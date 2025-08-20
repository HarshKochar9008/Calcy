import React from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="wallet-info">
          <span className="wallet-status connected">Connected</span>
          <button 
            className="disconnect-button"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
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
