import React from 'react';
import { getConfigurationStatus } from '../config/contracts';

export const ConfigurationCheck: React.FC = () => {
  const configStatus = getConfigurationStatus();

  if (configStatus.isConfigured) {
    return null; // Don't show anything if everything is configured
  }

  return (
    <div className="configuration-warning">
      <div className="warning-header">
        <h3>Contracts Not Configured</h3>
      </div>
      
      <div className="warning-content">
        <p>
          Deploy smart contracts and update configuration before using EduChain Scholarships.
        </p>
        
        <div className="missing-contracts">
          <h4>Missing:</h4>
          <ul>
            {configStatus.missingContracts.map((contract, index) => (
              <li key={index}>{contract}</li>
            ))}
          </ul>
        </div>
        
        <div className="deployment-steps">
          <h4>Deploy:</h4>
          <ol>
            <li>
              <strong>Deploy Contract:</strong>
              <ul>
                <li>Go to <code>contracts/savings_pot/</code></li>
                <li>Run <code>./deploy.sh</code> (Linux/Mac) or <code>deploy.bat</code> (Windows)</li>
                <li>Deploy to testnet</li>
              </ul>
            </li>
            <li>
              <strong>Update Config:</strong>
              <ul>
                <li>Copy contract ID from deployment output</li>
                <li>Update <code>frontend/src/config/contracts.ts</code></li>
                <li>Set <code>CONTRACT_ID</code></li>
              </ul>
            </li>
            <li>
              <strong>Restart:</strong>
              <ul>
                <li>Refresh page or restart dev server</li>
              </ul>
            </li>
          </ol>
        </div>
        
        <div className="quick-deploy">
          <h4>Windows Deploy:</h4>
          <pre className="deploy-command">
            cd contracts\savings_pot
            deploy.bat
          </pre>
        </div>
        
        <div className="network-info">
          <h4>Network:</h4>
          <p>
            Stellar Testnet<br/>
            Ankr Soroban Testnet<br/>
            Test SDF Network ; September 2015
          </p>
        </div>
      </div>
    </div>
  );
};
