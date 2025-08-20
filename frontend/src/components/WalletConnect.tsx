import React from 'react';
import type { Wallet } from '../types';

interface WalletConnectProps {
  wallet: Wallet | null;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  const handleAddToken = async () => {
    if (!wallet) return;
    
    const contractId = prompt('Enter the Soroban token contract ID:');
    if (!contractId) return;
    
    try {
      const result = await wallet.addToken({ 
        contractId,
        networkPassphrase: wallet.network?.networkPassphrase 
      });
      alert(`Successfully added token: ${result.contractId}`);
    } catch (error) {
      alert(`Failed to add token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {isConnected && wallet ? (
        <div className="wallet-info">
          <div className="wallet-details">
            <div className="wallet-status connected">Connected</div>
            <div className="wallet-address">
              Address: {formatAddress(wallet.publicKey)}
            </div>
            {wallet.network && (
              <div className="wallet-network">
                Network: {wallet.network.network}
                {wallet.network.networkUrl && (
                  <div className="network-url">
                    URL: {wallet.network.networkUrl}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="wallet-actions">
            <button 
              className="add-token-button"
              onClick={handleAddToken}
              title="Add Soroban token to wallet"
            >
              Add Token
            </button>
            <button 
              className="disconnect-button"
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="connect-button"
          onClick={onConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};
