import React, { useState, useEffect } from "react";
import "./styles.css";

// Components
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import QueryPanel from "./components/QueryPanel";
import ResultDisplay from "./components/ResultDisplay";
import Footer from "./components/Footer";

function App() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [uploadedIndex, setUploadedIndex] = useState(null);
  const [resultContent, setResultContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [contentType, setContentType] = useState("MCQ"); // Default content type is MCQ

  // Check if we're in mobile view on component mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };
    
    // Initial check
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  const handleSuccessfulUpload = (indexName) => {
    setUploadedIndex(indexName);
    setActiveIndex(indexName);
    setError(null);
  };

  const handleGenerateContent = async (query, indexName, type = "MCQ") => {
    if (!indexName) {
      setError("Please provide an index name");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://oollama-rag.onrender.com/75605149-f19c-434c-b2cc-15ab6991e8e3/query/?query=${encodeURIComponent(query)}&index_name=${encodeURIComponent(indexName)}&content_type=${encodeURIComponent(type)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate ${type}`);
      }
      
      const data = await response.json();
      setResultContent(data.response);
      
      // On mobile, always collapse left panel and force scroll to results
      if (isMobileView) {
        setIsLeftPanelCollapsed(true);
        
        // Use a longer timeout to ensure DOM has updated
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          
          // Wait a bit more and then scroll to the right panel
          setTimeout(() => {
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) {
              rightPanel.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 100);
        }, 300);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
    
    // If in mobile and we're showing the panel again, scroll to it
    if (isMobileView && isLeftPanelCollapsed) {
      setTimeout(() => {
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) {
          leftPanel.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // If in mobile and we're hiding the panel, scroll to results
    if (isMobileView && !isLeftPanelCollapsed) {
      setTimeout(() => {
        const rightPanel = document.querySelector('.right-panel');
        if (rightPanel) {
          rightPanel.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className={`content-container ${isLeftPanelCollapsed ? 'expanded-content' : ''}`}>
          <div className={`left-panel ${isLeftPanelCollapsed ? 'collapsed' : ''}`}>
            <div className="panel-collapse-toggle">
              <button 
                className="collapse-btn" 
                onClick={toggleLeftPanel}
                title={isLeftPanelCollapsed ? "Expand panel" : "Collapse panel"}
                aria-label={isLeftPanelCollapsed ? "Expand panel" : "Collapse panel"}
              >
                {isLeftPanelCollapsed ? "→" : "←"}
              </button>
            </div>
            
            <div className="panel-content">
              <h2 className="panel-title">Document Management</h2>
              <FileUpload 
                onUploadSuccess={handleSuccessfulUpload} 
                setError={setError}
              />
              
              <div className="content-generation-section">
                <h2 className="panel-title">Content Generation</h2>
                <QueryPanel 
                  activeIndex={activeIndex}
                  uploadedIndex={uploadedIndex}
                  onGenerateContent={handleGenerateContent}
                  isLoading={isLoading}
                  setActiveIndex={setActiveIndex}
                  contentType={contentType}
                  setContentType={setContentType}
                />
              </div>
            </div>
          </div>
          
          <div className="right-panel">
            <div className="responsive-controls">
              {isLeftPanelCollapsed && (
                <button 
                  className="show-panel-btn"
                  onClick={toggleLeftPanel}
                  title="Show control panel"
                >
                  Show Controls ←
                </button>
              )}
            </div>
            
            {isMobileView && (
              <div className="mobile-content-status">
                {isLeftPanelCollapsed && resultContent && !isLoading && (
                  <div className="content-status-message">Showing generated content ↓</div>
                )}
              </div>
            )}
            
            <h2 className="panel-title">Generated Content</h2>
            <ResultDisplay 
              content={resultContent} 
              isLoading={isLoading}
              error={error}
              contentType={contentType}
            />
          </div>
        </div>
      </main>
      
      {isMobileView && (
        <div className="mobile-panel-toggle">
          <button 
            className="mobile-toggle-btn"
            onClick={toggleLeftPanel}
            title={isLeftPanelCollapsed ? "Show controls" : "Hide controls"}
            aria-label={isLeftPanelCollapsed ? "Show controls" : "Hide controls"}
          >
            {isLeftPanelCollapsed ? "⚙️" : "✕"}
          </button>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default App;
