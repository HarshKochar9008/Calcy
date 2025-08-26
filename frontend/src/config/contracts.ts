// Contract Configuration
// This file contains the contract addresses and network configuration for testnet
// Update these values after deploying your smart contracts

export const CONTRACT_CONFIG = {
  // Network Configuration - TESTNET ONLY
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015', // This is the TESTNET passphrase
  RPC_URL: 'https://soroban-testnet.stellar.org', // Soroban RPC endpoint for testnet
  
  // Contract Addresses (update these after deployment)
  CONTRACT_ID: 'CDZQV5YQ7MQO5EEWH7ZK4OM4KPJHXJRKHSQXYBD6FBWGT4KCRPYNQM7C', // Deployed EduChain Scholarships contract ID (TESTNET)
  TOKEN_CONTRACT_ID: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // Native XLM token contract on testnet
  
  // Default Values (in stroops - 1 XLM = 10,000,000 stroops)
  DEFAULT_TOTAL_GOAL_STROOPS: 100_000_000_000, // 10,000 XLM (dummy data)
  DEFAULT_MAX_SCHOLARSHIP_STROOPS: 1_000_000_000, // 100 XLM (dummy data)
  DEFAULT_MIN_SCHOLARSHIP_STROOPS: 100_000_000, // 10 XLM (dummy data)
};

// Helper function to check if contracts are configured
export const isContractConfigured = (): boolean => {
  return !!(CONTRACT_CONFIG.CONTRACT_ID && CONTRACT_CONFIG.TOKEN_CONTRACT_ID);
};

// Helper function to get configuration status
export const getConfigurationStatus = () => {
  return {
    isConfigured: isContractConfigured(),
    missingContracts: [
      !CONTRACT_CONFIG.CONTRACT_ID && 'EduChain Scholarships Contract',
      !CONTRACT_CONFIG.TOKEN_CONTRACT_ID && 'XLM Token Contract',
    ].filter(Boolean),
  };
};
