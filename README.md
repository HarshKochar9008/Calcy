# 🎓 EduChain Scholarships

A hackathon-ready MVP dApp on Stellar using Soroban smart contracts (Rust) and a React frontend with Soroban SDK + Freighter wallet.

## �� Current Status

**🎉 The application is now working in MVP Demo Mode!** 

- ✅ Smart contract written in Rust for Soroban
- ✅ Frontend React application with TypeScript
- ✅ Freighter wallet integration
- ✅ Generated contract bindings
- ✅ **MVP Demo Mode** - Fully functional without blockchain deployment
- ⚠️ **Blockchain integration requires contract deployment and configuration**

**🚀 You can now test all features immediately using the MVP Demo Mode!**

## 🎯 Concept

**EduChain Scholarships** - A microfinance tool on Stellar for crowdfunding education where:
- **Donors** contribute XLM to scholarship pools
- **Students** apply for scholarships with academic credentials
- **Smart contracts** automatically distribute funds based on merit and need
- **Transparent** and **direct** support system for education
- **Automated** scholarship distribution with predefined criteria

## 🚀 MVP Demo Mode - How to Use

The application is now running in **MVP Demo Mode**, which means you can test all features immediately without deploying smart contracts or dealing with network issues.

### 🎮 **Quick Start (No Setup Required!)**

1. **Clone and Run**:
   ```bash
   git clone <your-repo>
   cd frontend
   npm install
   npm run dev
   ```

2. **Connect Wallet**: 
   - Install [Freighter Wallet](https://www.freighter.app/)
   - Click "Connect Wallet" in the app
   - **Any network works** (Testnet/Mainnet/Standalone)

3. **Start Using**:
   - **Create Pool**: Click "Create Pool" - works instantly!
   - **Make Donations**: Add funds to the pool (simulated)
   - **Submit Applications**: Students can apply for scholarships
   - **Manage Pool**: Approve and distribute scholarships

### 🎯 **MVP Features Available**

| Feature | Status | Description |
|---------|--------|-------------|
| **Pool Creation** | ✅ Working | Instantly create scholarship pools |
| **Donations** | ✅ Working | Accept and track donations |
| **Applications** | ✅ Working | Submit scholarship applications |
| **Pool Management** | ✅ Working | Approve and distribute scholarships |
| **Real-time Updates** | ✅ Working | UI updates immediately |
| **Progress Tracking** | ✅ Working | Visual progress bars and stats |

### 🔧 **What Happens in MVP Mode**

- **No Blockchain Transactions**: All actions are simulated locally
- **Instant Results**: No waiting for network confirmations
- **Full Functionality**: Test the complete user experience
- **Data Persistence**: Changes persist during your session
- **Realistic Simulation**: Uses actual contract data structures

### 📱 **User Experience**

1. **Pool Creators**: 
   - Create pools with funding goals
   - Set application and distribution deadlines
   - Manage the entire scholarship process

2. **Donors**: 
   - View pool progress and goals
   - Make donations of any amount
   - Track impact in real-time

3. **Students**: 
   - Browse available scholarships
   - Submit detailed applications
   - Include academic credentials and essays

## 🏗️ Architecture

- **Smart Contract**: Rust + Soroban SDK
- **Frontend**: React + Vite + TypeScript
- **Wallet**: Freighter integration
- **Network**: Stellar Testnet (when deployed)
- **Storage**: IPFS for essay storage (essay hashes)
- **MVP Mode**: Local simulation for immediate testing

## 📁 Project Structure

```
Calcy/
├── contracts/
│   └── savings_pot/                    # Smart contract directory
│       ├── src/
│       │   ├── lib.rs                  # Smart contract implementation
│       │   └── test.rs                 # Contract tests
│       ├── target/                     # Build artifacts
│       └── Cargo.toml                  # Rust dependencies
├── frontend/
│   ├── src/
│   │   ├── components/                 # React components
│   │   ├── hooks/                      # Custom React hooks (includes MVP mode)
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── utils/                      # Utility functions
│   │   ├── config/                     # Contract configuration
│   │   ├── contracts/                  # Generated contract bindings
│   │   └── App.tsx                     # Main application
│   ├── package.json                    # Frontend dependencies
│   ├── SETUP.md                        # Complete setup guide
│   └── env.example                     # Environment variables template
└── README.md                           # This file
```

## 🚀 Quick Start

### Option 1: MVP Demo Mode (Recommended for Testing)

```bash
cd frontend
npm install
npm run dev
```

**That's it!** The app will work immediately in demo mode.

### Option 2: Full Blockchain Integration

If you want to deploy the actual smart contracts:

#### Prerequisites

1. **Install Rust** (https://rustup.rs/)
2. **Install Soroban CLI** (https://soroban.stellar.org/docs/getting-started/setup)
3. **Install Node.js** (v18+)
4. **Install Freighter Wallet** (https://www.freighter.app/)

#### 1. Smart Contract Setup

```bash
cd contracts/savings_pot

# Build the contract
soroban contract build

# Run tests
cargo test

# Deploy to testnet (see SETUP.md for detailed steps)
soroban contract deploy --network testnet --source <YOUR_SECRET_KEY> target/wasm32-unknown-unknown/educhain_scholarships.wasm
```

#### 2. Frontend Configuration

```bash
cd frontend

# Install dependencies
npm install

# Configure contracts (see SETUP.md for detailed steps)
# Update frontend/src/config/contracts.ts with your contract IDs

# Start development server
npm run dev
```

#### 3. Configuration

**Important**: After deploying your smart contract, update the configuration in `frontend/src/config/contracts.ts`:

```typescript
export const CONTRACT_CONFIG = {
  CONTRACT_ID: 'YOUR_DEPLOYED_CONTRACT_ID_HERE',
  TOKEN_CONTRACT_ID: 'native', // Use 'native' for XLM on testnet
  // ... other settings
};
```

**For complete setup instructions, see [SETUP.md](frontend/SETUP.md)**

## 🔧 Smart Contract Functions

### Core Functions

- `init_pool(creator, token, total_goal, max_scholarship, min_scholarship, app_deadline, dist_deadline)` - Create scholarship pool
- `donate(from, amount)` - Donate XLM to scholarship pool
- `apply_for_scholarship(student, name, level, field, gpa, need_score, essay_hash)` - Student application
- `approve_scholarships(creator)` - Approve applications (creator only)
- `distribute_scholarships(creator)` - Distribute funds to approved students
- `get_pool() -> ScholarshipPool` - Get pool state
- `get_application(student) -> StudentApplication` - Get student application
- `get_pool_stats() -> (u32, u32, u32)` - Get statistics

### Contract State

```rust
pub struct ScholarshipPool {
    pub creator: Address,              // Pool creator/organization
    pub token: Address,                // XLM token address
    pub total_goal: i128,              // Total funding goal
    pub current_balance: i128,         // Current raised amount
    pub is_active: bool,               // Whether pool accepts donations
    pub max_scholarship_amount: i128,  // Maximum per scholarship
    pub min_scholarship_amount: i128,  // Minimum per scholarship
    pub application_deadline: u64,     // Application deadline
    pub distribution_deadline: u64,    // Distribution date
}

pub struct StudentApplication {
    pub student_address: Address,      // Student wallet address
    pub name: String,                  // Student name
    pub academic_level: String,        // Academic level
    pub field_of_study: String,        // Field of study
    pub gpa: i128,                     // GPA * 100
    pub financial_need_score: i128,    // 1-100 scale
    pub essay_hash: String,            // IPFS essay hash
    pub is_approved: bool,             // Approval status
    pub scholarship_amount: i128,      // Awarded amount
    pub application_timestamp: u64,    // Application time
}
```

## 🎨 Frontend Features

- **Wallet Connection**: Freighter wallet integration
- **Pool Management**: View scholarship pool details and progress
- **Donations**: Easy donation interface with quick amount buttons
- **Applications**: Student scholarship application forms
- **Real-time Updates**: Live progress tracking and status updates
- **Responsive Design**: Mobile-friendly interface
- **Academic Fields**: Predefined academic levels and fields of study
- **MVP Demo Mode**: Fully functional without blockchain deployment

## 🧪 Testing

### MVP Demo Testing

**No setup required!** Just run the frontend and test all features:

```bash
cd frontend
npm run dev
```

### Smart Contract Tests

```bash
cd contracts/savings_pot
cargo test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📱 Usage

### 🎮 **MVP Demo Mode Usage**

#### For Donors:
1. **Connect Wallet**: Click "Connect Wallet" and approve in Freighter
2. **View Pool**: See current funding goal and progress
3. **Make Donation**: Use the donation form to contribute XLM
4. **Track Impact**: Monitor how your donation helps students

#### For Students:
1. **Connect Wallet**: Connect your Freighter wallet
2. **View Pool**: Check if applications are open
3. **Apply**: Fill out the scholarship application form
4. **Submit**: Include your academic credentials and essay
5. **Wait**: Applications are reviewed after deadline

#### For Pool Creators:
1. **Initialize Pool**: Set funding goals and deadlines
2. **Monitor Applications**: Track student applications
3. **Approve Scholarships**: Review and approve applications
4. **Distribute Funds**: Automatically distribute scholarships

### 🔗 **Full Blockchain Mode Usage**

When you deploy the actual smart contracts, the same interface will work with real blockchain transactions.

## 🔒 Security Features

- **Creator-only functions**: Only pool creators can approve and distribute
- **Deadline enforcement**: Applications and distributions respect deadlines
- **Merit-based scoring**: Automated scholarship distribution based on GPA + need
- **Secure transfers**: Token transfers via Soroban Token SDK
- **Individual tracking**: Separate donor and student records

## 🌐 Network Configuration

- **Testnet**: `Test SDF Network ; September 2015`
- **RPC URL**: `https://soroban-testnet.stellar.org`
- **Asset**: Native XLM (XLM)
- **MVP Mode**: Works offline and with any network

## 🚧 Development Notes

- **Contract bindings are generated** and ready to use
- **Frontend is fully integrated** with the smart contract
- **MVP Demo Mode** provides immediate functionality for testing
- **Real contract integration** requires deployment and configuration
- **Error handling** is implemented for production use
- **IPFS integration** can be added for essay storage

## 🎯 **MVP vs Production**

| Feature | MVP Mode | Production Mode |
|---------|----------|-----------------|
| **Setup Time** | 2 minutes | 30+ minutes |
| **Network Required** | No | Yes (Stellar testnet) |
| **Data Persistence** | Session only | Permanent on blockchain |
| **Transaction Speed** | Instant | 3-5 seconds |
| **Real XLM** | No | Yes |
| **Testing** | Full functionality | Full functionality |

## 📚 Resources

- [Soroban Documentation](https://soroban.stellar.org/)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Testnet](https://laboratory.stellar.org/)
- [IPFS Documentation](https://docs.ipfs.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

## 🚀 **Getting Started Right Now**

**Want to test immediately?** 

1. **Clone the repo**
2. **Run `npm install` and `npm run dev`**
3. **Connect your Freighter wallet**
4. **Start creating scholarship pools!**

**Want to deploy to blockchain?**

1. **Follow the [Setup Guide](frontend/SETUP.md)**
2. **Deploy your smart contracts**
3. **Update configuration**
4. **Switch from MVP to production mode**

**Empowering Education Through Blockchain! 🎓🚀**
