import { useState, useEffect, useCallback } from 'react';
import type { Wallet } from '../types';

// Mock wallet for development/testing
const createMockWallet = (publicKey: string): Wallet => ({
  publicKey,
  isConnected: true,
  network: {
    network: 'testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    networkUrl: 'https://soroban-testnet.stellar.org',
    horizonRpcUrl: 'https://horizon-testnet.stellar.org'
  },
  signTransaction: async (xdr: string) => {
    console.log('🔐 Mock wallet: Signing transaction:', xdr.substring(0, 50) + '...');
    return { signedTxXdr: xdr, signerAddress: publicKey };
  },
  signAuthEntry: async (_authEntryXdr: string, opts: { address: string }) => {
    console.log('🔐 Mock wallet: Signing auth entry for address:', opts.address);
    return { signedAuthEntry: new Uint8Array([1, 2, 3, 4]), signerAddress: publicKey };
  },
  signMessage: async (message: string, opts: { address: string }) => {
    console.log('🔐 Mock wallet: Signing message:', message, 'for address:', opts.address);
    return { signedMessage: 'mock-signed-message', signerAddress: publicKey };
  },
  addToken: async (params: { contractId: string }) => {
    console.log('🔐 Mock wallet: Adding token with contract ID:', params.contractId);
    return { contractId: params.contractId };
  },
  getNetwork: async () => ({
    network: 'testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    networkUrl: 'https://soroban-testnet.stellar.org',
    horizonRpcUrl: 'https://horizon-testnet.stellar.org'
  }),
  getNetworkDetails: async () => ({
    network: 'testnet',
    networkPassphrase: 'Test SDF Network ; September 2015',
    networkUrl: 'https://soroban-testnet.stellar.org',
    horizonRpcUrl: 'https://horizon-testnet.stellar.org'
  })
});

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFreighterDetected, setIsFreighterDetected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Continuous console logging
  useEffect(() => {
    const logInterval = setInterval(() => {
      console.log('🔄 useWallet Hook Status:', {
        isConnected,
        isFreighterDetected,
        hasWallet: !!wallet,
        walletAddress: wallet?.publicKey?.substring(0, 8) + '...' || 'None',
        timestamp: new Date().toISOString()
      });
    }, 5000); // Log every 5 seconds

    return () => clearInterval(logInterval);
  }, [isConnected, isFreighterDetected, wallet]);

  // Check for Freighter extension
  useEffect(() => {
    const checkFreighter = () => {
      try {
        if (typeof window !== 'undefined' && (window as any).freighterApi) {
          console.log('✅ Freighter extension detected');
          setIsFreighterDetected(true);
          setConnectionError(null);
        } else {
          console.log('❌ Freighter extension not detected');
          setIsFreighterDetected(false);
        }
      } catch (error) {
        console.log('❌ Error checking Freighter:', error);
        setIsFreighterDetected(false);
      }
    };

    checkFreighter();
    
    // Check periodically
    const interval = setInterval(checkFreighter, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Connect wallet function
  const connect = useCallback(async () => {
    try {
      console.log('🔗 Attempting to connect wallet...');
      setConnectionError(null);

      if (typeof window !== 'undefined' && (window as any).freighterApi) {
        const freighter = (window as any).freighterApi;
        
        // Check if Freighter is unlocked
        const isUnlocked = await freighter.isConnected();
        if (!isUnlocked) {
          console.log('🔒 Freighter is locked, requesting unlock...');
          await freighter.connect();
        }

        // Get user info
        const userInfo = await freighter.getUserInfo();
        console.log('👤 User info received:', userInfo);

        if (userInfo && userInfo.publicKey) {
          const networkInfo = await freighter.getNetwork();
          console.log('🌐 Network info:', networkInfo);

          const connectedWallet: Wallet = {
            publicKey: userInfo.publicKey,
            isConnected: true,
            network: networkInfo,
            signTransaction: freighter.signTransaction.bind(freighter),
            signAuthEntry: freighter.signAuthEntry.bind(freighter),
            signMessage: freighter.signMessage.bind(freighter),
            addToken: freighter.addToken.bind(freighter),
            getNetwork: freighter.getNetwork.bind(freighter),
            getNetworkDetails: freighter.getNetworkDetails.bind(freighter)
          };

          setWallet(connectedWallet);
          setIsConnected(true);
          console.log('✅ Wallet connected successfully:', userInfo.publicKey);
        } else {
          throw new Error('No public key received from Freighter');
        }
      } else {
        // Fallback to mock wallet for development
        console.log('🔄 Freighter not available, using mock wallet for development');
        const mockWallet = createMockWallet('G' + 'A'.repeat(55));
        setWallet(mockWallet);
        setIsConnected(true);
        console.log('✅ Mock wallet connected for development');
      }
    } catch (error) {
      console.error('❌ Error connecting wallet:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      setConnectionError(errorMessage);
      
      // Fallback to mock wallet on error
      console.log('🔄 Falling back to mock wallet due to error');
      const mockWallet = createMockWallet('G' + 'A'.repeat(55));
      setWallet(mockWallet);
      setIsConnected(true);
      console.log('✅ Mock wallet connected as fallback');
    }
  }, []);

  // Disconnect wallet function
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting wallet...');
    setWallet(null);
    setIsConnected(false);
  }, []);

  return { wallet, isConnected, isFreighterDetected, connectionError, connect, disconnect };
};
