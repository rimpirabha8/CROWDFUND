import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Heart, ShieldCheck, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Rocket size={24} style={{ color: '#6366f1' }} />
              <span>Fund<span className="gradient-text">Pulse</span></span>
            </Link>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '320px', marginBottom: '1.5rem' }}>
              Empowering visionary creators and entrepreneurs to bring groundbreaking tech, green solutions, and creative ideas to life.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={16} color="#10b981" /> Verified Projects
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Globe size={16} color="#6366f1" /> Global Backers
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/discover?category=Technology">Technology</Link></li>
              <li><Link to="/discover?category=Green+Tech">Green Tech</Link></li>
              <li><Link to="/discover?category=Gaming">Gaming & Fun</Link></li>
              <li><Link to="/discover?category=Creative+Art">Creative Art</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Creators</h4>
            <ul>
              <li><Link to="/create">Start Your Campaign</Link></li>
              <li><Link to="/dashboard">Creator Dashboard</Link></li>
              <li><a href="#how-it-works">Campaign Handbook</a></li>
              <li><a href="#rules">Community Guidelines</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/login">Backer Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><a href="#faq">Support & FAQs</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 FundPulse Inc. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built with <Heart size={14} color="#ec4899" fill="#ec4899" /> for global creators & backers.
          </p>
        </div>
      </div>
    </footer>
  );
};
