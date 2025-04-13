import React, { useState, useEffect } from "react";
import ResourceSelector from "./ResourceSelector";

const QueryPanel = ({ 
  activeIndex, 
  uploadedIndex, 
  onGenerateContent, 
  isLoading, 
  setActiveIndex,
  contentType,
  setContentType
}) => {
  const [query, setQuery] = useState("Generate 5 UPSC-style MCQs");
  const [manualIndexName, setManualIndexName] = useState("");
  const [showResourceSelector, setShowResourceSelector] = useState(false);
  
  // Predefined queries based on content type
  const predefinedQueries = {
    MCQ: [
      "Generate 5 UPSC-style MCQs",
      "Create 10 multiple choice questions for UPSC prelims",
      "Generate 5 analytical MCQs about Indian history",
      "Create 5 MCQs about Indian economy with explanations",
      "Generate 5 MCQs about Indian geography with detailed answers"
    ],
    NOTES: [
      "Create comprehensive notes on Indian Constitution",
      "Generate concise notes on Environmental Studies for UPSC",
      "Prepare detailed notes on Indian Economy for UPSC mains",
      "Create structured notes on Modern Indian History",
      "Generate bullet-point notes on International Relations"
    ],
    ESSAY: [
      "Write a UPSC essay on Climate Change and its impact on India",
      "Draft an essay on Technology and Ethics for UPSC mains",
      "Generate an essay on Women Empowerment in India",
      "Create a structured essay on India's Foreign Policy",
      "Write an essay on Democracy and Governance in India"
    ]
  };

  // Update query when content type changes
  useEffect(() => {
    setQuery(predefinedQueries[contentType][0]);
  }, [contentType]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const indexToUse = activeIndex || manualIndexName;
    if (indexToUse) {
      onGenerateContent(query, indexToUse, contentType);
    }
  };
  
  const handleIndexChange = (e) => {
    setActiveIndex(e.target.value);
  };
  
  const selectPredefinedQuery = (predefinedQuery) => {
    setQuery(predefinedQuery);
  };
  
  const handleSelectExistingIndex = (indexName) => {
    setActiveIndex(indexName);
    setShowResourceSelector(false);
  };
  
  return (
    <div className="query-panel">
      <h3>Generate Content</h3>
      
      <div className="content-type-selector">
        <div className="content-type-heading">Content Type:</div>
        <div className="content-type-buttons">
          <button
            type="button"
            className={`content-type-button ${contentType === 'MCQ' ? 'active' : ''}`}
            onClick={() => setContentType('MCQ')}
            disabled={isLoading}
          >
            MCQs
          </button>
          <button
            type="button"
            className={`content-type-button ${contentType === 'NOTES' ? 'active' : ''}`}
            onClick={() => setContentType('NOTES')}
            disabled={isLoading}
          >
            Notes
          </button>
          <button
            type="button"
            className={`content-type-button ${contentType === 'ESSAY' ? 'active' : ''}`}
            onClick={() => setContentType('ESSAY')}
            disabled={isLoading}
          >
            Essays
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="query-form">
        <div className="input-group">
          <label htmlFor="query-input">Query:</label>
          <textarea
            id="query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here"
            rows={3}
            disabled={isLoading}
          />
          <div className="query-templates">
            <p className="templates-heading">Suggested templates:</p>
            <div className="template-buttons">
              {predefinedQueries[contentType].map((predefinedQuery, index) => (
                <button
                  key={index}
                  type="button"
                  className="template-button"
                  onClick={() => selectPredefinedQuery(predefinedQuery)}
                  disabled={isLoading}
                >
                  {predefinedQuery.length > 30 ? predefinedQuery.substring(0, 27) + "..." : predefinedQuery}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="index-selection-container">
          <div className="index-selection-header">
            <h4>Select Data Source</h4>
            <div className="source-toggle">
              <button 
                type="button"
                className={`source-toggle-btn ${!showResourceSelector ? 'active' : ''}`}
                onClick={() => setShowResourceSelector(false)}
                disabled={isLoading}
              >
                Manual Entry
              </button>
              <button 
                type="button"
                className={`source-toggle-btn ${showResourceSelector ? 'active' : ''}`}
                onClick={() => setShowResourceSelector(true)}
                disabled={isLoading}
              >
                Available Resources
              </button>
            </div>
          </div>
          
          {!showResourceSelector ? (
            <div className="manual-index-entry">
              {uploadedIndex ? (
                <div className="input-group">
                  <label htmlFor="index-select">Index Name:</label>
                  <select
                    id="index-select"
                    value={activeIndex || ""}
                    onChange={handleIndexChange}
                    disabled={isLoading}
                  >
                    <option value={uploadedIndex}>{uploadedIndex}</option>
                    <option value="">Use custom index name</option>
                  </select>
                </div>
              ) : null}
              
              {(!uploadedIndex || activeIndex === "") && (
                <div className="input-group">
                  <label htmlFor="manual-index">Custom Index Name:</label>
                  <input
                    type="text"
                    id="manual-index"
                    value={manualIndexName}
                    onChange={(e) => setManualIndexName(e.target.value)}
                    placeholder="Enter index name"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          ) : (
            <ResourceSelector 
              onSelectIndex={handleSelectExistingIndex} 
              isLoading={isLoading}
            />
          )}
        </div>
        
        <div className="selected-index-display">
          {activeIndex && (
            <div className="current-index">
              <span className="current-index-label">Current Index:</span>
              <span className="current-index-value">{activeIndex}</span>
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <button
            type="submit"
            className="generate-button"
            disabled={isLoading || (!activeIndex && !manualIndexName)}
          >
            {isLoading ? "Generating..." : `Generate ${contentType === 'MCQ' ? 'MCQs' : contentType === 'NOTES' ? 'Notes' : 'Essay'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryPanel; 