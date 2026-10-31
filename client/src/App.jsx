import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AccessibilityToolbar from './components/common/AccessibilityToolbar';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import FilterPage from './pages/FilterPage';
import AddPlacePage from './pages/AddPlacePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AccessibilityProvider>
          <ScrollToTop />
          <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navigation Header */}
            <Navbar />

            {/* Main Application Routes */}
            <main style={{ flex: 1 }}>
              <Routes>
                {/* 1. Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* 2. Register Page */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 3. Login Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* 4. Explore Places Page */}
                <Route path="/places" element={<ExplorePage />} />

                {/* 5. Place Details Page */}
                <Route path="/places/:id" element={<PlaceDetailsPage />} />

                {/* 6. Accessibility Filter Page */}
                <Route path="/filter" element={<FilterPage />} />

                {/* 7. Add Place Page (Protected) */}
                <Route
                  path="/add-place"
                  element={
                    <ProtectedRoute>
                      <AddPlacePage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. User Dashboard (Protected) */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* 9. User Profile Page (Protected) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 10. Favorites Page (Protected) */}
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 11. Admin Dashboard (Admin Only) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />

                {/* 12. About Us Page */}
                <Route path="/about" element={<AboutPage />} />

                {/* 13. Contact Page */}
                <Route path="/contact" element={<ContactPage />} />

                {/* 14. 404 Not Found Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Accessibility Controls Toolbar */}
            <AccessibilityToolbar />

            {/* Footer */}
            <Footer />
          </div>
        </AccessibilityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
