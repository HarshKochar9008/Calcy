# EduChain Scholarships Frontend

A React-based frontend for managing scholarship pools on the Stellar blockchain using Soroban smart contracts.

## Features

- **Wallet Integration**: Full integration with Freighter wallet using the modern `@stellar/freighter-api`
- **Scholarship Pool Management**: Create and manage scholarship pools
- **Donation System**: Accept donations from users
- **Application System**: Students can apply for scholarships
- **Real-time Updates**: Live wallet and network monitoring

## Freighter API Integration

This project now uses the modern `@stellar/freighter-api` package instead of the legacy `window.freighter` approach. Here's what's available:

### Core Wallet Functions

- **Connection Management**: `isConnected()`, `isAllowed()`, `setAllowed()`, `requestAccess()`
- **Address Retrieval**: `getAddress()` for lightweight access, `requestAccess()` for full authorization
- **Network Detection**: `getNetwork()`, `getNetworkDetails()` for network information
- **Transaction Signing**: `signTransaction()` with network validation
- **Message Signing**: `signMessage()` for signing arbitrary text
- **Authorization Signing**: `signAuthEntry()` for Soroban contract interactions
- **Token Management**: `addToken()` for adding Soroban tokens to wallet
- **Wallet Watching**: `WatchWalletChanges` for real-time wallet state monitoring

### Key Benefits

1. **Modern API**: Uses the latest Freighter API with proper TypeScript support
2. **Network Validation**: Automatically validates transactions against the correct network
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Real-time Updates**: Automatic detection of wallet changes and network switches
5. **Token Support**: Easy integration with Soroban tokens

## Getting Started

### Prerequisites

- Node.js 18+ 
- Freighter wallet extension installed in your browser
- Stellar testnet account with some test XLM

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

### 1. Connect Your Wallet

1. Make sure Freighter is installed and unlocked
2. Switch to **Testnet** network in Freighter (not Public/Mainnet)
3. Click "Connect Wallet" in the app
4. Approve the connection request in Freighter

### 2. Explore Freighter Features

Once connected, you'll see a comprehensive demo section showing:

- **Wallet Information**: Address, network, and connection status
- **Message Signing**: Sign arbitrary messages with your wallet
- **Token Management**: Add Soroban tokens to your wallet
- **Network Details**: View current network configuration

### 3. Manage Scholarship Pools

- Create new scholarship pools
- Accept donations from users
- Review student applications
- Distribute scholarship funds

## API Reference

### Wallet Interface

```typescript
interface Wallet {
  publicKey: string;
  isConnected: boolean;
  network: NetworkInfo | null;
  signTransaction: (xdr: string, opts?: SignOptions) => Promise<SignResult>;
  signAuthEntry: (authEntryXdr: string, opts: { address: string }) => Promise<AuthResult>;
  signMessage: (message: string, opts: { address: string }) => Promise<MessageResult>;
  addToken: (params: { contractId: string; networkPassphrase?: string }) => Promise<TokenResult>;
  getNetwork: () => Promise<NetworkInfo>;
  getNetworkDetails: () => Promise<NetworkInfo>;
}
```

### Utility Functions

The `freighterUtils.ts` file provides helper functions:

- `signTransactionWithFreighter()` - Sign transactions with error handling
- `signMessageWithFreighter()` - Sign messages with error handling
- `addSorobanToken()` - Add tokens to wallet
- `getCurrentNetwork()` - Get network information
- `isConnectedToNetwork()` - Check network connection
- `formatStellarAddress()` - Format addresses for display
- `isValidStellarAddress()` - Validate address format
- `isValidSorobanContractId()` - Validate contract ID format

### Example Usage

```typescript
import { useWallet } from './hooks/useWallet';
import { signMessageWithFreighter } from './utils/freighterUtils';

function MyComponent() {
  const { wallet, isConnected } = useWallet();

  const handleSignMessage = async () => {
    if (!wallet) return;
    
    try {
      const signedMessage = await signMessageWithFreighter(wallet, "Hello World!");
      console.log('Signed message:', signedMessage);
    } catch (error) {
      console.error('Signing failed:', error);
    }
  };

  return (
    <button onClick={handleSignMessage} disabled={!isConnected}>
      Sign Message
    </button>
  );
}
```

## Network Configuration

The app automatically detects your Freighter network configuration:

- **TESTNET**: Recommended for development and testing
- **PUBLIC**: Mainnet (use with caution)
- **FUTURENET**: Future network testing
- **STANDALONE**: Custom network configurations

## Error Handling

The app provides comprehensive error handling:

- **Connection Errors**: Clear messages when wallet connection fails
- **Network Mismatches**: Warnings when transactions don't match current network
- **User Rejections**: Friendly messages when users reject operations
- **Validation Errors**: Input validation with helpful error messages

## Troubleshooting

### Common Issues

1. **"Freighter Not Found"**
   - Make sure Freighter extension is installed
   - Refresh the page after installation

2. **"Wallet Not Connected"**
   - Unlock Freighter in the extension
   - Make sure you're on the correct network (Testnet recommended)

3. **"Network Mismatch"**
   - Switch to Testnet in Freighter settings
   - Refresh the page after changing networks

4. **"User Rejected"**
   - Check Freighter popup for approval requests
   - Make sure to approve the connection

### Debug Mode

Open browser console to see detailed logging:
- Wallet connection status
- Network information
- API call results
- Error details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to:
- **Freighter Wallet**: Check [Freighter documentation](https://docs.freighter.app/)
- **Stellar SDK**: Check [Stellar SDK documentation](https://stellar.github.io/js-stellar-sdk/)
- **Soroban**: Check [Soroban documentation](https://soroban.stellar.org/)
