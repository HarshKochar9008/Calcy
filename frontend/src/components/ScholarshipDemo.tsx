import React, { useState } from 'react';
import { ScholarshipActions } from './ScholarshipActions';
import { ScholarshipPool } from '../types';

export const ScholarshipDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'overview' | 'pools' | 'applications'>('overview');

  // Sample data for demonstration
  const samplePools: ScholarshipPool[] = [
    {
      creator: "GABC123...",
      token: "XLM",
      total_goal: 10000000000, // 1000 XLM in stroops
      current_balance: 6500000000, // 650 XLM in stroops
      is_active: true,
      max_scholarship_amount: 1000000000, // 100 XLM in stroops
      min_scholarship_amount: 500000000, // 50 XLM in stroops
      application_deadline: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
      distribution_deadline: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // 60 days from now
    },
    {
      creator: "GDEF456...",
      token: "XLM",
      total_goal: 50000000000, // 5000 XLM in stroops
      current_balance: 25000000000, // 2500 XLM in stroops
      is_active: true,
      max_scholarship_amount: 2000000000, // 200 XLM in stroops
      min_scholarship_amount: 1000000000, // 100 XLM in stroops
      application_deadline: Math.floor(Date.now() / 1000) + (45 * 24 * 60 * 60), // 45 days from now
      distribution_deadline: Math.floor(Date.now() / 1000) + (75 * 24 * 60 * 60), // 75 days from now
    }
  ];

  const handleExploreScholarships = () => {
    setCurrentView('pools');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'pools':
        return (
          <div className="pools-view">
            <h2>Available Scholarship Pools</h2>
            <div className="pools-grid">
              {samplePools.map((pool, index) => (
                <div key={index} className="pool-card">
                  <h3>Pool {index + 1}</h3>
                  <div className="pool-stats">
                    <div className="stat">
                      <span className="label">Goal:</span>
                      <span className="value">{(pool.total_goal / 10000000).toFixed(0)} XLM</span>
                    </div>
                    <div className="stat">
                      <span className="label">Raised:</span>
                      <span className="value">{(pool.current_balance / 10000000).toFixed(0)} XLM</span>
                    </div>
                    <div className="stat">
                      <span className="label">Progress:</span>
                      <span className="value">
                        {((pool.current_balance / pool.total_goal) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => setCurrentView('applications')}
                  >
                    View Applications
                  </button>
                </div>
              ))}
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
            
            <ScholarshipActions 
              pools={samplePools}
              onExploreScholarships={handleExploreScholarships}
            />
            
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
