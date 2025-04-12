import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
      <p>© {new Date().getFullYear()} CIVISYNC - AI-powered UPSC Preparation</p>
      </div>
    </footer>
  );
};

export default Footer;