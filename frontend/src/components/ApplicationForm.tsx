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
      <h3>Apply for Scholarship</h3>
      
      <div className="application-status">
        <span className={`status ${isApplicationOpen ? 'open' : 'closed'}`}>
          {isApplicationOpen ? 'Open' : 'Closed'}
        </span>
        <span className="deadline">
          Deadline: {new Date(pool.application_deadline * 1000).toLocaleDateString()}
        </span>
      </div>
      
      {isApplicationOpen ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="student-name">Name:</label>
            <input
              id="student-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              required
              placeholder="Full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="academic-level">Academic Level:</label>
            <select
              id="academic-level"
              value={formData.academic_level}
              onChange={(e) => handleInputChange('academic_level', e.target.value)}
              disabled={isLoading}
              required
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
            >
              {FIELDS_OF_STUDY.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gpa">GPA:</label>
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="financial-need">Financial Need (1-100):</label>
              <input
                id="financial-need"
                type="number"
                min="1"
                max="100"
                value={formData.financial_need_score}
                onChange={(e) => handleInputChange('financial_need_score', parseInt(e.target.value) || 1)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

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
            />
            <small className="help-text">
              Upload essay to IPFS and paste hash
            </small>
          </div>

          <button
            type="submit"
            className="apply-button"
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      ) : (
        <div className="applications-closed">
          <p>Applications are closed.</p>
        </div>
      )}
    </div>
  );
};
