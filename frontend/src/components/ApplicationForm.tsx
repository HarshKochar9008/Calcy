import React, { useState } from 'react';
import type { ScholarshipPool } from '../types';
import { ACADEMIC_LEVELS, FIELDS_OF_STUDY } from '../utils/constants';

interface ApplicationFormProps {
  onApply: (application: {
    name: string;
    academic_level: string;
    field_of_study: string;
    gpa: number;
    financial_need_score: number;
    essay_hash: string;
  }) => void;
  isLoading: boolean;
  pool: ScholarshipPool;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onApply,
  isLoading,
  pool,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    academic_level: 'Undergraduate',
    field_of_study: 'Computer Science',
    gpa: 3.5,
    financial_need_score: 50,
    essay_hash: 'ipfs://QmExampleEssayHash123...', // Mock IPFS hash
  });

  const isApplicationOpen = Date.now() / 1000 < pool.application_deadline;
  const daysUntilDeadline = Math.ceil((pool.application_deadline - Date.now() / 1000) / (24 * 60 * 60));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && isApplicationOpen) {
      onApply(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="application-form">
      <div className="form-header">
        <h3>📝 Apply for Scholarship</h3>
        <div className="form-status">
          <span className={`status-badge ${isApplicationOpen ? 'open' : 'closed'}`}>
            {isApplicationOpen ? '🟢 Applications Open' : '🔴 Applications Closed'}
          </span>
        </div>
      </div>
      
      <div className="application-status">
        <div className="status-grid">
          <div className="status-item">
            <div className="status-icon">
              {isApplicationOpen ? '📝' : '🔒'}
            </div>
            <div className="status-content">
              <div className="status-label">Application Status</div>
              <div className="status-value">
                {isApplicationOpen ? 'Open' : 'Closed'}
              </div>
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-icon">⏰</div>
            <div className="status-content">
              <div className="status-label">Deadline</div>
              <div className="status-value">
                {new Date(pool.application_deadline * 1000).toLocaleDateString()}
              </div>
              {isApplicationOpen && (
                <div className="status-deadline">
                  {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Last day today!'}
                </div>
              )}
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-icon">🎯</div>
            <div className="status-content">
              <div className="status-label">Pool Goal</div>
              <div className="status-value">
                {((pool.current_balance / pool.total_goal) * 100).toFixed(1)}% Funded
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isApplicationOpen ? (
        <form onSubmit={handleSubmit} className="application-form-content">
          <div className="form-section">
            <h4 className="section-title">📋 Personal Information</h4>
            
            <div className="form-group">
              <label htmlFor="student-name">Full Name:</label>
              <input
                id="student-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isLoading}
                required
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">🎓 Academic Details</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="academic-level">Academic Level:</label>
                <select
                  id="academic-level"
                  value={formData.academic_level}
                  onChange={(e) => handleInputChange('academic_level', e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-select"
                >
                  {ACADEMIC_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="field-of-study">Field of Study:</label>
                <select
                  id="field-of-study"
                  value={formData.field_of_study}
                  onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                  disabled={isLoading}
                  required
                  className="form-select"
                >
                  {FIELDS_OF_STUDY.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gpa">GPA (0.0 - 4.0):</label>
                <input
                  id="gpa"
                  type="number"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value) || 0)}
                  disabled={isLoading}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="financial-need">Financial Need Score (1-100):</label>
                <input
                  id="financial-need"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.financial_need_score}
                  onChange={(e) => handleInputChange('financial_need_score', parseInt(e.target.value) || 1)}
                  disabled={isLoading}
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">📄 Essay Submission</h4>
            
            <div className="form-group">
              <label htmlFor="essay-hash">Essay (IPFS Hash):</label>
              <input
                id="essay-hash"
                type="text"
                value={formData.essay_hash}
                onChange={(e) => handleInputChange('essay_hash', e.target.value)}
                disabled={isLoading}
                required
                placeholder="ipfs://QmExampleEssayHash..."
                className="form-input"
              />
              <small className="help-text">
                💡 Upload your essay to IPFS and paste the hash here. This ensures your essay is stored securely on the decentralized web.
              </small>
            </div>
          </div>

          <button
            type="submit"
            className="apply-button"
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? '🔄 Submitting...' : '📤 Submit Application'}
          </button>
          
          <div className="application-note">
            <p>💡 Your application will be reviewed by the scholarship committee. Make sure all information is accurate and complete.</p>
          </div>
        </form>
      ) : (
        <div className="applications-closed">
          <div className="closed-icon">🔒</div>
          <h4>Applications Are Closed</h4>
          <p>The application period for this scholarship pool has ended. Please check back for future opportunities or contact the pool creator for more information.</p>
          <div className="closed-details">
            <p><strong>Application Deadline:</strong> {new Date(pool.application_deadline * 1000).toLocaleDateString()}</p>
            <p><strong>Next Distribution:</strong> {new Date(pool.distribution_deadline * 1000).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
