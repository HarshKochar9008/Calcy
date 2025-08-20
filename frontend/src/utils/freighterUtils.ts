type Wallet = import('../types').Wallet;

/**
 * Signs a transaction using Freighter wallet
 * @param wallet - The connected wallet instance
 * @param xdr - The transaction XDR string
 * @param opts - Optional signing options
 * @returns The signed transaction XDR
 */
export const signTransactionWithFreighter = async (
  wallet: Wallet,
  xdr: string,
  opts?: { network?: string; networkPassphrase?: string; address?: string }
): Promise<string> => {
  try {
    const result = await wallet.signTransaction(xdr, opts);
    return result.signedTxXdr;
  } catch (error) {
    throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Signs an authorization entry using Freighter wallet
 * @param wallet - The connected wallet instance
 * @param authEntryXdr - The authorization entry XDR string
 * @returns The signed authorization entry
 */
export const signAuthEntryWithFreighter = async (
  wallet: Wallet,
  authEntryXdr: string
): Promise<Uint8Array | null> => {
  try {
    const result = await wallet.signAuthEntry(authEntryXdr, { address: wallet.publicKey });
    return result.signedAuthEntry;
  } catch (error) {
    throw new Error(`Failed to sign authorization entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Signs a message using Freighter wallet
 * @param wallet - The connected wallet instance
 * @param message - The message to sign
 * @returns The signed message
 */
export const signMessageWithFreighter = async (
  wallet: Wallet,
  message: string
): Promise<string | null> => {
  try {
    const result = await wallet.signMessage(message, { address: wallet.publicKey });
    return result.signedMessage;
  } catch (error) {
    throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Adds a Soroban token to the user's Freighter wallet
 * @param wallet - The connected wallet instance
 * @param contractId - The Soroban token contract ID
 * @returns The contract ID of the added token
 */
export const addSorobanToken = async (
  wallet: Wallet,
  contractId: string
): Promise<string> => {
  try {
    const result = await wallet.addToken({
      contractId,
      networkPassphrase: wallet.network?.networkPassphrase
    });
    return result.contractId;
  } catch (error) {
    throw new Error(`Failed to add token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Gets the current network information from the wallet
 * @param wallet - The connected wallet instance
 * @returns The network information
 */
export const getCurrentNetwork = async (wallet: Wallet) => {
  try {
    return await wallet.getNetworkDetails();
  } catch (error) {
    throw new Error(`Failed to get network details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Checks if the wallet is connected to a specific network
 * @param wallet - The connected wallet instance
 * @param expectedNetwork - The expected network (e.g., 'TESTNET', 'PUBLIC')
 * @returns True if connected to the expected network
 */
export const isConnectedToNetwork = (wallet: Wallet, expectedNetwork: string): boolean => {
  return wallet.network?.network === expectedNetwork;
};

/**
 * Formats a Stellar address for display
 * @param address - The Stellar address
 * @param prefixLength - Number of characters to show at the beginning
 * @param suffixLength - Number of characters to show at the end
 * @returns Formatted address string
 */
export const formatStellarAddress = (
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string => {
  if (address.length <= prefixLength + suffixLength + 3) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Validates a Stellar address format
 * @param address - The address to validate
 * @returns True if the address format is valid
 */
export const isValidStellarAddress = (address: string): boolean => {
  // Basic Stellar address validation (starts with G, A, or C and is 56 characters)
  const stellarAddressRegex = /^[GAC][A-Z2-7]{55}$/;
  return stellarAddressRegex.test(address);
};

/**
 * Validates a Soroban contract ID format
 * @param contractId - The contract ID to validate
 * @returns True if the contract ID format is valid
 */
export const isValidSorobanContractId = (contractId: string): boolean => {
  // Basic Soroban contract ID validation (starts with C and is 56 characters)
  const sorobanContractRegex = /^C[A-Z2-7]{55}$/;
  return sorobanContractRegex.test(contractId);
};
