import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import CreateCoverLetter from './pages/CreateCoverLetter';
import UpdateResume from './pages/UpdateResume';
import UpdateCoverLetter from './pages/UpdateCoverLetter';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Resource pages
import CareerTips from './pages/resources/CareerTips';
import InterviewGuide from './pages/resources/InterviewGuide';
import JobSearchTips from './pages/resources/JobSearchTips';

// Company pages
import AboutUs from './pages/company/AboutUs';
import Contact from './pages/company/Contact';

// Legal pages
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-primary-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-primary-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/create-resume" 
        element={
          <ProtectedRoute>
            <CreateResume />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/create-cover-letter" 
        element={
          <ProtectedRoute>
            <CreateCoverLetter />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/update-resume/:id" 
        element={
          <ProtectedRoute>
            <UpdateResume />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/update-coverLetter/:id" 
        element={
          <ProtectedRoute>
            <UpdateCoverLetter />
          </ProtectedRoute>
        } 
      />

      {/* Resource Routes */}
      <Route path="/resources/career-tips" element={<CareerTips />} />
      <Route path="/resources/interview-guide" element={<InterviewGuide />} />
      <Route path="/resources/job-search-tips" element={<JobSearchTips />} />

      {/* Company Routes */}
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />

      {/* Legal Routes */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;