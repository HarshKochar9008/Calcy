import { useState, useEffect, useCallback } from 'react';
import type { Wallet } from '../types';

declare global {
  interface Window {
    freighter?: {
      isConnected: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      signTransaction: (transaction: any) => Promise<any>;
      signAndSubmitTransaction: (transaction: any) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      off: (event: string, callback: (data: any) => void) => void;
    };
  }
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isFreighterDetected, setIsFreighterDetected] = useState<boolean | null>(null);

  const checkFreighterAvailability = useCallback(() => {
    console.log('Checking Freighter availability...');
    if (window.freighter) {
      console.log('✅ Freighter detected!');
      setIsFreighterDetected(true);
      return true;
    } else {
      console.log('❌ Freighter not detected yet');
      setIsFreighterDetected(false);
      return false;
    }
  }, []);

  const checkConnection = useCallback(async () => {
    console.log('Checking wallet connection...');
    
    // First check if Freighter is available
    if (!checkFreighterAvailability()) {
      setConnectionError('Freighter wallet extension not found. Please install it first.');
      return;
    }

    try {
      console.log('Freighter detected, checking connection...');
      const connected = await window.freighter!.isConnected();
      console.log('Connection status:', connected);
      
      if (connected) {
        const publicKey = await window.freighter!.getPublicKey();
        console.log('Public key retrieved:', publicKey);
        setWallet({
          publicKey,
          isConnected: true,
          signTransaction: window.freighter!.signTransaction,
          signAndSubmitTransaction: window.freighter!.signAndSubmitTransaction,
        });
        setIsConnected(true);
        setConnectionError(null);
      } else {
        console.log('Wallet not connected');
        setWallet(null);
        setIsConnected(false);
        setConnectionError('Wallet not connected. Please unlock Freighter and try again.');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWallet(null);
      setIsConnected(false);
      setConnectionError(`Connection check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [checkFreighterAvailability]);

  const connect = useCallback(async () => {
    console.log('Attempting to connect wallet...');
    setConnectionError(null);
    
    // Check Freighter availability before attempting connection
    if (!checkFreighterAvailability()) {
      const errorMsg = 'Please install Freighter wallet extension';
      console.error(errorMsg);
      setConnectionError(errorMsg);
      alert(errorMsg);
      return;
    }

    try {
      console.log('Getting public key from Freighter...');
      const publicKey = await window.freighter!.getPublicKey();
      console.log('Successfully got public key:', publicKey);
      
      const walletInstance: Wallet = {
        publicKey,
        isConnected: true,
        signTransaction: window.freighter!.signTransaction,
        signAndSubmitTransaction: window.freighter!.signAndSubmitTransaction,
      };
      
      setWallet(walletInstance);
      setIsConnected(true);
      setConnectionError(null);
      console.log('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      let errorMessage = 'Failed to connect wallet.';
      
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Connection was rejected. Please approve in Freighter.';
        } else if (error.message.includes('locked')) {
          errorMessage = 'Freighter is locked. Please unlock it and try again.';
        } else {
          errorMessage = `Connection failed: ${error.message}`;
        }
      }
      
      setConnectionError(errorMessage);
      alert(errorMessage);
    }
  }, [checkFreighterAvailability]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting wallet...');
    setWallet(null);
    setIsConnected(false);
    setConnectionError(null);
  }, []);

  useEffect(() => {
    console.log('useWallet hook initialized');
    
    // Initial check with a small delay to ensure extension is loaded
    const initialCheck = setTimeout(() => {
      checkFreighterAvailability();
    }, 100);

    // Set up polling to check for Freighter availability
    const availabilityCheck = setInterval(() => {
      if (!window.freighter) {
        checkFreighterAvailability();
      } else {
        clearInterval(availabilityCheck);
        checkConnection();
      }
    }, 500);

    // Clean up intervals
    return () => {
      clearTimeout(initialCheck);
      clearInterval(availabilityCheck);
    };
  }, [checkFreighterAvailability, checkConnection]);

  // Set up event listeners once Freighter is detected
  useEffect(() => {
    if (window.freighter && isFreighterDetected) {
      const handleAccountChange = () => {
        console.log('Account/network changed, rechecking connection...');
        checkConnection();
      };

      window.freighter.on('accountChanged', handleAccountChange);
      window.freighter.on('networkChanged', handleAccountChange);

      return () => {
        window.freighter.off('accountChanged', handleAccountChange);
        window.freighter.off('networkChanged', handleAccountChange);
      };
    }
  }, [isFreighterDetected, checkConnection]);

  return {
    wallet,
    isConnected,
    connectionError,
    isFreighterDetected,
    connect,
    disconnect,
  };
};
