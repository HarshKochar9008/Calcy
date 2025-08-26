import React from 'react';
import { STROOPS_TO_XLM } from '../utils/constants';

interface ProgressBarProps {
  current: number;
  goal: number;
  pool?: {
    application_deadline: number;
    distribution_deadline: number;
    is_active: boolean;
    creator?: string;
    current_wallet?: string;
  };
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, goal, pool }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const currentXLM = STROOPS_TO_XLM(current);
  const goalXLM = STROOPS_TO_XLM(goal);
  const remainingGoal = STROOPS_TO_XLM(goal - current);
  
  const now = Date.now() / 1000;
  const isApplicationOpen = pool ? now < pool.application_deadline : false;
  const isDistributionOpen = pool ? now >= pool.distribution_deadline : false;
  const isPoolActive = pool?.is_active ?? false;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span>Scholarship Pool Progress</span>
        <span className="progress-text">
          {currentXLM.toFixed(2)} / {goalXLM.toFixed(2)} XLM
        </span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="progress-percentage">
        {percentage.toFixed(1)}% Complete
      </div>

      {/* Enhanced Progress Details */}
      <div className="progress-details">
        <div className="progress-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Current Balance</div>
              <div className="stat-value">{currentXLM.toFixed(2)} XLM</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Remaining Goal</div>
              <div className="stat-value">{remainingGoal.toFixed(2)} XLM</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Progress</div>
              <div className="stat-value">{percentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Pool Status Information */}
        {pool && (
          <div className="pool-status-section">
            <h4 className="status-title">Pool Status & Deadlines</h4>
            
            <div className="status-grid">
              <div className={`status-item ${isPoolActive ? 'active' : 'inactive'}`}>
                <div className="status-icon">
                  {isPoolActive ? '🟢' : '🔴'}
                </div>
                <div className="status-content">
                  <div className="status-label">Pool Status</div>
                  <div className="status-value">
                    {isPoolActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              <div className={`status-item ${isApplicationOpen ? 'open' : 'closed'}`}>
                <div className="status-icon">
                  {isApplicationOpen ? '📝' : '🔒'}
                </div>
                <div className="status-content">
                  <div className="status-label">Applications</div>
                  <div className="status-value">
                    {isApplicationOpen ? 'Open' : 'Closed'}
                  </div>
                  <div className="status-deadline">
                    {new Date(pool.application_deadline * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className={`status-item ${isDistributionOpen ? 'ready' : 'waiting'}`}>
                <div className="status-icon">
                  {isDistributionOpen ? '🎁' : '⏳'}
                </div>
                <div className="status-content">
                  <div className="status-label">Distribution</div>
                  <div className="status-value">
                    {isDistributionOpen ? 'Ready' : 'Waiting'}
                  </div>
                  <div className="status-deadline">
                    {new Date(pool.distribution_deadline * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Status */}
            <div className="action-status">
              <div className="action-item">
                <span className="action-label">📤 Donations:</span>
                <span className={`action-status ${isPoolActive ? 'enabled' : 'disabled'}`}>
                  {isPoolActive ? 'Accepting' : 'Closed'}
                </span>
              </div>
              
              <div className="action-item">
                <span className="action-label">📝 Applications:</span>
                <span className={`action-status ${isApplicationOpen ? 'enabled' : 'disabled'}`}>
                  {isApplicationOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              
              <div className="action-item">
                <span className="action-label">🎁 Distribution:</span>
                <span className={`action-status ${isDistributionOpen ? 'enabled' : 'disabled'}`}>
                  {isDistributionOpen ? 'Ready' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
