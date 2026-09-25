import { SupportRequest, Volunteer, DashboardStats, FAQItem, AdminUser } from '../types';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('careconnect_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Support Requests
  async createRequest(data: {
    name: string;
    email: string;
    phone: string;
    category: string;
    preferredDate: string;
    preferredTime: string;
    location: string;
    description: string;
    urgency: string;
    consent: boolean;
  }): Promise<{ success: boolean; message: string; request: SupportRequest; warning?: string }> {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit request' }));
      throw new Error(err.error || 'Failed to submit request');
    }
    return res.json();
  },

  async getRequests(params?: {
    search?: string;
    category?: string;
    status?: string;
    urgency?: string;
  }): Promise<{ requests: SupportRequest[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.urgency) query.set('urgency', params.urgency);

    const res = await fetch(`/api/requests?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to fetch requests');
    }
    return res.json();
  },

  async getRequestById(id: string): Promise<{ request: SupportRequest }> {
    const res = await fetch(`/api/requests/${id}`);
    if (!res.ok) {
      throw new Error(`Request ${id} not found`);
    }
    return res.json();
  },

  async updateRequest(
    id: string,
    updates: Partial<SupportRequest>
  ): Promise<{ success: boolean; request: SupportRequest }> {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update request' }));
      throw new Error(err.error || 'Failed to update request');
    }
    return res.json();
  },

  async deleteRequest(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete request' }));
      throw new Error(err.error || 'Failed to delete request');
    }
    return res.json();
  },

  // Volunteers
  async createVolunteer(data: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    supportAreas: string[];
    availability: string[];
    experience: string;
    introNote: string;
  }): Promise<{ success: boolean; message: string; volunteer: Volunteer }> {
    const res = await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to register volunteer' }));
      throw new Error(err.error || 'Failed to register volunteer');
    }
    return res.json();
  },

  async getVolunteers(params?: {
    search?: string;
    status?: string;
    area?: string;
  }): Promise<{ volunteers: Volunteer[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.area) query.set('area', params.area);

    const res = await fetch(`/api/volunteers?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      throw new Error('Failed to fetch volunteers');
    }
    return res.json();
  },

  async updateVolunteer(
    id: string,
    status: Volunteer['status']
  ): Promise<{ success: boolean; volunteer: Volunteer }> {
    const res = await fetch(`/api/volunteers/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update volunteer' }));
      throw new Error(err.error || 'Failed to update volunteer');
    }
    return res.json();
  },

  // AI Service
  async chatWithAI(params: {
    message: string;
    history?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    role?: 'navigator' | 'volunteer' | 'general' | 'triage';
    modelTier?: 'fast' | 'general' | 'complex';
  } | string): Promise<{ answer: string; isEmergency?: boolean; modelUsed?: string }> {
    const payload = typeof params === 'string' ? { message: params } : params;
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('AI assistant response failed');
    }
    return res.json();
  },

  // Feature 3: Google Maps Facility Grounding
  async searchFacilitiesWithMaps(
    query: string,
    location?: string
  ): Promise<{
    facilities: Array<{
      name: string;
      type: string;
      address: string;
      distance?: string;
      accessibility?: string[];
      phone?: string;
      hours?: string;
      notes?: string;
    }>;
    groundedSummary: string;
    modelUsed: string;
  }> {
    const res = await fetch('/api/ai/maps-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, location })
    });
    if (!res.ok) {
      throw new Error('Google Maps grounding search failed');
    }
    return res.json();
  },

  // Stats & FAQs
  async getStats(): Promise<DashboardStats> {
    const res = await fetch('/api/stats');
    if (!res.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return res.json();
  },

  async getFAQs(): Promise<{ faqs: FAQItem[] }> {
    const res = await fetch('/api/faqs');
    if (!res.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    return res.json();
  },

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Invalid login' }));
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      throw new Error('Session invalid');
    }
    return res.json();
  }
};
