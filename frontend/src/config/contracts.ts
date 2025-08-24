// Contract Configuration
// This file contains the contract addresses and network configuration
// Update these values after deploying your smart contracts

export const CONTRACT_CONFIG = {
  // Network Configuration - TESTNET ONLY
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015', // This is the TESTNET passphrase
  RPC_URL: 'https://rpc.ankr.com/stellar_testnet_soroban/27d8079fb434ba5169358c0a6b24951c5ba0f32690f57218399fc1b6a47e07a7',
  
  // Alternative RPC URLs if the main one doesn't work
  ALTERNATIVE_RPC_URLS: [
    'https://rpc.ankr.com/stellar_testnet_soroban/27d8079fb434ba5169358c0a6b24951c5ba0f32690f57218399fc1b6a47e07a7',
    'https://soroban-testnet.stellar.org',
    'https://testnet.stellar.org',
    'https://horizon-testnet.stellar.org'
  ],
  
  // Contract Addresses (update these after deployment)
  CONTRACT_ID: 'CADCLWIMKSZ44WPAVI6HMM67WVEI3P24VUAOTV47KDL364ZMOM5QAFKK', // Deployed EduChain Scholarships contract ID (TESTNET)
  TOKEN_CONTRACT_ID: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // Native XLM token contract on testnet
  
  // Default Values (in stroops - 1 XLM = 10,000,000 stroops)
  DEFAULT_TOTAL_GOAL_STROOPS: 500_000_000, // 50 XLM
  DEFAULT_MAX_SCHOLARSHIP_STROOPS: 50_000_000, // 5 XLM
  DEFAULT_MIN_SCHOLARSHIP_STROOPS: 10_000_000, // 1 XLM
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

// Helper function to get working RPC URL
export const getWorkingRpcUrl = async (): Promise<string> => {
  // For Soroban, the Ankr endpoint should be the primary choice
  // The health check approach doesn't work with Soroban RPC endpoints
  console.log('Using Ankr Soroban testnet RPC URL');
  return 'https://rpc.ankr.com/stellar_testnet_soroban/27d8079fb434ba5169358c0a6b24951c5ba0f32690f57218399fc1b6a47e07a7';
};
