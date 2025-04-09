import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} UPSC Agent - AI-powered MCQ Generation for UPSC Preparation</p>
      </div>
    </footer>
  );
};

export default Footer; 