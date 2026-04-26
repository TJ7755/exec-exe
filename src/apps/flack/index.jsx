import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, Icon } from "../../utils/general";
import { useScenario } from "../../scenarios/engine";
import { selectPlayerName, selectFlackDMs, selectFlackChannels, selectReputation, selectSmallTalkHistory, recordSmallTalkQuestion } from "../../player/store";
import { selectCurrentDay, selectCurrentGameMinutes, selectFormattedGameTime } from "../../player/gameTime";
import { selectActiveChoice } from "../../player/dialogueStore";
import { setActiveChoice } from "../../player/dialogueStore";
import { FlackDialogueChoice } from "../../components/dialogue/FlackDialogueChoice";
import { SmallTalk } from "../../components/dialogue/SmallTalk";
import { selectStressBand, selectMeridianFlag } from "../../player/gameState";
import { getFlackReply } from "./llmClient";
import { ApiKeyConfig } from "./ApiKeyConfig";
import { hasAnyProvider } from "./apiKeyManager";
import {
  createIntroductionChoice,
  createLoginChoice,
  pushDmMessage,
  resolveLoginChoice,
  sendIntroductionResponses,
  toDay1Timestamp,
} from "../../player/events/day1";
import { getAvailableSmallTalkQuestions, getRelationshipTier, getResponseForTier } from "../../player/smallTalk";
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
  const currentDay = useSelector(selectCurrentDay);
  const currentGameMinutes = useSelector(selectCurrentGameMinutes);
  const stressBand = useSelector(selectStressBand);
  const introductionPosted = useSelector(selectMeridianFlag("INTRODUCTION_POSTED"));
  const hiddenState = useSelector((state) => state.player?.hiddenState || {});
  const reputation = useSelector(selectReputation);
  const smallTalkHistory = useSelector(selectSmallTalkHistory);
  const { scenario, getNPC, getPlayerName } = useScenario();
  const dispatch = useDispatch();
  
  // Build initial state from scenario
  const initialChannels = useMemo(() => {
    const name = playerName || getPlayerName();
    return buildChannelsFromScenario(scenario.channels, getNPC, name);
  }, [scenario.channels, getNPC, getPlayerName, playerName]);
  
  const initialDMs = useMemo(() => {
    const name = playerName || getPlayerName();
    const built = buildDMsFromScenario(scenario.directMessages, getNPC, name);
    scenario.npcs.forEach((npc) => {
      if (!built[npc.name]) {
        built[npc.name] = [];
      }
    });
    return built;
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
  const [pendingReplyFrom, setPendingReplyFrom] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(null);
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Get active DialogueChoice for current DM context
  const activeChoice = useSelector(selectActiveChoice);
  const reduxFlackDMs = useSelector(selectFlackDMs);
  const reduxFlackChannels = useSelector(selectFlackChannels);
  const currentNPC = selectedType === 'dm' ? scenario.npcs.find(n => n.name === selectedId) : null;
  const hasActiveChoice = !!(
    activeChoice &&
    !activeChoice.resolvedOptionId &&
    (
      (selectedType === "dm" && currentNPC && activeChoice.contextId === currentNPC.id) ||
      (selectedType === "channel" && activeChoice.contextId === selectedId.replace("#", ""))
    )
  );
  
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
    if (selectedType !== "dm" || !currentNPC || !inputText.trim()) {
      return;
    }

    // Carol Day 1 block - strictly no DMs to Carol on Day 1
    if (currentNPC.id === "carol" && currentDay === 1) {
      return;
    }

    const text = inputText.trim();
    const timestamp = toDay1Timestamp(currentGameMinutes);

    dispatch({
      type: "FLACK_ADD_DM_MESSAGE",
      payload: {
        participantId: currentNPC.id,
        message: {
          id: `player-${Date.now()}`,
          senderId: "player",
          content: text,
          timestamp,
          edited: false
        }
      }
    });

    setInputText("");

    getFlackReply({
      npcId: currentNPC.id,
      playerInput: text,
      history: currentMessages.slice(-8).map((message) => ({
        role: message.sender === currentPlayerName ? "player" : "character",
        content: message.text
      })),
      gameContext: {
        day: currentDay,
        inGameTime: currentGameTime,
        stressBand,
        flags: {
          INTRODUCTION_POSTED: introductionPosted
        }
      }
    }).then((reply) => {
      if (!reply) {
        return;
      }

      const delayMs = currentNPC.id === "harry" ? 450 : currentNPC.id === "sara" ? 1500 : currentNPC.id === "paul" ? 2500 : currentNPC.id === "james" ? 2200 : 2000;
      window.setTimeout(() => {
        pushDmMessage(dispatch, currentNPC.id, currentNPC.id, reply, currentGameMinutes);
      }, delayMs);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Check if small talk is available for current NPC
  const isSmallTalkAvailable = () => {
    if (selectedType !== "dm" || !currentNPC) return false;
    if (hasActiveChoice) return false;
    
    // Hide options while waiting for NPC to reply
    if (pendingReplyFrom === currentNPC.id) return false;
    
    // Hide if a scripted conversation is active for this context
    if (activeChoice && activeChoice.contextId === currentNPC.id) return false;
    
    // Check if there are available questions (max 3, excluding already-asked)
    const availableQuestions = getAvailableSmallTalkQuestions(currentNPC.id, currentDay, smallTalkHistory);
    if (availableQuestions.length === 0) return false;
    
    // Check if there are unread messages from this NPC
    if (unread[selectedId]) return false;
    
    // Hide if API keys are configured (free text takes priority)
    if (hasAnyProvider()) return false;
    
    return true;
  };

  // Handle small talk question selection
  const handleSmallTalkQuestion = (question) => {
    if (!currentNPC) return;

    // Record this question as asked
    dispatch(recordSmallTalkQuestion(currentNPC.id, question.id));

    // Persist to Redux (useEffect will sync to local state)
    dispatch({
      type: 'FLACK_ADD_DM_MESSAGE',
      payload: {
        participantId: currentNPC.id,
        message: {
          id: `player-${Date.now()}`,
          senderId: 'player',
          content: question.label,
          timestamp: toDay1Timestamp(currentGameMinutes),
          edited: false
        }
      }
    });

    // Get appropriate response based on relationship tier
    const tier = getRelationshipTier(currentNPC.id, reputation);
    const responseText = getResponseForTier(question, tier);

    // Dispatch NPC response with delay based on in-game time
    // Game time: 1 real second = 7.5 game seconds = 0.125 game minutes
    // Nathaniel: 90 game minutes delay = 720 real seconds (12 minutes) - very slow responder
    // Harry: 1 game minute delay = 8 real seconds - very fast responder
    // Sara: 3 game minutes delay = 24 real seconds - quick but not instant
    // Others: 5 game minutes delay = 40 real seconds
    let delayMs;
    let gameMinuteDelay;
    if (currentNPC.id === 'nathaniel') {
      gameMinuteDelay = 90; // 90 game minutes
    } else if (currentNPC.id === 'harry') {
      gameMinuteDelay = 1; // 1 game minute
    } else if (currentNPC.id === 'sara') {
      gameMinuteDelay = 3; // 3 game minutes
    } else {
      gameMinuteDelay = 5; // 5 game minutes
    }
    // Convert game minutes to real milliseconds: gameMinutes / 0.125 * 1000
    delayMs = (gameMinuteDelay / 0.125) * 1000;
    setPendingReplyFrom(currentNPC.id);
    window.setTimeout(() => {
      pushDmMessage(dispatch, currentNPC.id, currentNPC.id, responseText, currentGameMinutes + gameMinuteDelay);
      setPendingReplyFrom(null);
    }, delayMs);
  };

  // Merge Redux flackDMs into local DM state when new messages arrive from events
  useEffect(() => {
    if (!reduxFlackDMs || Object.keys(reduxFlackDMs).length === 0) return;

    setDms(prevDms => {
      const newDms = { ...prevDms };
      let hasChanges = false;

      const messageKey = (m) => m.id || `${m.sender}-${m.time}-${m.text}`;

      Object.entries(reduxFlackDMs).forEach(([npcId, messages]) => {
        const npc = getNPC(npcId);
        const npcName = npc ? npc.name : npcId;
        const existingMessages = newDms[npcName] || [];
        const existingKeys = new Set(existingMessages.map(m => messageKey(m)));

        const mapped = (messages || []).map(msg => {
          const senderNPC = msg.senderId !== 'player' ? getNPC(msg.senderId) : null;
          const senderName = senderNPC ? senderNPC.name : currentPlayerName;
          const timeMatch = msg.timestamp ? msg.timestamp.match(/T(\d{2}):(\d{2})/) : null;
          const timeStr = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : currentGameTime;
          return {
            id: msg.id,
            sender: senderName,
            time: timeStr,
            text: msg.content,
            _ts: msg.timestamp
          };
        }).filter(m => !existingKeys.has(messageKey(m)));

        if (mapped.length > 0) {
          // Show typing indicator before new NPC messages
          const hasNPCMessage = mapped.some(m => m.sender !== currentPlayerName);
          if (hasNPCMessage && npcName === selectedId && selectedType === 'dm') {
            setTypingIndicator(npcName);
            setTimeout(() => setTypingIndicator(null), 2000);
          }

          // Merge and sort by timestamp (if available) to keep chronological order
          const merged = [...existingMessages, ...mapped];
          merged.sort((a, b) => {
            const ta = a._ts || '1970-01-01T00:00:00';
            const tb = b._ts || '1970-01-01T00:00:00';
            return new Date(ta) - new Date(tb);
          });

          // Remove internal _ts before saving
          newDms[npcName] = merged.map(({ _ts, ...rest }) => rest);
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        // If Redux is empty, ensure scenario DMs are present
        scenario.directMessages.forEach(dm => {
          const npc = getNPC(dm.participantId);
          if (npc && !newDms[npc.name]) {
            newDms[npc.name] = convertScenarioMessages(dm.messages, getNPC, currentPlayerName);
            hasChanges = true;
          }
        });
      }

      return hasChanges ? newDms : prevDms;
    });
  }, [reduxFlackDMs, scenario.directMessages, getNPC, currentPlayerName, currentGameTime, selectedId, selectedType]);

  // Merge Redux flackChannels into local channel state when new messages arrive from events
  useEffect(() => {
    if (!reduxFlackChannels || Object.keys(reduxFlackChannels).length === 0) return;

    setChannels(prevChannels => {
      const newChannels = { ...prevChannels };
      let hasChanges = false;

      const messageKey = (m) => m.id || `${m.sender}-${m.time}-${m.text}`;

      Object.entries(reduxFlackChannels).forEach(([channelId, messages]) => {
        const key = channelId.startsWith('#') ? channelId : `#${channelId}`;
        const existingMessages = newChannels[key] || [];
        const existingKeys = new Set(existingMessages.map(m => messageKey(m)));

        const mapped = (messages || []).map(msg => {
          const senderNPC = msg.senderId !== 'player' ? getNPC(msg.senderId) : null;
          const senderName = senderNPC ? senderNPC.name : currentPlayerName;
          const timeMatch = msg.timestamp ? msg.timestamp.match(/T(\d{2}):(\d{2})/) : null;
          const timeStr = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : currentGameTime;
          return {
            id: msg.id,
            sender: senderName,
            time: timeStr,
            text: msg.content,
            _ts: msg.timestamp
          };
        }).filter(m => !existingKeys.has(messageKey(m)));

        if (mapped.length > 0) {
          const merged = [...existingMessages, ...mapped];
          merged.sort((a, b) => {
            const ta = a._ts || '1970-01-01T00:00:00';
            const tb = b._ts || '1970-01-01T00:00:00';
            return new Date(ta) - new Date(tb);
          });

          newChannels[key] = merged.map(({ _ts, ...rest }) => rest);
          hasChanges = true;
        }
      });

      return hasChanges ? newChannels : prevChannels;
    });
  }, [reduxFlackChannels, getNPC, currentPlayerName, currentGameTime]);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [currentMessages]);

  useEffect(() => {
    if (selectedType === "channel" && selectedId === "#general" && !introductionPosted && !activeChoice) {
      dispatch(setActiveChoice(createIntroductionChoice()));
    }
  }, [selectedType, selectedId, introductionPosted, activeChoice, dispatch]);

  useEffect(() => {
    if (selectedType !== "dm" || !currentNPC) return;
    if (!hiddenState.SYNERGY_LOGIN_FAILED || hiddenState.SYNERGY_LOGIN_RESOLVED) return;
    if (activeChoice && !activeChoice.resolvedOptionId) return;
    if (currentDay !== 1) return;

    dispatch(setActiveChoice(createLoginChoice(currentNPC.id)));
  }, [
    selectedType,
    currentNPC,
    hiddenState.SYNERGY_LOGIN_FAILED,
    hiddenState.SYNERGY_LOGIN_RESOLVED,
    activeChoice,
    currentDay,
    dispatch,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowApiKeyConfig(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      >
        <div className="flack-settings-btn" onClick={() => setShowApiKeyConfig(true)} title="API Key Settings (Cmd+,)">
          <Icon fafa="faCog" width={16} />
        </div>
      </ToolBar>
      <div className="windowScreen flex" data-dock="true">
        {/* Sidebar */}
        <div className="flack-sidebar">
          <div className="flack-workspace">
            <div className="flack-workspace-icon">MIS</div>
            <span>Meridian Education Group</span>
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
          </div>

          <div className="flack-messages">
            {currentMessages.map((msg) => {
              const key = msg.id || `${msg.sender}-${msg.time}-${msg.text}`;
              return (
                <div key={key} className={`flack-message ${msg.sender === currentPlayerName ? "own" : ""}`}>
                  {msg.sender !== currentPlayerName && (
                    <div
                      className="flack-message-avatar"
                      style={{ backgroundColor: getSenderColor(msg.sender, npcs, currentPlayerName) }}
                    >
                      {getInitials(msg.sender)}
                    </div>
                  )}
                  <div className={`flack-message-content ${msg.sender === currentPlayerName ? 'from-player' : ''}`}>
                    <div className="flack-message-header">
                      <span className="flack-message-sender">{msg.sender}</span>
                      <span className="flack-message-time">{msg.time}</span>
                    </div>
                    <div className="flack-message-text">
                      {parseMarkdown(msg.text)}
                    </div>
                  </div>
                </div>
              );
            })}
            {typingIndicator && typingIndicator === selectedId && selectedType === 'dm' && (
              <div className="flack-message">
                <div
                  className="flack-message-avatar"
                  style={{ backgroundColor: getSenderColor(typingIndicator, npcs, currentPlayerName) }}
                >
                  {getInitials(typingIndicator)}
                </div>
                <div className="flack-message-content">
                  <div className="flack-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* DialogueChoice Type A — inline rendering in DM thread / #general */}
          {hasActiveChoice && activeChoice && (
            <FlackDialogueChoice
              choice={activeChoice}
              npcName={currentNPC?.name || "Meridian"}
              npcAvatarColour={currentNPC?.avatarColour || "#1B3A5C"}
              onResolve={(optionId, option) => {
                // Add player message as if they typed it (use responseText if available, else label)
                if (selectedType === "dm") {
                  // Persist to Redux so it survives navigation (useEffect will sync to local state)
                  dispatch({
                    type: 'FLACK_ADD_DM_MESSAGE',
                    payload: {
                      participantId: currentNPC.id,
                      message: {
                        id: `player-${Date.now()}`,
                        senderId: 'player',
                        content: option.responseText || option.label,
                        timestamp: new Date().toISOString(),
                        edited: false
                      }
                    }
                  });

                  if (activeChoice?.id.startsWith("day1-login-")) {
                    if (currentNPC.id === "carol" && currentDay === 1) {
                      return;
                    }
                    resolveLoginChoice(dispatch, currentNPC.id, currentGameMinutes);
                  }
                } else if (selectedType === "channel" && selectedId === "#general") {
                  dispatch({
                    type: "FLACK_ADD_MESSAGE",
                    payload: {
                      channel: "general",
                      senderId: "player",
                      content: option.responseText || option.label,
                      timestamp: toDay1Timestamp(currentGameMinutes)
                    }
                  });
                  sendIntroductionResponses(dispatch);
                }
              }}
            />
          )}

          {/* Small Talk — available when no active DialogueChoice and no unread messages */}
          {isSmallTalkAvailable() && currentNPC && (
            <SmallTalk
              questions={getAvailableSmallTalkQuestions(currentNPC.id, currentDay, smallTalkHistory)}
              onQuestionSelect={handleSmallTalkQuestion}
              npcName={currentNPC.name}
            />
          )}

          {/* Hide compose input while DialogueChoice is active or small talk is available */}
          {!hasActiveChoice && !isSmallTalkAvailable() && (
            <div className="flack-input-area">
              <div className="flack-input-container">
                <textarea
                  className="flack-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={selectedType === "dm" ? `Message ${selectedId}${hasAnyProvider() ? ' (AI-powered)' : ' (requires API key)'}` : "Select a direct message to send a message"}
                  rows={1}
                  disabled={selectedType !== "dm"}
                />
                <button 
                  className="flack-send-btn"
                  onClick={sendMessage}
                  disabled={selectedType !== "dm" || !inputText.trim()}
                  title={selectedType === "dm" ? "Send message" : "Direct messages only"}
                >
                  <Icon fafa="faPaperPlane" width={16} />
                </button>
              </div>
              <div className="flack-input-hint">
                {selectedType === "dm" ? (
                  hasAnyProvider() ? "Free text is available after scripted branches." : "Configure API keys in settings for AI responses, or use SmallTalk options."
                ) : "Use #general for the scripted introduction. DMs handle direct messages."}
              </div>
            </div>
          )}

          {showApiKeyConfig && <ApiKeyConfig onClose={() => setShowApiKeyConfig(false)} />}
        </div>
      </div>
    </div>
  );
};
