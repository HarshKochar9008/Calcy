import { useEffect } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { ScholarshipPoolDetails } from './components/ScholarshipPoolDetails';
import { DonationForm } from './components/DonationForm';
import { ApplicationForm } from './components/ApplicationForm';
import { ProgressBar } from './components/ProgressBar';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import './App.css';

function App() {
  const { wallet, isConnected, connectionError, isFreighterDetected, connect, disconnect } = useWallet();
  const { 
    pool, 
    userDonation, 
    isLoading, 
    error,
    initializePool,
    donate,
    applyForScholarship,
    refreshPool 
  } = useContract(wallet);

  useEffect(() => {
    if (isConnected && wallet) {
      refreshPool();
    }
  }, [isConnected, wallet]);

  return (
    <div className="app">
      {/* Header with Navigation */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">EduChain Scholarships</span>
          </div>
        </div>
        
        <nav className="header-nav">
          <a href="#" className="nav-item active">
            <span className="nav-icon">🏠</span>
            Dashboard
          </a>
          <a href="#" className="nav-item active">
            <span className="nav-icon">🎯</span>
            Scholarships
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📊</span>
            Analytics
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">👥</span>
            Students
          </a>
        </nav>

        <div className="header-right">
          <WalletConnect 
            isConnected={isConnected}
            onConnect={connect}
            onDisconnect={disconnect}
          />
        </div>
      </header>

      <main className="app-main">
        {!isConnected ? (
          <div className="connect-prompt">
            <h2>Connect Your Wallet</h2>
            <p>Connect your Freighter wallet to start using EduChain Scholarships</p>
            
            {connectionError && (
              <div className="connection-error">
                <p className="error-text">⚠️ {connectionError}</p>
                <div className="error-help">
                  <h4>Troubleshooting Steps:</h4>
                  <ol>
                    <li>Make sure Freighter extension is installed and unlocked</li>
                    <li>Switch to <strong>Testnet</strong> in Freighter (not Public/Mainnet)</li>
                    <li>Refresh this page after unlocking Freighter</li>
                    <li>Check browser console for detailed error messages</li>
                  </ol>
                </div>
              </div>
            )}
            
            <button 
              className="connect-button"
              onClick={connect}
              disabled={isFreighterDetected === false}
            >
              {isFreighterDetected === false ? 'Freighter Not Found' : 'Connect Wallet'}
            </button>
            
            <div className="wallet-status-info">
              <p><strong>Current Status:</strong></p>
              <ul>
                <li>Freighter Extension: {isFreighterDetected === null ? '🔄 Checking...' : isFreighterDetected ? '✅ Detected' : '❌ Not Found'}</li>
                <li>Wallet Connection: {isConnected ? '✅ Connected' : '❌ Disconnected'}</li>
                {wallet && <li>Public Key: {wallet.publicKey.substring(0, 8)}...{wallet.publicKey.substring(wallet.publicKey.length - 8)}</li>}
              </ul>
            </div>
          </div>
        ) : (
          <div className="main-content">
            {/* Main Title Section */}
            <div className="title-section">
              <h1>Scholarship Pool Manager</h1>
              <p className="title-description">
                Create and manage scholarship pools, accept donations, and distribute funds to deserving students based on merit and need.
              </p>
            </div>

            {/* Two Panel Layout */}
            <div className="panels-container">
              {/* Left Panel - Configuration */}
              <div className="left-panel">
                <div className="panel-header">
                  <span className="panel-icon">⚙️</span>
                  <h3>Pool Configuration</h3>
                </div>
                
                {pool ? (
                  <div className="pool-actions">
                    <DonationForm 
                      onDonate={donate}
                      isLoading={isLoading}
                      userDonation={userDonation}
                      pool={pool}
                    />
                    
                    <ApplicationForm 
                      onApply={applyForScholarship}
                      isLoading={isLoading}
                      pool={pool}
                    />
                  </div>
                ) : (
                  <div className="create-pool-section">
                    <p>Set up a new scholarship pool to help students achieve their educational dreams</p>
                    <button 
                      className="init-button"
                      onClick={initializePool}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Scholarship Pool'}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    Error: {error}
                  </div>
                )}
              </div>

              {/* Right Panel - Information */}
              <div className="right-panel">
                {pool ? (
                  <>
                    <div className="panel-header">
                      <span className="panel-icon">📊</span>
                      <h3>Pool Overview</h3>
                    </div>
                    
                    <ScholarshipPoolDetails pool={pool} />
                    <ProgressBar current={pool.current_balance} goal={pool.total_goal} />
                  </>
                ) : (
                  <>
                    <div className="panel-header">
                      <span className="panel-icon">📚</span>
                      <h3>What Gets Funded</h3>
                    </div>
                    
                    <div className="info-content">
                      <h4>Scholarship Types</h4>
                      <ul>
                        <li>Academic Merit Scholarships</li>
                        <li>Financial Need Grants</li>
                        <li>Field-Specific Awards</li>
                        <li>Graduate Research Funding</li>
                        <li>Professional Development</li>
                        <li>International Student Support</li>
                      </ul>
                      
                      <h4>Pro Tips</h4>
                      <ul>
                        <li>Set realistic funding goals for better donor engagement</li>
                        <li>Clear deadlines help students plan their applications</li>
                        <li>Merit-based scoring ensures fair distribution</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
