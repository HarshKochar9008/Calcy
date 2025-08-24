import { useState, useEffect, useCallback } from 'react';
import type { Wallet, NetworkInfo } from '../types';
import { CONTRACT_CONFIG } from '../config/contracts';
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
  const [isManuallyDisconnected, setIsManuallyDisconnected] = useState(false);

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

  // Helper function to check if network is testnet
  const isTestnetNetwork = useCallback((network: string): boolean => {
    // Check if validation is bypassed
    if (CONTRACT_CONFIG.NETWORK_VALIDATION.BYPASS_VALIDATION) {
      console.log('⚠️ Network validation bypassed - allowing any network');
      return true;
    }
    
    // Use configured allowed networks
    const allowedNetworks = CONTRACT_CONFIG.NETWORK_VALIDATION.ALLOWED_NETWORKS;
    const isTestnet = allowedNetworks.includes(network);
    console.log(`🔍 Network validation: "${network}" is ${isTestnet ? 'allowed' : 'NOT allowed'}`);
    console.log(`🔍 Allowed networks: ${allowedNetworks.join(', ')}`);
    return isTestnet;
  }, []);

  const getNetworkInformation = useCallback(async (): Promise<NetworkInfo | null> => {
    try {
      console.log('🔍 Getting network details from Freighter...');
      console.log('🔧 Current validation settings:', {
        strictTestnetOnly: CONTRACT_CONFIG.NETWORK_VALIDATION.STRICT_TESTNET_ONLY,
        bypassValidation: CONTRACT_CONFIG.NETWORK_VALIDATION.BYPASS_VALIDATION,
        allowedNetworks: CONTRACT_CONFIG.NETWORK_VALIDATION.ALLOWED_NETWORKS
      });
      
      // Try getNetworkDetails first
      try {
        const networkDetails = await getNetworkDetails();
        console.log('📡 Raw network details from getNetworkDetails:', networkDetails);
        
        if (networkDetails.error) {
          console.error('❌ Error getting network details:', networkDetails.error);
          throw new Error(networkDetails.error);
        }
        
        const networkInfo: NetworkInfo = {
          network: networkDetails.network,
          networkPassphrase: networkDetails.networkPassphrase,
          networkUrl: networkDetails.networkUrl,
          horizonRpcUrl: networkDetails.sorobanRpcUrl,
        };
        
        console.log('✅ Processed network info:', networkInfo);
        console.log('🌐 Network type:', networkInfo.network);
        console.log('🔑 Network passphrase:', networkInfo.networkPassphrase);
        console.log('🔍 Network validation result:', isTestnetNetwork(networkInfo.network));
        
        setNetworkInfo(networkInfo);
        return networkInfo;
      } catch (detailsError) {
        console.log('⚠️ getNetworkDetails failed, trying getNetwork as fallback...');
        console.log('⚠️ Error details:', detailsError);
        
        // Fallback to getNetwork
        const networkResult = await getNetwork();
        console.log('📡 Fallback network result from getNetwork:', networkResult);
        
        if (networkResult.error) {
          console.error('❌ Error getting network (fallback):', networkResult.error);
          throw new Error(networkResult.error);
        }
        
        const fallbackNetworkInfo: NetworkInfo = {
          network: networkResult.network,
          networkPassphrase: networkResult.networkPassphrase,
          networkUrl: undefined,
          horizonRpcUrl: undefined,
        };
        
        console.log('✅ Fallback network info:', fallbackNetworkInfo);
        console.log('🌐 Network type (fallback):', fallbackNetworkInfo.network);
        console.log('🔑 Network passphrase (fallback):', fallbackNetworkInfo.networkPassphrase);
        console.log('🔍 Network validation result (fallback):', isTestnetNetwork(fallbackNetworkInfo.network));
        
        setNetworkInfo(fallbackNetworkInfo);
        return fallbackNetworkInfo;
      }
    } catch (error) {
      console.error('❌ Error getting network information:', error);
      return null;
    }
  }, [isTestnetNetwork]);

  // Function to test network connection and provide detailed feedback
  const testNetworkConnection = useCallback(async () => {
    console.log('🧪 Testing network connection...');
    
    try {
      const networkInfo = await getNetworkInformation();
      
      if (!networkInfo) {
        return {
          success: false,
          error: 'Failed to get network information',
          details: null
        };
      }
      
      const isValidNetwork = isTestnetNetwork(networkInfo.network);
      
      return {
        success: true,
        isValidNetwork,
        currentNetwork: networkInfo.network,
        expectedNetworks: CONTRACT_CONFIG.NETWORK_VALIDATION.ALLOWED_NETWORKS,
        networkInfo,
        message: isValidNetwork 
          ? '✅ Network validation passed - you can connect!' 
          : `❌ Network validation failed. Current: "${networkInfo.network}", Expected: one of ${CONTRACT_CONFIG.NETWORK_VALIDATION.ALLOWED_NETWORKS.join(', ')}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: null
      };
    }
  }, [getNetworkInformation, isTestnetNetwork]);

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
        
        // Check if wallet is on testnet
        console.log('🔍 Validating network type in checkConnection...');
        console.log('📡 Network info received:', networkInfo);
        console.log('🌐 Network type:', networkInfo?.network);
        console.log('🔑 Expected: testnet, Actual:', networkInfo?.network);
        
        if (!networkInfo?.network || !isTestnetNetwork(networkInfo.network)) {
          console.error('❌ Network validation failed in checkConnection - not testnet');
          console.log('🔍 Available testnet identifiers: testnet, TESTNET, Testnet, test, TEST');
          console.log('🔍 Received network:', networkInfo?.network);
          throw new Error(`Only testnet accounts are supported. Current network: "${networkInfo?.network || 'unknown'}". Please switch to testnet in Freighter.`);
        }
        
        console.log('✅ Network validation passed in checkConnection - testnet confirmed');
        
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
              horizonRpcUrl: result.sorobanRpcUrl,
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
      
      let errorMessage = 'Connection check failed';
      if (error instanceof Error) {
        if (error.message.includes('Only testnet accounts are supported')) {
          errorMessage = `❌ Network Configuration Issue

Current Network: "${networkInfo?.network || 'unknown'}"

🔧 Troubleshooting Steps:
1. Open Freighter extension
2. Click on the network dropdown (top right)
3. Select "Testnet" or "Test Network"
4. Refresh this page
5. Try connecting again

💡 Alternative: If you're already on testnet, try:
- Refreshing the page
- Disconnecting and reconnecting
- Checking browser console for detailed logs`;
        } else {
          errorMessage = `Connection check failed: ${error.message}`;
        }
      }
      setConnectionError(errorMessage);
    }
  }, [getNetworkInformation, isTestnetNetwork, networkInfo]);

  const connect = useCallback(async () => {
    console.log('Attempting to connect wallet...');
    setConnectionError(null);
    setIsManuallyDisconnected(false); // Reset manual disconnect flag
    
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
      
      // Check if wallet is on testnet
      console.log('🔍 Validating network type...');
      console.log('📡 Network info received:', networkInfo);
      console.log('🌐 Network type:', networkInfo?.network);
      console.log('🔑 Expected: testnet, Actual:', networkInfo?.network);
      
      if (!networkInfo?.network || !isTestnetNetwork(networkInfo.network)) {
        console.error('❌ Network validation failed - not testnet');
        console.log('🔍 Available testnet identifiers: testnet, TESTNET, Testnet, test, TEST');
        console.log('🔍 Received network:', networkInfo?.network);
        throw new Error(`Only testnet accounts are supported. Current network: "${networkInfo?.network || 'unknown'}". Please switch to testnet in Freighter and try again.`);
      }
      
      console.log('✅ Network validation passed - testnet confirmed');
      
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
            horizonRpcUrl: result.sorobanRpcUrl,
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
        if (error.message.includes('Only testnet accounts are supported')) {
          errorMessage = `❌ Network Configuration Issue

Current Network: "${networkInfo?.network || 'unknown'}"

🔧 Troubleshooting Steps:
1. Open Freighter extension
2. Click on the network dropdown (top right)
3. Select "Testnet" or "Test Network"
4. Refresh this page
5. Try connecting again

💡 Alternative: If you're already on testnet, try:
- Refreshing the page
- Disconnecting and reconnecting
- Checking browser console for detailed logs`;
        } else if (error.message.includes('User rejected')) {
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
  }, [getNetworkInformation, isTestnetNetwork, networkInfo]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting wallet...');
    
    // Set manual disconnect flag to prevent auto-reconnection
    setIsManuallyDisconnected(true);
    
    // Clear all wallet-related state
    setWallet(null);
    setIsWalletConnected(false);
    setConnectionError(null);
    setNetworkInfo(null);
    
    // Force cleanup of any pending operations
    console.log('Wallet disconnected successfully, all state cleared');
  }, []);

  // Watch for wallet changes
  useEffect(() => {
    if (isFreighterDetected && !isManuallyDisconnected) {
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
  }, [isFreighterDetected, wallet?.publicKey, checkConnection, isManuallyDisconnected]);

  useEffect(() => {
    console.log('useWallet hook initialized');
    
    // Initial check with a small delay to ensure extension is loaded
    const initialCheck = setTimeout(async () => {
      await checkFreighterAvailability();
    }, 100);

    // Set up polling to check for Freighter availability
    const availabilityCheck = setInterval(async () => {
      const isAvailable = await checkFreighterAvailability();
      if (isAvailable && !isManuallyDisconnected) {
        clearInterval(availabilityCheck);
        checkConnection();
      }
    }, 500);

    // Clean up intervals
    return () => {
      clearTimeout(initialCheck);
      clearInterval(availabilityCheck);
    };
  }, [checkFreighterAvailability, checkConnection, isManuallyDisconnected]);

  return {
    wallet,
    isConnected: isWalletConnected,
    connectionError,
    isFreighterDetected,
    networkInfo,
    connect,
    disconnect,
    testNetworkConnection,
  };
};
