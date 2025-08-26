import React, { useState } from 'react';
import { ScholarshipPool } from '../types';

interface ScholarshipActionsProps {
  pools: ScholarshipPool[];
  onExploreScholarships: () => void;
}

export const ScholarshipActions: React.FC<ScholarshipActionsProps> = ({ 
  pools, 
  onExploreScholarships 
}) => {
  const [showLearnMore, setShowLearnMore] = useState(false);

  const activePools = pools.filter(pool => 
    pool.is_active && Date.now() / 1000 <= pool.application_deadline
  );

  const totalFundingGoal = activePools.reduce((sum, pool) => sum + pool.total_goal, 0);
  const totalCurrentBalance = activePools.reduce((sum, pool) => sum + pool.current_balance, 0);

  const handleExploreScholarships = () => {
    onExploreScholarships();
  };

  const handleLearnMore = () => {
    setShowLearnMore(!showLearnMore);
  };

  return (
    <div className="scholarship-actions">
      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={handleExploreScholarships}
        >
          Explore Scholarships
        </button>
        
        <button 
          className="btn-secondary"
          onClick={handleLearnMore}
        >
          Learn More
        </button>
      </div>

      {showLearnMore && (
        <div className="learn-more-content">
          <h3>About Our Scholarship System</h3>
          
          <div className="stats-overview">
            <div className="stat-card">
              <span className="stat-number">{activePools.length}</span>
              <span className="stat-label">Active Pools</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {totalFundingGoal > 0 ? ((totalCurrentBalance / totalFundingGoal) * 100).toFixed(1) : '0'}%
              </span>
              <span className="stat-label">Funding Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {(totalCurrentBalance / 10000000).toFixed(1)}
              </span>
              <span className="stat-label">Total Raised (XLM)</span>
            </div>
          </div>

          <div className="how-it-works">
            <h4>How It Works</h4>
            <ol>
              <li><strong>Donate:</strong> Contribute XLM to active scholarship pools</li>
              <li><strong>Apply:</strong> Students submit applications with academic details</li>
              <li><strong>Review:</strong> Applications are evaluated based on merit and need</li>
              <li><strong>Distribute:</strong> Scholarships are automatically distributed to approved students</li>
            </ol>
          </div>

          <div className="benefits">
            <h4>Benefits</h4>
            <ul>
              <li>Transparent blockchain-based funding</li>
              <li>Automated scholarship distribution</li>
              <li>No intermediaries or hidden fees</li>
              <li>Global accessibility</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
