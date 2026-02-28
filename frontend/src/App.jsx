import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth }  from "./context/AuthContext";
import { ThemeProvider }          from "./context/ThemeContext";
import { useToast }               from "./hooks/useToast";
import { ToastContainer }         from "./components/ui/toast";
import Navbar                     from "./components/Navbar";
import Footer                     from "./components/Footer";
import { PageLoader }             from "./components/Loader";

// Pages
import HomePage            from "./pages/HomePage";
import DiscoverPage        from "./pages/DiscoverPage";
import ProjectDetailPage   from "./pages/ProjectDetailPage";
import CreateProjectPage   from "./pages/CreateProjectPage";
import DashboardPage       from "./pages/DashboardPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { PaymentSuccessPage, ProfilePage, SavedPage, NotFoundPage } from "./pages/OtherPages";
import EditProjectPage   from "./pages/EditProjectPage";
import AIAssistantPage   from "./pages/AIAssistantPage";

// ── PrivateRoute ──────────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  return isLoggedIn ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

// ── App Layout ────────────────────────────────────────────────────────
function AppLayout() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/discover"          element={<DiscoverPage />} />
          <Route path="/projects/:id"      element={<ProjectDetailPage />} />
          <Route path="/profile/:id"       element={<ProfilePage />} />
          <Route path="/login"             element={<LoginPage />} />
          <Route path="/register"          element={<RegisterPage />} />
          <Route path="/payment-success"   element={<PaymentSuccessPage />} />

          <Route path="/create"     element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
          <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/saved"      element={<PrivateRoute><SavedPage /></PrivateRoute>} />
          <Route path="/projects/:id/edit" element={<PrivateRoute><EditProjectPage /></PrivateRoute>} />
          <Route path="/ai"         element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
