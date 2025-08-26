import React from 'react';
import type { ScholarshipPool } from '../types';
import { STROOPS_TO_XLM } from '../utils/constants';

interface ScholarshipPoolDetailsProps {
  pool: ScholarshipPool;
}

export const ScholarshipPoolDetails: React.FC<ScholarshipPoolDetailsProps> = ({ pool }) => {
  const goalXLM = STROOPS_TO_XLM(pool.total_goal);
  const balanceXLM = STROOPS_TO_XLM(pool.current_balance);
  const maxScholarshipXLM = STROOPS_TO_XLM(pool.max_scholarship_amount);
  const minScholarshipXLM = STROOPS_TO_XLM(pool.min_scholarship_amount);
  const percentage = pool.total_goal > 0 ? Math.min((pool.current_balance / pool.total_goal) * 100, 100) : 0;

  const formatDeadline = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = () => {
    if (!pool.is_active) return 'closed';
    if (Date.now() / 1000 > pool.application_deadline) return 'applications-closed';
    return 'active';
  };

  const getStatusText = () => {
    if (!pool.is_active) return 'Closed';
    if (Date.now() / 1000 > pool.application_deadline) return 'Applications Closed';
    return 'Active';
  };

  const isPoolActive = pool.is_active && Date.now() / 1000 <= pool.application_deadline;

  return (
    <div className="scholarship-pool-details">
      <h2>Scholarship Pool Details</h2>
      
      <div className="pool-stats">
        <div className="stat-item">
          <label>Funding Goal:</label>
          <span className="value">{goalXLM.toFixed(2)} XLM</span>
        </div>
        
        <div className="stat-item">
          <label>Current Balance:</label>
          <span className="value">{balanceXLM.toFixed(2)} XLM</span>
        </div>
        
        <div className="stat-item">
          <label>Progress</label>
          <span className="value">{percentage.toFixed(1)}%</span>
        </div>
        
        <div className="stat-item">
          <label>Status</label>
          <span className={`status ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="scholarship-details">
        <h3>Scholarship Range</h3>
        <div className="scholarship-range">
          <div className="range-item">
            <label>Maximum:</label>
            <span>{maxScholarshipXLM.toFixed(2)} XLM</span>
          </div>
          <div className="range-item">
            <label>Minimum:</label>
            <span>{minScholarshipXLM.toFixed(2)} XLM</span>
          </div>
        </div>
      </div>

      <div className="deadlines">
        <h3>Important Dates</h3>
        <div className="deadline-item">
          <label>Application Deadline:</label>
          <span>{formatDeadline(pool.application_deadline)}</span>
        </div>
        <div className="deadline-item">
          <label>Distribution Date:</label>
          <span>{formatDeadline(pool.distribution_deadline)}</span>
        </div>
      </div>
      
      {isPoolActive && (
        <div className="active-notice">
          🎯 Pool is active! Students can apply and donors can contribute.
        </div>
      )}
    </div>
  );
};
