import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'; // For tables, strikethrough, etc.

const ResultDisplay = ({ content, isLoading, error, contentType = "MCQ" }) => {
  const [copied, setCopied] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setContentOverflow(scrollHeight > clientHeight);
    }
  }, [content]);

  // Process markdown content to properly handle code blocks with triple backticks
  const processMarkdown = (content) => {
    if (!content) return "";
    
    let processedContent = content;
    
    // First pass: Handle specific markdown codeblocks that should be directly rendered
    processedContent = processedContent.replace(/```(markdown|md)\n([\s\S]*?)```/g, (match, language, code) => {
      // For markdown-specific code blocks, we want to preserve the content but remove the ```markdown wrapper
      return code;
    });
    
    // Second pass: Process the content for special formatting if needed
    // For example, ensure proper spacing for list items
    processedContent = processedContent.replace(/(\n[*-]\s.*\n)(?!\s*[*-])/g, '$1\n');
    
    return processedContent;
  };
  
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
  
  // Content type specific messages
  const loadingMessages = {
    MCQ: "Generating high-quality UPSC questions...",
    NOTES: "Creating comprehensive UPSC notes...",
    ESSAY: "Crafting a well-structured UPSC essay..."
  };
  
  const emptyStateMessages = {
    MCQ: {
      title: "No MCQs generated yet",
      description: "Upload a document or specify an index name, then generate MCQs to see results here",
      steps: ["Upload a PDF or specify an existing index", "Enter your query or select a template", "Click \"Generate MCQs\" to see results"]
    },
    NOTES: {
      title: "No notes generated yet",
      description: "Upload a document or specify an index name, then generate notes to see results here",
      steps: ["Upload a PDF or specify an existing index", "Enter your query or select a template", "Click \"Generate Notes\" to see results"]
    },
    ESSAY: {
      title: "No essay generated yet",
      description: "Upload a document or specify an index name, then generate an essay to see results here",
      steps: ["Upload a PDF or specify an existing index", "Enter your query or select a template", "Click \"Generate Essay\" to see results"]
    }
  };
  
  return (
    <div className="result-container">
      {isLoading && (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>{loadingMessages[contentType]}</p>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{processMarkdown(content)}</ReactMarkdown>
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
          <h3 className="empty-state-title">{emptyStateMessages[contentType].title}</h3>
          <p className="empty-state-description">
            {emptyStateMessages[contentType].description}
          </p>
          <div className="empty-state-steps">
            {emptyStateMessages[contentType].steps.map((step, index) => (
              <div className="step" key={index}>
                <div className="step-number">{index + 1}</div>
                <div className="step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay; 