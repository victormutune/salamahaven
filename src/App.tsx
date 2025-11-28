import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import ReportIncident from '@/pages/ReportIncident';
import Emergency from '@/pages/Emergency';
import Counselors from '@/pages/Counselors';
import Community from '@/pages/Community';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AnonymousReport from '@/pages/AnonymousReport';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/anonymous-report" element={<AnonymousReport />} />

              {/* Protected Routes - Default to LandingPage */}
              <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
              <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
              <Route path="/counselors" element={<ProtectedRoute><Counselors /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
