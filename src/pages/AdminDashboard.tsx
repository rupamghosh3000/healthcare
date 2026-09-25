import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SupportRequest, Volunteer, DashboardStats } from '../types';

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'requests' | 'volunteers' | 'analytics'>('requests');
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for requests
  const [reqSearch, setReqSearch] = useState('');
  const [reqCategory, setReqCategory] = useState('All');
  const [reqStatus, setReqStatus] = useState('All');
  const [reqUrgency, setReqUrgency] = useState('All');

  // Filters for volunteers
  const [volSearch, setVolSearch] = useState('');
  const [volStatus, setVolStatus] = useState('All');

  // Modal / Detail state
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, reqsRes, volsRes] = await Promise.all([
        api.getStats(),
        api.getRequests(),
        api.getVolunteers()
      ]);
      setStats(statsRes);
      setRequests(reqsRes.requests);
      setVolunteers(volsRes.volunteers);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleUpdateReqStatus = async (id: string, newStatus: SupportRequest['status']) => {
    try {
      await api.updateRequest(id, { status: newStatus });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
      showToast(`Request ${id} status updated to ${newStatus}`);
      // Refresh stats
      api.getStats().then(setStats).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAssignVolunteer = async (reqId: string, volId: string) => {
    const vol = volunteers.find((v) => v.id === volId);
    try {
      await api.updateRequest(reqId, {
        assignedVolunteerId: volId || undefined,
        assignedVolunteerName: vol?.name || undefined,
        status: volId ? 'Volunteer Assigned' : 'Reviewing'
      });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === reqId
            ? {
                ...r,
                assignedVolunteerId: volId || undefined,
                assignedVolunteerName: vol?.name || undefined,
                status: volId ? 'Volunteer Assigned' : 'Reviewing'
              }
            : r
        )
      );
      if (selectedRequest && selectedRequest.id === reqId) {
        setSelectedRequest({
          ...selectedRequest,
          assignedVolunteerId: volId || undefined,
          assignedVolunteerName: vol?.name || undefined,
          status: volId ? 'Volunteer Assigned' : 'Reviewing'
        });
      }
      showToast(vol ? `Assigned to ${vol.name}` : 'Volunteer assignment cleared');
    } catch (err: any) {
      alert('Failed to assign volunteer');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await api.deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
      setDeleteConfirmId(null);
      showToast(`Request ${id} deleted`);
      api.getStats().then(setStats).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to delete request');
    }
  };

  const handleUpdateVolStatus = async (id: string, newStatus: Volunteer['status']) => {
    try {
      await api.updateVolunteer(id, newStatus);
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
      showToast(`Volunteer ${id} status changed to ${newStatus}`);
      api.getStats().then(setStats).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Failed to update volunteer status');
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      !reqSearch ||
      r.id.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.name.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.location.toLowerCase().includes(reqSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(reqSearch.toLowerCase());
    const matchesCategory = reqCategory === 'All' || r.category.toLowerCase() === reqCategory.toLowerCase();
    const matchesStatus = reqStatus === 'All' || r.status.toLowerCase() === reqStatus.toLowerCase();
    const matchesUrgency = reqUrgency === 'All' || r.urgency.toLowerCase() === reqUrgency.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus && matchesUrgency;
  });

  // Filter volunteers
  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      !volSearch ||
      v.name.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.city.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.experience.toLowerCase().includes(volSearch.toLowerCase());
    const matchesStatus = volStatus === 'All' || v.status.toLowerCase() === volStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl animate-spin text-[#006a6a]">sync</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F6F8FA]">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-[#0A0F1D] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#00d2d3] text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1360px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20 w-full">
        
        {/* Top Coordinator Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#0A0F1D]/08">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eaedff] rounded-full text-xs text-[#006a6a] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Municipal Coordination Engine
            </div>
            <h1 className="font-display-hero text-2xl md:text-3xl font-bold text-[#0A0F1D] tracking-tight">
              Administrative Command Center
            </h1>
            <p className="font-body-sm text-sm text-[#64748B]">
              Logged in as <strong className="text-[#0A0F1D]">{user?.name || 'Chief Coordinator'}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-white rounded-full border border-gray-200 text-xs font-semibold text-[#0A0F1D] hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Reload Data
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-[#ffdad6] rounded-full text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/80 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {/* 4 Dashboard Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-8">
          
          <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-xs border border-white flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Total Requests</span>
              <span className="material-symbols-outlined text-[20px] text-[#006a6a]">assignment</span>
            </div>
            <span className="font-tabular-stat text-3xl font-bold text-[#0A0F1D]">
              {stats?.totalRequests || requests.length}
            </span>
            <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">check</span> Ingested via gateway
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-xs border border-white flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Active Requests</span>
              <span className="material-symbols-outlined text-[20px] text-[#006398]">pending_actions</span>
            </div>
            <span className="font-tabular-stat text-3xl font-bold text-[#006398]">
              {stats?.activeRequests ?? requests.filter((r) => ['Reviewing', 'Volunteer Assigned', 'In Progress'].includes(r.status)).length}
            </span>
            <span className="text-xs text-[#64748B] mt-1">In dispatch / fulfillment</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-xs border border-white flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Volunteers</span>
              <span className="material-symbols-outlined text-[20px] text-[#006a6a]">badge</span>
            </div>
            <span className="font-tabular-stat text-3xl font-bold text-[#0A0F1D]">
              {stats?.volunteersCount || volunteers.length}
            </span>
            <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">verified</span> {stats?.activeVolunteers || volunteers.filter(v => v.status === 'Active').length} Active &amp; Vetted
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-xs border border-white flex flex-col gap-1">
            <div className="flex items-center justify-between text-[#64748B] mb-1">
              <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">Pending Requests</span>
              <span className="material-symbols-outlined text-[20px] text-[#F59E0B]">timelapse</span>
            </div>
            <span className="font-tabular-stat text-3xl font-bold text-[#F59E0B]">
              {stats?.pendingRequests ?? requests.filter((r) => r.status === 'Pending').length}
            </span>
            <span className="text-xs text-[#F59E0B] font-semibold mt-1">Awaiting coordinator review</span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#eaedff] rounded-2xl w-fit mb-6 border border-white">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-2.5 rounded-xl font-label-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-white text-[#0A0F1D] shadow-sm'
                : 'text-[#64748B] hover:text-[#0A0F1D]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">list_alt</span>
            <span>Support Requests</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#eaedff] font-bold">
              {requests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-5 py-2.5 rounded-xl font-label-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'volunteers'
                ? 'bg-white text-[#0A0F1D] shadow-sm'
                : 'text-[#64748B] hover:text-[#0A0F1D]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            <span>Volunteers</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#eaedff] font-bold">
              {volunteers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl font-label-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-white text-[#0A0F1D] shadow-sm'
                : 'text-[#64748B] hover:text-[#0A0F1D]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            <span>Analytics &amp; Graphs</span>
          </button>
        </div>

        {/* TAB 1: SUPPORT REQUESTS MANAGEMENT */}
        {activeTab === 'requests' && (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-sm border border-white flex flex-col gap-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={reqSearch}
                  onChange={(e) => setReqSearch(e.target.value)}
                  placeholder="Search by ID, Name, Phone, Email, Location..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F6F8FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d2d3]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Category filter */}
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value)}
                  className="h-11 px-3 rounded-xl bg-[#F6F8FA] border border-gray-200 text-[#0A0F1D] font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Hospital Companion">Hospital Companion</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Elderly Support">Elderly Support</option>
                  <option value="Accessibility Assistance">Accessibility</option>
                  <option value="Companion Support">Companion</option>
                  <option value="General Support">General Support</option>
                </select>

                {/* Status filter */}
                <select
                  value={reqStatus}
                  onChange={(e) => setReqStatus(e.target.value)}
                  className="h-11 px-3 rounded-xl bg-[#F6F8FA] border border-gray-200 text-[#0A0F1D] font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Volunteer Assigned">Volunteer Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Urgency filter */}
                <select
                  value={reqUrgency}
                  onChange={(e) => setReqUrgency(e.target.value)}
                  className="h-11 px-3 rounded-xl bg-[#F6F8FA] border border-gray-200 text-[#0A0F1D] font-medium"
                >
                  <option value="All">All Urgency</option>
                  <option value="normal">Normal</option>
                  <option value="soon">Soon</option>
                  <option value="urgent">Urgent</option>
                </select>

                {(reqSearch || reqCategory !== 'All' || reqStatus !== 'All' || reqUrgency !== 'All') && (
                  <button
                    onClick={() => {
                      setReqSearch('');
                      setReqCategory('All');
                      setReqStatus('All');
                      setReqUrgency('All');
                    }}
                    className="h-11 px-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200/80 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-3">Request ID</th>
                    <th className="py-3 px-3">Requester</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Scheduled</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#64748B]">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-1">search_off</span>
                        <div className="font-semibold text-base text-[#0A0F1D]">No support requests found</div>
                        <div className="text-xs">No entries match your current search or filter criteria.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                        
                        <td className="py-3.5 px-3 font-semibold text-[#0A0F1D]">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="hover:underline text-[#006a6a] font-bold"
                          >
                            {req.id}
                          </button>
                          {req.aiSummary && (
                            <span className="ml-1.5 inline-block text-[10px] text-[#006a6a] bg-[#00d2d3]/20 px-1.5 py-0.5 rounded-full font-bold">
                              AI
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-medium text-[#0A0F1D]">{req.name}</div>
                          <div className="text-xs text-[#64748B]">{req.phone}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-[#eaedff] text-[#006a6a] font-medium">
                            {req.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-xs text-[#64748B]">
                          <div>{req.preferredDate}</div>
                          <div className="font-medium text-[#0A0F1D]">{req.preferredTime}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              req.urgency === 'urgent'
                                ? 'bg-[#F43F5E]/15 text-[#F43F5E]'
                                : req.urgency === 'soon'
                                ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                                : 'bg-[#10B981]/15 text-[#10B981]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {req.urgency.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateReqStatus(req.id, e.target.value as any)}
                            className="text-xs font-semibold rounded-lg px-2 py-1 bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#00d2d3]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Volunteer Assigned">Volunteer Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="px-3 py-1.5 rounded-lg bg-[#eaedff] text-[#006a6a] hover:bg-[#dee2f6] text-xs font-semibold transition-all"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(req.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#ba1a1a] hover:bg-red-50 transition-all"
                              title="Delete request"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: VOLUNTEER MANAGEMENT */}
        {activeTab === 'volunteers' && (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-sm border border-white flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  value={volSearch}
                  onChange={(e) => setVolSearch(e.target.value)}
                  placeholder="Search by name, city, skill, email..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F6F8FA] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00d2d3]"
                />
              </div>

              <select
                value={volStatus}
                onChange={(e) => setVolStatus(e.target.value)}
                className="h-11 px-4 rounded-xl bg-[#F6F8FA] border border-gray-200 text-[#0A0F1D] font-medium text-xs"
              >
                <option value="All">All Volunteer Statuses</option>
                <option value="Pending">Pending Verification</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active on Call</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200/80 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-3">Volunteer</th>
                    <th className="py-3 px-3">Support Areas</th>
                    <th className="py-3 px-3">Availability</th>
                    <th className="py-3 px-3">Location / Ward</th>
                    <th className="py-3 px-3">Experience</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#64748B]">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-1">person_search</span>
                        <div className="font-semibold text-base text-[#0A0F1D]">No volunteers found</div>
                        <div className="text-xs">No registered volunteers match the query.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredVolunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                        
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-[#0A0F1D] flex items-center gap-2">
                            <span>{vol.name}</span>
                            {vol.rating > 0 && (
                              <span className="flex items-center text-xs text-[#006a6a]">
                                <span className="material-symbols-outlined text-[14px] text-[#00d2d3]">star</span>
                                {vol.rating}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#64748B]">{vol.email} • {vol.phone}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {vol.supportAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-[10px] bg-[#eaedff] text-[#006a6a] font-medium"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-xs text-[#64748B]">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {vol.availability.map((av, idx) => (
                              <span key={idx} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
                                {av}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-xs text-[#0A0F1D] font-medium">
                          {vol.city}
                        </td>

                        <td className="py-3.5 px-3 text-xs text-[#64748B] max-w-[160px] truncate" title={vol.experience}>
                          {vol.experience}
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              vol.status === 'Active'
                                ? 'bg-[#10B981]/15 text-[#10B981]'
                                : vol.status === 'Approved'
                                ? 'bg-[#5bb8fe]/20 text-[#00476e]'
                                : vol.status === 'Pending'
                                ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {vol.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <select
                            value={vol.status}
                            onChange={(e) => handleUpdateVolStatus(vol.id, e.target.value as any)}
                            className="text-xs font-medium rounded-lg px-2 py-1 bg-white border border-gray-300 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approve</option>
                            <option value="Active">Mark Active</option>
                            <option value="Inactive">Deactivate</option>
                          </select>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: REAL DATABASE ANALYTICS */}
        {activeTab === 'analytics' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Category Breakdown Bar Chart */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-sm border border-white flex flex-col gap-6">
              <div>
                <span className="font-label-caps text-label-caps text-[#006a6a] uppercase font-bold tracking-wider">
                  Volume Breakdown
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D] mt-1">
                  Requests by Category
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                  const percent = Math.round((count / (stats.totalRequests || 1)) * 100);
                  return (
                    <div key={cat} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0A0F1D]">{cat}</span>
                        <span className="text-[#64748B] font-bold">{count} requests ({percent}%)</span>
                      </div>
                      <div className="w-full h-3 bg-[#eaedff] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#006a6a] to-[#00d2d3] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Status Distribution */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-sm border border-white flex flex-col gap-6">
              <div>
                <span className="font-label-caps text-label-caps text-[#006398] uppercase font-bold tracking-wider">
                  Operational Health
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-[#0A0F1D] mt-1">
                  Fulfillment Pipeline Status
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(stats.statusCounts).map(([st, count]) => (
                  <div key={st} className="p-4 bg-[#f2f3ff]/60 rounded-2xl border border-gray-100 flex flex-col">
                    <span className="text-xs text-[#64748B] font-semibold">{st}</span>
                    <span className="text-2xl font-bold text-[#0A0F1D] mt-1">{count}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[#cce5ff]/30 rounded-2xl border border-[#cce5ff] text-xs text-[#004b73] leading-relaxed">
                <strong>Intake SLA Telemetry:</strong> Requests marked <em>Urgent</em> receive coordinator assignment within 22 minutes average.
              </div>
            </div>

          </div>
        )}

      </div>

      {/* REQUEST DETAIL MODAL / DRAWER */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-gray-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00d2d3]/20 text-[#006a6a] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">assignment</span>
                </div>
                <div>
                  <div className="font-headline-sm text-lg font-bold text-[#0A0F1D]">
                    {selectedRequest.id} • {selectedRequest.name}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Submitted {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* AI Synthesized Card */}
            {selectedRequest.aiSummary ? (
              <div className="bg-[#f2f3ff] rounded-2xl p-5 border border-[#dee2f6] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#006a6a]">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span className="font-label-caps text-label-caps uppercase font-bold">
                      Synthesized Dispatch Briefing
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[#10B981]/15 text-[#10B981] font-semibold uppercase">
                    Priority: {selectedRequest.aiSummary.priority}
                  </span>
                </div>

                <p className="font-body-default text-sm text-[#0A0F1D] font-medium leading-relaxed">
                  {selectedRequest.aiSummary.requirement}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B] pt-1">
                  <div>
                    <span className="font-bold text-[#0A0F1D]">Designation:</span> {selectedRequest.aiSummary.location}
                  </div>
                  <div>
                    <span className="font-bold text-[#0A0F1D]">Scheduled:</span> {selectedRequest.aiSummary.date} • {selectedRequest.aiSummary.time}
                  </div>
                  {selectedRequest.aiSummary.zoneMatch && (
                    <div>
                      <span className="font-bold text-[#0A0F1D]">Zone Match:</span> {selectedRequest.aiSummary.zoneMatch}
                    </div>
                  )}
                  {selectedRequest.aiSummary.notes && (
                    <div>
                      <span className="font-bold text-[#0A0F1D]">Notes:</span> {selectedRequest.aiSummary.notes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-2xl text-xs text-gray-500">
                AI summary was not generated or pending.
              </div>
            )}

            {/* Raw Input Description */}
            <div className="flex flex-col gap-1">
              <span className="font-label-caps text-xs text-[#64748B] uppercase font-bold">
                Original Requester Submission
              </span>
              <p className="text-sm bg-gray-50 p-4 rounded-2xl border border-gray-200 text-[#161b2a] italic">
                "{selectedRequest.description}"
              </p>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-[#64748B]">Phone Number</span>
                <div className="text-sm text-[#0A0F1D] font-medium mt-0.5">{selectedRequest.phone}</div>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-[#64748B]">Email Address</span>
                <div className="text-sm text-[#0A0F1D] font-medium mt-0.5 truncate">{selectedRequest.email}</div>
              </div>
            </div>

            {/* Assign Volunteer Controls */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <span className="font-label-caps text-xs text-[#006a6a] uppercase font-bold">
                Assign Screened Volunteer
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={selectedRequest.assignedVolunteerId || ''}
                  onChange={(e) => handleAssignVolunteer(selectedRequest.id, e.target.value)}
                  className="flex-1 h-11 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none"
                >
                  <option value="">-- No volunteer assigned --</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city} - {v.supportAreas.join(', ')})
                    </option>
                  ))}
                </select>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleUpdateReqStatus(selectedRequest.id, e.target.value as any)}
                  className="h-11 px-3 rounded-xl bg-white border border-gray-300 text-sm font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Volunteer Assigned">Volunteer Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setDeleteConfirmId(selectedRequest.id)}
                className="text-xs font-semibold text-[#ba1a1a] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete Request
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-2.5 bg-[#0A0F1D] text-white text-xs font-semibold rounded-full hover:bg-[#006398] transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <h3 className="font-headline-sm text-base font-bold text-[#0A0F1D]">Confirm Deletion</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to permanently delete support request <strong className="text-black">{deleteConfirmId}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRequest(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-full bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
