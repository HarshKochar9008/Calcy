import React, { useState } from 'react';
import type { ScholarshipPool } from '../types';
import { STROOPS_TO_XLM } from '../utils/constants';

interface DonationFormProps {
  onDonate: (amount: number) => void;
  isLoading: boolean;
  userDonation: number;
  pool: ScholarshipPool;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  onDonate,
  isLoading,
  userDonation,
  pool,
}) => {
  const [amount, setAmount] = useState(1); // Default 1 XLM
  const userDonationXLM = STROOPS_TO_XLM(userDonation);
  const remainingGoal = STROOPS_TO_XLM(pool.total_goal - pool.current_balance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && amount <= remainingGoal) {
      onDonate(amount);
    }
  };

  const quickAmounts = [0.5, 1, 2, 5, 10, 25];

  return (
    <div className="donation-form">
      <div className="form-header">
        <h3>💝 Make a Donation</h3>
        <div className="form-status">
          <span className={`status-badge ${pool.is_active ? 'active' : 'inactive'}`}>
            {pool.is_active ? '🟢 Accepting Donations' : '🔴 Donations Closed'}
          </span>
        </div>
      </div>
      
      <div className="donation-info">
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">💰</div>
            <div className="info-content">
              <div className="info-label">Your Total Donations</div>
              <div className="info-value">{userDonationXLM.toFixed(2)} XLM</div>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">🎯</div>
            <div className="info-content">
              <div className="info-label">Remaining Goal</div>
              <div className="info-value">{remainingGoal.toFixed(2)} XLM</div>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-icon">📊</div>
            <div className="info-content">
              <div className="info-label">Pool Progress</div>
              <div className="info-value">
                {((pool.current_balance / pool.total_goal) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {pool.is_active ? (
        <form onSubmit={handleSubmit} className="donation-form-content">
          <div className="amount-input">
            <label htmlFor="donation-amount">Amount (XLM):</label>
            <div className="input-wrapper">
              <input
                id="donation-amount"
                type="number"
                min="0.1"
                max={remainingGoal}
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                disabled={isLoading}
                required
                className="amount-input-field"
              />
              <span className="input-suffix">XLM</span>
            </div>
          </div>
          
          <div className="quick-amounts">
            <span className="quick-label">Quick amounts:</span>
            <div className="quick-buttons">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  className={`quick-amount ${amount === quickAmount ? 'active' : ''}`}
                  onClick={() => setAmount(quickAmount)}
                  disabled={isLoading || quickAmount > remainingGoal}
                >
                  {quickAmount} XLM
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="donate-button"
            disabled={isLoading || amount <= 0 || amount > remainingGoal}
          >
            {isLoading ? '🔄 Processing...' : '💝 Donate Now'}
          </button>
          
          <div className="donation-note">
            <p>💡 Your donation will be securely stored on the blockchain and distributed to deserving students.</p>
          </div>
        </form>
      ) : (
        <div className="pool-closed-notice">
          <div className="closed-icon">🔒</div>
          <h4>Donations Temporarily Closed</h4>
          <p>This scholarship pool is not currently accepting donations. Please check back later or contact the pool creator.</p>
        </div>
      )}
    </div>
  );
};
