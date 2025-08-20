# 🎓 EduChain Scholarships

A hackathon-ready MVP dApp on Stellar using Soroban smart contracts (Rust) and a React frontend with Soroban SDK + Freighter wallet.

## 🎯 Concept

**EduChain Scholarships** - A microfinance tool on Stellar for crowdfunding education where:
- **Donors** contribute XLM to scholarship pools
- **Students** apply for scholarships with academic credentials
- **Smart contracts** automatically distribute funds based on merit and need
- **Transparent** and **direct** support system for education
- **Automated** scholarship distribution with predefined criteria

## 🏗️ Architecture

- **Smart Contract**: Rust + Soroban SDK
- **Frontend**: React + Vite + TypeScript
- **Wallet**: Freighter integration
- **Network**: Stellar Testnet
- **Storage**: IPFS for essay storage (essay hashes)

## 📁 Project Structure

```
Calcy/
├── contracts/
│   └── educhain-scholarships/
│       ├── src/
│       │   ├── lib.rs          # Smart contract implementation
│       │   └── test.rs         # Contract tests
│       └── Cargo.toml          # Rust dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   └── App.tsx             # Main application
│   ├── package.json            # Frontend dependencies
│   └── env.example             # Environment variables template
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Install Rust** (https://rustup.rs/)
2. **Install Stellar CLI** (https://soroban.stellar.org/docs/getting-started/setup)
3. **Install Node.js** (v18+)
4. **Install Freighter Wallet** (https://www.freighter.app/)

### 1. Smart Contract Setup

```bash
cd contracts/educhain-scholarships

# Build the contract
stellar contract build

# Run tests
cargo test

# Deploy to testnet (after building)
stellar contract deploy --network testnet --source <YOUR_SECRET_KEY> target/wasm32-unknown-unknown/release/educhain-scholarships.wasm
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local

# Edit .env.local with your contract ID
# VITE_CONTRACT_ID=<YOUR_DEPLOYED_CONTRACT_ID>

# Start development server
npm run dev
```

### 3. Environment Configuration

Create `.env.local` in the frontend directory:

```env
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_RPC_URL=https://soroban-testnet.stellar.org
VITE_CONTRACT_ID=<YOUR_CONTRACT_ID>
```

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

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts/educhain-scholarships
cargo test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📱 Usage

### For Donors:
1. **Connect Wallet**: Click "Connect Wallet" and approve in Freighter
2. **View Pool**: See current funding goal and progress
3. **Make Donation**: Use the donation form to contribute XLM
4. **Track Impact**: Monitor how your donation helps students

### For Students:
1. **Connect Wallet**: Connect your Freighter wallet
2. **View Pool**: Check if applications are open
3. **Apply**: Fill out the scholarship application form
4. **Submit**: Include your academic credentials and essay
5. **Wait**: Applications are reviewed after deadline

### For Pool Creators:
1. **Initialize Pool**: Set funding goals and deadlines
2. **Monitor Applications**: Track student applications
3. **Approve Scholarships**: Review and approve applications
4. **Distribute Funds**: Automatically distribute scholarships

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

## 🚧 Development Notes

- The frontend currently uses mock data for demonstration
- Real contract integration requires proper Soroban TypeScript bindings
- Generate bindings with: `stellar contract bindings typescript`
- Implement proper error handling for production use
- Add IPFS integration for essay storage

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

**Empowering Education Through Blockchain! 🎓🚀**
