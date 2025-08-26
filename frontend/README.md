# EduChain Scholarships - Testnet Version

A simplified blockchain scholarship platform built on Stellar testnet using Soroban smart contracts.

## 🚀 Quick Start

### Prerequisites
1. **Freighter Wallet Extension** - Install from [freighter.app](https://freighter.app)
2. **Testnet XLM** - Get from [Stellar Testnet Faucet](https://laboratory.stellar.org/#account-creator?network=testnet)

### Setup
1. **Switch to Testnet** in Freighter wallet
2. **Connect Wallet** to the application
3. **Create Pool** - Initialize your first scholarship pool
4. **Start Donating** - Contribute XLM to the pool
5. **Apply for Scholarships** - Students can submit applications

## 🎯 Features

- **Simple Pool Creation** - Create scholarship pools with basic parameters
- **Direct Donations** - Donate XLM directly to pools
- **Student Applications** - Submit scholarship applications
- **Pool Management** - Approve and distribute scholarships
- **Testnet Ready** - All transactions happen on Stellar testnet

## 🔧 Configuration

The application is pre-configured for Stellar testnet:
- **Network**: Test SDF Network
- **RPC Endpoint**: soroban-testnet.stellar.org
- **Contract ID**: Pre-deployed on testnet

## 📱 Usage

### Creating a Pool
1. Connect your Freighter wallet
2. Click "Create Pool" 
3. Pool will be initialized with default settings:
   - Total Goal: 50 XLM
   - Max Scholarship: 5 XLM
   - Min Scholarship: 1 XLM
   - Application Deadline: 30 days
   - Distribution Deadline: 31 days

### Making Donations
1. Enter amount in XLM
2. Click "Donate"
3. Confirm transaction in Freighter
4. Pool balance updates automatically

### Applying for Scholarships
1. Fill out application form
2. Submit application
3. Wait for pool creator approval
4. Receive scholarship if approved

## 🛠️ Development

### Project Structure
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks
│   ├── contracts/     # Generated contract bindings
│   └── utils/         # Constants and utilities
```

### Key Files
- `useContract.ts` - Smart contract interactions
- `contracts.ts` - Contract configuration
- `App.tsx` - Main application component

### Building
```bash
npm install
npm run build
npm run dev
```

## 🔗 Links

- [Stellar Testnet](https://laboratory.stellar.org/#?network=testnet)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Wallet](https://freighter.app)

## 📝 Notes

- This is a testnet version for development and testing
- All transactions use testnet XLM (no real value)
- Smart contracts are pre-deployed on testnet
- Simplified error handling and user experience

## 🆘 Support

For issues or questions:
- Check browser console for error messages
- Ensure Freighter is on testnet
- Verify wallet has testnet XLM balance
- Check network connectivity to testnet
