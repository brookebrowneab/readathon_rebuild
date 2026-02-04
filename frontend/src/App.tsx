import { Navigate, Route, Routes } from 'react-router-dom';
import LogReadingPage from './pages/LogReadingPage';
import ManageChildrenPage from './pages/family/ManageChildrenPage';
import ChildDetailsPage from './pages/family/ChildDetailsPage';
import StudentPinLoginPage from './pages/student/StudentPinLoginPage';
import StudentLogReadingPage from './pages/student/StudentLogReadingPage';
import SponsorGatewayPage from './pages/sponsor/SponsorGatewayPage';
import FamilySponsorPage from './pages/sponsor/FamilySponsorPage';
import SponsorLandingPage from './pages/sponsor/SponsorLandingPage';
import SponsorPaymentPage from './pages/sponsor/SponsorPaymentPage';
import GuestPaymentPage from './pages/sponsor/GuestPaymentPage';
import SponsorThankYouPage from './pages/sponsor/SponsorThankYouPage';
import SponsorPledgedPage from './pages/sponsor/SponsorPledgedPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReadingLogsPage from './pages/admin/AdminReadingLogsPage';
import AdminOutstandingPage from './pages/admin/AdminOutstandingPage';
import AdminChecksPage from './pages/admin/AdminChecksPage';
import AdminEmailPage from './pages/admin/AdminEmailPage';
import AdminSiteContentPage from './pages/admin/AdminSiteContentPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminFinancePage from './pages/AdminFinancePage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherLogReading from './pages/teacher/TeacherLogReading';
import TeacherLoginPage from './pages/teacher/TeacherLoginPage';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/reading" element={<AdminReadingLogsPage />} />
      <Route path="/admin/outstanding" element={<AdminOutstandingPage />} />
      <Route path="/admin/checks" element={<AdminChecksPage />} />
      <Route path="/admin/emails" element={<AdminEmailPage />} />
      <Route path="/admin/content" element={<AdminSiteContentPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
      <Route path="/admin-users" element={<AdminUsersPage />} />
      <Route path="/admin-finance" element={<AdminFinancePage />} />
      <Route path="/sponsor" element={<SponsorGatewayPage />} />
      <Route path="/f/:userId" element={<FamilySponsorPage />} />
      <Route path="/sponsor/:childId" element={<SponsorLandingPage />} />
      <Route path="/sponsor/pay" element={<SponsorPaymentPage />} />
      <Route path="/sponsor/guest-pay" element={<GuestPaymentPage />} />
      <Route path="/sponsor/thank-you" element={<SponsorThankYouPage />} />
      <Route path="/sponsor/pledged" element={<SponsorPledgedPage />} />
      <Route path="/dashboard" element={<Navigate to="/log-reading" replace />} />
      <Route path="/log-reading" element={<LogReadingPage />} />
      <Route path="/children" element={<ManageChildrenPage />} />
      <Route path="/family/manage" element={<ManageChildrenPage />} />
      <Route path="/children/:id" element={<ChildDetailsPage />} />
      <Route path="/student/login" element={<StudentPinLoginPage />} />
      <Route path="/student/log" element={<StudentLogReadingPage />} />
      <Route path="/student" element={<Navigate to="/student/log" replace />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/log" element={<TeacherLogReading />} />
      <Route path="/teacher/login" element={<TeacherLoginPage />} />
      <Route path="*" element={<Navigate to="/sponsor" replace />} />
    </Routes>
  );
}
