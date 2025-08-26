import React from 'react';
import type { Wallet } from '../types';

interface WalletConnectProps {
  wallet: Wallet | null;
  isConnected: boolean;
  onConnect: () => void;
  DisconnectWallet: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  isConnected,
  onConnect,
  DisconnectWallet,
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
              {formatAddress(wallet.publicKey)}
            </div>
          </div>
          <div className="wallet-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleAddToken}
              title="Add Soroban token to wallet"
            >
              Add Token
            </button>
            <button 
              className="btn btn-secondary"
              onClick={DisconnectWallet}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="btn btn-primary"
          onClick={onConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};
