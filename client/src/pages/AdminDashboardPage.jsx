import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaTrash,
  FaExclamationTriangle,
  FaUserShield,
  FaClock,
} from 'react-icons/fa';
import api from '../services/api';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'places' | 'users' | 'reviews' | 'reports'

  const [stats, setStats] = useState(null);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Rejection modal state
  const [rejectModalPlace, setRejectModalPlace] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchStatsAndPending = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/places/pending'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (pendingRes.data.success) setPendingPlaces(pendingRes.data.places);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setAlert({ type: 'error', message: 'Error loading admin data.' });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStatsAndPending();
      setLoading(false);
    };
    init();
  }, []);

  // Fetch data on tab change
  useEffect(() => {
    const loadTabData = async () => {
      try {
        if (activeTab === 'places' && allPlaces.length === 0) {
          const res = await api.get('/admin/places/all');
          if (res.data.success) setAllPlaces(res.data.places);
        } else if (activeTab === 'users' && users.length === 0) {
          const res = await api.get('/admin/users');
          if (res.data.success) setUsers(res.data.users);
        } else if (activeTab === 'reviews' && reviews.length === 0) {
          const res = await api.get('/admin/reviews');
          if (res.data.success) setReviews(res.data.reviews);
        } else if (activeTab === 'reports' && reports.length === 0) {
          const res = await api.get('/admin/reports');
          if (res.data.success) setReports(res.data.reports);
        }
      } catch (err) {
        console.error('Failed to load tab data:', err);
      }
    };
    loadTabData();
  }, [activeTab]);

  // Approve place
  const handleApprovePlace = async (placeId) => {
    try {
      const res = await api.put(`/admin/places/${placeId}/approve`);
      if (res.data.success) {
        setPendingPlaces((prev) => prev.filter((p) => p._id !== placeId));
        setAlert({ type: 'success', message: res.data.message });
        fetchStatsAndPending();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to approve place.' });
    }
  };

  // Reject place
  const handleConfirmReject = async () => {
    if (!rejectModalPlace) return;
    try {
      const res = await api.put(`/admin/places/${rejectModalPlace._id}/reject`, {
        reason: rejectionReason,
      });
      if (res.data.success) {
        setPendingPlaces((prev) => prev.filter((p) => p._id !== rejectModalPlace._id));
        setAlert({ type: 'warning', message: res.data.message });
        setRejectModalPlace(null);
        setRejectionReason('');
        fetchStatsAndPending();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to reject place.' });
    }
  };

  // Delete place
  const handleDeletePlace = async (placeId) => {
    if (!window.confirm('Are you sure you want to delete this place permanently?')) return;
    try {
      const res = await api.delete(`/places/${placeId}`);
      if (res.data.success) {
        setAllPlaces((prev) => prev.filter((p) => p._id !== placeId));
        setPendingPlaces((prev) => prev.filter((p) => p._id !== placeId));
        setAlert({ type: 'info', message: 'Place successfully deleted.' });
        fetchStatsAndPending();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Error deleting place.' });
    }
  };

  // Toggle user role
  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${targetUser.name}'s role to ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await api.put(`/admin/users/${targetUser._id}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
        setAlert({ type: 'success', message: `User role changed to ${newRole}.` });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error updating role.' });
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setAlert({ type: 'info', message: 'User deleted.' });
        fetchStatsAndPending();
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Cannot delete user.' });
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        setAlert({ type: 'info', message: 'Review removed.' });
        fetchStatsAndPending();
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Error deleting review.' });
    }
  };

  return (
    <div className="admin-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              backgroundColor: '#f3e8ff',
              color: '#7c3aed',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <FaShieldAlt size={14} /> Master Administration Console
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Platform Administration
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Audit submissions, moderate user reviews, oversee registrations, and manage platform data.
          </p>
        </div>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Overview Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            className="card"
            style={{ padding: '1.5rem', borderLeft: '5px solid #2563eb' }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.totalPlaces || 0}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
              Total Locations Listed
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', borderLeft: '5px solid #f59e0b' }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>
              {stats?.pendingPlaces || 0}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
              Pending Verifications
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', borderLeft: '5px solid #7c3aed' }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed' }}>
              {stats?.totalUsers || 0}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
              Registered Users
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', borderLeft: '5px solid #059669' }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
              {stats?.totalReviews || 0}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
              Community Reviews
            </div>
          </div>

          <div
            className="card"
            style={{ padding: '1.5rem', borderLeft: '5px solid #dc2626' }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626' }}>
              {stats?.totalReports || 0}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
              Open Issue Reports
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'pending' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'pending' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaClock size={14} color={activeTab === 'pending' ? '#d97706' : '#94a3b8'} />
            <span>Pending Approvals ({pendingPlaces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'places' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'places' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaMapMarkerAlt size={14} />
            <span>All Locations</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'users' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'users' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaUsers size={14} />
            <span>Users Management</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'reviews' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'reviews' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaStar size={14} color="#f59e0b" />
            <span>Moderate Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'reports' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'reports' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaExclamationTriangle size={14} color="#dc2626" />
            <span>Issue Reports</span>
          </button>
        </div>

        {/* Tab 1: Pending Places Approval */}
        {activeTab === 'pending' && (
          <div>
            {loading ? (
              <LoadingSpinner message="Loading pending submissions..." />
            ) : pendingPlaces.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                <FaCheckCircle size={36} color="#059669" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No Pending Submissions
                </h3>
                <p style={{ color: '#64748b', margin: 0 }}>
                  All community suggested locations have been audited and resolved.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pendingPlaces.map((pl) => (
                  <div
                    key={pl._id}
                    className="card"
                    style={{
                      padding: '1.75rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: '1 1 400px' }}>
                      <img
                        src={
                          pl.images && pl.images.length > 0
                            ? pl.images[0].startsWith('http')
                              ? pl.images[0]
                              : `http://localhost:5000${pl.images[0]}`
                            : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={pl.name}
                        style={{
                          width: '100px',
                          height: '90px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className="badge badge-primary">{pl.category}</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Submitted by: {pl.submittedBy?.name || 'Community Member'} ({pl.submittedBy?.email || 'N/A'})
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#0f172a' }}>
                          {pl.name}
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 0.65rem 0' }}>
                          {pl.address}, {pl.city}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                          {pl.description.slice(0, 180)}...
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.65rem' }}>
                          {pl.accessibilityFeatures?.map((f) => (
                            <span
                              key={f}
                              style={{
                                fontSize: '0.72rem',
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                fontWeight: 600,
                              }}
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <Link to={`/places/${pl._id}`} className="btn btn-outline btn-sm">
                        Inspect
                      </Link>
                      <button
                        onClick={() => handleApprovePlace(pl._id)}
                        className="btn btn-success btn-sm"
                        style={{ gap: '0.4rem' }}
                      >
                        <FaCheckCircle size={14} /> Approve & Publish
                      </button>
                      <button
                        onClick={() => setRejectModalPlace(pl)}
                        className="btn btn-danger btn-sm"
                        style={{ gap: '0.4rem' }}
                      >
                        <FaTimesCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: All Places */}
        {activeTab === 'places' && (
          <div>
            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.75rem' }}>Place Name</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>City</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Rating</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPlaces.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#0f172a' }}>
                        <Link to={`/places/${p._id}`}>{p.name}</Link>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>{p.category}</td>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>{p.city}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span
                          className={`badge ${
                            p.status === 'approved'
                              ? 'badge-success'
                              : p.status === 'pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                        ★ {p.averageRating ? p.averageRating.toFixed(1) : '0.0'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeletePlace(p._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Delete place"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users Management */}
        {activeTab === 'users' && (
          <div>
            <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.75rem' }}>User</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Joined Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img
                            src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-slate'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleToggleUserRole(u)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                          >
                            <FaUserShield size={12} /> Make {u.role === 'admin' ? 'User' : 'Admin'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Delete user"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Moderate Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev) => (
                <div key={rev._id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        {rev.user?.name || 'User'}
                      </span>{' '}
                      reviewed <strong>{rev.place?.name}</strong>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#dc2626', borderColor: '#fecaca', fontSize: '0.75rem' }}
                    >
                      <FaTrash size={12} /> Remove
                    </button>
                  </div>
                  <StarRating rating={rev.rating} size={14} showValue={false} />
                  <p style={{ color: '#334155', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Issue Reports */}
        {activeTab === 'reports' && (
          <div>
            {reports.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <FaCheckCircle size={32} color="#059669" style={{ marginBottom: '0.75rem' }} />
                <p style={{ color: '#64748b', margin: 0 }}>No reported issues at this time.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reports.map((rep) => (
                  <div key={rep._id} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #dc2626' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                        {rep.issueType} on {rep.place?.name}
                      </h4>
                      <span className="badge badge-warning">{rep.status}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 0.5rem 0' }}>
                      {rep.description}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Reported by {rep.reporterName || 'Anonymous'} on {new Date(rep.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModalPlace && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Reject Place Submission
                </h3>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
                  Please specify why <strong>{rejectModalPlace.name}</strong> cannot be approved:
                </p>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Ramp slope does not meet guidelines, address unclear..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setRejectModalPlace(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="btn btn-danger btn-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
