#!/bin/bash

# EduChain Scholarships Smart Contract Deployment Script
# This script helps deploy the contract to Stellar testnet

set -e

echo "🎓 EduChain Scholarships - Contract Deployment"
echo "=============================================="

# Check if Stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo "❌ Stellar CLI not found. Please install it first:"
    echo "   curl -sSf https://soroban.stellar.org/install.sh | sh"
    exit 1
fi

echo "✅ Stellar CLI found: $(stellar --version)"

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo not found. Please install Rust first:"
    echo "   https://rustup.rs/"
    exit 1
fi

echo "✅ Rust found: $(cargo --version)"

# Set network to testnet
echo "🌐 Setting network to testnet..."
stellar network use testnet

# Get account public key
echo ""
echo "📝 Please enter your Stellar account public key:"
read -p "Public Key: " ACCOUNT_PUBLIC_KEY

if [ -z "$ACCOUNT_PUBLIC_KEY" ]; then
    echo "❌ Public key cannot be empty"
    exit 1
fi

echo "✅ Using account: $ACCOUNT_PUBLIC_KEY"

# Check if account exists and has XLM
echo "🔍 Checking account balance..."
ACCOUNT_INFO=$(stellar keys ls | grep "$ACCOUNT_PUBLIC_KEY" || true)

if [ -z "$ACCOUNT_INFO" ]; then
    echo "⚠️  Account not found in Stellar config. Adding it..."
    echo "📝 Please enter your account's secret key:"
    read -s -p "Secret Key: " SECRET_KEY
    echo ""
    
    if [ -z "$SECRET_KEY" ]; then
        echo "❌ Secret key cannot be empty"
        exit 1
    fi
    
    stellar keys add "$ACCOUNT_PUBLIC_KEY" --secret-key "$SECRET_KEY"
    echo "✅ Account added to Stellar config"
fi

# Build the contract
echo ""
echo "🔨 Building smart contract..."
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Contract built successfully"

# Check if WASM file exists
WASM_PATH="target/wasm32-unknown-unknown/release/educhain_scholarships.wasm"
if [ ! -f "$WASM_PATH" ]; then
    echo "❌ WASM file not found at $WASM_PATH"
    echo "   Make sure the contract name in Cargo.toml matches 'educhain-scholarships'"
    exit 1
fi

echo "✅ WASM file found: $WASM_PATH"

# Deploy the contract
echo ""
echo "🚀 Deploying contract to testnet..."
DEPLOY_RESULT=$(stellar contract deploy \
    --wasm "$WASM_PATH" \
    --source "$ACCOUNT_PUBLIC_KEY" \
    --network testnet)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

# Extract contract ID from deployment result
CONTRACT_ID=$(echo "$DEPLOY_RESULT" | grep -o '[A-Z0-9]{56}' | head -1)

if [ -z "$CONTRACT_ID" ]; then
    echo "❌ Could not extract contract ID from deployment result"
    echo "Deployment result: $DEPLOY_RESULT"
    exit 1
fi

echo "✅ Contract deployed successfully!"
echo "📋 Contract ID: $CONTRACT_ID"

# Install the contract
echo ""
echo "📦 Installing contract..."
INSTALL_RESULT=$(stellar contract install \
    --wasm "$WASM_PATH" \
    --source "$ACCOUNT_PUBLIC_KEY" \
    --network testnet)

if [ $? -ne 0 ]; then
    echo "❌ Contract installation failed"
    exit 1
fi

# Extract WASM hash from install result
WASM_HASH=$(echo "$INSTALL_RESULT" | grep -o '[A-Z0-9]{64}' | head -1)

if [ -z "$WASM_HASH" ]; then
    echo "❌ Could not extract WASM hash from install result"
    echo "Install result: $INSTALL_RESULT"
    exit 1
fi

echo "✅ Contract installed successfully!"
echo "📋 WASM Hash: $WASM_HASH"

# Initialize the contract
echo ""
echo "🎯 Initializing scholarship pool..."

# Calculate deadlines (30 days from now for applications, 37 days for distribution)
CURRENT_TIME=$(date +%s)
APP_DEADLINE=$((CURRENT_TIME + 2592000))  # 30 days
DIST_DEADLINE=$((CURRENT_TIME + 2592000 + 604800))  # 37 days

INIT_RESULT=$(stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source "$ACCOUNT_PUBLIC_KEY" \
    --network testnet \
    -- \
    init_pool \
    --creator "$ACCOUNT_PUBLIC_KEY" \
    --token "native" \
    --total_goal 500000000 \
    --max_scholarship_amount 50000000 \
    --min_scholarship_amount 10000000 \
    --application_deadline "$APP_DEADLINE" \
    --distribution_deadline "$DIST_DEADLINE")

if [ $? -ne 0 ]; then
    echo "❌ Contract initialization failed"
    exit 1
fi
echo "✅ Scholarship pool initialized successfully!"

# Display configuration for frontend
echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "📋 Configuration for Frontend:"
echo "   Update frontend/src/config/contracts.ts with:"
echo ""
echo "   export const CONTRACT_CONFIG = {"
echo "     NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',"
echo "     RPC_URL: 'https://rpc.ankr.com/stellar_testnet_soroban/27d8079fb434ba5169358c0a6b24951c5ba0f32690f57218399fc1b6a47e07a7',"
echo "     CONTRACT_ID: '$CONTRACT_ID',"
echo "     TOKEN_CONTRACT_ID: 'native',"
echo "     DEFAULT_TOTAL_GOAL_STROOPS: 500_000_000,"
echo "     DEFAULT_MAX_SCHOLARSHIP_STROOPS: 50_000_000,"
echo "     DEFAULT_MIN_SCHOLARSHIP_STROOPS: 10_000_000,"
echo "   };"
echo ""
echo "🔗 Testnet Explorer: https://testnet.stellarchain.io/"
echo "📚 Next Steps: Follow the setup guide in frontend/SETUP.md"
echo ""
echo "🎓 Happy Scholarship Funding! 🚀"

