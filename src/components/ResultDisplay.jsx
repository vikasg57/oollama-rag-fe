import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const ResultDisplay = ({ content, isLoading, error }) => {
  const [copied, setCopied] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setContentOverflow(scrollHeight > clientHeight);
    }
  }, [content]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };
  
  return (
    <div className="result-container">
      {isLoading && (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Generating high-quality UPSC questions...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {!isLoading && !error && content && (
        <div className="result-wrapper">
          <div className="result-actions">
            <button 
              className="copy-button" 
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              {copied ? "Copied! ✓" : "Copy"}
            </button>
          </div>
          <div 
            className="result-content" 
            ref={contentRef}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          {contentOverflow && (
            <div className="scroll-top-container">
              <button 
                className="scroll-top-button" 
                onClick={scrollToTop}
                title="Scroll to top"
              >
                ↑ Back to top
              </button>
            </div>
          )}
        </div>
      )}
      
      {!isLoading && !error && !content && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No content generated yet</h3>
          <p className="empty-state-description">
            Upload a document or specify an index name, then generate MCQs to see results here
          </p>
          <div className="empty-state-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-text">Upload a PDF or specify an existing index</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-text">Enter your query or select a template</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-text">Click "Generate MCQs" to see results</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay; 