export interface AISummary {
  category: string;
  requirement: string;
  date: string;
  time: string;
  location: string;
  priority: string;
  zoneMatch?: string;
  notes?: string;
}

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  description: string;
  urgency: 'normal' | 'soon' | 'urgent';
  status: 'Pending' | 'Reviewing' | 'Volunteer Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  aiSummary?: AISummary;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  supportAreas: string[];
  availability: string[];
  experience: string;
  introNote: string;
  status: 'Pending' | 'Approved' | 'Active' | 'Inactive';
  rating: number;
  missionsCompleted: number;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DashboardStats {
  totalRequests: number;
  activeRequests: number;
  pendingRequests: number;
  completedRequests: number;
  volunteersCount: number;
  activeVolunteers: number;
  categoryCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
  statusCounts: Record<string, number>;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'patient' | 'volunteer';
  photoURL?: string;
  authProvider?: 'google' | 'local';
}

export interface MapFacility {
  id: string;
  name: string;
  type: string; // e.g. Hospital, Clinic, Pharmacy, Urgent Care
  address: string;
  distance?: string;
  accessibility?: string[];
  phone?: string;
  hours?: string;
  latitude?: number;
  longitude?: number;
}

