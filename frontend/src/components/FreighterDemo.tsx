import React, { useState } from 'react';
import type { Wallet } from '../types';
import {
  signTransactionWithFreighter,
  signMessageWithFreighter,
  addSorobanToken,
  getCurrentNetwork,
  isConnectedToNetwork,
  formatStellarAddress,
  isValidSorobanContractId,
} from '../utils/freighterUtils';

interface FreighterDemoProps {
  wallet: Wallet;
}

export const FreighterDemo: React.FC<FreighterDemoProps> = ({ wallet }) => {
  const [message, setMessage] = useState('');
  const [contractId, setContractId] = useState('');
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const signed = await signMessageWithFreighter(wallet, message);
      setSignedMessage(signed);
      setSuccess('Message signed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async () => {
    if (!contractId.trim()) {
      setError('Please enter a contract ID');
      return;
    }

    if (!isValidSorobanContractId(contractId)) {
      setError('Invalid Soroban contract ID format');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await addSorobanToken(wallet, contractId);
      setSuccess(`Token added successfully! Contract ID: ${result}`);
      setContractId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetNetwork = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const network = await getCurrentNetwork(wallet);
      setSuccess(`Network: ${network.network}, Passphrase: ${network.networkPassphrase}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get network info');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
    setSignedMessage(null);
  };

  return (
    <div className="freighter-demo">
      <h3>Freighter API Demo</h3>
      
      <div className="demo-section">
        <h4>Wallet Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Address:</label>
            <span className="monospace">{formatStellarAddress(wallet.publicKey)}</span>
          </div>
          <div className="info-item">
            <label>Network:</label>
            <span>{wallet.network?.network || 'Unknown'}</span>
          </div>
          <div className="info-item">
            <label>Network URL:</label>
            <span className="monospace">{wallet.network?.networkUrl || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Connected to Testnet:</label>
            <span>{isConnectedToNetwork(wallet, 'TESTNET') ? '✅ Yes' : '❌ No'}</span>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h4>Message Signing</h4>
        <div className="input-group">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to sign"
            className="demo-input"
          />
          <button
            onClick={handleSignMessage}
            disabled={isLoading || !message.trim()}
            className="demo-button"
          >
            {isLoading ? 'Signing...' : 'Sign Message'}
          </button>
        </div>
        {signedMessage && (
          <div className="result-box">
            <label>Signed Message:</label>
            <div className="monospace">{signedMessage}</div>
          </div>
        )}
      </div>

      <div className="demo-section">
        <h4>Add Soroban Token</h4>
        <div className="input-group">
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Enter Soroban contract ID (starts with C...)"
            className="demo-input"
          />
          <button
            onClick={handleAddToken}
            disabled={isLoading || !contractId.trim()}
            className="demo-button"
          >
            {isLoading ? 'Adding...' : 'Add Token'}
          </button>
        </div>
        <div className="help-text">
          Example: C...ABCD (56 characters, starts with C)
        </div>
      </div>

      <div className="demo-section">
        <h4>Network Information</h4>
        <button
          onClick={handleGetNetwork}
          disabled={isLoading}
          className="demo-button"
        >
          {isLoading ? 'Getting...' : 'Get Network Details'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <strong>Success:</strong> {success}
        </div>
      )}

      <div className="demo-actions">
        <button onClick={clearMessages} className="clear-button">
          Clear Messages
        </button>
      </div>
    </div>
  );
};
