import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LandingPage from '@/pages/LandingPage';
import ReportIncident from '@/pages/ReportIncident';
import Emergency from '@/pages/Emergency';
import Counselors from '@/pages/Counselors';
import Bookings from '@/pages/Bookings';
import Logout from '@/pages/Logout';
import Community from '@/pages/Community';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import AdminLogin from '@/pages/AdminLogin';
import { AdminRoute } from '@/components/AdminRoute';
import Register from '@/pages/Register';
import AnonymousReport from '@/pages/AnonymousReport';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';
import HelpCenter from '@/pages/HelpCenter';
import SafetyTips from '@/pages/SafetyTips';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';

import { ChatBot } from '@/components/ai/ChatBot';

import Resources from '@/pages/Resources';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/report-anonymous" element={<AnonymousReport />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<LandingPage />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/community" element={<Community />} />
              <Route path="/counselors" element={<Counselors />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/logout" element={<Logout />} />

              {/* Support Pages */}
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/safety-tips" element={<SafetyTips />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />

          </Routes>
          <ChatBot />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
