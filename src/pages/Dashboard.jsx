import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CampaignCard } from '../components/CampaignCard';
import { DollarSign, Heart, Rocket, TrendingUp, Plus, Clock, ExternalLink } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('backed');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getDashboardStats();
        setStats(res);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#94a3b8' }}>
        <p>Loading user dashboard...</p>
      </div>
    );
  }

  const summary = stats?.summary || { totalPledged: 0, backedCount: 0, createdCount: 0, totalFundsRaised: 0 };
  const contributions = stats?.contributions || [];
  const createdCampaigns = stats?.createdCampaigns || [];

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* User Greeting Banner */}
        <div className="glass-card" style={{ padding: '2rem 2.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Welcome back, {user?.name}!</h1>
                <span className="badge-pill" style={{ textTransform: 'capitalize' }}>{user?.role || 'backer'}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/create" className="btn btn-primary">
              <Plus size={18} /> Start New Campaign
            </Link>
          </div>
        </div>

        {/* Dashboard Stats Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Pledged</span>
              <DollarSign size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#6ee7b7' }}>
              ${summary.totalPledged.toLocaleString()}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Campaigns Backed</span>
              <Heart size={20} color="#ec4899" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {summary.backedCount}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Created Campaigns</span>
              <Rocket size={20} color="#6366f1" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {summary.createdCount}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Funds Raised</span>
              <TrendingUp size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fcd34d' }}>
              ${summary.totalFundsRaised.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('backed')}
            style={{
              padding: '0.85rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'backed' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'backed' ? '#fff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            My Backed Projects & Rewards ({contributions.length})
          </button>
          <button
            onClick={() => setActiveTab('created')}
            style={{
              padding: '0.85rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'created' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'created' ? '#fff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            My Created Campaigns ({createdCampaigns.length})
          </button>
        </div>

        {/* Tab 1: Backed Projects */}
        {activeTab === 'backed' && (
          <div>
            {contributions.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Heart size={48} color="#ec4899" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>You Haven't Backed Any Campaigns Yet</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Explore innovative ideas and receive unique rewards from visionary creators.</p>
                <Link to="/discover" className="btn btn-primary">Discover Projects to Back</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {contributions.map((item, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <img
                        src={item.campaign?.imageUrl || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=200&q=80'}
                        alt={item.campaign?.title}
                        style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                          {item.campaign ? (
                            <Link to={`/campaign/${item.campaign._id}`} style={{ color: '#fff' }}>
                              {item.campaign.title}
                            </Link>
                          ) : (
                            'Project Unavailable'
                          )}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
                          <span>Reward: <strong style={{ color: '#a5b4fc' }}>{item.rewardTitle}</strong></span>
                          <span>Transaction: <code style={{ color: '#64748b' }}>{item.transactionId}</code></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#6ee7b7' }}>
                          ${item.amount}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                          <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {item.campaign && (
                        <Link to={`/campaign/${item.campaign._id}`} className="btn btn-secondary btn-sm">
                          View Campaign <ExternalLink size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Created Campaigns */}
        {activeTab === 'created' && (
          <div>
            {createdCampaigns.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Rocket size={48} color="#6366f1" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No Campaigns Created Yet</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Turn your project into reality with our easy multi-step creation wizard.</p>
                <Link to="/create" className="btn btn-primary">Start Your First Campaign</Link>
              </div>
            ) : (
              <div className="campaign-grid">
                {createdCampaigns.map((camp) => (
                  <CampaignCard key={camp._id} campaign={camp} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
