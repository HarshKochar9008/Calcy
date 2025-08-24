import { useState, useEffect } from 'react';
import type { Wallet } from '../types';

export const useWalletBalance = (wallet: Wallet | null) => {
  const [balance, setBalance] = useState<string>('--');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet || !wallet.publicKey) {
      setBalance('--');
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if wallet is on testnet
        if (wallet.network?.network !== 'testnet') {
          setError('Only testnet accounts supported');
          setBalance('--');
          return;
        }

        // For now, show a placeholder - in production, fetch from Stellar Horizon API
        // Example: https://horizon-testnet.stellar.org/accounts/{publicKey}
        setBalance('0.00'); // Show 0.00 for testnet accounts
        
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
        setError('Failed to fetch balance');
        setBalance('--');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [wallet]);

  const refreshBalance = async () => {
    if (wallet) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if wallet is on testnet
        if (wallet.network?.network !== 'testnet') {
          setError('Only testnet accounts supported');
          setBalance('--');
          return;
        }

        // For now, show a placeholder - in production, fetch from Stellar Horizon API
        setBalance('0.00'); // Show 0.00 for testnet accounts
        
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
        setError('Failed to fetch balance');
        setBalance('--');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    balance,
    isLoading,
    error,
    refreshBalance
  };
};
