const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth API
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name, email, password, role) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data;
  },

  // Campaigns API
  async getCampaigns(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/campaigns?${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch campaigns');
    return data;
  },

  async getCampaignById(id) {
    const res = await fetch(`${API_BASE_URL}/campaigns/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Campaign not found');
    return data;
  },

  async createCampaign(campaignData) {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaignData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create campaign');
    return data;
  },

  async contributeToCampaign(campaignId, amount, rewardTitle) {
    const res = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/contribute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, rewardTitle })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Contribution failed');
    return data;
  },

  async postCampaignUpdate(campaignId, title, content) {
    const res = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/updates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to post update');
    return data;
  },

  async deleteCampaign(campaignId) {
    const res = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete campaign');
    return data;
  },

  // Dashboard API
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard stats');
    return data;
  }
};
