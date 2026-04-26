import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar } from "../../utils/general";
import { selectActiveChoice } from "../../player/dialogueStore";
import { resolveChoice, addResolvedChoice } from "../../player/dialogueStore";
import { unblockDialogue, selectCurrentDay, selectCurrentGameMinutes } from "../../player/gameTime";
import { setMultipleHiddenFlags } from "../../player/hiddenState";
import { updateStats } from "../../player/store";
import { setMeridianFlag } from "../../player/gameState";
// import { getNPCResponse } from "../../scenarios/meridian/npcResponses";
import DialogueChoice from "../../components/dialogue/DialogueChoice";
import "./executerm.scss";

const BOOT_SEQUENCE = [
  "Meridian Education Group — ExecuTerm v2.4.1",
  "(c) 2024 Meridian Education Group Ltd. All rights reserved.",
  "",
  "WARNING: This terminal is monitored in accordance with the Meridian Acceptable",
  "Use Policy (see Employee Handbook, Section 7.4). Unauthorised use will be logged.",
  "",
  "Type 'help' for available commands.",
  ""
];

const listDirectory = (cwd) => {
  const map = {
    "/": ["home", "tmp", "var", "opt", "scripts"],
    "/home": ["player", "shared"],
    "/home/player": ["Desktop", "Documents", "Downloads"],
    "/opt": ["meridian"],
    "/opt/meridian": ["bin", "logs", "cache"],
    "/scripts": ["mpi_clean.sh"],
  };

  return (map[cwd] || [".."]).join("  ");
};


const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export const ExecuTerm = ({ onOpenTasks, deepLink }) => {
  const wnapp = useSelector((state) => state.apps.executerm);
  const dispatch = useDispatch();
  const activeChoice = useSelector(selectActiveChoice);
  const currentDay = useSelector(selectCurrentDay);
  const currentGameMinutes = useSelector(selectCurrentGameMinutes);
  const hiddenState = useSelector((state) => state.player?.hiddenState || {});
  const terminalState = useSelector((state) => state.player?.terminal);
  
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState("/home/player");
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
          const flags = cons.hiddenFlags({ player: { hiddenState } });
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
      chosenOptionId: optionId,
      allOptions: choice.options || [],
      gameDay: currentDay,
      gameMinute: currentGameMinutes,
      context: choice.contextId || 'executerm',
    }));

    // Resolve the choice
    dispatch(resolveChoice(choice.id, optionId));

    // Unblock game time (dialogue-blocking) if set by the choice UI
    dispatch(unblockDialogue());

    // Handle NPC follow-up response
    // TODO: Re-enable when npcResponses is available
    // if (option?.consequences?.npcFollowUpKey) {
    //   const response = getNPCResponse(choice.contextId, option.consequences.npcFollowUpKey);
    //   if (response) {
    //     setTimeout(() => {
    //       setLines(prev => [...prev, { type: "output", text: response }]);
    //     }, 800);
    //   }
    // }
  }, [activeChoice, dispatch, currentDay, currentGameMinutes, hiddenState]);

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

  useEffect(() => {
    if (!wnapp.hide) {
      dispatch(setMeridianFlag("EXECUTERM_OPENED", true));
    }
  }, [dispatch, wnapp.hide]);

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
          const output = "No scheduled tasks found";
          setLines(prev => [...prev, 
            { type: "input", text: "> calendar (from notification)" },
            { type: "output", text: output }
          ]);
        }, 100);
      }
    }
  }, [deepLink, booted, wnapp.hide]);

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
      setLines(prev => [...prev, { type: "output", text: "Opening Synergy Drive — Task Board..." }]);
      // Trigger the cross-app navigation
      setTimeout(() => {
        onOpenTasks?.();
      }, 500);
    } else if (trimmed === "help") {
      setLines(prev => [...prev, { type: "output", text: "Available commands:\n\nhelp\nls\npwd\ncd\ncat\nclear\nmeridian_scheduler --list\ntasks" }]);
    } else if (trimmed === "ls") {
      setLines(prev => [...prev, { type: "output", text: listDirectory(cwd) }]);
    } else if (trimmed === "pwd") {
      setLines(prev => [...prev, { type: "output", text: cwd }]);
    } else if (cmd === "cd") {
      const target = args[0] || "/home/player";
      const next = target === ".."
        ? cwd.split("/").slice(0, -1).join("/") || "/"
        : target.startsWith("/") ? target : `${cwd}/${target}`.replace(/\/+/g, "/");
      setCwd(next);
      setLines(prev => [...prev, { type: "output", text: "" }]);
    } else if (cmd === "cat") {
      const target = args.join(" ");
      if (target === "/scripts/mpi_clean.sh") {
        setLines(prev => [...prev, { type: "output", text: "#!/bin/bash\n# MPI Data Cleanup Script\n# Run quarterly to archive superseded data\n# Archive password: ARCHIVE2023\n\necho \"Starting MPI data cleanup...\"\n# Cleanup logic here" }]);
      } else if (target) {
        setLines(prev => [...prev, { type: "output", text: `cat: ${target}: Permission denied` }]);
      } else {
        setLines(prev => [...prev, { type: "output", text: "cat: missing file operand" }]);
      }
    } else if (trimmed === "meridian_scheduler --list") {
      setLines(prev => [...prev, { type: "output", text: "Scheduled tasks:\n\n2025-03-15 02:00 — MPI data cleanup (quarterly)\n2025-06-15 02:00 — MPI data cleanup (quarterly)\n2025-09-15 02:00 — MPI data cleanup (quarterly)\n2025-12-15 02:00 — MPI data cleanup (quarterly)" }]);
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
