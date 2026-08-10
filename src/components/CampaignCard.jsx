import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, ArrowUpRight } from 'lucide-react';

export const CampaignCard = ({ campaign }) => {
  const {
    _id,
    title,
    tagline,
    category,
    targetGoal,
    currentAmount,
    deadline,
    imageUrl,
    backersCount,
    status,
    creator
  } = campaign;

  const percentage = Math.min(Math.round((currentAmount / targetGoal) * 100), 100);

  // Calculate days left
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge-pill ${status === 'successful' ? 'successful' : ''}`}>
            {category}
          </span>
        </div>
        {status === 'successful' && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px'
          }}>
            FUNDED 🎉
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <img
            src={creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={creator?.name || 'Creator'}
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            By <strong style={{ color: '#cbd5e1' }}>{creator?.name || 'Anonymous Creator'}</strong>
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <Link to={`/campaign/${_id}`} style={{ color: '#fff' }}>
            {title}
          </Link>
        </h3>

        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.25rem', flex: 1, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tagline}
        </p>

        {/* Progress Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: '600', color: '#6ee7b7' }}>${currentAmount.toLocaleString()} raised</span>
            <span style={{ color: '#94a3b8' }}>{percentage}% of ${targetGoal.toLocaleString()}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* Metrics Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={15} color="#818cf8" />
            {backersCount} Backers
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={15} color="#f59e0b" />
            {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
          </span>
          <Link to={`/campaign/${_id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
