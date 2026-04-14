import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, Icon } from "../../utils/general";
import { useScenario } from "../../scenarios/engine";
import { selectPlayerName } from "../../player/store";
import { selectActiveChoice } from "../../player/dialogueStore";
import { EmailDialogueChoice } from "../../components/dialogue/EmailDialogueChoice";
import "./outbox.scss";

// Convert scenario emails to app format
const convertScenarioEmails = (emails, getNPC, playerName) => {
  return emails.map(email => {
    const fromNPC = email.fromId !== 'player' ? getNPC(email.fromId) : null;
    const fromName = fromNPC ? fromNPC.name : playerName;
    const fromEmail = fromNPC ? fromNPC.email : `${playerName.toLowerCase().replace(/\s+/g, '.')}@meridian-analytics.co.uk`;
    
    // Parse timestamp for display
    const date = new Date(email.timestamp);
    const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    
    // Determine recipient display
    const toDisplay = email.toIds.includes('all') 
      ? 'All Staff' 
      : email.toIds.includes('player') 
        ? 'You' 
        : email.toIds.map(id => {
          const npc = getNPC(id);
          return npc ? npc.name : id;
        }).join(', ');
    
    // Determine CC display
    const ccDisplay = email.ccIds && email.ccIds.length > 0
      ? email.ccIds.includes('player')
        ? 'You'
        : email.ccIds.map(id => {
            const npc = getNPC(id);
            return npc ? npc.name : id;
          }).join(', ')
      : null;
    
    return {
      id: email.id,
      from: fromName,
      fromEmail: fromEmail,
      to: toDisplay,
      cc: ccDisplay,
      subject: email.subject,
      time: timeStr,
      date: dateStr,
      read: email.read,
      folder: 'inbox',
      body: email.body,
      replies: []
    };
  });
};

const FOLDERS = [
  { id: "inbox", name: "Inbox", icon: "faInbox" },
  { id: "sent", name: "Sent", icon: "faPaperPlane" },
  { id: "drafts", name: "Drafts", icon: "faFile" },
  { id: "archive", name: "Archive", icon: "faArchive" }
];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const Outbox = () => {
  const wnapp = useSelector((state) => state.apps.outbox);
  const playerName = useSelector(selectPlayerName);
  const { scenario, getNPC, getPlayerName } = useScenario();
  const dispatch = useDispatch();
  
  // Convert scenario emails to app format
  const initialEmails = useMemo(() => {
    const name = playerName || getPlayerName();
    return convertScenarioEmails(scenario.initialEmails, getNPC, name);
  }, [scenario.initialEmails, getNPC, getPlayerName, playerName]);
  
  const [emails, setEmails] = useState(initialEmails);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  
  // Get active DialogueChoice for current email context
  const activeChoice = useSelector(selectActiveChoice);
  const hasActiveChoice = activeChoice && selectedEmailId && activeChoice.contextId === selectedEmailId && !activeChoice.resolvedOptionId;
  
  if (!wnapp) return null;

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const getUnreadCount = (folderId) => {
    if (folderId === "inbox") {
      return emails.filter(e => e.folder === "inbox" && !e.read).length;
    }
    return 0;
  };

  const handleEmailClick = (emailId) => {
    const email = emails.find(e => e.id === emailId);
    
    // If clicking on a draft, open it in compose mode for editing
    if (email?.folder === "drafts") {
      setComposeData({
        to: email.to,
        subject: email.subject === "(No subject)" ? "" : email.subject,
        body: email.body,
        draftId: email.id  // Track the draft ID so we can remove it when sent
      });
      setIsComposing(true);
      setSelectedEmailId(null);  // Deselect since we're editing
      return;
    }
    
    setSelectedEmailId(emailId);
    setEmails(prev => prev.map(e => 
      e.id === emailId ? { ...e, read: true } : e
    ));
  };

  const handleArchive = () => {
    if (!selectedEmailId) return;
    setEmails(prev => prev.map(e => 
      e.id === selectedEmailId ? { ...e, folder: "archive" } : e
    ));
    setSelectedEmailId(null);
  };

  const handleReply = () => {
    // Freeform input disabled - only DialogueChoices allowed
    return;
  };

  const sendReply = () => {
    // Freeform input disabled - only DialogueChoices allowed
    return;
    
    const now = new Date();
    const timeStr = formatTime();
    const dateStr = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    
    setEmails(prev => prev.map(e => {
      if (e.id === replyingTo) {
        return {
          ...e,
          replies: [...e.replies, {
            from: playerName || getPlayerName(),
            time: timeStr,
            date: dateStr,
            body: replyText.trim()
          }]
        };
      }
      return e;
    }));
    
    setReplyingTo(null);
    setReplyText("");
  };

  const sendCompose = () => {
    if (!composeData.to.trim() || !composeData.subject.trim()) return;
    
    const now = new Date();
    const timeStr = formatTime();
    const dateStr = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    
    const newEmail = {
      id: `sent-${Date.now()}`,
      from: playerName || getPlayerName(),
      fromEmail: `${(playerName || getPlayerName()).toLowerCase().replace(/\s+/g, '.')}@meridian-analytics.co.uk`,
      to: composeData.to,
      subject: composeData.subject,
      time: timeStr,
      date: dateStr,
      read: true,
      folder: "sent",
      body: composeData.body,
      replies: []
    };
    
    // If this was a draft, remove it from drafts
    if (composeData.draftId) {
      setEmails(prev => prev.filter(e => e.id !== composeData.draftId).concat([newEmail]));
    } else {
      setEmails(prev => [newEmail, ...prev]);
    }
    
    setIsComposing(false);
    setComposeData({ to: "", subject: "", body: "" });
  };

  const saveDraft = () => {
    // Don't save empty drafts
    if (!composeData.to.trim() && !composeData.subject.trim() && !composeData.body.trim()) {
      setIsComposing(false);
      return;
    }
    
    const now = new Date();
    const timeStr = formatTime();
    const dateStr = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    
    const newDraft = {
      id: `draft-${Date.now()}`,
      from: playerName || getPlayerName(),
      fromEmail: `${(playerName || getPlayerName()).toLowerCase().replace(/\s+/g, '.')}@meridian-analytics.co.uk`,
      to: composeData.to,
      subject: composeData.subject || "(No subject)",
      time: timeStr,
      date: dateStr,
      read: true,
      folder: "drafts",
      body: composeData.body,
      replies: []
    };
    
    setEmails(prev => [newDraft, ...prev]);
    setIsComposing(false);
    setComposeData({ to: "", subject: "", body: "" });
  };

  const filteredEmails = [...emails.filter(e => e.folder === selectedFolder)].reverse();

  const getSenderInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const getSenderColor = (name) => {
    const colors = ["#0078d4", "#107c10", "#d83b01", "#8764b8", "#038387", "#ff8c00"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className="outbox floatTab dpShad"
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
        name="Outbox"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        {/* Toolbar */}
        <div className="outbox-toolbar">
          <button 
            className="outbox-btn-primary"
            onClick={() => setIsComposing(true)}
          >
            <Icon fafa="faPen" width={14} /> New mail
          </button>
          <button 
            className="outbox-btn-icon"
            onClick={handleArchive}
            disabled={!selectedEmailId || selectedEmail?.folder === "archive"}
          >
            <Icon fafa="faArchive" width={16} />
          </button>
        </div>

        {/* Main content */}
        <div className="outbox-main">
          {/* Folder sidebar */}
          <div className="outbox-sidebar">
            {FOLDERS.map(folder => {
              const unread = getUnreadCount(folder.id);
              return (
                <div
                  key={folder.id}
                  className={`outbox-folder ${selectedFolder === folder.id ? "active" : ""}`}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Icon fafa={folder.icon} width={16} />
                  <span>{folder.name}</span>
                  {unread > 0 && (
                    <span className="outbox-badge">{unread}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Email list */}
          <div className="outbox-list">
            {filteredEmails.length === 0 ? (
              <div className="outbox-empty">No emails in this folder</div>
            ) : (
              filteredEmails.map(email => (
                <div
                  key={email.id}
                  className={`outbox-email-item ${!email.read ? "unread" : ""} ${selectedEmailId === email.id ? "selected" : ""}`}
                  onClick={() => handleEmailClick(email.id)}
                >
                  <div 
                    className="outbox-avatar"
                    style={{ backgroundColor: getSenderColor(email.from) }}
                  >
                    {getSenderInitials(email.from)}
                  </div>
                  <div className="outbox-email-content">
                    <div className="outbox-email-header">
                      <span className="outbox-sender">{email.from}</span>
                      <span className="outbox-time">{email.time}</span>
                    </div>
                    <div className="outbox-subject">{email.subject}</div>
                    <div className="outbox-preview">
                      {email.body.substring(0, 60).replace(/\n/g, " ")}...
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reading pane */}
          <div className="outbox-reading-pane">
            {isComposing ? (
              <div className="outbox-compose">
                <div className="outbox-compose-header">
                  <h3>New Message</h3>
                  <button 
                    className="outbox-close-btn"
                    onClick={() => setIsComposing(false)}
                  >
                    <Icon fafa="faTimes" width={14} />
                  </button>
                </div>
                <div className="outbox-compose-fields">
                  <div className="outbox-field">
                    <label>To</label>
                    <input 
                      type="text" 
                      value={composeData.to}
                      onChange={e => setComposeData({...composeData, to: e.target.value})}
                      placeholder="recipient@meridian-analytics.co.uk"
                    />
                  </div>
                  <div className="outbox-field">
                    <label>Subject</label>
                    <input 
                      type="text" 
                      value={composeData.subject}
                      onChange={e => setComposeData({...composeData, subject: e.target.value})}
                    />
                  </div>
                  <textarea
                    className="outbox-compose-body"
                    value={composeData.body}
                    onChange={e => setComposeData({...composeData, body: e.target.value})}
                    placeholder="Type your message here..."
                  />
                  <div className="outbox-compose-actions">
                    <button 
                      className="outbox-btn-primary"
                      onClick={sendCompose}
                      disabled={!composeData.to.trim() || !composeData.subject.trim()}
                    >
                      Send
                    </button>
                    <button 
                      className="outbox-btn-secondary"
                      onClick={saveDraft}
                    >
                      Save as Draft
                    </button>
                    <button 
                      className="outbox-btn-secondary"
                      onClick={() => {
                        setIsComposing(false);
                        setComposeData({ to: "", subject: "", body: "" });
                      }}
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedEmail ? (
              <>
                <div className="outbox-reading-header">
                  <h2 className="outbox-reading-subject">{selectedEmail.subject}</h2>
                  <div className="outbox-reading-meta">
                    <div 
                      className="outbox-avatar large"
                      style={{ backgroundColor: getSenderColor(selectedEmail.from) }}
                    >
                      {getSenderInitials(selectedEmail.from)}
                    </div>
                    <div className="outbox-meta-details">
                      <div className="outbox-from-line">
                        <strong>{selectedEmail.from}</strong>
                        <span className="outbox-email-addr">&lt;{selectedEmail.fromEmail}&gt;</span>
                      </div>
                      <div className="outbox-to-line">To: {selectedEmail.to}</div>
                      {selectedEmail.cc && (
                        <div className="outbox-cc-line">CC: {selectedEmail.cc}</div>
                      )}
                      <div className="outbox-date-line">{selectedEmail.date} at {selectedEmail.time}</div>
                    </div>
                  </div>
                  <div className="outbox-reading-actions">
                    <button 
                      className="outbox-btn-primary"
                      onClick={handleReply}
                      disabled={true}
                      title="Freeform input disabled - use dialogue choices"
                    >
                      <Icon fafa="faReply" width={14} /> Reply
                    </button>
                    <button 
                      className="outbox-btn-secondary"
                      onClick={handleArchive}
                      disabled={selectedEmail.folder === "archive"}
                    >
                      <Icon fafa="faArchive" width={14} /> Archive
                    </button>
                  </div>
                </div>
                <div className="outbox-reading-body">
                  <div className="outbox-email-text">{selectedEmail.body}</div>
                  
                  {/* DialogueChoice Type B — inline rendering in email reading pane */}
                  {hasActiveChoice && activeChoice && (
                    <EmailDialogueChoice
                      choice={activeChoice}
                      emailSubject={selectedEmail.subject}
                      onResolve={(optionId, option) => {
                        // Add reply to email thread with chosen option label
                        setEmails(prev => prev.map(e => 
                          e.id === selectedEmailId 
                            ? { 
                                ...e, 
                                replies: [
                                  ...(e.replies || []), 
                                  { from: "You", body: option.label, time: formatTime() }
                                ] 
                              }
                            : e
                        ));
                      }}
                    />
                  )}
                  
                  {/* Replies */}
                  {selectedEmail.replies.map((reply, idx) => (
                    <div key={idx} className="outbox-reply">
                      <div className="outbox-reply-header">
                        <strong>{reply.from}</strong>
                        <span>{reply.date} at {reply.time}</span>
                      </div>
                      <div className="outbox-reply-body">{reply.body}</div>
                    </div>
                  ))}
                  
                  {/* Reply input */}
                  {/* Reply box disabled - only DialogueChoices allowed */}
                </div>
              </>
            ) : (
              <div className="outbox-empty-state">
                <Icon fafa="faEnvelopeOpen" width={48} />
                <p>Select an email to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
