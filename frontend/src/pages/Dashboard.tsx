import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scan, History, ArrowRight, TrendingUp, Clock, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';
import { DashboardStats } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import HistoryCard from '../components/common/HistoryCard';
import { ConfidenceIndicator } from '../components/results/PredictionCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await profileService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.warn('Dashboard stats fallback', err);
        setStats({
          total_analyses: 0,
          recent_analyses: [],
          latest_prediction: undefined,
          latest_confidence: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
                Welcome back, {user?.first_name}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem' }}>
                Track your skin health journey and analyze new images.
              </p>
            </div>
            <Link to="/analyzer" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-teal-700)', fontWeight: 700 }}>
              <Plus size={18} /> New Analysis
            </Link>
          </div>
        </div>
      </div>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container" style={{ paddingTop: '0', paddingBottom: '3rem' }}>

          {isLoading ? (
            <LoadingSpinner label="Loading your dashboard…" />
          ) : error ? (
            <ErrorMessage message={error} className="mt-4" />
          ) : (
            <>
              {/* Stats */}
              <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p className="stat-value">{stats?.total_analyses ?? 0}</p>
                      <p className="stat-label">Total Analyses</p>
                    </div>
                    <div style={{ background: 'var(--color-teal-50)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: 'var(--color-teal-600)' }}>
                      <TrendingUp size={20} />
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p className="stat-value">{stats?.recent_analyses?.length ?? 0}</p>
                      <p className="stat-label">Recent Scans (last 30 days)</p>
                    </div>
                    <div style={{ background: 'var(--color-teal-50)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', color: 'var(--color-teal-600)' }}>
                      <Scan size={20} />
                    </div>
                  </div>
                </div>

                {stats?.latest_prediction && (
                  <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>Latest Prediction</p>
                    <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-slate-800)', marginBottom: '0.5rem' }}>
                      {stats.latest_prediction}
                    </p>
                    {stats.latest_confidence !== undefined && (
                      <ConfidenceIndicator confidence={stats.latest_confidence} size="sm" />
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
                <Link to="/analyzer" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', border: '2px solid var(--color-teal-200)', cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Scan size={22} color="white" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--color-slate-800)', marginBottom: '0.2rem' }}>Quick Analyze</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>Upload an image for instant AI analysis</p>
                  </div>
                  <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--color-slate-400)' }} />
                </Link>

                <Link to="/history" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <History size={22} style={{ color: 'var(--color-slate-600)' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--color-slate-800)', marginBottom: '0.2rem' }}>View History</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)' }}>Review all your previous analyses</p>
                  </div>
                  <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--color-slate-400)' }} />
                </Link>
              </div>

              {/* Recent Analyses */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} style={{ color: 'var(--color-teal-600)' }} /> Recent Analyses
                  </h2>
                  {(stats?.recent_analyses?.length ?? 0) > 0 && (
                    <Link to="/history" className="btn btn-ghost btn-sm">View All →</Link>
                  )}
                </div>

                {!stats?.recent_analyses?.length ? (
                  <EmptyState
                    icon={Scan}
                    title="No analyses yet"
                    description="Upload your first skin image to get started with AI-powered analysis."
                    action={
                      <button className="btn btn-primary" onClick={() => navigate('/analyzer')}>
                        <Scan size={16} /> Analyze Your First Image
                      </button>
                    }
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {stats.recent_analyses.map((item) => (
                      <HistoryCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
