import React, { useState } from 'react';
import { STROOPS_TO_XLM } from '../utils/constants';

interface WithdrawFormProps {
  onWithdraw: (amount: number) => void;
  isLoading: boolean;
  maxAmount: number;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({
  onWithdraw,
  isLoading,
  maxAmount,
}) => {
  const [amount, setAmount] = useState(0);
  const maxAmountXLM = STROOPS_TO_XLM(maxAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && amount <= maxAmountXLM) {
      onWithdraw(amount);
      setAmount(0); // Reset form after submission
    }
  };

  const quickAmounts = [1, 2, 5, 10];

  return (
    <div className="withdraw-form">
      <h3>Withdraw XLM</h3>
      
      <div className="available-balance">
        <span>Available for Withdrawal: {maxAmountXLM.toFixed(2)} XLM</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="amount-input">
          <label htmlFor="withdraw-amount">Amount (XLM):</label>
          <input
            id="withdraw-amount"
            type="number"
            min="0.1"
            max={maxAmountXLM}
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
              disabled={isLoading || quickAmount > maxAmountXLM}
            >
              {quickAmount} XLM
            </button>
          ))}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="max-button"
            onClick={() => setAmount(maxAmountXLM)}
            disabled={isLoading}
          >
            Max
          </button>
          
          <button
            type="submit"
            className="withdraw-button"
            disabled={isLoading || amount <= 0 || amount > maxAmountXLM}
          >
            {isLoading ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </div>
      </form>
    </div>
  );
};
