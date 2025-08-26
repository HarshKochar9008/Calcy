import { useState, useEffect, useCallback } from 'react';
import type { Wallet, ScholarshipPool, StudentApplication, PoolStats } from '../types';
import { CONTRACT_CONFIG } from '../config/contracts';

// Mock data for development/testing
const createMockPool = (creator: string): ScholarshipPool => ({
  creator,
  token: CONTRACT_CONFIG.TOKEN_CONTRACT_ID,
  total_goal: CONTRACT_CONFIG.DEFAULT_TOTAL_GOAL_STROOPS,
  current_balance: 0,
  is_active: true,
  max_scholarship_amount: CONTRACT_CONFIG.DEFAULT_MAX_SCHOLARSHIP_STROOPS,
  min_scholarship_amount: CONTRACT_CONFIG.DEFAULT_MIN_SCHOLARSHIP_STROOPS,
  application_deadline: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
  distribution_deadline: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // 60 days from now
});

const createMockStats = (): PoolStats => ({
  total_applications: 0,
  approved_applications: 0,
  total_donors: 0,
});

export const useContract = (wallet: Wallet | null) => {
  const [pool, setPool] = useState<ScholarshipPool | null>(null);
  const [userDonation, setUserDonation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [poolStats, setPoolStats] = useState<PoolStats>(createMockStats());

  // Continuous console logging
  useEffect(() => {
    const logInterval = setInterval(() => {
      console.log('📋 useContract Hook Status:', {
        hasWallet: !!wallet,
        walletAddress: wallet?.publicKey?.substring(0, 8) + '...' || 'None',
        hasPool: !!pool,
        poolCreator: pool?.creator?.substring(0, 8) + '...' || 'None',
        currentBalance: pool?.current_balance || 0,
        totalGoal: pool?.total_goal || 0,
        isLoading,
        error: error || 'None',
        success: success || 'None',
        timestamp: new Date().toISOString()
      });
    }, 5000); // Log every 5 seconds

    return () => clearInterval(logInterval);
  }, [wallet, pool, isLoading, error, success]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Initialize pool function
  const initializePool = useCallback(async () => {
    if (!wallet) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🏗️ Initializing scholarship pool...');

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPool = createMockPool(wallet.publicKey);
      setPool(newPool);
      setSuccess('Pool created successfully! You can now accept donations and applications.');
      console.log('✅ Pool initialized successfully:', newPool);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize pool';
      setError(errorMessage);
      console.error('❌ Error initializing pool:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  // Donate function
  const donate = useCallback(async (amount: number) => {
    if (!wallet || !pool) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (amount <= 0) {
      setError('Donation amount must be greater than 0');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('💰 Processing donation:', amount, 'stroops');

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update pool balance
      const updatedPool = { ...pool, current_balance: pool.current_balance + amount };
      setPool(updatedPool);

      // Update user donation
      setUserDonation(prev => prev + amount);

      // Update stats
      setPoolStats(prev => ({ ...prev, total_donors: prev.total_donors + 1 }));

      setSuccess(`Successfully donated ${amount} stroops! Thank you for supporting education.`);
      console.log('✅ Donation processed successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process donation';
      setError(errorMessage);
      console.error('❌ Error processing donation:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  // Apply for scholarship function
  const applyForScholarship = useCallback(async (_application: Omit<StudentApplication, 'student_address' | 'is_approved' | 'scholarship_amount' | 'application_timestamp'>) => {
    if (!wallet || !pool) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('📝 Processing scholarship application...');

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update stats
      setPoolStats(prev => ({ ...prev, total_applications: prev.total_applications + 1 }));

      setSuccess('Scholarship application submitted successfully! Your application is under review.');
      console.log('✅ Application submitted successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      console.error('❌ Error submitting application:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  // Approve scholarships function
  const approveScholarships = useCallback(async () => {
    if (!wallet || !pool) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (pool.creator !== wallet.publicKey) {
      setError('Only pool creator can approve scholarships');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('✅ Approving scholarships...');

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Update stats
      setPoolStats(prev => ({ ...prev, approved_applications: prev.approved_applications + 2 }));

      setSuccess('Scholarships approved successfully! Funds will be distributed after the deadline.');
      console.log('✅ Scholarships approved successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve scholarships';
      setError(errorMessage);
      console.error('❌ Error approving scholarships:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  // Distribute scholarships function
  const distributeScholarships = useCallback(async () => {
    if (!wallet || !pool) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (pool.creator !== wallet.publicKey) {
      setError('Only pool creator can distribute scholarships');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🎓 Distributing scholarships...');

      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      setSuccess('Scholarships distributed successfully! Students have received their funds.');
      console.log('✅ Scholarships distributed successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to distribute scholarships';
      setError(errorMessage);
      console.error('❌ Error distributing scholarships:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  // Refresh pool function
  const refreshPool = useCallback(async () => {
    if (!wallet) {
      console.log('🔄 No wallet connected, skipping pool refresh');
      return;
    }

    try {
      console.log('🔄 Refreshing pool data...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If no pool exists, create a mock one
      if (!pool) {
        const newPool = createMockPool(wallet.publicKey);
        setPool(newPool);
        console.log('✅ Created new pool on refresh');
      } else {
        console.log('✅ Pool data refreshed');
      }

    } catch (err) {
      console.error('❌ Error refreshing pool:', err);
    }
  }, [wallet, pool]);

  // Auto-refresh pool when wallet connects
  useEffect(() => {
    if (wallet && !pool) {
      console.log('🔄 Auto-refreshing pool for new wallet connection...');
      refreshPool();
    }
  }, [wallet, pool, refreshPool]);

  return {
    pool,
    userDonation,
    isLoading,
    error,
    success,
    poolStats,
    initializePool,
    donate,
    applyForScholarship,
    approveScholarships,
    distributeScholarships,
    refreshPool
  };
};
