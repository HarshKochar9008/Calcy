// Stellar Network Configuration
export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org';
export const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || '';

// XLM Asset (native token)
export const XLM_ASSET = {
  type: 'native',
  code: 'XLM',
  issuer: ''
};

// Default scholarship pool settings (in stroops - 1 XLM = 10,000,000 stroops)
export const DEFAULT_TOTAL_GOAL_STROOPS = 500_000_000; // 50 XLM
export const DEFAULT_MAX_SCHOLARSHIP_STROOPS = 50_000_000; // 5 XLM
export const DEFAULT_MIN_SCHOLARSHIP_STROOPS = 10_000_000; // 1 XLM
export const DEFAULT_DONATION_STROOPS = 10_000_000; // 1 XLM

// Academic levels
export const ACADEMIC_LEVELS = [
  'High School',
  'Undergraduate',
  'Graduate',
  'PhD',
  'Professional Certification'
];

// Fields of study
export const FIELDS_OF_STUDY = [
  'Computer Science',
  'Engineering',
  'Medicine',
  'Business',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Education',
  'Law',
  'Other'
];

// Conversion helpers
export const STROOPS_TO_XLM = (stroops: number) => stroops / 10_000_000;
export const XLM_TO_STROOPS = (xlm: number) => Math.floor(xlm * 10_000_000);

// Time helpers
export const DAY_IN_SECONDS = 24 * 60 * 60;
export const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
export const MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS;
