import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Rocket, Plus, Trash2, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Image, DollarSign, Calendar } from 'lucide-react';

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Technology',
    targetGoal: 10000,
    deadline: '',
    imageUrl: ''
  });

  // Reward Tiers state
  const [rewards, setRewards] = useState([
    { title: 'Early Bird Backer Pack', amount: 50, description: 'Get 1x early access unit at 30% discount off retail.', estimatedDelivery: 'Within 60 days' }
  ]);

  const categories = ['Technology', 'Creative Art', 'Gaming', 'Community', 'Green Tech', 'Health & Fitness', 'Education'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReward = () => {
    setRewards((prev) => [
      ...prev,
      { title: '', amount: 25, description: '', estimatedDelivery: '' }
    ]);
  };

  const handleRewardChange = (index, field, value) => {
    const updated = [...rewards];
    updated[index][field] = value;
    setRewards(updated);
  };

  const handleRemoveReward = (index) => {
    setRewards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.tagline) {
        setError('Please enter both a title and tagline for your campaign.');
        return;
      }
    } else if (step === 2) {
      if (!formData.targetGoal || !formData.deadline || !formData.description) {
        setError('Please complete the goal, deadline, and detailed project story.');
        return;
      }
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmitCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        targetGoal: Number(formData.targetGoal),
        rewards: rewards.filter((r) => r.title && r.amount > 0)
      };

      const created = await api.createCampaign(payload);
      navigate(`/campaign/${created._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create campaign. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Wizard Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            <Sparkles size={16} /> Campaign Creation Wizard
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Launch Your Vision</h1>
          <p style={{ color: '#94a3b8' }}>Fill in your project details to begin raising funds from backers worldwide.</p>
        </div>

        {/* Wizard Step Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', position: 'relative' }}>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step >= num ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.05)',
                border: step >= num ? 'none' : '1px solid var(--border-color)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: step === num ? 'var(--shadow-glow)' : 'none'
              }}>
                {step > num ? <CheckCircle2 size={20} /> : num}
              </div>
              <span style={{ fontSize: '0.78rem', color: step >= num ? '#fff' : '#64748b', marginTop: '0.4rem', fontWeight: '500' }}>
                {num === 1 ? 'Basics' : num === 2 ? 'Goal & Story' : num === 3 ? 'Rewards' : 'Publish'}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.9rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            fontSize: '0.92rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmitCampaign} className="glass-card" style={{ padding: '2.5rem' }}>
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Step 1: Campaign Basics</h3>

              <div className="form-group">
                <label className="form-label">Campaign Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter campaign title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Tagline *</label>
                <input
                  type="text"
                  name="tagline"
                  placeholder="Enter short tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <div style={{ position: 'relative' }}>
                  <Image size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="Enter image URL"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ paddingLeft: '2.6rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GOAL & STORY */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Step 2: Funding Goal & Story</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Funding Target Goal ($ USD) *</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={18} color="#10b981" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="number"
                      name="targetGoal"
                      min="100"
                      placeholder="Enter target goal amount"
                      value={formData.targetGoal}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Funding Deadline *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} color="#6366f1" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Campaign Story & Details *</label>
                <textarea
                  name="description"
                  placeholder="Enter full campaign story and project details"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  style={{ minHeight: '180px' }}
                  required
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: REWARD TIERS */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem' }}>Step 3: Reward Tiers</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Create incentives for backers to pledge higher amounts.</p>
                </div>
                <button type="button" onClick={handleAddReward} className="btn btn-secondary btn-sm">
                  <Plus size={16} /> Add Reward Tier
                </button>
              </div>

              {rewards.map((reward, index) => (
                <div key={index} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', color: '#818cf8' }}>Reward Tier #{index + 1}</h4>
                    {rewards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveReward(index)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="text"
                        placeholder="Enter reward title"
                        value={reward.title}
                        onChange={(e) => handleRewardChange(index, 'title', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="number"
                        placeholder="Enter min amount ($)"
                        value={reward.amount}
                        onChange={(e) => handleRewardChange(index, 'amount', Number(e.target.value))}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <textarea
                      placeholder="Enter reward description and perks"
                      value={reward.description}
                      onChange={(e) => handleRewardChange(index, 'description', e.target.value)}
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      placeholder="Enter estimated delivery date"
                      value={reward.estimatedDelivery}
                      onChange={(e) => handleRewardChange(index, 'estimatedDelivery', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: REVIEW & PUBLISH */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Step 4: Review & Publish</h3>
              
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                  <img
                    src={formData.imageUrl || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=300&q=80'}
                    alt="Preview"
                    style={{ width: '120px', height: '90px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <span className="badge-pill" style={{ marginBottom: '0.4rem' }}>{formData.category}</span>
                    <h4 style={{ fontSize: '1.2rem' }}>{formData.title || 'Untitled Campaign'}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{formData.tagline}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Target Goal:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>${Number(formData.targetGoal).toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Deadline:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{formData.deadline}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Rewards Created:</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#818cf8' }}>{rewards.length} Tiers</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1rem', borderRadius: '12px', fontSize: '0.88rem', color: '#6ee7b7', marginBottom: '2rem' }}>
                🚀 Ready to launch! Once published, your campaign will immediately accept backer contributions.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            {step > 1 ? (
              <button type="button" onClick={handlePrevStep} className="btn btn-secondary">
                <ArrowLeft size={16} /> Previous Step
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNextStep} className="btn btn-primary">
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                <Rocket size={20} />
                {loading ? 'Publishing Campaign...' : 'Publish Campaign Now'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
