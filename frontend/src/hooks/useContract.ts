import { useState, useEffect, useCallback } from 'react';
import type { Wallet, ScholarshipPool } from '../types';
import { Client } from '../contracts';
import {
  CONTRACT_ID,
  DEFAULT_TOTAL_GOAL_STROOPS,
  DEFAULT_MAX_SCHOLARSHIP_STROOPS,
  DEFAULT_MIN_SCHOLARSHIP_STROOPS,
  XLM_TO_STROOPS,
  MONTH_IN_SECONDS,
  DAY_IN_SECONDS,
  RPC_URL,
  NETWORK_PASSPHRASE,
  TOKEN_CONTRACT_ID,
} from '../utils/constants';
import { getConfigurationStatus, getWorkingRpcUrl } from '../config/contracts';

export const useContract = (wallet: Wallet | null) => {
  const [pool, setPool] = useState<ScholarshipPool | null>(null);
  const [userDonation, setUserDonation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rpcUrl, setRpcUrl] = useState<string>(RPC_URL);

  // Network configuration verification
  useEffect(() => {
    console.log('🔍 NETWORK CONFIGURATION VERIFICATION:');
    console.log('NETWORK_PASSPHRASE:', NETWORK_PASSPHRASE);
    console.log('RPC_URL:', RPC_URL);
    console.log('CONTRACT_ID:', CONTRACT_ID);
    console.log('Expected Testnet Passphrase:', 'Test SDF Network ; September 2015');
    console.log('Is Testnet?', NETWORK_PASSPHRASE === 'Test SDF Network ; September 2015');
    console.log('Is Mainnet?', NETWORK_PASSPHRASE === 'Public Global Stellar Network ; September 2015');
  }, []);

  const requireConfig = () => {
    if (!wallet) throw new Error('Wallet not connected');
    
    const configStatus = getConfigurationStatus();
    if (!configStatus.isConfigured) {
      const missingContracts = configStatus.missingContracts.join(', ');
      throw new Error(`Contracts not configured: ${missingContracts}. Please deploy contracts and update configuration.`);
    }
    
    if (!NETWORK_PASSPHRASE) throw new Error('Network passphrase missing');
    
    // Additional validation for contract ID format
    if (!CONTRACT_ID || CONTRACT_ID.trim() === '') {
      throw new Error('Contract ID is not configured. Please deploy the contract and update the CONTRACT_ID in the configuration.');
    }
    
    // Validate contract ID format (should be 56 characters, alphanumeric)
    if (!/^[A-Z0-9]{56}$/.test(CONTRACT_ID)) {
      throw new Error(`Invalid contract ID format: ${CONTRACT_ID}. Contract ID should be 56 characters long and contain only uppercase letters and numbers.`);
    }
  };

  const getContractClient = () => {
    if (!CONTRACT_ID) throw new Error('Contract ID not configured');
    if (!wallet) throw new Error('Wallet not connected');
    
    // Verify we're using the correct testnet passphrase
    const expectedTestnetPassphrase = 'Test SDF Network ; September 2015';
    const actualPassphrase = NETWORK_PASSPHRASE;
    
    if (actualPassphrase !== expectedTestnetPassphrase) {
      console.error('❌ NETWORK MISMATCH DETECTED!');
      console.error('Expected (Testnet):', expectedTestnetPassphrase);
      console.error('Actual:', actualPassphrase);
      throw new Error(`Network passphrase mismatch! Expected testnet but got: ${actualPassphrase}`);
    }
    
    console.log('✅ Creating contract client with CORRECT testnet configuration:', {
      contractId: CONTRACT_ID,
      networkPassphrase: actualPassphrase,
      rpcUrl: rpcUrl,
      walletPublicKey: wallet.publicKey,
      isTestnet: actualPassphrase === expectedTestnetPassphrase
    });
    
    return new Client({
      contractId: CONTRACT_ID,
      networkPassphrase: actualPassphrase,
      rpcUrl: rpcUrl,
    });
  };

  useEffect(() => {
    const initializeRpcUrl = async () => {
      try {
        const workingUrl = await getWorkingRpcUrl();
        setRpcUrl(workingUrl);
        console.log('Using RPC URL:', workingUrl);
      } catch (error) {
        console.warn('Failed to find working RPC URL, using default:', error);
        setRpcUrl(RPC_URL);
      }
    };
    
    initializeRpcUrl();
  }, []);


  const checkPoolExists = useCallback(async (): Promise<boolean> => {
    if (!wallet || !CONTRACT_ID) return false;
    
    try {
      const client = getContractClient();
      const result = await client.get_pool_opt();
      return !!(result && result.result);
    } catch (error) {
      return false;
    }
  }, [wallet, rpcUrl]);

  const refreshPool = useCallback(async () => {
    if (!wallet || !CONTRACT_ID) return;

    try {
      setError(null);
      const client = getContractClient();
      
      try {
        const result = await client.get_pool_opt();
        console.log('Pool opt result:', result);
        
        if (result && result.result) {
          const poolData = result.result;
          console.log('Pool data:', poolData);
          
          if (poolData) {
            // Pool exists
            const parsed: ScholarshipPool = {
              creator: poolData.creator,
              token: poolData.token,
              total_goal: Number(poolData.total_goal),
              current_balance: Number(poolData.current_balance),
              is_active: poolData.is_active,
              max_scholarship_amount: Number(poolData.max_scholarship_amount),
              min_scholarship_amount: Number(poolData.min_scholarship_amount),
              application_deadline: Number(poolData.application_deadline),
              distribution_deadline: Number(poolData.distribution_deadline),
            };
            setPool(parsed);
            
            // Get user donation
            try {
              const donationResult = await client.get_donor({ donor: wallet.publicKey });
              if (donationResult.result) {
                const donorData = donationResult.result as any;
                if (donorData && donorData.total_contributed) {
                  setUserDonation(Number(donorData.total_contributed));
                } else {
                  setUserDonation(0);
                }
              } else {
                setUserDonation(0);
              }
            } catch (donationErr) {
              console.warn('Could not get user donation:', donationErr);
              setUserDonation(0);
            }
          } else {
            // Pool doesn't exist yet
            console.log('Pool not initialized yet - this is expected for new contracts');
            setPool(null);
            setUserDonation(0);
          }
        } else {
          // No result
          console.log('No result from contract');
          setPool(null);
          setUserDonation(0);
        }
      } catch (poolErr: any) {
        console.log('Pool error:', poolErr);
        setPool(null);
        setUserDonation(0);
      }
    } catch (err) {
      console.error('Error refreshing pool:', err);
      setError('Failed to load pool details');
    }
  }, [wallet, rpcUrl]);

  const initializePool = useCallback(async () => {
    if (!wallet || !CONTRACT_ID) {
      setError('Wallet not connected or contract not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Enhanced configuration check
      const configStatus = getConfigurationStatus();
      if (!configStatus.isConfigured) {
        const missingContracts = configStatus.missingContracts.join(', ');
        throw new Error(`Contracts not configured: ${missingContracts}. Please deploy contracts and update configuration.`);
      }
      
      if (!NETWORK_PASSPHRASE) {
        throw new Error('Network passphrase missing. Please check your configuration.');
      }

      if (!TOKEN_CONTRACT_ID) {
        throw new Error('Token contract ID missing. Please deploy the XLM token contract and update configuration.');
      }

      console.log('Initializing pool with configuration:', {
        creator: wallet.publicKey,
        token: TOKEN_CONTRACT_ID,
        total_goal: DEFAULT_TOTAL_GOAL_STROOPS,
        max_scholarship: DEFAULT_MAX_SCHOLARSHIP_STROOPS,
        min_scholarship: DEFAULT_MIN_SCHOLARSHIP_STROOPS,
        rpcUrl,
        networkPassphrase: NETWORK_PASSPHRASE,
        isTestnet: NETWORK_PASSPHRASE === 'Test SDF Network ; September 2015'
      });
      
      const currentTime = Math.floor(Date.now() / 1000);
      const client = getContractClient();
      
      // Call the contract function - this returns an AssembledTransaction2
      const assembledTransaction = await client.init_pool({
        creator: wallet.publicKey,
        token: TOKEN_CONTRACT_ID,
        total_goal: BigInt(DEFAULT_TOTAL_GOAL_STROOPS),
        max_scholarship_amount: BigInt(DEFAULT_MAX_SCHOLARSHIP_STROOPS),
        min_scholarship_amount: BigInt(DEFAULT_MIN_SCHOLARSHIP_STROOPS),
        application_deadline: BigInt(currentTime + MONTH_IN_SECONDS),
        distribution_deadline: BigInt(currentTime + MONTH_IN_SECONDS + DAY_IN_SECONDS * 7),
      });

      console.log('Pool initialization assembled transaction:', assembledTransaction);

      // Execute the transaction by signing and sending it
      const result = await assembledTransaction.signAndSend({
        signTransaction: async (transaction: any) => {
          if (!wallet) throw new Error('Wallet not connected');
          const signedResult = await wallet.signTransaction(transaction);
          return {
            signedTxXdr: signedResult.signedTxXdr,
            signerAddress: signedResult.signerAddress
          };
        }
      });

      console.log('Pool initialization result:', result);

      if (result && result.result) {
        await refreshPool();
        setUserDonation(0);
        setError(null);
      } else {
        throw new Error(`Pool initialization failed - no result returned`);
      }
      
    } catch (err: any) {
      console.error('Error initializing pool:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to initialize scholarship pool';
      
      if (err.message) {
        if (err.message.includes('Contracts not configured')) {
          errorMessage = err.message;
        } else if (err.message.includes('Network passphrase missing')) {
          errorMessage = err.message;
        } else if (err.message.includes('Token contract ID missing')) {
          errorMessage = err.message;
        } else if (err.message.includes('Pool initialization failed')) {
          errorMessage = err.message;
        } else if (err.message.includes('RPC')) {
          errorMessage = `Network error: ${err.message}. Please check your internet connection and try again.`;
        } else if (err.message.includes('contract')) {
          errorMessage = `Contract error: ${err.message}. Please ensure the contract is deployed and accessible.`;
        } else {
          errorMessage = `Initialization error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, refreshPool, rpcUrl]);

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
      const client = getContractClient();
      
      // Call the contract function - this returns an AssembledTransaction2
      const assembledTransaction = await client.donate({
        from: wallet.publicKey,
        amount: BigInt(amountStroops),
      });

      // Execute the transaction by signing and sending it
      const result = await assembledTransaction.signAndSend({
        signTransaction: async (transaction: any) => {
          if (!wallet) throw new Error('Wallet not connected');
          const signedResult = await wallet.signTransaction(transaction);
          return {
            signedTxXdr: signedResult.signedTxXdr,
            signerAddress: signedResult.signerAddress
          };
        }
      });

      if (result && result.result) {
        await refreshPool();
      }
      
    } catch (err) {
      console.error('Error donating:', err);
      setError('Failed to process donation');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool, refreshPool]);

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
      const client = getContractClient();
      
      // Call the contract function - this returns an AssembledTransaction2
      const assembledTransaction = await client.apply_for_scholarship({
        student: wallet.publicKey,
        name: application.name,
        academic_level: application.academic_level,
        field_of_study: application.field_of_study,
        gpa: BigInt(Math.floor(application.gpa * 100)),
        financial_need_score: BigInt(application.financial_need_score),
        essay_hash: application.essay_hash,
      });

      // Execute the transaction by signing and sending it
      const result = await assembledTransaction.signAndSend({
        signTransaction: async (transaction: any) => {
          if (!wallet) throw new Error('Wallet not connected');
          const signedResult = await wallet.signTransaction(transaction);
          return {
            signedTxXdr: signedResult.signedTxXdr,
            signerAddress: signedResult.signerAddress
          };
        }
      });

      if (result && result.result) {
        setError(null);
      }
      
    } catch (err) {
      console.error('Error applying for scholarship:', err);
      setError('Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool]);

  const approveScholarships = useCallback(async () => {
    if (!wallet || !pool || !CONTRACT_ID) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (pool.creator !== wallet.publicKey) {
      setError('Only pool creator can approve scholarships');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = getContractClient();
      
      // Call the contract function - this returns an AssembledTransaction2
      const assembledTransaction = await client.approve_scholarships({
        creator: wallet.publicKey,
      });

      // Execute the transaction by signing and sending it
      const result = await assembledTransaction.signAndSend({
        signTransaction: async (transaction: any) => {
          if (!wallet) throw new Error('Wallet not connected');
          const signedResult = await wallet.signTransaction(transaction);
          return {
            signedTxXdr: signedResult.signedTxXdr,
            signerAddress: signedResult.signerAddress
          };
        }
      });

      if (result && result.result) {
        await refreshPool();
        setError(null);
      }
      
    } catch (err) {
      console.error('Error approving scholarships:', err);
      setError('Failed to approve scholarships');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool, refreshPool]);

  const distributeScholarships = useCallback(async () => {
    if (!wallet || !pool || !CONTRACT_ID) {
      setError('Wallet not connected or pool not initialized');
      return;
    }

    if (pool.creator !== wallet.publicKey) {
      setError('Only pool creator can distribute scholarships');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = getContractClient();
      
      // Call the contract function - this returns an AssembledTransaction2
      const assembledTransaction = await client.distribute_scholarships({
        creator: wallet.publicKey,
      });

      // Execute the transaction by signing and sending it
      const result = await assembledTransaction.signAndSend({
        signTransaction: async (transaction: any) => {
          if (!wallet) throw new Error('Wallet not connected');
          const signedResult = await wallet.signTransaction(transaction);
          return {
            signedTxXdr: signedResult.signedTxXdr,
            signerAddress: signedResult.signerAddress
          };
        }
      });

      if (result && result.result) {
        await refreshPool();
        setError(null);
      }
      
    } catch (err) {
      console.error('Error distributing scholarships:', err);
      setError('Failed to distribute scholarships');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, pool, refreshPool]);

  useEffect(() => {
    if (wallet && CONTRACT_ID) {
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
    approveScholarships,
    distributeScholarships,
    refreshPool,
  };
};
