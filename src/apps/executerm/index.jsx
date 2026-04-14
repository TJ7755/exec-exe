import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar } from "../../utils/general";
import { useScenario } from "../../scenarios/engine";
import { selectPlayerName } from "../../player/store";
import { selectActiveChoice } from "../../player/dialogueStore";
import { resolveChoice, addResolvedChoice } from "../../player/dialogueStore";
import { pauseGameTime, resumeGameTime, selectFormattedGameTime, selectGameDate } from "../../player/gameTime";
import { setHiddenFlag, setMultipleHiddenFlags } from "../../player/hiddenState";
import { updateStats } from "../../player/store";
import { getNPCResponse } from "../../scenarios/meridian/npcResponses";
import DialogueChoice from "../../components/dialogue/DialogueChoice";
import "./executerm.scss";

const BOOT_SEQUENCE = [
  "Meridian Analytics — ExecuTerm v2.4.1",
  "(c) 2024 Meridian Analytics Ltd. All rights reserved.",
  "",
  "WARNING: This terminal is monitored in accordance with the Meridian Acceptable",
  "Use Policy (see Employee Handbook, Section 7.4). Unauthorised use will be logged.",
  "",
  "Type 'help' for available commands.",
  ""
];

// Commands factory - creates commands with access to scenario data
const createCommands = (scenario, getNPC, getPlayerName) => ({
  help: () => `Available commands:

  status        — Project status summary
  calendar      — This week's scheduled meetings
  whoami        — Current user profile
  ping [name]   — Check if someone is online
  tasks         — Open task list (alias for Synergy Drive task board)
  axiom         — Axiom Digital integration status
  clear         — Clear terminal
  help          — Show this message`,

  status: () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const openRisks = scenario.riskRegister.filter(r => r.status === 'Open').length;
    return `VANTAGE PROJECT STATUS
──────────────────────
Sprint:         7 (week 3 of 4)
Overall status: AMBER
Schedule:       -3 weeks vs. plan
Budget:         11% over (contractor costs)
Open risks:     ${openRisks}
Blockers:       Schema sign-off (R1)

Last updated: ${dateStr}`;
  },

  calendar: () => {
    const entries = scenario.calendar
      .sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))
      .map(entry => {
        const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][entry.dayOffset] || 'Mon';
        return `${day} ${entry.time}   ${entry.title.padEnd(35)} [${entry.medium}${entry.mandatory ? ' — MANDATORY' : ''}]`;
      })
      .join('\n');
    return `THIS WEEK
──────────────────────────────────────────────────────
${entries}`;
  },

  whoami: () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const player = scenario.player;
    const manager = getNPC(player.managerId);
    return `User:         ${getPlayerName()}
Role:         ${player.role}
Department:   ${player.department}
Manager:      ${manager ? manager.name : player.managerId}
Current acct: ${scenario.company.name} (${scenario.company.sector})
Access level: Standard
Last login:   ${dateStr} 08:57`;
  },

  ping: (args) => {
    if (!args || args.length === 0) {
      return "Usage: ping [name]";
    }
    
    const name = args[0].toLowerCase();
    const npc = scenario.npcs.find(n => 
      n.firstName.toLowerCase() === name || 
      n.id.toLowerCase() === name ||
      n.email.toLowerCase().includes(name)
    );
    
    if (npc) {
      const statuses = ['ONLINE', 'ONLINE', 'AWAY', 'ONLINE', 'AWAY'];
      const times = ['2 minutes ago', '34 minutes ago', 'this morning', 'just now', '4 minutes ago', 'yesterday'];
      const status = statuses[Math.abs(name.charCodeAt(0)) % statuses.length];
      const time = times[Math.abs(name.charCodeAt(0)) % times.length];
      return `${npc.email.split('@')[0]} — ${status} (last active: ${time})`;
    }
    
    return "User not found.";
  },

  tasks: () => "Opening Synergy Drive — Task Board...",

  axiom: () => `AXIOM DIGITAL INTEGRATION STATUS
──────────────────────────────────
Data migration:       43% complete
Schema mapping:       In progress
Legacy system sunset: Q3 (target)
Integration lead:     Jess Okafor
Last sync:            Fri 23:14

WARNING: 3 unmapped entity types. See migration log for details.`,

  clear: () => "__CLEAR__"
});


const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const ExecuTerm = ({ onOpenTasks, deepLink }) => {
  const wnapp = useSelector((state) => state.apps.executerm);
  const dispatch = useDispatch();
  const playerName = useSelector(selectPlayerName);
  const activeChoice = useSelector(selectActiveChoice);
  const gameTime = useSelector(selectFormattedGameTime);
  const gameDate = useSelector(selectGameDate);
  const terminalState = useSelector((state) => state.player?.terminal);
  const { scenario, getNPC, getPlayerName } = useScenario();
  
  // Create commands with access to scenario data
  const commands = useCallback(() => createCommands(scenario, getNPC, () => playerName || getPlayerName()), [scenario, getNPC, getPlayerName, playerName]);
  
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const deepLinkProcessedRef = useRef(false);

  // Handle dialogue choice resolution
  const handleChoiceResolve = useCallback((optionId) => {
    const choice = activeChoice;
    if (!choice) return;

    // Apply consequences
    const option = choice.options?.find(opt => opt.id === optionId);
    if (option?.consequences) {
      const cons = option.consequences;
      
      // Handle stat deltas
      if (cons.statDeltas) {
        dispatch(updateStats(cons.statDeltas));
      }
      
      // Handle rep deltas
      if (cons.repDeltas) {
        dispatch(updateStats({ reputation: Object.entries(cons.repDeltas).map(([npcId, score]) => ({ npcId, score })) }));
      }
      
      // Handle hidden flags
      if (cons.hiddenFlags) {
        if (typeof cons.hiddenFlags === 'function') {
          const flags = cons.hiddenFlags({ player: { hiddenState: {} } });
          dispatch(setMultipleHiddenFlags(flags));
        } else {
          dispatch(setMultipleHiddenFlags(cons.hiddenFlags));
        }
      }
      
      // Handle trigger events
      if (cons.triggerEventIds) {
        cons.triggerEventIds.forEach(eventId => {
          dispatch({ type: 'SCHEDULE_EVENT', payload: eventId });
        });
      }
      
      // Handle trigger event (singular)
      if (cons.triggerEventId) {
        dispatch({ type: 'SCHEDULE_EVENT', payload: cons.triggerEventId });
      }
    }

    // Store resolved choice
    dispatch(addResolvedChoice({
      choiceId: choice.id,
      optionId,
      context: choice.contextId || 'executerm',
      gameDay: parseInt(gameDate?.split(' ')[1] || '1'),
      currentGameMinutes: 0, // Simplified for now
    }));

    // Resolve the choice
    dispatch(resolveChoice(choice.id, optionId));

    // Resume game time if blocked
    dispatch(resumeGameTime());

    // Handle NPC follow-up response
    if (option?.consequences?.npcFollowUpKey) {
      const response = getNPCResponse(choice.contextId, option.consequences.npcFollowUpKey);
      if (response) {
        setTimeout(() => {
          setLines(prev => [...prev, { type: "output", text: response }]);
        }, 800);
      }
    }
  }, [activeChoice, dispatch, gameTime, gameDate]);

  // Handle pending command from Redux state
  useEffect(() => {
    if (terminalState?.pendingCommand) {
      executeCommand(terminalState.pendingCommand);
      // Clear the pending command
      dispatch({ type: 'TERMINAL_EXEC', payload: null });
    }
  }, [terminalState?.pendingCommand]);

  // Handle output lines from Redux state
  useEffect(() => {
    if (terminalState?.outputLines && terminalState.outputLines.length > 0) {
      const newLines = terminalState.outputLines.filter((line, idx) => 
        idx >= lines.length
      );
      if (newLines.length > 0) {
        setLines(prev => [...prev, ...newLines]);
      }
    }
  }, [terminalState?.outputLines]);

  if (!wnapp) return null;

  // Boot sequence
  useEffect(() => {
    if (!booted && !wnapp.hide) {
      let delay = 0;
      BOOT_SEQUENCE.forEach((line, idx) => {
        setTimeout(() => {
          setLines(prev => [...prev, { type: "system", text: line }]);
          if (idx === BOOT_SEQUENCE.length - 1) {
            setBooted(true);
          }
        }, delay);
        delay += 40;
      });
    }
  }, [wnapp.hide, booted]);

  // Auto-scroll
  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [lines]);

  // Focus input on load
  useEffect(() => {
    if (booted && !wnapp.hide) {
      inputRef.current?.focus();
    }
  }, [booted, wnapp.hide]);
  
  // Handle deep links
  useEffect(() => {
    if (deepLink && booted && !wnapp.hide && !deepLinkProcessedRef.current) {
      if (deepLink === 'calendar') {
        deepLinkProcessedRef.current = true;
        // Auto-run calendar command
        setTimeout(() => {
          const output = commands().calendar();
          setLines(prev => [...prev, 
            { type: "input", text: "> calendar (from notification)" },
            { type: "output", text: output }
          ]);
        }, 100);
      }
    }
  }, [deepLink, booted, wnapp.hide, commands]);

  const executeCommand = (cmdLine) => {
    const trimmed = cmdLine.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add to history
    setLines(prev => [...prev, { type: "input", text: `> ${trimmed}` }]);
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      setLines([]);
    } else if (cmd === "tasks") {
      setLines(prev => [...prev, { type: "output", text: commands().tasks() }]);
      // Trigger the cross-app navigation
      setTimeout(() => {
        onOpenTasks?.();
      }, 500);
    } else if (commands()[cmd]) {
      const output = commands()[cmd](args);
      if (output && output !== "__CLEAR__") {
        setLines(prev => [...prev, { type: "output", text: output }]);
      }
    } else {
      setLines(prev => [...prev, { 
        type: "error", 
        text: `Command not recognised. Type 'help' for available commands.` 
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="executerm floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z
      }}
      data-hide={wnapp?.hide}
      id={wnapp?.icon + "App"}
      onClick={() => inputRef.current?.focus()}
    >
      <ToolBar
        app={wnapp?.action}
        icon={wnapp?.icon}
        size={wnapp?.size}
        name="ExecuTerm"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="executerm-container" ref={terminalRef}>
          <div className="executerm-lines">
            {lines.map((line, idx) => (
              <div key={idx} className={`executerm-line ${line.type}`}>
                {line.text.split("\n").map((text, i) => (
                  <div key={i}>{text}</div>
                ))}
              </div>
            ))}
            
            {/* Render inline dialogue choice for executerm type */}
            {activeChoice && activeChoice.type === 'executerm' && !activeChoice.resolvedOptionId && (
              <div className="executerm-line dialogue">
                <DialogueChoice 
                  choice={activeChoice}
                  onResolve={handleChoiceResolve}
                />
              </div>
            )}
          </div>
          
          {booted && (
            <div className="executerm-input-line">
              <span className="executerm-prompt">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="executerm-input"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
              />
              <span className="executerm-cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
