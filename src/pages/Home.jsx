import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CampaignCard } from '../components/CampaignCard';
import { Rocket, ShieldCheck, Sparkles, TrendingUp, Users, DollarSign, ChevronRight, Zap } from 'lucide-react';

export const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Green Tech', 'Gaming', 'Creative Art', 'Community'];

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const data = await api.getCampaigns({ category: selectedCategory });
        setCampaigns(data);
      } catch (err) {
        console.error('Error fetching home campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, [selectedCategory]);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> Next Generation Crowdfunding Platform
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '800', maxWidth: '900px', margin: '0 auto 1.25rem auto' }}>
            Bring Creative Ideas & Future Tech To <span className="gradient-text">Life</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
            Discover groundbreaking projects, back visionary entrepreneurs, and receive exclusive early rewards.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/discover" className="btn btn-primary btn-lg">
              <Rocket size={20} />
              Explore Projects
            </Link>
            <Link to="/create" className="btn btn-secondary btn-lg">
              Start a Campaign
            </Link>
          </div>

          {/* Key Platform Stats Counter */}
          <div className="glass-card" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            maxWidth: '960px',
            margin: '4rem auto 0 auto',
            padding: '1.75rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <DollarSign size={24} /> 2.4M+
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Funds Raised</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Users size={24} /> 18,500+
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Active Backers</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <TrendingUp size={24} /> 96%
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Campaign Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Campaigns Showcase */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem' }}>Trending Campaigns</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Projects making waves across technology, art, and eco innovation</p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '999px', fontSize: '0.85rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
              <Zap size={32} className="text-indigo-400" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '1rem' }}>Loading innovative projects...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Rocket size={48} color="#6366f1" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Campaigns Found in {selectedCategory}</h3>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Be the first creator to launch a project in this category!</p>
              <Link to="/create" className="btn btn-primary">Start a Campaign</Link>
            </div>
          ) : (
            <div className="campaign-grid">
              {campaigns.map((camp) => (
                <CampaignCard key={camp._id} campaign={camp} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/discover" className="btn btn-secondary">
              View All Campaigns <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose FundPulse Section */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Built for Trust & Innovation</h2>
            <p style={{ color: '#94a3b8' }}>Everything you need to fund ideas or back the future safely</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} color="#6366f1" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verified Creators</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                All project creators undergo identity verification and project roadmap reviews to protect backer funds.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={26} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Exclusive Rewards</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Backers receive early-bird pricing, custom limited editions, and direct creator updates on production progress.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Rocket size={26} color="#ec4899" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Full Disbursement Support</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Automated funding goal tracking, transparent milestone releases, and reward fulfillment management tools.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
