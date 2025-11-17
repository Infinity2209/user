/**
 * Main App Component
 *
 * This is the root component of the React admin panel application.
 * It sets up routing, authentication, and the main layout structure
 * including sidebar, header, and footer.
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './i18n';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  // State for sidebar visibility on desktop (expanded/collapsed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State for mobile menu overlay
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle window resize to close mobile menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic margin class based on sidebar state
  const sidebarWidth = isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16';

  // Handler for mobile menu button click
  const handleMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  {/* Sidebar always rendered, but behaves differently on mobile */}
                  <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    isMobile={isMobileMenuOpen}
                    setIsMobile={setIsMobileMenuOpen}
                  />

                  {/* MAIN CONTENT WRAPPER */}
                  <div
                    className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarWidth}`}
                  >
                    {/* Header */}
                    <Header onMenuClick={handleMenuClick} />

                    {/* MAIN page content */}
                    <main className="flex-1">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/users"
                          element={
                            <ProtectedRoute roles={['admin']}>
                              <Users />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/products" element={<Products />} />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute roles={['admin']}>
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>

                    {/* Footer */}
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
