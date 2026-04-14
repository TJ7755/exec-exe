import { useEffect, useState, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch, useSelector } from "react-redux";
import "./i18nextConf";
import "./index.css";

import ActMenu from "./components/menu";
import {
  BandPane,
  CalnWid,
  DesktopApp,
  SidePane,
  StartMenu,
  WidPane,
  NotificationPane,
} from "./components/start";
import Taskbar from "./components/taskbar";
import { Background, BootScreen, LockScreen } from "./containers/background";

import { loadSettings } from "./actions";
import * as Applications from "./containers/applications";
import * as Drafts from "./containers/applications/draft";

// Import Exec.exe apps for cross-app interaction
import { ExecuTerm } from "./apps/executerm";
import { Synergy } from "./apps/synergy";
import { Flack } from "./apps/flack";

// Import scenario data layer
import { ScenarioProvider, useScenario } from "./scenarios";

// Import player profile
import { 
  completeFirstLaunch, 
  updateDisplayName, 
  selectIsFirstLaunch, 
  selectPlayerName, 
  hasSavedGame, 
  addNotification,
  selectFlackDMs,
  selectNotifications
} from "./player/store";

// Import email store
import { selectEmails } from "./player/emailStore";

// Import Resume Modal
import ResumeModal from "./components/start/ResumeModal";

// Import legacy username utilities (for migration)
import { getUsername } from "./utils/username";

// Import notification components
import { ToastContainer, ActionCenter } from "./components/notifications";
import { 
  usePauseAwareNotifications,
  useFlackNotifications,
  useOutboxNotifications
} from "./components/notifications/useNotificationTriggers";

// Import scheduler for calendar event registration
import { initializeScheduler, registerCalendarEvents, clearRegisteredEvents } from "./player/events/scheduler";

// Import Day Summary component
import { DaySummary } from "./components/game/DaySummary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <meta charSet="UTF-8" />
      <title>404 - Page</title>
      <script src="https://win11.blueedge.me/script.js"></script>
      <link rel="stylesheet" href="https://win11.blueedge.me/style.css" />
      {/* partial:index.partial.html */}
      <div id="page">
        <div id="container">
          <h1>:(</h1>
          <h2>
            Your PC ran into a problem and needs to restart. We're just
            collecting some error info, and then we'll restart for you.
          </h2>
          <h2>
            <span id="percentage">0</span>% complete
          </h2>
          <div id="details">
            <div id="qr">
              <div id="image">
                <img src="https://win11.blueedge.me/img/qr.png" alt="QR Code" />
              </div>
            </div>
            <div id="stopcode">
              <h4>
                For more information about this issue and possible fixes, visit
                <br />{" "}
                <a href="https://github.com/blueedgetechno/win11React/issues">
                  https://github.com/blueedgetechno/win11React/issues
                </a>{" "}
              </h4>
              <h5>
                If you call a support person, give them this info:
                <br />
                Stop Code: {error.message}
              </h5>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          </div>
        </div>
      </div>
      {/* partial */}
    </div>
  );
}

function FirstLaunchModal({ onComplete }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    dispatch(updateDisplayName(trimmed));
    dispatch(completeFirstLaunch());
    onComplete?.();
  };

  const handleChange = (e) => {
    setName(e.target.value);
    setError("");
  };

  return (
    <div className="first-launch-overlay">
      <div className="first-launch-backdrop" />
      <div className="first-launch-content">
        <div className="first-launch-avatar">
          <img src="img/asset/stickman.svg" alt="User avatar" />
        </div>
        <h1 className="first-launch-title">Who&apos;s going to use this PC?</h1>
        <form onSubmit={handleSubmit} className="first-launch-form">
          <div className="first-launch-input-wrap">
            <input
              type="text"
              value={name}
              onChange={handleChange}
              placeholder="Your name"
              className={`first-launch-input ${error ? "first-launch-input--error" : ""}`}
              autoFocus
              maxLength={30}
            />
          </div>
          {error && <div className="first-launch-error">{error}</div>}
          <button
            type="submit"
            className="first-launch-next"
            disabled={!name.trim()}
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5L15 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function AppContent() {
  const apps = useSelector((state) => state.apps);
  const wall = useSelector((state) => state.wallpaper);
  const isFirstLaunch = useSelector(selectIsFirstLaunch);
  const playerName = useSelector(selectPlayerName);
  const dispatch = useDispatch();
  
  // Resume/Restart modal state
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasCheckedSave, setHasCheckedSave] = useState(false);
  
  // Get scenario data for calendar events
  const { scenario } = useScenario();
  
  // Get Flack DMs and previous state for message notifications
  const flackDMs = useSelector(selectFlackDMs);
  const prevFlackDMsRef = useRef(flackDMs);
  
  // Get emails and previous state for email notifications
  const emails = useSelector(selectEmails);
  const prevEmailsRef = useRef(emails);
  
  // Initialize scheduler
  useEffect(() => {
    initializeScheduler(dispatch, () => ({ player: { gameTime: { isPaused: false } } }));
  }, [dispatch]);
  
  // Register calendar events when scenario changes
  useEffect(() => {
    if (scenario?.calendar) {
      clearRegisteredEvents();
      registerCalendarEvents(scenario.calendar);
    }
  }, [scenario?.calendar]);
  
  // Initialize pause-aware notifications (hybrid mode)
  usePauseAwareNotifications();
  
  // Initialize message-driven notifications
  useFlackNotifications(flackDMs, prevFlackDMsRef.current);
  useOutboxNotifications(emails, prevEmailsRef.current);
  
  // Update previous refs for next comparison
  useEffect(() => {
    prevFlackDMsRef.current = flackDMs;
    prevEmailsRef.current = emails;
  }, [flackDMs, emails]);
  
  // Cross-app interaction state
  const [synergyView, setSynergyView] = useState(null);
  const [flackDeepLink, setFlackDeepLink] = useState(null);
  const [executermDeepLink, setExecutermDeepLink] = useState(null);
  
  // Handle deep links from notifications
  useEffect(() => {
    const handleFocusApp = (event) => {
      const { appId, deepLink } = event.detail;
      
      // Focus the app
      dispatch({
        type: appId.toUpperCase(),
        payload: "front"
      });
      
      // Handle deep links
      if (appId === 'flack' && deepLink) {
        setFlackDeepLink(deepLink);
      } else if (appId === 'executerm' && deepLink) {
        setExecutermDeepLink(deepLink);
      }
    };
    
    window.addEventListener('focus-app', handleFocusApp);
    return () => window.removeEventListener('focus-app', handleFocusApp);
  }, [dispatch]);
  
  // Handle toast messages from intranet
  useEffect(() => {
    const handleToast = (event) => {
      const { message } = event.detail;
      // Dispatch a notification for the toast message
      dispatch(addNotification({
        title: 'Meridian Intranet',
        body: message,
        urgency: 'low'
      }));
    };
    
    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, [dispatch]);

  const handleOpenTasks = () => {
    // Open Synergy Drive with Task Board view
    setSynergyView("tasks");
    // Bring Synergy to front
    dispatch({
      type: "SYNERGY",
      payload: "front"
    });
  };

  const afterMath = (event) => {
    var ess = [
      ["START", "STARTHID"],
      ["BAND", "BANDHIDE"],
      ["PANE", "PANEHIDE"],
      ["WIDG", "WIDGHIDE"],
      ["CALN", "CALNHIDE"],
      ["MENU", "MENUHIDE"],
    ];

    var actionType = "";
    try {
      actionType = event.target.dataset.action || "";
    } catch (err) {}

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
      "--prefix",
    );

    ess.forEach((item, i) => {
      if (!actionType.startsWith(item[0]) && !actionType0.startsWith(item[0])) {
        dispatch({
          type: item[1],
        });
      }
    });
  };

  window.oncontextmenu = (e) => {
    afterMath(e);
    e.preventDefault();
    // dispatch({ type: 'GARBAGE'});
    var data = {
      top: e.clientY,
      left: e.clientX,
    };

    if (e.target.dataset.menu != null) {
      data.menu = e.target.dataset.menu;
      data.attr = e.target.attributes;
      data.dataset = e.target.dataset;
      dispatch({
        type: "MENUSHOW",
        payload: data,
      });
    }
  };

  window.onclick = afterMath;

  window.onload = (e) => {
    dispatch({ type: "WALLBOOTED" });
  };

  useEffect(() => {
    if (!window.onstart) {
      loadSettings();
      window.onstart = setTimeout(() => {
        // console.log("prematurely loading ( ﾉ ﾟｰﾟ)ﾉ");
        dispatch({ type: "WALLBOOTED" });
      }, 5000);
    }
  });

  // Debug: Monitor desktop element for size and style changes
  useEffect(() => {
    const desktop = document.querySelector('.desktop');
    if (!desktop) return;
    
    console.log('Initial desktop:', {
      style: desktop.getAttribute('style'),
      class: desktop.className,
      rect: desktop.getBoundingClientRect()
    });
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log('Desktop resized:', {
          time: Date.now(),
          boundingRect: entry.target.getBoundingClientRect(),
          style: entry.target.getAttribute('style')
        });
      }
    });
    
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          console.log('Desktop mutated:', {
            time: Date.now(),
            attribute: mutation.attributeName,
            oldValue: mutation.oldValue,
            newValue: mutation.target.getAttribute(mutation.attributeName),
            rect: mutation.target.getBoundingClientRect()
          });
        }
      }
    });
    
    resizeObserver.observe(desktop);
    mutationObserver.observe(desktop, { 
      attributes: true, 
      attributeOldValue: true,
      attributeFilter: ['style', 'class'] 
    });
    
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Migrate legacy username to player store on first load
  useEffect(() => {
    const legacyName = getUsername();
    if (legacyName && !playerName) {
      dispatch(updateDisplayName(legacyName));
    }
  }, []);
  
  // Check for saved game when unlocking
  useEffect(() => {
    if (wall.booted && !wall.locked && !isFirstLaunch && !hasCheckedSave) {
      setHasCheckedSave(true);
      if (hasSavedGame()) {
        setShowResumeModal(true);
      }
    }
  }, [wall.booted, wall.locked, isFirstLaunch, hasCheckedSave]);

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {!wall.booted ? <BootScreen dir={wall.dir} /> : null}
        {wall.locked ? <LockScreen dir={wall.dir} /> : null}
        {wall.booted && !wall.locked && isFirstLaunch && (
          <FirstLaunchModal />
        )}
        {showResumeModal && (
          <ResumeModal 
            onResume={() => setShowResumeModal(false)}
            onClose={() => setShowResumeModal(false)}
          />
        )}
        <div className={"appwrap" + (isFirstLaunch ? " appwrap--hidden" : "")}>
          <DaySummary />
          <Background />
          <div className="desktop" data-menu="desk">
            <DesktopApp />
            {Object.keys(Applications).map((key, idx) => {
              var WinApp = Applications[key];
              // Special handling for ExecuTerm and Synergy to enable cross-app interaction
              if (key === "ExecuTerm") {
                return <ExecuTerm key={idx} onOpenTasks={handleOpenTasks} deepLink={executermDeepLink} />;
              }
              if (key === "Synergy") {
                return <Synergy key={idx} initialView={synergyView} />;
              }
              if (key === "Flack") {
                return <Flack key={idx} deepLink={flackDeepLink} />;
              }
              return <WinApp key={idx} />;
            })}
            {Object.keys(apps)
              .filter((x) => x != "hz")
              .map((key) => apps[key])
              .map((app, i) => {
                if (app.pwa) {
                  var WinApp = Drafts[app.data.type];
                  return <WinApp key={i} icon={app.icon} {...app.data} />;
                }
              })}
            <StartMenu />
            <BandPane />
            <SidePane />
            <WidPane />
            <CalnWid />
            <NotificationPane />
          </div>
          <Taskbar />
          <ActMenu />
          <ToastContainer />
        </div>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <ScenarioProvider>
      <AppContent />
    </ScenarioProvider>
  );
}

export default App;
