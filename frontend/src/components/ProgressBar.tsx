import React from 'react';
import { STROOPS_TO_XLM } from '../utils/constants';

interface ProgressBarProps {
  current: number;
  goal: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, goal }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const currentXLM = STROOPS_TO_XLM(current);
  const goalXLM = STROOPS_TO_XLM(goal);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span>Progress</span>
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
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
};
