import React, { useState } from "react";
import ResourceSelector from "./ResourceSelector";

const QueryPanel = ({ activeIndex, uploadedIndex, onGenerateMCQs, isLoading, setActiveIndex }) => {
  const [query, setQuery] = useState("Generate 5 UPSC-style MCQs");
  const [manualIndexName, setManualIndexName] = useState("");
  const [showResourceSelector, setShowResourceSelector] = useState(false);
  
  const predefinedQueries = [
    "Generate 5 UPSC-style MCQs",
    "Create 10 multiple choice questions for UPSC prelims",
    "Generate 5 analytical MCQs about Indian history",
    "Create 5 MCQs about Indian economy with explanations",
    "Generate 5 MCQs about Indian geography with detailed answers"
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const indexToUse = activeIndex || manualIndexName;
    if (indexToUse) {
      onGenerateMCQs(query, indexToUse);
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
              {predefinedQueries.map((predefinedQuery, index) => (
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
            {isLoading ? "Generating..." : "Generate MCQs"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryPanel; 