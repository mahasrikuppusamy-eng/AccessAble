import React, { useState } from 'react';
import { MdReportProblem, MdClose } from 'react-icons/md';
import api from '../../services/api';

const ReportModal = ({ place, isOpen, onClose, onSuccess }) => {
  const [issueType, setIssueType] = useState('Incorrect Accessibility Features');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !place) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide details about the accessibility inaccuracy.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/places/${place._id}/report`, {
        issueType,
        description,
        reporterName,
      });

      if (response.data.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MdReportProblem size={22} color="#dc2626" />
            <h3 id="report-modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Report Inaccurate Info
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
            }}
          >
            <MdClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Help keep <strong>{place.name}</strong> accurate for the community.
              Your report will be reviewed by accessibility auditors.
            </p>

            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="issueType" className="form-label">
                Nature of the Issue *
              </label>
              <select
                id="issueType"
                className="form-control"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="Incorrect Accessibility Features">
                  Incorrect Accessibility Features (e.g. ramp missing, elevator broken)
                </option>
                <option value="Place Closed or Moved">
                  Place Closed or Permanently Relocated
                </option>
                <option value="Broken Equipment / Ramp / Elevator">
                  Temporarily Broken Ramp or Elevator
                </option>
                <option value="Misleading Description">
                  Misleading Description or Inaccurate Hours
                </option>
                <option value="Other">Other Community Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reportDescription" className="form-label">
                Specific Details *
              </label>
              <textarea
                id="reportDescription"
                className="form-control"
                rows="4"
                placeholder="Explain what is inaccurate or any physical obstacles observed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reporterName" className="form-label">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="reporterName"
                className="form-control"
                placeholder="Anonymous or Community Member"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger btn-sm"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
