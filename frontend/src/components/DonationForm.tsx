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
      <h3>💝 Donate to Scholarship Pool</h3>
      
      <div className="donation-info">
        <div className="info-item">
          <span>Your Total Donations: {userDonationXLM.toFixed(2)} XLM</span>
        </div>
        <div className="info-item">
          <span>Remaining Goal: {remainingGoal.toFixed(2)} XLM</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="amount-input">
          <label htmlFor="donation-amount">Amount (XLM):</label>
          <input
            id="donation-amount"
            type="number"
            min="0.1"
            max={remainingGoal}
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            disabled={isLoading || !pool.is_active}
            required
          />
        </div>
        
        <div className="quick-amounts">
          <span>Quick amounts:</span>
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              className={`quick-amount ${amount === quickAmount ? 'active' : ''}`}
              onClick={() => setAmount(quickAmount)}
              disabled={isLoading || !pool.is_active || quickAmount > remainingGoal}
            >
              {quickAmount} XLM
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          className="donate-button"
          disabled={isLoading || amount <= 0 || amount > remainingGoal || !pool.is_active}
        >
          {isLoading ? 'Processing...' : 'Donate Now'}
        </button>
        
        {!pool.is_active && (
          <p className="pool-closed-notice">
            This scholarship pool is currently closed for donations.
          </p>
        )}
      </form>
    </div>
  );
};
