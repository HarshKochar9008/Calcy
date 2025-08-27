import React, { useState } from 'react';

export const ScholarshipDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'pools' | 'applications'>('overview');



  const renderContent = () => {
    switch (currentView) {
      case 'pools':
        return (
          <div className="pools-view">
            <h2>Available Scholarship Pools</h2>
            <div className="pools-grid">
                <div className="pool-card">
                  <h3>Pool </h3>
                  <div className="pool-stats">
                    <div className="stat">
                      <span className="label">Goal:</span>
                      <span className="value"> XLM</span>
                    </div>
                    <div className="stat">
                      <span className="label">Raised:</span>
                      <span className="value"> XLM</span>
                    </div>
                    <div className="stat">
                      <span className="label">Progress:</span>

                    </div>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => setCurrentView('applications')}
                  >
                    View Applications
                  </button>
                </div>
            </div>
            <button 
              className="btn-secondary"
              onClick={() => setCurrentView('overview')}
            >
              Back to Overview
            </button>
          </div>
        );
      
      case 'applications':
        return (
          <div className="applications-view">
            <h2>Student Applications</h2>
            <div className="applications-list">
              <div className="application-item">
                <h4>Sarah Johnson</h4>
                <p><strong>Field:</strong> Computer Science</p>
                <p><strong>GPA:</strong> 3.8</p>
                <p><strong>Status:</strong> <span className="status-approved">Approved</span></p>
              </div>
              <div className="application-item">
                <h4>Michael Chen</h4>
                <p><strong>Field:</strong> Engineering</p>
                <p><strong>GPA:</strong> 3.9</p>
                <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
              </div>
            </div>
            <button 
              className="btn-secondary"
              onClick={() => setCurrentView('pools')}
            >
              Back to Pools
            </button>
          </div>
        );
      
      default:
        return (
          <div className="overview-view">
            <h1>Welcome to Calcy Scholarships</h1>
            <p className="subtitle">
              A blockchain-powered platform for transparent and efficient scholarship funding
            </p>

            
            <div className="features">
              <div className="feature">
                <h3>🎓 For Students</h3>
                <p>Apply for scholarships with transparent criteria and automated distribution</p>
              </div>
              <div className="feature">
                <h3>💝 For Donors</h3>
                <p>Contribute to scholarship pools and track your impact in real-time</p>
              </div>
              <div className="feature">
                <h3>🔗 Blockchain</h3>
                <p>Built on Stellar for secure, fast, and cost-effective transactions</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="scholarship-demo">
      {renderContent()}
    </div>
  );
};
