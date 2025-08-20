import React, { useState } from 'react';
import { STROOPS_TO_XLM } from '../utils/constants';

interface DepositFormProps {
  onDeposit: (amount: number) => void;
  isLoading: boolean;
  userContribution: number;
}

export const DepositForm: React.FC<DepositFormProps> = ({
  onDeposit,
  isLoading,
  userContribution,
}) => {
  const [amount, setAmount] = useState(1); // Default 1 XLM
  const userContributionXLM = STROOPS_TO_XLM(userContribution);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      onDeposit(amount);
    }
  };

  const quickAmounts = [0.5, 1, 2, 5, 10];

  return (
    <div className="deposit-form">
      <h3>Deposit XLM</h3>
      
      <div className="user-contribution">
        <span>Your Total Contribution: {userContributionXLM.toFixed(2)} XLM</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="amount-input">
          <label htmlFor="deposit-amount">Amount (XLM):</label>
          <input
            id="deposit-amount"
            type="number"
            min="0.1"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
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
              disabled={isLoading}
            >
              {quickAmount} XLM
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          className="deposit-button"
          disabled={isLoading || amount <= 0}
        >
          {isLoading ? 'Depositing...' : 'Deposit'}
        </button>
      </form>
    </div>
  );
};
