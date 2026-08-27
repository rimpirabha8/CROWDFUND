import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PledgeModal } from '../components/PledgeModal';
import { Users, Clock, ShieldCheck, Heart, Sparkles, CheckCircle2, MessageSquare, Plus, ArrowLeft, Send } from 'lucide-react';

export const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('story');
  
  // Modal state
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  // New update state (for creator)
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [postingUpdate, setPostingUpdate] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.getCampaignById(id);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load campaign detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#94a3b8' }}>
        <p>Loading campaign details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ef4444' }}>Campaign Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error || 'The requested campaign does not exist or has been removed.'}</p>
          <Link to="/discover" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const { campaign, recentContributions } = data;
  const isCreator = user && campaign.creator && user._id === campaign.creator._id;
  const percentage = Math.min(Math.round((campaign.currentAmount / campaign.targetGoal) * 100), 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const handleOpenPledge = (reward = null) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedReward(reward);
    setShowPledgeModal(true);
  };

  const handlePledgeSuccess = (result) => {
    fetchDetail();
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdateTitle || !newUpdateContent) return;

    try {
      setPostingUpdate(true);
      await api.postCampaignUpdate(campaign._id, newUpdateTitle, newUpdateContent);
      setNewUpdateTitle('');
      setNewUpdateContent('');
      fetchDetail();
    } catch (err) {
      alert(err.message || 'Failed to post update');
    } finally {
      setPostingUpdate(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Navigation back */}
        <Link to="/discover" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to all projects
        </Link>

        {/* Title Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge-pill">{campaign.category}</span>
            {campaign.status === 'successful' && (
              <span className="badge-pill successful">Fully Funded 🎉</span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.75rem' }}>{campaign.title}</h1>
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '850px' }}>{campaign.tagline}</p>
        </div>

        {/* Campaign Hero Showcase Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Main Media Image Showcase */}
          <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            />
          </div>

          {/* Funding Card Sidebar */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Creator Metadata */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingBottom: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <img
                  src={campaign.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={campaign.creator?.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                />
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Campaign Creator</span>
                  <h4 style={{ fontSize: '1.05rem' }}>{campaign.creator?.name || 'Verified Creator'}</h4>
                </div>
              </div>

              {/* Raised Stats */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#6ee7b7', lineHeight: 1, marginBottom: '0.3rem' }}>
                  ${campaign.currentAmount.toLocaleString()}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  pledged of <strong style={{ color: '#fff' }}>${campaign.targetGoal.toLocaleString()}</strong> goal
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div className="progress-bar-container" style={{ height: '10px', marginBottom: '0.5rem' }}>
                  <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
                  <span>{percentage}% Funded</span>
                  <span>Goal: ${campaign.targetGoal.toLocaleString()}</span>
                </div>
              </div>

              {/* Key Metrics Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>{campaign.backersCount}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Users size={14} color="#818cf8" /> Total Backers
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>{daysLeft}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} color="#f59e0b" /> Days Remaining
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div>
              <button
                onClick={() => handleOpenPledge(null)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '0.8rem' }}
              >
                <Heart size={20} fill="#fff" />
                Back This Project
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#10b981' }}>
                <ShieldCheck size={16} /> All or Nothing Funding Guarantee
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Navigation */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('story')}
            style={{
              padding: '0.85rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'story' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'story' ? '#fff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Project Story
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            style={{
              padding: '0.85rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'rewards' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'rewards' ? '#fff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Rewards ({campaign.rewards ? campaign.rewards.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            style={{
              padding: '0.85rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'updates' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'updates' ? '#fff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Updates ({campaign.updates ? campaign.updates.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('backers')}
            style={{
              padding: '0.85rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'backers' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'backers' ? '#fff' : '#94a3b8',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Community & Backers ({recentContributions ? recentContributions.length : 0})
          </button>
        </div>

        {/* Tab 1: Project Story */}
        {activeTab === 'story' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>About the Campaign</h3>
              <div style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {campaign.description}
              </div>
            </div>

            {/* Creator Bio Sidebar */}
            <aside>
              <div className="glass-card" style={{ padding: '1.75rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>About the Creator</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <img
                    src={campaign.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={campaign.creator?.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem' }}>{campaign.creator?.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{campaign.creator?.email}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {campaign.creator?.bio || 'Dedicated entrepreneur building innovative products and tech for the global community.'}
                </p>
                <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', fontSize: '0.85rem', color: '#a5b4fc' }}>
                  <Sparkles size={16} style={{ marginBottom: '0.3rem' }} />
                  Verified Creator with 100% campaign fulfillment record.
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Tab 2: Reward Tiers */}
        {activeTab === 'rewards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {(!campaign.rewards || campaign.rewards.length === 0) ? (
              <div className="glass-card" style={{ padding: '3rem', gridColumn: '1/-1', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8' }}>No specific reward tiers added yet. You can still make a custom pledge!</p>
                <button onClick={() => handleOpenPledge(null)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Make Custom Pledge
                </button>
              </div>
            ) : (
              campaign.rewards.map((reward, idx) => (
                <div key={idx} className="glass-card glass-card-interactive" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span className="badge-pill">Pledge ${reward.amount} or more</span>
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600' }}>
                        {reward.backersCount || 0} claimed
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{reward.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                      {reward.description}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                      <strong>Estimated Delivery:</strong> {reward.estimatedDelivery || 'Soon'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenPledge(reward)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Select Reward (${reward.amount})
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Updates */}
        {activeTab === 'updates' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {isCreator && (
              <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} color="#6366f1" /> Post Project Update (Creator Tools)
                </h3>
                <form onSubmit={handlePostUpdate}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter update title"
                      value={newUpdateTitle}
                      onChange={(e) => setNewUpdateTitle(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Enter update description"
                      value={newUpdateContent}
                      onChange={(e) => setNewUpdateContent(e.target.value)}
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" disabled={postingUpdate} className="btn btn-primary">
                    <Send size={16} />
                    {postingUpdate ? 'Publishing...' : 'Publish Update to Backers'}
                  </button>
                </form>
              </div>
            )}

            {(!campaign.updates || campaign.updates.length === 0) ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <MessageSquare size={40} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ color: '#94a3b8' }}>No updates posted yet by the creator.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {campaign.updates.map((update, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{update.title}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                      {update.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Backers */}
        {activeTab === 'backers' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Recent Backers ({recentContributions.length})</h3>
              {recentContributions.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>Be the first backer to support this campaign!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentContributions.map((contrib, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img
                          src={contrib.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={contrib.user?.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.95rem' }}>{contrib.user?.name || 'Anonymous Backer'}</h4>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{contrib.rewardTitle}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#6ee7b7' }}>
                          +${contrib.amount}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(contrib.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal render */}
        {showPledgeModal && (
          <PledgeModal
            campaign={campaign}
            selectedReward={selectedReward}
            onClose={() => setShowPledgeModal(false)}
            onSuccess={handlePledgeSuccess}
          />
        )}
      </div>
    </div>
  );
};
