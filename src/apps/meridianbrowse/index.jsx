import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../utils/general";
import { Intranet } from "./Intranet";
import "./meridianbrowse.scss";

// MIS Logo component
const MISLogo = () => (
  <svg className="mis-logo-pulse" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="4" fill="#1B3A5C"/>
    <text x="14" y="19" 
          fontFamily="Arial, sans-serif" 
          fontSize="12" 
          fontWeight="bold" 
          fill="white" 
          textAnchor="middle">MIS</text>
  </svg>
);

// Monitoring banner component
const MonitoringBanner = ({ onDismiss }) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <div className="monitoring-banner">
      <div className="monitoring-content">
        <span className="monitoring-icon">⚠️</span>
        <span className="monitoring-text">
          This browser is monitored by Meridian Education Group IT Security.
          All activity is logged. MIS Acceptable Use Policy (AUP-2024-v3) applies.
        </span>
        <button 
          className="monitoring-dismiss"
          onClick={() => setDismissed(true)}
        >
          <Icon fafa="faTimes" width={12} />
        </button>
      </div>
    </div>
  );
};

// Address bar component
const AddressBar = ({ url, onNavigate, onBack, onForward, onRefresh, canGoBack, canGoForward, mode, onModeChange }) => {
  const [inputValue, setInputValue] = useState(url);
  
  useEffect(() => {
    setInputValue(url);
  }, [url]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigate(inputValue);
  };
  
  return (
    <div className="meridian-address-bar">
      <div className="meridian-nav-buttons">
        <button 
          className="meridian-nav-btn"
          onClick={onBack}
          disabled={!canGoBack || mode === 'intranet'}
        >
          <Icon fafa="faArrowLeft" width={14} />
        </button>
        <button 
          className="meridian-nav-btn"
          onClick={onForward}
          disabled={!canGoForward || mode === 'intranet'}
        >
          <Icon fafa="faArrowRight" width={14} />
        </button>
        <button 
          className="meridian-nav-btn"
          onClick={onRefresh}
          disabled={mode === 'intranet'}
        >
          <Icon fafa="faRedo" width={14} />
        </button>
      </div>
      
      <form className="meridian-url-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          className="meridian-url-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={mode === 'intranet' ? 'Intranet mode - external URLs disabled' : 'Enter URL or search term'}
          disabled={mode === 'intranet'}
        />
        <Icon 
          src="search" 
          ui 
          width={14} 
          className="meridian-url-search-icon"
        />
      </form>
      
      <div className="meridian-mode-toggle">
        <button 
          className={`meridian-mode-btn ${mode === 'internet' ? 'active' : ''}`}
          onClick={() => onModeChange('internet')}
        >
          <Icon fafa="faGlobe" width={14} />
          Internet
        </button>
        <button 
          className={`meridian-mode-btn ${mode === 'intranet' ? 'active' : ''}`}
          onClick={() => onModeChange('intranet')}
        >
          <Icon fafa="faLock" width={14} />
          MIS Intranet
        </button>
      </div>
    </div>
  );
};

export const MeridianBrowse = () => {
  const wnapp = useSelector((state) => state.apps.meridianbrowse);
  const dispatch = useDispatch();
  const [mode, setMode] = useState('internet'); // 'internet' or 'intranet'
  const [url, setUrl] = useState('https://www.google.com/?igu=1');
  const [history, setHistory] = useState(['https://www.google.com/?igu=1']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [dismissedSession, setDismissedSession] = useState(false);
  const [specialPage, setSpecialPage] = useState(null);
  const webviewRef = useRef(null);

  useEffect(() => {
    const handleSupport = () => {
      const supportUrl = "http://intranet.meridian-edu.co.uk/it-helpdesk/support";
      setMode("internet");
      setUrl(supportUrl);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), supportUrl]);
      setHistoryIndex((prev) => prev + 1);
      setSpecialPage("support404");
    };

    window.addEventListener("meridianbrowse-open-support", handleSupport);
    return () => window.removeEventListener("meridianbrowse-open-support", handleSupport);
  }, [historyIndex]);

  if (!wnapp) return null;

  const handleNavigate = (newUrl) => {
    let processedUrl = newUrl;
    if (newUrl === "http://intranet.meridian-edu.co.uk/it-helpdesk/support") {
      setSpecialPage("support404");
      setUrl(newUrl);
      return;
    }
    
    // Add protocol if missing
    if (!processedUrl.startsWith('http')) {
      if (processedUrl.includes('.')) {
        processedUrl = 'https://' + processedUrl;
      } else {
        processedUrl = 'https://www.bing.com/search?q=' + encodeURIComponent(processedUrl);
      }
    }
    
    setUrl(processedUrl);
    setSpecialPage(null);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(processedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Load in webview
    if (webviewRef.current) {
      webviewRef.current.src = processedUrl;
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setSpecialPage(history[newIndex] === "http://intranet.meridian-edu.co.uk/it-helpdesk/support" ? "support404" : null);
      if (webviewRef.current) {
        webviewRef.current.src = history[newIndex];
      }
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setSpecialPage(history[newIndex] === "http://intranet.meridian-edu.co.uk/it-helpdesk/support" ? "support404" : null);
      if (webviewRef.current) {
        webviewRef.current.src = history[newIndex];
      }
    }
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <div
      className="meridian-browse floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z,
      }}
      data-hide={wnapp?.hide}
      id={wnapp?.icon + "App"}
    >
      <ToolBar
        app={wnapp?.action}
        icon={wnapp?.icon}
        size={wnapp?.size}
        name="MeridianBrowse v3.1"
        bg="#fefefe"
        logo={<MISLogo />}
      />
      
      <div className="windowScreen flex flex-col">
        <AddressBar
          url={url}
          onNavigate={handleNavigate}
          onBack={handleBack}
          onForward={handleForward}
          onRefresh={handleRefresh}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < history.length - 1}
          mode={mode}
          onModeChange={handleModeChange}
        />
        
        {mode === 'internet' && !dismissedSession && (
          <MonitoringBanner onDismiss={() => setDismissedSession(true)} />
        )}
        
        <div className="meridian-content">
          {mode === 'internet' ? (
            specialPage === "support404" ? (
              <div className="intranet-home">
                <div className="intranet-welcome">
                  <h1>404 — Page Not Found</h1>
                  <p className="intranet-welcome-text">This page could not be found. It may have been moved or removed.</p>
                </div>
                <div className="outbox-compose-actions" style={{ padding: "0 24px 24px" }}>
                  <button className="outbox-btn-primary" onClick={() => setSpecialPage("support404")}>Contact IT Support</button>
                  <button className="outbox-btn-secondary" onClick={() => { setMode("intranet"); setSpecialPage(null); }}>Return to Intranet</button>
                </div>
                <div style={{ marginTop: "auto", padding: "24px", fontSize: "12px", color: "#666" }} title={`Meridian Education Services was the trading name of this organisation until March 2023. If you are experiencing technical difficulties, please contact Meridian Logistics Ltd on 01603 488 122.`}>
                  © Meridian Education Services 2022
                </div>
              </div>
            ) : (
              <div className="meridian-webview-container">
                {window.require ? (
                  <webview
                    ref={webviewRef}
                    src={url}
                    key={url}
                    className="meridian-webview"
                    partition="persist:meridianbrowse"
                  />
                ) : (
                  <iframe
                    ref={webviewRef}
                    src={url}
                    key={url}
                    className="meridian-webview"
                    title="MeridianBrowse"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                )}
              </div>
            )
          ) : (
            <Intranet />
          )}
        </div>
      </div>
    </div>
  );
};

export default MeridianBrowse;
