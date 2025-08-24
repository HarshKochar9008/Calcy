import { useState, useEffect } from 'react';
import { CONTRACT_CONFIG, getWorkingRpcUrl } from '../config/contracts';

export const NetworkTest = () => {
  const [testResults, setTestResults] = useState<{
    [url: string]: { status: 'testing' | 'success' | 'error'; message: string };
  }>({});
  const [isTesting, setIsTesting] = useState(false);
  const [workingUrl, setWorkingUrl] = useState<string>('');

  const testRpcUrl = async (url: string) => {
    setTestResults(prev => ({
      ...prev,
      [url]: { status: 'testing', message: 'Testing...' }
    }));

    try {
      const response = await fetch(url + '/health');
      if (response.ok) {
        setTestResults(prev => ({
          ...prev,
          [url]: { status: 'success', message: 'Connected' }
        }));
        return true;
      } else {
        setTestResults(prev => ({
          ...prev,
          [url]: { status: 'error', message: `HTTP ${response.status}` }
        }));
        return false;
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [url]: { status: 'error', message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}` }
      }));
      return false;
    }
  };

  const testAllUrls = async () => {
    setIsTesting(true);
    setTestResults({});
    
    for (const url of CONTRACT_CONFIG.ALTERNATIVE_RPC_URLS) {
      const isWorking = await testRpcUrl(url);
      if (isWorking) {
        setWorkingUrl(url);
        break;
      }
    }
    
    setIsTesting(false);
  };

  useEffect(() => {
    // Auto-test on component mount
    testAllUrls();
  }, []);

  return (
    <div className="network-test">
      <h3>Network Test</h3>
      <p>Test connection to Stellar testnet RPC endpoints.</p>
      
      <div className="test-results">
        {CONTRACT_CONFIG.ALTERNATIVE_RPC_URLS.map((url) => {
          const result = testResults[url];
          return (
            <div key={url} className="test-result">
              <div className="test-url">{url}</div>
              {result && (
                <div className={`test-status ${result.status}`}>
                  {result.message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {workingUrl && (
        <div className="working-url">
          <strong>Working URL:</strong> {workingUrl}
        </div>
      )}

      <button
        onClick={testAllUrls}
        disabled={isTesting}
        className="btn btn-secondary"
      >
        {isTesting ? 'Testing...' : 'Retest'}
      </button>

      <div className="troubleshooting">
        <h4>Troubleshooting:</h4>
        <ul>
          <li>Check internet connection</li>
          <li>Try accessing URLs in browser</li>
          <li>Corporate networks may block endpoints</li>
          <li>App uses first working URL</li>
        </ul>
      </div>
    </div>
  );
};
