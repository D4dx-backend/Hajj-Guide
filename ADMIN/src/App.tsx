import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import Layout from './components/Layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const RitualStepsPage = lazy(() => import('./pages/RitualSteps/RitualStepsPage'));
const DuasPage = lazy(() => import('./pages/Duas/DuasPage'));
const AudioPage = lazy(() => import('./pages/Audio/AudioPage'));

const PageLoader: React.FC = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="card flex items-center gap-3 px-5 py-4 text-sm font-semibold text-slate-700">
      <FiLoader className="h-4 w-4 animate-spin text-cyan-600" />
      Loading workspace
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="ritual-steps" element={<RitualStepsPage />} />
            <Route path="duas" element={<DuasPage />} />
            <Route path="audio" element={<AudioPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
);

export default App;