import { useEffect, useState } from 'react';
import { ScholarshipPoolDetails } from './components/ScholarshipPoolDetails';
import { DonationForm } from './components/DonationForm';
import { ApplicationForm } from './components/ApplicationForm';
import { ProgressBar } from './components/ProgressBar';

import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import './App.css';

// Scholarship carousel data
const scholarshipTypes = [
  {
    id: 1,
    title: "Academic Merit",
    description: "Rewarding exceptional academic performance and achievements",
    icon: "🎓",
    color: "#4f46e5"
  },
  {
    id: 2,
    title: "Financial Need",
    description: "Supporting students who demonstrate financial hardship",
    icon: "💝",
    color: "#dc2626"
  },
  {
    id: 3,
    title: "Field-Specific",
    description: "Targeted funding for specific academic disciplines",
    icon: "🔬",
    color: "#059669"
  },
  {
    id: 4,
    title: "Graduate Research",
    description: "Funding for advanced research and doctoral studies",
    icon: "📚",
    color: "#7c3aed"
  },
  {
    id: 5,
    title: "Professional Development",
    description: "Support for career advancement and skill development",
    icon: "🚀",
    color: "#ea580c"
  },
  {
    id: 6,
    title: "International Support",
    description: "Assistance for international students studying abroad",
    icon: "🌍",
    color: "#0891b2"
  }
];

function App() {
  // Get all wallet functions including connect and disconnect
  const { wallet, isConnected, connectionError, isFreighterDetected, connect, disconnect } = useWallet();
  const { 
    pool, 
    userDonation, 
    isLoading, 
    error,
    success,
    initializePool,
    donate,
    applyForScholarship,
    approveScholarships,
    distributeScholarships,
    refreshPool
  } = useContract(wallet);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % scholarshipTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % scholarshipTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + scholarshipTypes.length) % scholarshipTypes.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isConnected && wallet) {
      refreshPool();
    }
  }, [isConnected, wallet, refreshPool]);

  return (
    <div className="app">
      {/* Professional Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="Title">EduChain</div>
            <img src="/logo.png" alt="EduChain Logo" className="logo" />
            <span className="logo-subtitle">Blockchain Scholarships</span>
          </div>
          
          <div className="navbar-menu">
            <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Home
            </button>
            <button className="nav-link" onClick={() => document.getElementById('scholarships')?.scrollIntoView({ behavior: 'smooth' })}>
              Scholarships
            </button>
            <button className="nav-link" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              About
            </button>
            <button className="nav-link" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Contact
            </button>
          </div>
          
          <div className="navbar-actions">
            {/* Enable connect/disconnect functionality */}
            {!isConnected ? (
              <button 
                className="btn btn-primary btn-nav"
                onClick={connect}
                title="Connect your Freighter wallet"
              >
                Connect Wallet
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-nav"
                onClick={disconnect}
                title="Disconnect your wallet"
              >
                Disconnect Wallet
              </button>
            )}
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
                <div className="card-icon"><img src="/hurray.png" alt="EduChain Logo" className="logo1" /></div>
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



      {/* Simple Connection Status */}
      {isFreighterDetected && !isConnected && (
        <div className="connection-prompt-banner">
          <div className="connection-prompt-content">
            <span className="connection-prompt-icon">🔗</span>
            <span className="connection-prompt-text">
              Connect your Freighter wallet to start using EduChain
            </span>
            <button 
              className="connection-prompt-connect"
              onClick={connect}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      <main className="main">
        <section id="scholarships">
          {!isConnected ? (
            <div className="connect-section">
              <h1>🚀 EduChain Scholarships</h1>
              <p>Connect your Freighter wallet to create and manage scholarship pools on Stellar testnet.</p>
              
              <div className="connect-notice" style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                background: '#f0f9ff', 
                borderRadius: '8px', 
                border: '1px solid #0ea5e9',
                textAlign: 'center'
              }}>
                <h3 style={{ marginBottom: '0.5rem', color: '#0369a1' }}>📱 How to Connect</h3>
                <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
                  <strong>1. Install Freighter Extension</strong>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
                  <strong>2. Switch to Testnet</strong>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
                  <strong>3. Connect Wallet</strong>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#0369a1', marginTop: '0.5rem' }}>
                  <strong>Ready to create scholarship pools on testnet!</strong>
                </p>
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
              
              {/* Scholarship Carousel - Main Section */}
              <div className="scholarship-carousel-main">
                <div className="carousel-container-main">
                  <div 
                    className="carousel-slide-main"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {scholarshipTypes.map((scholarship) => (
                      <div 
                        key={scholarship.id} 
                        className="carousel-item-main"
                        style={{ borderLeft: `4px solid ${scholarship.color}` }}
                      >
                        <div className="carousel-icon-main">{scholarship.icon}</div>
                        <div className="carousel-content-main">
                          <h4 className="carousel-title-main">{scholarship.title}</h4>
                          <p className="carousel-description-main">{scholarship.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Navigation */}
                <div className="carousel-nav-main">
                  <button 
                    className="carousel-btn-main carousel-prev-main" 
                    onClick={prevSlide}
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <div className="carousel-dots-main">
                    {scholarshipTypes.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot-main ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    className="carousel-btn-main carousel-next-main" 
                    onClick={nextSlide}
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </div>
              </div>
              


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
                      <h3>🚀 Create Your Scholarship Pool</h3>
                      <p>Start a new scholarship pool to help students achieve their educational dreams. Set funding goals, deadlines, and scholarship amounts.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={initializePool}
                        disabled={isLoading}
                      >
                        {isLoading ? '🏗️ Creating Pool...' : '🎓 Create Scholarship Pool'}
                      </button>
                      <div className="info-box">
                        <h4>What happens next?</h4>
                        <ul>
                          <li>Pool is created on the blockchain</li>
                          <li>Accept donations from supporters</li>
                          <li>Students can apply for scholarships</li>
                          <li>Distribute funds to approved students</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="error-box">
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  {success && (
                    <div className="success-box">
                      <strong>Success:</strong> {success}
                      {success.includes('Pool created successfully') && (
                        <div style={{ marginTop: '1rem' }}>
                          <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.5rem' }}>
                            Your scholarship pool has been created on the blockchain! 
                            The pool details should appear below. If you don't see them, try refreshing.
                          </p>
                          <button 
                            className="btn btn-secondary"
                            onClick={refreshPool}
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          >
                            🔄 Refresh Pool Data
                          </button>
                        </div>
                      )}
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
        </section>
        
        <section id="about" className="about-section">
          <div className="about-container">
            <h2>About EduChain</h2>
            <p>EduChain is a revolutionary platform that leverages blockchain technology to create transparent, 
            decentralized scholarship pools. We connect donors directly with students, eliminating intermediaries 
            and ensuring 100% of funds go to education.</p>
          </div>
        </section>
        
        <section id="contact" className="contact-section">
          <div className="contact-container">
            <h2>Contact Us</h2>
            <p>Have questions about EduChain? Get in touch with me.</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">harshkochar88@gmail.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Tweet me on X:</span>
                <span className="contact-value">
                  <a href="https://x.com/Too_harshk" target="_blank" rel="noopener noreferrer">
                    @Too_harshk
                  </a>
                </span>
              </div>
              <div className="simple-status">
                <h3>Wallet Status</h3>
                <div className="status-content">
                  <span className="status-text">
                    <strong>Status:</strong> {isConnected ? '✅ Connected to Testnet' : '❌ Not Connected'}
                  </span>
                  {wallet && (
                    <span className="status-text">
                      <strong>Address:</strong> {wallet.publicKey.substring(0, 8)}...{wallet.publicKey.substring(wallet.publicKey.length - 8)}
                    </span>
                  )}
                </div>
              </div>

              {/* Connection Error Display */}
              {connectionError && (
                <div className="error-box">
                  <p>{connectionError}</p>
                  <div className="error-help">
                    <h4>Troubleshooting</h4>
                    <ul>
                      <li>Ensure Freighter extension is installed and unlocked</li>
                      <li>Switch to Testnet in Freighter</li>
                      <li>Refresh page after unlocking Freighter</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
