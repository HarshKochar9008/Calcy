import { useState, useEffect, useCallback } from 'react';
import type { Wallet, NetworkInfo } from '../types';
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  signTransaction,
  signAuthEntry,
  signMessage,
  addToken,
  WatchWalletChanges,
} from '@stellar/freighter-api';

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isFreighterDetected, setIsFreighterDetected] = useState<boolean | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  const checkFreighterAvailability = useCallback(async () => {
    console.log('Checking Freighter availability...');
    try {
      const connected = await isConnected();
      if (connected.isConnected) {
        console.log('✅ Freighter detected and connected!');
        setIsFreighterDetected(true);
        return true;
      } else {
        console.log('❌ Freighter detected but not connected');
        setIsFreighterDetected(true);
        return false;
      }
    } catch (error) {
      console.log('❌ Freighter not detected');
      setIsFreighterDetected(false);
      return false;
    }
  }, []);

  const getNetworkInformation = useCallback(async (): Promise<NetworkInfo | null> => {
    try {
      const networkDetails = await getNetworkDetails();
      if (networkDetails.error) {
        console.error('Error getting network details:', networkDetails.error);
        return null;
      }
      
      const networkInfo: NetworkInfo = {
        network: networkDetails.network,
        networkPassphrase: networkDetails.networkPassphrase,
        networkUrl: networkDetails.networkUrl,
        sorobanRpcUrl: networkDetails.sorobanRpcUrl,
      };
      
      setNetworkInfo(networkInfo);
      return networkInfo;
    } catch (error) {
      console.error('Error getting network information:', error);
      return null;
    }
  }, []);

  const checkConnection = useCallback(async () => {
    console.log('Checking wallet connection...');
    
    try {
      const connected = await isConnected();
      console.log('Connection status:', connected);
      
      if (connected.isConnected) {
        const addressObj = await getAddress();
        if (addressObj.error) {
          throw new Error(addressObj.error);
        }
        
        const publicKey = addressObj.address;
        console.log('Public key retrieved:', publicKey);
        
        const networkInfo = await getNetworkInformation();
        
        const walletInstance: Wallet = {
          publicKey,
          isConnected: true,
          network: networkInfo,
          signTransaction: async (xdr: string, opts?: { network?: string; networkPassphrase?: string; address?: string }) => {
            const result = await signTransaction(xdr, opts);
            if (result.error) {
              throw new Error(result.error);
            }
            return result;
          },
          signAuthEntry: async (authEntryXdr: string, opts: { address: string }) => {
            const result = await signAuthEntry(authEntryXdr, opts);
            if (result.error) {
              throw new Error(result.error);
            }
            return result;
          },
          signMessage: async (message: string, opts: { address: string }) => {
            const result = await signMessage(message, opts);
            if (result.error) {
              throw new Error(result.error);
            }
            return result;
          },
          addToken: async (params: { contractId: string; networkPassphrase?: string }) => {
            const result = await addToken(params);
            if (result.error) {
              throw new Error(result.error);
            }
            return result;
          },
          getNetwork: async () => {
            const result = await getNetwork();
            if (result.error) {
              throw new Error(result.error);
            }
            return {
              network: result.network,
              networkPassphrase: result.networkPassphrase,
            };
          },
          getNetworkDetails: async () => {
            const result = await getNetworkDetails();
            if (result.error) {
              throw new Error(result.error);
            }
            return {
              network: result.network,
              networkPassphrase: result.networkPassphrase,
              networkUrl: result.networkUrl,
              sorobanRpcUrl: result.sorobanRpcUrl,
            };
          },
        };
        
        setWallet(walletInstance);
        setIsWalletConnected(true);
        setConnectionError(null);
      } else {
        console.log('Wallet not connected');
        setWallet(null);
        setIsWalletConnected(false);
        setConnectionError('Wallet not connected. Please unlock Freighter and try again.');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWallet(null);
      setIsWalletConnected(false);
      setConnectionError(`Connection check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [getNetworkInformation]);

  const connect = useCallback(async () => {
    console.log('Attempting to connect wallet...');
    setConnectionError(null);
    
    try {
      // Check if app is allowed
      const allowed = await isAllowed();
      if (!allowed.isAllowed) {
        console.log('App not allowed, requesting access...');
        const setAllowedResult = await setAllowed();
        if (!setAllowedResult.isAllowed) {
          throw new Error('User rejected app access');
        }
      }
      
      // Request access to get public key
      console.log('Requesting access to wallet...');
      const accessObj = await requestAccess();
      if (accessObj.error) {
        throw new Error(accessObj.error);
      }
      
      const publicKey = accessObj.address;
      console.log('Successfully got public key:', publicKey);
      
      const networkInfo = await getNetworkInformation();
      
      const walletInstance: Wallet = {
        publicKey,
        isConnected: true,
        network: networkInfo,
        signTransaction: async (xdr: string, opts?: { network?: string; networkPassphrase?: string; address?: string }) => {
          const result = await signTransaction(xdr, opts);
          if (result.error) {
            throw new Error(result.error);
          }
          return result;
          },
        signAuthEntry: async (authEntryXdr: string, opts: { address: string }) => {
          const result = await signAuthEntry(authEntryXdr, opts);
          if (result.error) {
            throw new Error(result.error);
          }
          return result;
        },
        signMessage: async (message: string, opts: { address: string }) => {
          const result = await signMessage(message, opts);
          if (result.error) {
            throw new Error(result.error);
          }
          return result;
        },
        addToken: async (params: { contractId: string; networkPassphrase?: string }) => {
          const result = await addToken(params);
          if (result.error) {
            throw new Error(result.error);
          }
          return result;
        },
        getNetwork: async () => {
          const result = await getNetwork();
          if (result.error) {
            throw new Error(result.error);
          }
          return {
            network: result.network,
            networkPassphrase: result.networkPassphrase,
          };
        },
        getNetworkDetails: async () => {
          const result = await getNetworkDetails();
          if (result.error) {
            throw new Error(result.error);
          }
          return {
            network: result.network,
            networkPassphrase: result.networkPassphrase,
            networkUrl: result.networkUrl,
            sorobanRpcUrl: result.sorobanRpcUrl,
          };
        },
      };
      
      setWallet(walletInstance);
      setIsWalletConnected(true);
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
  }, [getNetworkInformation]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting wallet...');
    setWallet(null);
    setIsWalletConnected(false);
    setConnectionError(null);
    setNetworkInfo(null);
  }, []);

  // Watch for wallet changes
  useEffect(() => {
    if (isFreighterDetected) {
      const watcher = new WatchWalletChanges(3000); // Check every 3 seconds
      
      watcher.watch((watcherResults) => {
        console.log('Wallet changed:', watcherResults);
        if (watcherResults.address !== wallet?.publicKey) {
          // Recheck connection when address changes
          checkConnection();
        }
      });

      return () => {
        watcher.stop();
      };
    }
  }, [isFreighterDetected, wallet?.publicKey, checkConnection]);

  useEffect(() => {
    console.log('useWallet hook initialized');
    
    // Initial check with a small delay to ensure extension is loaded
    const initialCheck = setTimeout(async () => {
      await checkFreighterAvailability();
    }, 100);

    // Set up polling to check for Freighter availability
    const availabilityCheck = setInterval(async () => {
      const isAvailable = await checkFreighterAvailability();
      if (isAvailable) {
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

  return {
    wallet,
    isConnected: isWalletConnected,
    connectionError,
    isFreighterDetected,
    networkInfo,
    connect,
    disconnect,
  };
};
