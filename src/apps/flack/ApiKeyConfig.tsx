import React, { useState, useEffect } from "react";
import { getGeminiKey, getOpenRouterKey, setGeminiKey, setOpenRouterKey, clearGeminiKey, clearOpenRouterKey } from "./apiKeyManager";
import "./ApiKeyConfig.scss";

interface ApiKeyConfigProps {
  onClose: () => void;
}

export const ApiKeyConfig = ({ onClose }: ApiKeyConfigProps) => {
  const [geminiKey, setGeminiKeyInput] = useState("");
  const [openRouterKey, setOpenRouterKeyInput] = useState("");
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenRouter, setShowOpenRouter] = useState(false);

  useEffect(() => {
    setGeminiKeyInput(getGeminiKey() || "");
    setOpenRouterKeyInput(getOpenRouterKey() || "");
  }, []);

  const handleSaveGemini = () => {
    if (geminiKey.trim()) {
      setGeminiKey(geminiKey);
    } else {
      clearGeminiKey();
    }
  };

  const handleSaveOpenRouter = () => {
    if (openRouterKey.trim()) {
      setOpenRouterKey(openRouterKey);
    } else {
      clearOpenRouterKey();
    }
  };

  const handleClearGemini = () => {
    setGeminiKeyInput("");
    clearGeminiKey();
  };

  const handleClearOpenRouter = () => {
    setOpenRouterKeyInput("");
    clearOpenRouterKey();
  };

  const hasGeminiKey = !!getGeminiKey();
  const hasOpenRouterKey = !!getOpenRouterKey();

  return (
    <div className="api-key-config-overlay" onClick={onClose}>
      <div className="api-key-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="api-key-config-header">
          <h2>API Key Configuration</h2>
          <button className="api-key-config-close" onClick={onClose}>×</button>
        </div>

        <div className="api-key-config-content">
          <div className="api-key-config-section">
            <div className="api-key-config-label">
              <span>Gemini API Key</span>
              {hasGeminiKey && <span className="api-key-config-check">✓</span>}
            </div>
            <div className="api-key-config-input-group">
              <input
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="Enter Gemini API key"
                className="api-key-config-input"
              />
              <button
                className="api-key-config-toggle"
                onClick={() => setShowGemini(!showGemini)}
              >
                {showGemini ? "Hide" : "Show"}
              </button>
            </div>
            <div className="api-key-config-actions">
              <button className="api-key-config-save" onClick={handleSaveGemini}>
                Save
              </button>
              {hasGeminiKey && (
                <button className="api-key-config-clear" onClick={handleClearGemini}>
                  Clear
                </button>
              )}
            </div>
            <div className="api-key-config-helper">
              Get your key at{" "}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                aistudio.google.com
              </a>
            </div>
          </div>

          <div className="api-key-config-section">
            <div className="api-key-config-label">
              <span>OpenRouter API Key</span>
              {hasOpenRouterKey && <span className="api-key-config-check">✓</span>}
            </div>
            <div className="api-key-config-input-group">
              <input
                type={showOpenRouter ? "text" : "password"}
                value={openRouterKey}
                onChange={(e) => setOpenRouterKeyInput(e.target.value)}
                placeholder="Enter OpenRouter API key"
                className="api-key-config-input"
              />
              <button
                className="api-key-config-toggle"
                onClick={() => setShowOpenRouter(!showOpenRouter)}
              >
                {showOpenRouter ? "Hide" : "Show"}
              </button>
            </div>
            <div className="api-key-config-actions">
              <button className="api-key-config-save" onClick={handleSaveOpenRouter}>
                Save
              </button>
              {hasOpenRouterKey && (
                <button className="api-key-config-clear" onClick={handleClearOpenRouter}>
                  Clear
                </button>
              )}
            </div>
            <div className="api-key-config-helper">
              Get your key at{" "}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                openrouter.ai
              </a>
            </div>
          </div>

          <div className="api-key-config-info">
            <p>
              <strong>Note:</strong> Gemini is used as the primary provider. OpenRouter is used as a fallback.
              At least one API key is required for AI-powered responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
