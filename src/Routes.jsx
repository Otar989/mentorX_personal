import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminPanel from './pages/admin-panel';
import LessonInterface from './pages/lesson-interface';
import CompanyDashboard from './pages/company-dashboard';
import Login from './pages/login';
import StudentDashboard from './pages/student-dashboard';
import AssignmentSubmission from './pages/assignment-submission';
import CourseDetail from './pages/course-detail';
import CourseCatalog from './pages/course-catalog';
import Register from './pages/register';
import AIVoiceTutor from './pages/ai-voice-tutor';
import Settings from './pages/settings';
import ErrorPage from './pages/404-error-page';
import SiteMap from './pages/site-map';
import Profile from './pages/profile';
import Help from './pages/help';
import PasswordReset from './pages/password-reset';
import NavigationDebugPanel from './pages/navigation-debug-panel';

const Routes = () => {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/lesson-interface" element={<LessonInterface />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/assignment-submission" element={<AssignmentSubmission />} />
        <Route path="/course-detail" element={<CourseDetail />} />
        <Route path="/course-catalog" element={<CourseCatalog />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ai-voice-tutor" element={<AIVoiceTutor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/404-error-page" element={<ErrorPage />} />
        <Route path="/site-map" element={<SiteMap />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/navigation-debug-panel" element={<NavigationDebugPanel />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;