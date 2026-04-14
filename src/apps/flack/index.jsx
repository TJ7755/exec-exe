import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ToolBar, Icon } from "../../utils/general";
import { useScenario } from "../../scenarios/engine";
import { selectPlayerName, selectFlackDMs } from "../../player/store";
import { selectActiveChoice } from "../../player/dialogueStore";
import { selectFormattedGameTime, gameMinutesToGameTime } from "../../player/gameTime";
import { FlackDialogueChoice } from "../../components/dialogue/FlackDialogueChoice";
import "./flack.scss";

// Convert scenario messages to app format
const convertScenarioMessages = (messages, getNPC, playerName) => {
  return messages.map(msg => {
    const senderNPC = msg.senderId !== 'player' ? getNPC(msg.senderId) : null;
    const senderName = senderNPC ? senderNPC.name : playerName;
    
    // Extract time from ISO timestamp and format as game time
    const timeMatch = msg.timestamp.match(/T(\d{2}):(\d{2})/);
    const timeStr = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : '09:00';
    
    return {
      sender: senderName,
      time: timeStr,
      text: msg.content
    };
  });
};

// Build channels from scenario data
const buildChannelsFromScenario = (scenarioChannels, getNPC, playerName) => {
  const channels = {};
  scenarioChannels.forEach(channel => {
    const channelKey = `#${channel.name}`;
    channels[channelKey] = convertScenarioMessages(channel.messages, getNPC, playerName);
  });
  return channels;
};

// Build DMs from scenario data
const buildDMsFromScenario = (scenarioDMs, getNPC, playerName) => {
  const dms = {};
  scenarioDMs.forEach(dm => {
    const npc = getNPC(dm.participantId);
    if (npc) {
      dms[npc.name] = convertScenarioMessages(dm.messages, getNPC, playerName);
    }
  });
  return dms;
};

// Simple markdown parser for **bold**, *italic*, and `code`
const parseMarkdown = (text) => {
  const parts = [];
  let currentText = text;
  let key = 0;
  
  const patterns = [
    { regex: /\*\*(.+?)\*\*/, type: "bold" },
    { regex: /\*(.+?)\*/, type: "italic" },
    { regex: /`(.+?)`/, type: "code" }
  ];
  
  while (currentText) {
    let earliestMatch = null;
    let earliestPattern = null;
    
    for (const pattern of patterns) {
      const match = currentText.match(pattern.regex);
      if (match && (!earliestMatch || match.index < earliestMatch.index)) {
        earliestMatch = match;
        earliestPattern = pattern;
      }
    }
    
    if (!earliestMatch) {
      parts.push(<span key={key++}>{currentText}</span>);
      break;
    }
    
    if (earliestMatch.index > 0) {
      parts.push(<span key={key++}>{currentText.substring(0, earliestMatch.index)}</span>);
    }
    
    const content = earliestMatch[1];
    if (earliestPattern.type === "bold") {
      parts.push(<strong key={key++}>{content}</strong>);
    } else if (earliestPattern.type === "italic") {
      parts.push(<em key={key++}>{content}</em>);
    } else if (earliestPattern.type === "code") {
      parts.push(<code key={key++} className="flack-code">{content}</code>);
    }
    
    currentText = currentText.substring(earliestMatch.index + earliestMatch[0].length);
  }
  
  return parts.length > 0 ? parts : text;
};

// Get sender color from NPC data or generate consistent color
const getSenderColor = (name, npcs, playerName) => {
  // Check if this is an NPC
  const npc = npcs.find(n => n.name === name);
  if (npc) {
    return npc.avatarColour;
  }
  // Check if this is the player
  if (name === playerName) {
    return "#0078d4"; // Player color
  }
  // Generate consistent color from name
  const colors = ["#d83b01", "#0078d4", "#8764b8", "#038387", "#107c10", "#ff8c00", "#8e562e", "#c239b3"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Flack = ({ deepLink }) => {
  const wnapp = useSelector((state) => state.apps.flack);
  const playerName = useSelector(selectPlayerName);
  const currentGameTime = useSelector(selectFormattedGameTime);
  const { scenario, getNPC, getPlayerName } = useScenario();
  
  // Build initial state from scenario
  const initialChannels = useMemo(() => {
    const name = playerName || getPlayerName();
    return buildChannelsFromScenario(scenario.channels, getNPC, name);
  }, [scenario.channels, getNPC, getPlayerName, playerName]);
  
  const initialDMs = useMemo(() => {
    const name = playerName || getPlayerName();
    return buildDMsFromScenario(scenario.directMessages, getNPC, name);
  }, [scenario.directMessages, getNPC, getPlayerName, playerName]);
  
  const [channels, setChannels] = useState(initialChannels);
  const [dms, setDms] = useState(initialDMs);
  const [selectedType, setSelectedType] = useState("channel");
  const [selectedId, setSelectedId] = useState("#general");
  const [unread, setUnread] = useState(() => {
    const unreadState = {};
    scenario.channels.forEach(c => { unreadState[`#${c.name}`] = true; });
    scenario.directMessages.forEach(dm => {
      const npc = getNPC(dm.participantId);
      if (npc) unreadState[npc.name] = true;
    });
    return unreadState;
  });
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  
  // Get active DialogueChoice for current DM context
  const activeChoice = useSelector(selectActiveChoice);
  const reduxFlackDMs = useSelector(selectFlackDMs);
  const currentNPC = selectedType === 'dm' ? scenario.npcs.find(n => n.name === selectedId) : null;
  const hasActiveChoice = activeChoice && currentNPC && activeChoice.contextId === currentNPC.id && !activeChoice.resolvedOptionId;
  
  // Handle deep links
  useEffect(() => {
    if (!deepLink) return;
    
    // Parse deep link format: dm-{npcId} or channel-{channelId}
    if (deepLink.startsWith('dm-')) {
      const npcId = deepLink.replace('dm-', '');
      const npc = getNPC(npcId);
      if (npc && dms[npc.name]) {
        setSelectedType('dm');
        setSelectedId(npc.name);
        setUnread(prev => ({ ...prev, [npc.name]: false }));
      }
    } else if (deepLink.startsWith('channel-')) {
      const channelId = deepLink.replace('channel-', '');
      const channelKey = `#${channelId}`;
      if (channels[channelKey]) {
        setSelectedType('channel');
        setSelectedId(channelKey);
        setUnread(prev => ({ ...prev, [channelKey]: false }));
      }
    }
  }, [deepLink, dms, channels, getNPC]);

  if (!wnapp) return null;
  
  const currentPlayerName = playerName || getPlayerName();
  const npcs = scenario.npcs;

  const currentMessages = selectedType === "channel" 
    ? channels[selectedId] || [] 
    : dms[selectedId] || [];

  const handleSelect = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
    setUnread(prev => ({ ...prev, [id]: false }));
  };

  const sendMessage = () => {
    // Freeform input disabled - only DialogueChoices allowed
    return;
    
    const newMessage = {
      sender: currentPlayerName,
      time: currentGameTime,
      text: inputText.trim()
    };
    
    if (selectedType === "channel") {
      setChannels(prev => ({
        ...prev,
        [selectedId]: [...prev[selectedId], newMessage]
      }));
    } else {
      setDms(prev => ({
        ...prev,
        [selectedId]: [...prev[selectedId], newMessage]
      }));
    }
    
    setInputText("");
  };

  const handleKeyPress = (e) => {
    // Freeform input disabled - only DialogueChoices allowed
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Merge Redux flackDMs into local state when new messages arrive from events
  useEffect(() => {
    if (!reduxFlackDMs || Object.keys(reduxFlackDMs).length === 0) return;
    
    setDms(prevDms => {
      const newDms = { ...prevDms };
      let hasChanges = false;
      
      Object.entries(reduxFlackDMs).forEach(([participantId, messages]) => {
        const npc = getNPC(participantId);
        if (!npc) return;
        
        const npcName = npc.name;
        const existingMessages = newDms[npcName] || [];
        const existingIds = new Set(existingMessages.map(m => m.id || `${m.sender}-${m.time}-${m.text}`));
        
        // Convert Redux messages to local format and filter out duplicates
        const newMessages = messages
          .map(msg => {
            const senderNPC = msg.senderId !== 'player' ? getNPC(msg.senderId) : null;
            const senderName = senderNPC ? senderNPC.name : currentPlayerName;
            // Extract time from ISO timestamp and format as game time
            const timeMatch = msg.timestamp.match(/T(\d{2}):(\d{2})/);
            const timeStr = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : currentGameTime;
            
            return {
              id: msg.id,
              sender: senderName,
              time: timeStr,
              text: msg.content
            };
          })
          .filter(msg => !existingIds.has(msg.id || `${msg.sender}-${msg.time}-${msg.text}`));
        
        if (newMessages.length > 0) {
          newDms[npcName] = [...existingMessages, ...newMessages];
          hasChanges = true;
        }
      });
      
      return hasChanges ? newDms : prevDms;
    });
  }, [reduxFlackDMs, getNPC, currentPlayerName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [currentMessages]);

  const getInitials = (name) => {
    return name.replace("#", "").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="flack floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z
      }}
      data-hide={wnapp?.hide}
      id={wnapp?.icon + "App"}
    >
      <ToolBar
        app={wnapp?.action}
        icon={wnapp?.icon}
        size={wnapp?.size}
        name="Flack"
      />
      <div className="windowScreen flex" data-dock="true">
        {/* Sidebar */}
        <div className="flack-sidebar">
          <div className="flack-workspace">
            <div className="flack-workspace-icon">MA</div>
            <span>Meridian Analytics</span>
          </div>
          
          <div className="flack-section">
            <div className="flack-section-header">Channels</div>
            {Object.keys(channels).map(channelId => (
              <div
                key={channelId}
                className={`flack-item ${selectedType === "channel" && selectedId === channelId ? "active" : ""} ${unread[channelId] ? "unread" : ""}`}
                onClick={() => handleSelect("channel", channelId)}
              >
                <span className="flack-hash">#</span>
                <span className="flack-name">{channelId.replace("#", "")}</span>
                {unread[channelId] && <span className="flack-unread-dot" />}
              </div>
            ))}
          </div>
          
          <div className="flack-section">
            <div className="flack-section-header">Direct Messages</div>
            {Object.keys(dms).map(dmId => (
              <div
                key={dmId}
                className={`flack-item ${selectedType === "dm" && selectedId === dmId ? "active" : ""} ${unread[dmId] ? "unread" : ""}`}
                onClick={() => handleSelect("dm", dmId)}
              >
                <div 
                  className="flack-status-indicator"
                  style={{ backgroundColor: getSenderColor(dmId, npcs, currentPlayerName) }}
                />
                <span className="flack-name">{dmId}</span>
                {unread[dmId] && <span className="flack-unread-dot" />}
              </div>
            ))}
          </div>
        </div>

        {/* Message pane */}
        <div className="flack-content">
          <div className="flack-header">
            <div className="flack-channel-name">
              {selectedType === "channel" ? (
                <><span className="flack-hash-large">#</span> {selectedId.replace("#", "")}</>
              ) : (
                <>
                  <div 
                    className="flack-header-avatar"
                    style={{ backgroundColor: getSenderColor(selectedId, npcs, currentPlayerName) }}
                  >
                    {getInitials(selectedId)}
                  </div>
                  {selectedId}
                </>
              )}
            </div>
            {selectedType === "channel" && (
              <div className="flack-channel-topic">
                {selectedId === "#general" && "Company-wide announcements and general chat"}
                {selectedId === "#vantage-project" && "NHS Digital Vantage project coordination"}
                {selectedId === "#it-helpdesk" && "IT support and technical issues"}
              </div>
            )}
          </div>

          <div className="flack-messages">
            {currentMessages.map((msg, idx) => (
              <div key={idx} className={`flack-message ${msg.sender === currentPlayerName ? "own" : ""}`}>
                {msg.sender !== currentPlayerName && (
                  <div 
                    className="flack-message-avatar"
                    style={{ backgroundColor: getSenderColor(msg.sender, npcs, currentPlayerName) }}
                  >
                    {getInitials(msg.sender)}
                  </div>
                )}
                <div className="flack-message-content">
                  <div className="flack-message-header">
                    <span className="flack-message-sender">{msg.sender}</span>
                    <span className="flack-message-time">{msg.time}</span>
                  </div>
                  <div className="flack-message-text">
                    {parseMarkdown(msg.text)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* DialogueChoice Type A — inline rendering in DM thread */}
          {hasActiveChoice && currentNPC && activeChoice && (
            <FlackDialogueChoice
              choice={activeChoice}
              npcName={currentNPC.name}
              npcAvatarColour={currentNPC.avatarColour}
              onResolve={(optionId, option) => {
                // Add player message as if they typed it (use responseText if available, else label)
                const playerMessage = {
                  sender: currentPlayerName,
                  time: currentGameTime,
                  text: option.responseText || option.label
                };
                
                if (selectedType === "dm") {
                  setDms(prev => ({
                    ...prev,
                    [selectedId]: [...(prev[selectedId] || []), playerMessage]
                  }));
                }
              }}
            />
          )}

          {/* Hide compose input while DialogueChoice is active */}
          {!hasActiveChoice && (
            <div className="flack-input-area">
              <div className="flack-input-container">
                <textarea
                  className="flack-input"
                  value=""
                  readOnly
                  onKeyDown={handleKeyPress}
                  placeholder="Use dialogue choices to respond..."
                  rows={1}
                  disabled={true}
                />
                <button 
                  className="flack-send-btn"
                  onClick={sendMessage}
                  disabled={true}
                  title="Freeform input disabled - use dialogue choices"
                >
                  <Icon fafa="faPaperPlane" width={16} />
                </button>
              </div>
              <div className="flack-input-hint">
                <strong>**bold**</strong> <em>*italic*</em> <code>`code`</code> — Press Enter to send
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
