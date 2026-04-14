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
          This browser is monitored by Meridian Infrastructure Services IT Security.
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
  const webviewRef = useRef(null);

  if (!wnapp) return null;

  const handleNavigate = (newUrl) => {
    let processedUrl = newUrl;
    
    // Add protocol if missing
    if (!processedUrl.startsWith('http')) {
      if (processedUrl.includes('.')) {
        processedUrl = 'https://' + processedUrl;
      } else {
        processedUrl = 'https://www.bing.com/search?q=' + encodeURIComponent(processedUrl);
      }
    }
    
    setUrl(processedUrl);
    
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
            <div className="meridian-webview-container">
              {window.require ? (
                // Electron webview
                <webview
                  ref={webviewRef}
                  src={url}
                  key={url}
                  className="meridian-webview"
                  partition="persist:meridianbrowse"
                />
              ) : (
                // Fallback to iframe for browser
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
          ) : (
            <Intranet />
          )}
        </div>
      </div>
    </div>
  );
};

export default MeridianBrowse;
