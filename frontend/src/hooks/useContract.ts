import { useState, useEffect, useCallback } from 'react';
import type { Wallet, ScholarshipPool } from '../types';
import { 
  CONTRACT_ID, 
  DEFAULT_TOTAL_GOAL_STROOPS,
  DEFAULT_MAX_SCHOLARSHIP_STROOPS,
  DEFAULT_MIN_SCHOLARSHIP_STROOPS,
  XLM_TO_STROOPS,
  DAY_IN_SECONDS,
  MONTH_IN_SECONDS
} from '../utils/constants';

export const useContract = (wallet: Wallet | null) => {
  const [pool, setPool] = useState<ScholarshipPool | null>(null);
  const [userDonation, setUserDonation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshPool = useCallback(async () => {
    if (!wallet || !CONTRACT_ID) return;

    try {
      setError(null);
      // In a real implementation, you would call the contract's get_pool function
      // For now, we'll simulate this with mock data
      const currentTime = Math.floor(Date.now() / 1000);
      const mockPool: ScholarshipPool = {
        creator: wallet.publicKey,
        token: 'XLM',
        total_goal: DEFAULT_TOTAL_GOAL_STROOPS,
        current_balance: 0,
        is_active: true,
        max_scholarship_amount: DEFAULT_MAX_SCHOLARSHIP_STROOPS,
        min_scholarship_amount: DEFAULT_MIN_SCHOLARSHIP_STROOPS,
        application_deadline: currentTime + MONTH_IN_SECONDS, // 1 month from now
        distribution_deadline: currentTime + MONTH_IN_SECONDS + DAY_IN_SECONDS * 7, // 1 week after applications close
      };
      setPool(mockPool);
      
      // Get user donation
      const donation = await getUserDonation();
      setUserDonation(donation);
    } catch (err) {
      console.error('Error refreshing pool:', err);
      setError('Failed to load pool details');
    }
  }, [wallet]);

  const getUserDonation = async (): Promise<number> => {
    if (!CONTRACT_ID) return 0;
    
    try {
      // In a real implementation, you would call the contract's get_donor function
      // For now, return mock data
      return 0;
    } catch (err) {
      console.error('Error getting user donation:', err);
      return 0;
    }
  };

  const initializePool = useCallback(async () => {
    if (!wallet || !CONTRACT_ID) {
      setError('Wallet not connected or contract not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call the contract's init_pool function
      // For now, we'll simulate this
      const currentTime = Math.floor(Date.now() / 1000);
      const newPool: ScholarshipPool = {
        creator: wallet.publicKey,
        token: 'XLM',
        total_goal: DEFAULT_TOTAL_GOAL_STROOPS,
        current_balance: 0,
        is_active: true,
        max_scholarship_amount: DEFAULT_MAX_SCHOLARSHIP_STROOPS,
        min_scholarship_amount: DEFAULT_MIN_SCHOLARSHIP_STROOPS,
        application_deadline: currentTime + MONTH_IN_SECONDS,
        distribution_deadline: currentTime + MONTH_IN_SECONDS + DAY_IN_SECONDS * 7,
      };
      
      setPool(newPool);
      setUserDonation(0);
      
      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      console.error('Error initializing pool:', err);
      setError('Failed to initialize scholarship pool');
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const donate = useCallback(async (amount: number) => {
    if (!wallet || !pool || !CONTRACT_ID) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (amount <= 0) {
      setError('Invalid donation amount');
      return;
    }

    if (!pool.is_active) {
      setError('Pool is not accepting donations');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountStroops = XLM_TO_STROOPS(amount);
      
      // In a real implementation, you would call the contract's donate function
      // For now, we'll simulate this
      const updatedPool = { ...pool };
      updatedPool.current_balance += amountStroops;
      
      setPool(updatedPool);
      setUserDonation(prev => prev + amountStroops);
      
      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      console.error('Error donating:', err);
      setError('Failed to process donation');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  const applyForScholarship = useCallback(async (application: {
    name: string;
    academic_level: string;
    field_of_study: string;
    gpa: number;
    financial_need_score: number;
    essay_hash: string;
  }) => {
    if (!wallet || !pool || !CONTRACT_ID) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (Date.now() / 1000 > pool.application_deadline) {
      setError('Application deadline has passed');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call the contract's apply_for_scholarship function
      // For now, we'll simulate this
      console.log('Scholarship application submitted:', application);
      
      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setError(null);
      
    } catch (err) {
      console.error('Error applying for scholarship:', err);
      setError('Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  useEffect(() => {
    if (wallet) {
      refreshPool();
    }
  }, [wallet, refreshPool]);

  return {
    pool,
    userDonation,
    isLoading,
    error,
    initializePool,
    donate,
    applyForScholarship,
    refreshPool,
  };
};
