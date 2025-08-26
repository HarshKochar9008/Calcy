export interface ScholarshipPool {
  creator: string;
  token: string;
  total_goal: number;
  current_balance: number;
  is_active: boolean;
  max_scholarship_amount: number;
  min_scholarship_amount: number;
  application_deadline: number;
  distribution_deadline: number;
}

export interface StudentApplication {
  student_address: string;
  name: string;
  academic_level: string;
  field_of_study: string;
  gpa: number;
  financial_need_score: number;
  essay_hash: string;
  is_approved: boolean;
  scholarship_amount: number;
  application_timestamp: number;
}

export interface Donor {
  address: string;
  total_contributed: number;
  contribution_count: number;
}

export interface NetworkInfo {
  network: string;
  networkPassphrase: string;
  networkUrl?: string;
  horizonRpcUrl?: string;
}

export interface Wallet {
  publicKey: string;
  isConnected: boolean;
  network: NetworkInfo | null;
  signTransaction: (xdr: string, opts?: { network?: string; networkPassphrase?: string; address?: string }) => Promise<{ signedTxXdr: string; signerAddress: string }>;
  signAuthEntry: (authEntryXdr: string, opts: { address: string }) => Promise<{ signedAuthEntry: Uint8Array | null; signerAddress: string }>;
  signMessage: (message: string, opts: { address: string }) => Promise<{ signedMessage: string | Uint8Array | null; signerAddress: string }>;
  addToken: (params: { contractId: string; networkPassphrase?: string }) => Promise<{ contractId: string }>;
  getNetwork: () => Promise<NetworkInfo>;
  getNetworkDetails: () => Promise<NetworkInfo>;
}

export interface ContractError {
  message: string;
  code?: string;
}

export interface PoolStats {
  total_applications: number;
  approved_applications: number;
  total_donors: number;
}
