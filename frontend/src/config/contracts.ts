// Contract Configuration
// This file contains the contract addresses and network configuration
// Update these values after deploying your smart contracts

export const CONTRACT_CONFIG = {
  // Network Configuration - TESTNET ONLY
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015', // This is the TESTNET passphrase
  RPC_URL: 'https://soroban-testnet.stellar.org', // Soroban RPC endpoint for testnet
  
  // Network Validation Settings
  NETWORK_VALIDATION: {
    STRICT_TESTNET_ONLY: true, // Set to false to allow other networks (not recommended for production)
    ALLOWED_NETWORKS: ['testnet', 'TESTNET', 'Testnet', 'test', 'TEST'], // Networks that are considered testnet
    BYPASS_VALIDATION: false, // Set to true to completely bypass network validation (use with caution)
  },
  

  
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

// Helper function to test Soroban RPC endpoint specifically
export const testSorobanRpcEndpoint = async (): Promise<{ isWorking: boolean; error?: string }> => {
  const sorobanUrl = 'https://soroban-testnet.stellar.org';
  
  try {
    console.log('🔍 Testing Soroban RPC endpoint specifically...');
    
    const response = await fetch(sorobanUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout for Soroban RPC
    });
    
    if (response.ok) {
      console.log('✅ Soroban RPC endpoint is working and correctly configured for testnet');
      return { isWorking: true };
    } else {
      console.warn(`⚠️ Soroban RPC endpoint responded with status: ${response.status}`);
      return { isWorking: false, error: `HTTP ${response.status}` };
    }
  } catch (error: any) {
    console.error('❌ Soroban RPC endpoint test failed:', error);
    return { 
      isWorking: false, 
      error: error.message || 'Connection failed' 
    };
  }
};

// Helper function to get working RPC URL
export const getWorkingRpcUrl = async (): Promise<string> => {
  // Prioritize the Soroban RPC endpoint as it's the standard for smart contracts
  console.log('🔍 Testing Soroban RPC endpoints for connectivity...');
  
  const testUrls = [
    'https://soroban-testnet.stellar.org',
    'https://soroban-testnet.stellar.org:443',
    'https://testnet.stellar.org'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`Testing Soroban RPC endpoint: ${url}`);
      
      // Test the endpoint with a simple health check
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add a reasonable timeout
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        console.log(`✅ Soroban RPC endpoint working: ${url}`);
        return url;
      }
    } catch (error) {
      console.warn(`❌ Soroban RPC endpoint failed: ${url}`, error);
      continue;
    }
  }
  
  // If all fail, fall back to the primary Soroban RPC endpoint
  console.log('⚠️ All Soroban RPC endpoints failed, using primary Soroban RPC endpoint');
  return 'https://soroban-testnet.stellar.org';
};
