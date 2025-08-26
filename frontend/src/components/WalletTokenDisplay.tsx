import React from 'react';
import type { Wallet } from '../types';
import { XLM_ASSET } from '../utils/constants';
import { useWalletBalance } from '../hooks/useWalletBalance';

interface WalletTokenDisplayProps {
  wallet: Wallet | null;
  isConnected: boolean;
  onDisconnect: () => void;
  isNetworkError?: boolean;
}

export const WalletTokenDisplay: React.FC<WalletTokenDisplayProps> = ({
  wallet,
  isConnected,
  onDisconnect,
  isNetworkError = false
}) => {
  const { balance, isLoading, error, refreshBalance } = useWalletBalance(wallet);

  if (!isConnected || !wallet) {
    return null;
  }

  // Format the public key for display
  const formatPublicKey = (publicKey: string) => {
    return `${publicKey.substring(0, 6)}...${publicKey.substring(publicKey.length - 4)}`;
  };

  // Get network display name
  const getNetworkDisplay = (network: any) => {
    if (!network) return 'Unknown';
    return network.network === 'testnet' ? 'Testnet' : 'Mainnet';
  };

  return (
    <div className="wallet-token-display">
      <div className="wallet-info">
        <div className="wallet-status">
          <span className={`status-dot ${isNetworkError ? 'disconnected' : 'connected'}`}>
            {isNetworkError ? '⚠️' : '●'}
          </span>
          <span className={`network-name ${wallet.network?.network !== 'testnet' ? 'network-warning' : ''}`}>
            {getNetworkDisplay(wallet.network)}
          </span>
          {wallet.network?.network !== 'testnet' && (
            <span className="network-warning-indicator" title="Mainnet account detected - only testnet is supported">
              ⚠️
            </span>
          )}
          {isNetworkError && (
            <span className="network-error-indicator" title="Network connection issues detected">
              ⚠️
            </span>
          )}
        </div>
        
        <div className="wallet-address">
          <span className="address-label">Wallet:</span>
          <span className="address-value">{formatPublicKey(wallet.publicKey)}</span>
        </div>
        
        <div className="token-balance">
          <span className="token-icon">⭐</span>
          <span className="token-symbol">{XLM_ASSET.code}</span>
          <span className="balance-label">Balance:</span>
          <span className={`balance-value ${isLoading ? 'loading' : ''}`}>
            {isLoading ? '...' : error ? 'Error' : balance}
          </span>
          <button 
            className="refresh-balance-btn"
            onClick={refreshBalance}
            disabled={isLoading}
            title="Refresh balance"
          >
            🔄
          </button>
        </div>
      </div>
      
      <button 
        className="disconnect-btn"
        onClick={onDisconnect}
        title="Disconnect wallet"
      >
        Disconnect
      </button>
    </div>
  );
};
