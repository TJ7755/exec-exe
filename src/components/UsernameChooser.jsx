import React, { useState } from "react";
import { setUsername } from "../utils/username";
import "./usernameChooser.scss";

export const UsernameChooser = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name");
      return;
    }

    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmed.length > 30) {
      setError("Name must be 30 characters or less");
      return;
    }

    setUsername(trimmed);
    onComplete?.(trimmed);
  };

  return (
    <div className="uc-screen">
      {/* blurred wallpaper backdrop */}
      <div className="uc-backdrop" />

      <div className="uc-panel">
        {/* avatar placeholder */}
        <div className="uc-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>

        <div className="uc-title">Welcome to Exec.exe</div>
        <div className="uc-subtitle">Enter your name to begin the simulation</div>

        <form onSubmit={handleSubmit} className="uc-form">
          <div className="uc-input-wrap">
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Your name"
              autoFocus
              maxLength={30}
              className={error ? "uc-input uc-input--error" : "uc-input"}
            />
            <button
              type="submit"
              className="uc-arrow-btn"
              disabled={!name.trim()}
              aria-label="Continue"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
          </div>
          {error && <div className="uc-error">{error}</div>}
        </form>

        <div className="uc-hint">
          Used for email signatures, messages &amp; documents
        </div>
      </div>
    </div>
  );
};
