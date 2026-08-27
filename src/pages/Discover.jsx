import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { CampaignCard } from '../components/CampaignCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const categories = ['All', 'Technology', 'Green Tech', 'Gaming', 'Creative Art', 'Community', 'Health & Fitness', 'Education'];

  const fetchFilteredCampaigns = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (searchQuery) params.search = searchQuery;
      if (status) params.status = status;
      if (sort) params.sort = sort;

      const data = await api.getCampaigns(params);
      setCampaigns(data);
    } catch (err) {
      console.error('Discover page error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredCampaigns();
  }, [category, status, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredCampaigns();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setStatus('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Discover Innovative Campaigns</h1>
          <p style={{ color: '#94a3b8' }}>Search, filter, and back the most promising projects across all categories.</p>
        </div>

        {/* Search Bar & Mobile Controls */}
        <form onSubmit={handleSearchSubmit} className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter search keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.8rem', border: 'none', background: 'transparent' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
          {/* Sidebar Filter Options */}
          <aside>
            <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SlidersHorizontal size={18} color="#6366f1" /> Filters
                </h3>
                <button
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>

              {/* Category Radio / List */}
              <div className="form-group">
                <label className="form-label" style={{ color: '#fff', fontWeight: '600', marginBottom: '0.75rem' }}>Category</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        textAlign: 'left',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        background: category === cat ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        color: category === cat ? '#818cf8' : '#94a3b8',
                        border: category === cat ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label" style={{ color: '#fff', fontWeight: '600' }}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="successful">Funded / Successful</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label" style={{ color: '#fff', fontWeight: '600' }}>Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="form-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Backers</option>
                  <option value="funded">Most Funds Raised</option>
                  <option value="endingSoon">Ending Soonest</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Campaign Results Grid */}
          <main>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                <p>Loading matching campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <Filter size={48} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No Campaigns Found</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Try adjusting your search criteria or resetting filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="campaign-grid">
                {campaigns.map((camp) => (
                  <CampaignCard key={camp._id} campaign={camp} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
