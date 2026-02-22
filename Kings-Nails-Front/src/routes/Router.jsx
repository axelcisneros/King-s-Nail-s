import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage/LoginPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import TerminosPage from '../pages/TerminosPage/TerminosPage';
import PrivacidadPage from '../pages/PrivacidadPage/PrivacidadPage';
import GalleryPage from '../pages/GalleryPage/GalleryPage';
import ClientLayout from '../components/ClientLayout/ClientLayout';
import ClientProfilePage from '../pages/ClientProfilePage/ClientProfilePage';
import ClientAppointmentsPage from '../pages/ClientAppointmentsPage/ClientAppointmentsPage';
import ClientReviewPage from '../pages/ClientReviewPage/ClientReviewPage';
import ClientDesignsPage from '../pages/ClientDesignsPage/ClientDesignsPage';
import AppointmentPage from '../pages/AppointmentPage/AppointmentPage';
import ClientQuotesPage from '../pages/ClientQuotesPage/ClientQuotesPage';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import AdminDashboardPage from '../pages/AdminDashboardPage/AdminDashboardPage';
import AdminAppointmentsPage from '../pages/AdminAppointmentsPage/AdminAppointmentsPage';
import AdminReviewsPage from '../pages/AdminReviewsPage/AdminReviewsPage';
import AdminGalleryPage from '../pages/AdminGalleryPage/AdminGalleryPage';
import AdminServicesPage from '../pages/AdminServicesPage/AdminServicesPage';
import LoginSuccessPage from '../pages/LoginSuccessPage/LoginSuccessPage';
import AdminUsersPage from '../pages/AdminUsersPage/AdminUsersPage';
import ServicesPage from '../pages/ServicesPage/ServicesPage';
import AdminQuotesPage from '../pages/AdminQuotesPage/AdminQuotesPage';

const Router = () => {
  return (
    <Routes>
      <Route path="*" element={<Layout />}>
        {/* --- Rutas Públicas --- */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="terminos" element={<TerminosPage />} />
        <Route path="privacidad" element={<PrivacidadPage />} />
        <Route path="galeria" element={<GalleryPage />} />
  <Route path="servicios" element={<ServicesPage />} />
        <Route path="login-success" element={<LoginSuccessPage />} />

        {/* --- Rutas Privadas --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="client" element={<ClientLayout />}>
            <Route index element={<ClientProfilePage />} />
            <Route path="mis-citas" element={<ClientAppointmentsPage />} />
            <Route path="mis-cotizaciones" element={<ClientQuotesPage />} />
            <Route path="mis-reseñas" element={<ClientReviewPage />} />
            <Route path="mis-disenos" element={<ClientDesignsPage />} />
          </Route>
          <Route path="citas" element={<AppointmentPage />} />
        </Route>

        {/* --- Rutas de Administración --- */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="citas" element={<AdminAppointmentsPage />} />
              <Route path="cotizaciones" element={<AdminQuotesPage />} />
            <Route path="reseñas" element={<AdminReviewsPage />} />
            <Route path="galeria" element={<AdminGalleryPage />} />
            <Route path="servicios" element={<AdminServicesPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;