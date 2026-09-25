import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingAIWidget } from './components/FloatingAIWidget';

import { Home } from './pages/Home';
import { RequestSupport } from './pages/RequestSupport';
import { RequestProcessing } from './pages/RequestProcessing';
import { RequestSuccess } from './pages/RequestSuccess';
import { Volunteer } from './pages/Volunteer';
import { FAQ } from './pages/FAQ';
import { AIAssistant } from './pages/AIAssistant';
import { About } from './pages/About';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Scroll to top on navigation helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#F6F8FA] text-[#161b2a] selection:bg-[#00d2d3]/30 font-body-default">
          {/* Floating Pill Header */}
          <Navbar />

          {/* Main App Routes */}
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/request-support" element={<RequestSupport />} />
              <Route path="/request-processing/:id" element={<RequestProcessing />} />
              <Route path="/request-success/:id" element={<RequestSuccess />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/about" element={<About />} />
              
              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <Footer />

          {/* Bottom-right Floating AI Assistant Widget */}
          <FloatingAIWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
