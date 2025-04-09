import React from "react";

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">📝</span>
          </div>
          <h1>UPSC Agent</h1>
        </div>
        <div className="tagline">
          <p>Advanced AI-powered MCQ Generation for UPSC Preparation</p>
          <div className="header-actions">
            <a href="https://upsc.gov.in/" target="_blank" rel="noopener noreferrer" className="header-link">UPSC Website</a>
            <span className="header-divider">|</span>
            <a href="#help" className="header-link">Help</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 