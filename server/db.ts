import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

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
  id: string; // e.g. CC-1024
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

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface DBData {
  requests: SupportRequest[];
  volunteers: Volunteer[];
  users: AdminUser[];
  faqs: FAQItem[];
  nextRequestId: number;
  nextVolunteerId: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What kind of support can I request?',
    answer: 'You can request non-clinical community support such as hospital accompaniment (sitting with you, ambulatory check-in navigation, pharmacy collection), non-emergency transportation to and from scheduled appointments, elderly assistance (grocery pickup, check-ins), and door-to-door mobility guidance.'
  },
  {
    id: 'faq-2',
    category: 'Volunteering',
    question: 'How can I become a volunteer?',
    answer: 'You can navigate to the Volunteer Portal, complete the short registration form with your preferred service categories, weekly availability windows, and municipal zone. Our district coordinators conduct an identity verification and onboarding review within 24 hours.'
  },
  {
    id: 'faq-3',
    category: 'Transportation',
    question: 'Can I request transportation help?',
    answer: 'Yes! Vetted volunteers offer rides to non-urgent medical checkups, clinic consultations, and pharmacy pickups. However, CareConnect is not an ambulance service; if emergency transport or paramedic life support is required, dial 911 immediately.'
  },
  {
    id: 'faq-4',
    category: 'Process',
    question: 'How does the support request process work?',
    answer: '1. You submit your request via our simple form. 2. Our deterministic AI intake engine structures and summarizes your logistics (time, location, mobility aids needed) without touching sensitive health records. 3. Municipal coordinators review and pair your request with vetted neighborhood volunteers within 45 minutes.'
  },
  {
    id: 'faq-5',
    category: 'Emergency & Safety',
    question: 'Is CareConnect an emergency medical service?',
    answer: 'NO. CareConnect is strictly for non-emergency civil healthcare navigation and neighborly community aid. CareConnect volunteers do not prescribe medications, diagnose conditions, or provide invasive care. For any acute or life-threatening crisis, call 911 immediately.'
  },
  {
    id: 'faq-6',
    category: 'Process',
    question: 'What happens after I submit a request?',
    answer: 'You receive an instant reference ID (e.g. CC-1042) and an interactive synthesis summary. A local coordinator verifies volunteer availability in your sector, matches an accredited caregiver, and updates you via SMS and email confirmation.'
  }
];

class Database {
  private data: DBData;

  constructor() {
    this.data = this.load();
  }

  private load(): DBData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading db.json, re-initializing...', err);
    }
    return this.seedInitial();
  }

  private seedInitial(): DBData {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('admin123', salt);

    const initialData: DBData = {
      nextRequestId: 1045,
      nextVolunteerId: 412,
      users: [
        {
          id: 'admin-1',
          email: 'admin@careconnect.org',
          passwordHash,
          name: 'Chief Coordinator Sarah',
          role: 'admin'
        }
      ],
      faqs: INITIAL_FAQS,
      volunteers: [
        {
          id: 'VOL-401',
          name: 'Marcus Chen',
          email: 'marcus.chen@carenetwork.org',
          phone: '(555) 439-0129',
          city: 'Metro District 4, North Hills',
          supportAreas: ['Transportation', 'Hospital Companion', 'Elderly Assistance'],
          availability: ['Weekdays', 'Morning (8am - 12pm)', 'Afternoon (12pm - 5pm)'],
          experience: 'CPR / Basic Life Support certified',
          introNote: 'Retired physical therapist assistant with flexible weekday mornings.',
          status: 'Active',
          rating: 5.0,
          missionsCompleted: 48,
          createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
        },
        {
          id: 'VOL-402',
          name: 'Alice Reynolds',
          email: 'alice.reynolds@civicaid.org',
          phone: '(555) 872-9011',
          city: 'West Health District #04',
          supportAreas: ['Hospital Companion', 'Accessibility Aid'],
          availability: ['Weekends', 'Morning (8am - 12pm)'],
          experience: 'Retired nurse or healthcare professional',
          introNote: 'Registered nurse (retired) wishing to give comfort to outpatient visitors.',
          status: 'Active',
          rating: 4.9,
          missionsCompleted: 42,
          createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
        },
        {
          id: 'VOL-403',
          name: 'David Kim',
          email: 'david.kim@metro.org',
          phone: '(555) 302-8841',
          city: 'Metro District 2, South Park',
          supportAreas: ['Transportation', 'General Support'],
          availability: ['Weekdays', 'Evening (5pm - 9pm)'],
          experience: 'Active community organizer / Neighborhood watch',
          introNote: 'Have reliable 4-door vehicle equipped with accessible seating.',
          status: 'Active',
          rating: 4.8,
          missionsCompleted: 29,
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
        },
        {
          id: 'VOL-404',
          name: 'Elena Rostova',
          email: 'elena.rostova@carenet.org',
          phone: '(555) 914-2200',
          city: 'Central District 1',
          supportAreas: ['Elderly Assistance', 'Companion Support'],
          availability: ['Weekends', 'Afternoon (12pm - 5pm)'],
          experience: 'Nursing / Pre-Med / Paramedic student',
          introNote: '2nd year nursing student fluent in English and Ukrainian.',
          status: 'Approved',
          rating: 5.0,
          missionsCompleted: 14,
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
        },
        {
          id: 'VOL-405',
          name: 'Jamal Washington',
          email: 'jamal.w@communitymail.org',
          phone: '(555) 604-3321',
          city: 'East District 3',
          supportAreas: ['Transportation', 'Accessibility Aid'],
          availability: ['Weekdays', 'Morning (8am - 12pm)'],
          experience: 'CPR / Basic Life Support certified',
          introNote: 'Comfortable aiding seniors with foldable walkers.',
          status: 'Pending',
          rating: 0,
          missionsCompleted: 0,
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
        }
      ],
      requests: [
        {
          id: 'CC-1042',
          name: 'Eleanor Vance',
          email: 'eleanor.vance@example.org',
          phone: '(555) 234-8901',
          category: 'Hospital Companion',
          preferredDate: 'Tomorrow',
          preferredTime: '10:00 AM',
          location: 'City Hospital, West Wing (Entrance Gate 3)',
          description: 'Someone to accompany the patient through ambulatory check-in, waiting room transitions, and pharmacy collection.',
          urgency: 'normal',
          status: 'Reviewing',
          aiSummary: {
            category: 'Hospital Companion',
            requirement: 'Someone to accompany the patient through ambulatory check-in, waiting room transitions, and pharmacy collection.',
            date: 'Tomorrow',
            time: '10:00 AM',
            location: 'City Hospital, West Wing',
            priority: 'Normal',
            zoneMatch: 'West Health District #04',
            notes: 'Wheelchair assistance ready; English speaker; Check-in: 15m prior.'
          },
          assignedVolunteerId: 'VOL-402',
          assignedVolunteerName: 'Alice Reynolds',
          createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: 'CC-1041',
          name: 'Arthur Pendelton',
          email: 'arthur.p@outlook.com',
          phone: '(555) 789-1029',
          category: 'Transportation',
          preferredDate: 'Today',
          preferredTime: '2:30 PM',
          location: 'Mercy Diagnostic Pavilion, Suite 200',
          description: 'Need a ride back home after cataract surgery dilation. Cannot drive for 4 hours.',
          urgency: 'soon',
          status: 'Volunteer Assigned',
          aiSummary: {
            category: 'Transportation',
            requirement: 'Post-cataract procedure patient pickup and safe escort to residence.',
            date: 'Today',
            time: '2:30 PM',
            location: 'Mercy Diagnostic Pavilion',
            priority: 'Soon',
            zoneMatch: 'Central District 1',
            notes: 'Vision impaired temporarily from pupil dilation; sunglasses needed.'
          },
          assignedVolunteerId: 'VOL-401',
          assignedVolunteerName: 'Marcus Chen',
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
        },
        {
          id: 'CC-1040',
          name: 'Lillian Zhao',
          email: 'lillian.z@gmail.com',
          phone: '(555) 441-9920',
          category: 'Elderly Support',
          preferredDate: '2026-09-27',
          preferredTime: 'Morning (9:00 AM)',
          location: 'Oakridge Senior Living Apt 4B',
          description: 'Help picking up bi-weekly maintenance heart prescriptions from Walgreens and carrying grocery bags.',
          urgency: 'normal',
          status: 'Pending',
          aiSummary: {
            category: 'Elderly Support',
            requirement: 'Prescription pickup and grocery assistance for senior resident.',
            date: '2026-09-27',
            time: '9:00 AM',
            location: 'Oakridge Senior Living',
            priority: 'Normal',
            zoneMatch: 'Metro District 4, North Hills',
            notes: 'Two light bags. Contact reception for gate code.'
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
        },
        {
          id: 'CC-1039',
          name: 'Marcus Brody',
          email: 'mbrody@univ.edu',
          phone: '(555) 902-1144',
          category: 'Accessibility Assistance',
          preferredDate: '2026-09-26',
          preferredTime: '11:00 AM',
          location: 'University Orthopedic Rehab Clinic',
          description: 'Recent ankle fracture surgery, need assistance with crutches navigating steep stairs at clinic entrance.',
          urgency: 'urgent',
          status: 'In Progress',
          aiSummary: {
            category: 'Accessibility Assistance',
            requirement: 'Physical guiding assistance navigating multi-story clinic entrance on crutches.',
            date: '2026-09-26',
            time: '11:00 AM',
            location: 'University Orthopedic Rehab Clinic',
            priority: 'Urgent',
            zoneMatch: 'Metro District 2, South Park',
            notes: 'Requires patient, steady physical support.'
          },
          assignedVolunteerId: 'VOL-403',
          assignedVolunteerName: 'David Kim',
          createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        },
        {
          id: 'CC-1038',
          name: 'Carlos Mendoza',
          email: 'carlos.m@health.org',
          phone: '(555) 512-8899',
          category: 'Companion Support',
          preferredDate: '2026-09-24',
          preferredTime: '1:00 PM',
          location: 'Saint Jude Memorial Outpatient',
          description: 'Senior father feels anxious sitting alone in oncology waiting room; requested friendly Spanish-speaking presence.',
          urgency: 'normal',
          status: 'Completed',
          aiSummary: {
            category: 'Companion Support',
            requirement: 'Bedside waiting room presence and conversation in Spanish.',
            date: '2026-09-24',
            time: '1:00 PM',
            location: 'Saint Jude Memorial Outpatient',
            priority: 'Normal',
            zoneMatch: 'Central District 1',
            notes: 'Companion mission completed with volunteer Elena Rostova.'
          },
          assignedVolunteerId: 'VOL-404',
          assignedVolunteerName: 'Elena Rostova',
          createdAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
        }
      ]
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DBData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.data = data;
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  // Requests
  public getRequests(): SupportRequest[] {
    return [...this.data.requests];
  }

  public getRequestById(id: string): SupportRequest | undefined {
    return this.data.requests.find((r) => r.id === id);
  }

  public createRequest(data: Omit<SupportRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: SupportRequest['status'] }): SupportRequest {
    const id = `CC-${this.data.nextRequestId++}`;
    const newReq: SupportRequest = {
      ...data,
      id,
      status: data.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.requests.unshift(newReq);
    this.saveData(this.data);
    return newReq;
  }

  public updateRequest(id: string, updates: Partial<SupportRequest>): SupportRequest | null {
    const idx = this.data.requests.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.requests[idx] = {
      ...this.data.requests[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.requests[idx];
  }

  public deleteRequest(id: string): boolean {
    const initialLen = this.data.requests.length;
    this.data.requests = this.data.requests.filter((r) => r.id !== id);
    if (this.data.requests.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Volunteers
  public getVolunteers(): Volunteer[] {
    return [...this.data.volunteers];
  }

  public getVolunteerById(id: string): Volunteer | undefined {
    return this.data.volunteers.find((v) => v.id === id);
  }

  public createVolunteer(data: Omit<Volunteer, 'id' | 'createdAt' | 'rating' | 'missionsCompleted' | 'status'> & { status?: Volunteer['status'] }): Volunteer {
    const id = `VOL-${this.data.nextVolunteerId++}`;
    const newVol: Volunteer = {
      ...data,
      id,
      status: data.status || 'Pending',
      rating: 5.0,
      missionsCompleted: 0,
      createdAt: new Date().toISOString()
    };
    this.data.volunteers.unshift(newVol);
    this.saveData(this.data);
    return newVol;
  }

  public updateVolunteer(id: string, updates: Partial<Volunteer>): Volunteer | null {
    const idx = this.data.volunteers.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.data.volunteers[idx] = {
      ...this.data.volunteers[idx],
      ...updates
    };
    this.saveData(this.data);
    return this.data.volunteers[idx];
  }

  // Admin user
  public getUserByEmail(email: string): AdminUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  // FAQs
  public getFAQs(): FAQItem[] {
    return [...this.data.faqs];
  }

  // Stats calculation
  public getStats() {
    const requests = this.data.requests;
    const volunteers = this.data.volunteers;

    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
    const activeRequests = requests.filter((r) => ['Reviewing', 'Volunteer Assigned', 'In Progress'].includes(r.status)).length;
    const completedRequests = requests.filter((r) => r.status === 'Completed').length;
    const activeVolunteers = volunteers.filter((v) => v.status === 'Active' || v.status === 'Approved').length;

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    requests.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    // Priority breakdown
    const priorityCounts: Record<string, number> = {
      normal: 0,
      soon: 0,
      urgent: 0
    };
    requests.forEach((r) => {
      priorityCounts[r.urgency] = (priorityCounts[r.urgency] || 0) + 1;
    });

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    requests.forEach((r) => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });

    return {
      totalRequests,
      activeRequests,
      pendingRequests,
      completedRequests,
      volunteersCount: volunteers.length,
      activeVolunteers,
      categoryCounts,
      priorityCounts,
      statusCounts
    };
  }
}

export const db = new Database();
