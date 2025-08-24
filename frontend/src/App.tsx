import { useEffect } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { ScholarshipPoolDetails } from './components/ScholarshipPoolDetails';
import { DonationForm } from './components/DonationForm';
import { ApplicationForm } from './components/ApplicationForm';
import { ProgressBar } from './components/ProgressBar';
import { FreighterDemo } from './components/FreighterDemo';
import { NetworkTest } from './components/NetworkTest';
import { ConfigurationCheck } from './components/ConfigurationCheck';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { useSorobanReact } from '@soroban-react/core';
import './App.css';

function App() {
  const { wallet, isConnected, connectionError, isFreighterDetected, connect, disconnect } = useWallet();
  const { address } = useSorobanReact();
  const { 
    pool, 
    userDonation, 
    isLoading, 
    error,
    initializePool,
    donate,
    applyForScholarship,
    approveScholarships,
    distributeScholarships,
    refreshPool 
  } = useContract(wallet);

  useEffect(() => {
    if (isConnected && wallet && address) {
      refreshPool();
    }
  }, [isConnected, wallet, address, refreshPool]);

  return (
    <div className="app">
      {/* Professional Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="logo">EduChain</div>
            <span className="logo-subtitle">Blockchain Scholarships</span>
          </div>
          
          <div className="navbar-menu">
            <a href="#home" className="nav-link">Home</a>
            <a href="#scholarships" className="nav-link">Scholarships</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          
          <div className="navbar-actions">
            <WalletConnect 
              wallet={wallet}
              isConnected={isConnected}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Revolutionizing Education with
              <span className="hero-highlight"> Blockchain Scholarships</span>
            </h1>
            <p className="hero-description">
              EduChain connects donors directly with students through transparent, 
              decentralized scholarship pools. No intermediaries, just education.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Transparent</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0%</span>
                <span className="stat-label">Fees</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Possibilities</span>
              </div>
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary btn-large">
                Explore Scholarships
              </button>
              <button className="btn btn-secondary btn-large">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-icon">🎓</div>
                <h3>Live Scholarship Pool</h3>
              </div>
              <div className="card-content">
                <div className="pool-info">
                  <div className="info-row">
                    <span>Total Raised</span>
                    <span className="amount">$45,230</span>
                  </div>
                  <div className="info-row">
                    <span>Goal</span>
                    <span className="amount">$100,000</span>
                  </div>
                  <div className="info-row">
                    <span>Students</span>
                    <span className="amount">127</span>
                  </div>
                </div>
                <div className="progress-mini">
                  <div className="progress-bar-mini">
                    <div className="progress-fill-mini" style={{ width: '45%' }}></div>
                  </div>
                  <span className="progress-text-mini">45% Complete</span>
                </div>
                <button className="btn btn-primary btn-full">
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="main">
        {!isConnected ? (
          <div className="connect-section">
            <h1>Connect Wallet</h1>
            <p>Connect your Freighter wallet to access EduChain Scholarships</p>
            
            {connectionError && (
              <div className="error-box">
                <p>{connectionError}</p>
                <div className="error-help">
                  <h4>Troubleshooting</h4>
                  <ul>
                    <li>Ensure Freighter extension is installed and unlocked</li>
                    <li>Switch to Testnet in Freighter</li>
                    <li>Refresh page after unlocking Freighter</li>
                    <li>Check browser console for errors</li>
                  </ul>
                </div>
              </div>
            )}
            
            <button 
              className="btn btn-primary"
              onClick={connect}
              disabled={isFreighterDetected === false}
            >
              {isFreighterDetected === false ? 'Freighter Not Found' : 'Connect Wallet'}
            </button>
            
            <div className="status-info">
              <p><strong>Status</strong></p>
              <ul>
                <li>
                  <strong>Freighter:</strong> 
                  <span>{isFreighterDetected === null ? 'Checking...' : isFreighterDetected ? 'Detected' : 'Not Found'}</span>
                </li>
                <li>
                  <strong>Connection:</strong> 
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </li>
                {wallet && (
                  <li>
                    <strong>Public Key:</strong> 
                    <span>{wallet.publicKey.substring(0, 8)}...{wallet.publicKey.substring(wallet.publicKey.length - 8)}</span>
                  </li>
                )}
                {address && (
                  <li>
                    <strong>Address:</strong> 
                    <span>{address.substring(0, 8)}...{address.substring(address.length - 8)}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="content">
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              marginBottom: '3rem', 
              textAlign: 'center', 
              color: '#1a1a1a',
              letterSpacing: '-0.025em'
            }}>
              Scholarship Pool
            </h1>
            
            <ConfigurationCheck />
            <NetworkTest />
            {wallet && <FreighterDemo wallet={wallet} />}

            <div className="grid">
              <div className="panel">
                <h2>Actions</h2>
                
                {pool ? (
                  <div className="actions">
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

                    {pool.creator === wallet?.publicKey && (
                      <div className="management">
                        <h3>Pool Management</h3>
                        <div className="btn-group">
                          <button 
                            className="btn btn-secondary"
                            onClick={approveScholarships}
                            disabled={isLoading || Date.now() / 1000 < pool.application_deadline}
                          >
                            {isLoading ? 'Processing...' : 'Approve Scholarships'}
                          </button>
                          
                          <button 
                            className="btn btn-secondary"
                            onClick={distributeScholarships}
                            disabled={isLoading || Date.now() / 1000 < pool.distribution_deadline}
                          >
                            {isLoading ? 'Processing...' : 'Distribute Scholarships'}
                          </button>
                        </div>
                        <div className="note">
                          <strong>Deadlines:</strong><br />
                          Applications close: {new Date(pool.application_deadline * 1000).toLocaleDateString()}<br />
                          Distribution begins: {new Date(pool.distribution_deadline * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="create-pool">
                    <p>Create a new scholarship pool to help students achieve their educational dreams</p>
                    <button 
                      className="btn btn-primary"
                      onClick={initializePool}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Pool'}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="error-box">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>

              <div className="panel">
                <h2>Pool Information</h2>
                
                {pool ? (
                  <>
                    <ScholarshipPoolDetails pool={pool} />
                    <ProgressBar current={pool.current_balance} goal={pool.total_goal} />
                  </>
                ) : (
                  <div className="info">
                    <h3>Scholarship Types</h3>
                    <ul>
                      <li>Academic Merit Scholarships</li>
                      <li>Financial Need Grants</li>
                      <li>Field-Specific Awards</li>
                      <li>Graduate Research Funding</li>
                      <li>Professional Development</li>
                      <li>International Student Support</li>
                    </ul>
                    
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <h4 style={{ marginBottom: '1rem', color: '#374151' }}>How It Works</h4>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6' }}>
                        Create a scholarship pool, set funding goals, and let donors contribute. 
                        Students can apply, and funds are distributed based on merit and need.
                      </p>
                    </div>
                  </div>
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
