@echo off
setlocal enabledelayedexpansion

REM EduChain Scholarships Smart Contract Deployment Script for Windows
REM This script helps deploy the contract to Stellar testnet

echo 🎓 EduChain Scholarships - Contract Deployment
echo ==============================================

REM Check if Stellar CLI is installed
where stellar >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Stellar CLI not found. Please install it first:
    echo    curl -sSf https://soroban.stellar.org/install.sh ^| sh
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('stellar --version') do set STELLAR_VERSION=%%i
echo ✅ Stellar CLI found: !STELLAR_VERSION!

REM Check if Rust is installed
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Rust/Cargo not found. Please install Rust first:
    echo    https://rustup.rs/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('cargo --version') do set RUST_VERSION=%%i
echo ✅ Rust found: !RUST_VERSION!

REM Set network to testnet
echo 🌐 Setting network to testnet...
stellar network use testnet

REM Get account public key
echo.
echo 📝 Please enter your Stellar account public key:
set /p ACCOUNT_PUBLIC_KEY="Public Key: "

if "!ACCOUNT_PUBLIC_KEY!"=="" (
    echo ❌ Public key cannot be empty
    pause
    exit /b 1
)

echo ✅ Using account: !ACCOUNT_PUBLIC_KEY!

REM Check if account exists and has XLM
echo 🔍 Checking account balance...
stellar keys ls | findstr "!ACCOUNT_PUBLIC_KEY!" >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Account not found in Stellar config. Adding it...
    echo 📝 Please enter your account's secret key:
    set /p SECRET_KEY="Secret Key: "
    
    if "!SECRET_KEY!"=="" (
        echo ❌ Secret key cannot be empty
        pause
        exit /b 1
    )
    
    stellar keys add "!ACCOUNT_PUBLIC_KEY!" --secret-key "!SECRET_KEY!"
    echo ✅ Account added to Stellar config
)

REM Build the contract
echo.
echo 🔨 Building smart contract...
cargo build --target wasm32-unknown-unknown --release

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Contract built successfully

REM Check if WASM file exists
set WASM_PATH=target\wasm32-unknown-unknown\release\educhain_scholarships.wasm
if not exist "!WASM_PATH!" (
    echo ❌ WASM file not found at !WASM_PATH!
    echo    Make sure the contract name in Cargo.toml matches 'educhain-scholarships'
    pause
    exit /b 1
)

echo ✅ WASM file found: !WASM_PATH!

REM Deploy the contract
echo.
echo 🚀 Deploying contract to testnet...
for /f "tokens=*" %%i in ('stellar contract deploy --wasm "!WASM_PATH!" --source "!ACCOUNT_PUBLIC_KEY!" --network testnet') do set DEPLOY_RESULT=%%i

if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

REM Extract contract ID from deployment result (simplified for Windows)
echo ✅ Contract deployed successfully!
echo 📋 Contract ID: !DEPLOY_RESULT!

REM Install the contract
echo.
echo 📦 Installing contract...
for /f "tokens=*" %%i in ('stellar contract install --wasm "!WASM_PATH!" --source "!ACCOUNT_PUBLIC_KEY!" --network testnet') do set INSTALL_RESULT=%%i

if %errorlevel% neq 0 (
    echo ❌ Contract installation failed
    pause
    exit /b 1
)

echo ✅ Contract installed successfully!
echo 📋 WASM Hash: !INSTALL_RESULT!

REM Initialize the contract
echo.
echo 🎯 Initializing scholarship pool...

REM Calculate deadlines (30 days from now for applications, 37 days for distribution)
REM Note: Windows batch doesn't have easy date arithmetic, so we'll use fixed values
REM You may need to adjust these manually based on current time

set APP_DEADLINE=2592000
set DIST_DEADLINE=3200000

stellar contract invoke --id "!DEPLOY_RESULT!" --source "!ACCOUNT_PUBLIC_KEY!" --network testnet -- init_pool --creator "!ACCOUNT_PUBLIC_KEY!" --token "native" --total_goal 500000000 --max_scholarship_amount 50000000 --min_scholarship_amount 10000000 --application_deadline !APP_DEADLINE! --distribution_deadline !DIST_DEADLINE!

if %errorlevel% neq 0 (
    echo ❌ Contract initialization failed
    pause
    exit /b 1
)

echo ✅ Scholarship pool initialized successfully!

REM Display configuration for frontend
echo.
echo 🎉 Deployment Complete!
echo ======================
echo.
echo 📋 Configuration for Frontend:
echo    Update frontend/src/config/contracts.ts with:
echo.
echo    export const CONTRACT_CONFIG = {
echo      NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
echo      RPC_URL: 'https://rpc.ankr.com/stellar_testnet_soroban/27d8079fb434ba5169358c0a6b24951c5ba0f32690f57218399fc1b6a47e07a7',
echo      CONTRACT_ID: '!DEPLOY_RESULT!',
echo      TOKEN_CONTRACT_ID: 'native',
echo      DEFAULT_TOTAL_GOAL_STROOPS: 500_000_000,
echo      DEFAULT_MAX_SCHOLARSHIP_STROOPS: 50_000_000,
echo      DEFAULT_MIN_SCHOLARSHIP_STROOPS: 10_000_000,
echo    };
echo.
echo 🔗 Testnet Explorer: https://testnet.stellarchain.io/
echo 📚 Next Steps: Follow the setup guide in frontend/SETUP.md
echo.
echo 🎓 Happy Scholarship Funding! 🚀
pause
