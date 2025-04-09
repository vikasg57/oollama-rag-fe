import React, { useState, useEffect } from "react";

const ResourceSelector = ({ onSelectIndex, isLoading }) => {
  const [resources, setResources] = useState({ pdfs: [], indices: [] });
  const [fetchError, setFetchError] = useState(null);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [selectedTab, setSelectedTab] = useState("indices");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoadingResources(true);
    setFetchError(null);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/75605149-f19c-434c-b2cc-15ab6991e8e3/list-resources");
      
      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }
      
      const data = await response.json();
      setResources({
        pdfs: data.pdfs || [],
        indices: data.indices || []
      });
    } catch (err) {
      setFetchError(err.message);
      console.error("Error fetching resources:", err);
    } finally {
      setIsLoadingResources(false);
    }
  };

  const handleSelectIndex = (indexName) => {
    onSelectIndex(indexName);
  };

  return (
    <div className="resource-selector">
      <div className="resource-tabs">
        <button 
          className={`tab-button ${selectedTab === 'indices' ? 'active' : ''}`}
          onClick={() => setSelectedTab('indices')}
        >
          Existing Indices
        </button>
        <button 
          className={`tab-button ${selectedTab === 'pdfs' ? 'active' : ''}`}
          onClick={() => setSelectedTab('pdfs')}
        >
          Available PDFs
        </button>
        <button 
          className="refresh-button"
          onClick={fetchResources}
          title="Refresh resource list"
          disabled={isLoadingResources}
        >
          {isLoadingResources ? "⟳" : "↻"}
        </button>
      </div>
      
      {fetchError && (
        <div className="resource-error">
          <p>Error loading resources: {fetchError}</p>
          <button onClick={fetchResources}>Retry</button>
        </div>
      )}
      
      {!fetchError && (
        <div className="resource-list-container">
          {isLoadingResources ? (
            <div className="loading-resources">
              <div className="mini-spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : (
            <div className="resource-list">
              {selectedTab === 'indices' && (
                <>
                  <p className="resource-help-text">Select an existing index:</p>
                  {resources.indices.length === 0 ? (
                    <p className="no-resources">No indices available</p>
                  ) : (
                    <ul className="resources">
                      {resources.indices.map((index, i) => (
                        <li key={i} className="resource-item">
                          <button
                            className="resource-button"
                            onClick={() => handleSelectIndex(index)}
                            disabled={isLoading}
                          >
                            {index}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              
              {selectedTab === 'pdfs' && (
                <>
                  <p className="resource-help-text">Available PDFs for processing:</p>
                  {resources.pdfs.length === 0 ? (
                    <p className="no-resources">No PDFs available</p>
                  ) : (
                    <ul className="resources">
                      {resources.pdfs.map((pdf, i) => (
                        <li key={i} className="resource-item pdf-item">
                          {pdf}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceSelector; 