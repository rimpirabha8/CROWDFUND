import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const PledgeModal = ({ campaign, selectedReward, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(selectedReward ? selectedReward.amount : 25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitPledge = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Please enter a pledge amount greater than 0.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const rewardTitle = selectedReward ? selectedReward.title : 'Custom Backer Pledge';
      const result = await api.contributeToCampaign(campaign._id, amount, rewardTitle);
      setSuccessMsg(true);
      setTimeout(() => {
        onSuccess(result);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {successMsg ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pledge Successful! 🎉</h3>
            <p style={{ color: '#94a3b8' }}>
              Thank you for backing <strong>{campaign.title}</strong>. Your support makes innovation possible.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge-pill" style={{ marginBottom: '0.5rem' }}>Secure Checkout</span>
              <h3 style={{ fontSize: '1.4rem' }}>Back this Project</h3>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                {selectedReward ? `Selected Tier: ${selectedReward.title}` : `Pledge to ${campaign.title}`}
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitPledge}>
              <div className="form-group">
                <label className="form-label">Pledge Amount ($ USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: '600' }}>
                    $
                  </span>
                  <input
                    type="number"
                    min={selectedReward ? selectedReward.amount : 1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="form-input"
                    style={{ paddingLeft: '2.2rem', fontSize: '1.2rem', fontWeight: '600' }}
                  />
                </div>
                {selectedReward && (
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Minimum pledge for this reward tier is ${selectedReward.amount}
                  </span>
                )}
              </div>

              {/* Simulated Card Info */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <CreditCard size={16} color="#6366f1" /> Simulated Instant Payment
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242 (Demo Test Card)"
                    className="form-input"
                    style={{ fontSize: '0.85rem', color: '#94a3b8' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981' }}>
                  <ShieldCheck size={14} /> 256-Bit SSL Encrypted & No Real Charge
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                {loading ? 'Processing Pledge...' : `Confirm Pledge of $${amount}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
