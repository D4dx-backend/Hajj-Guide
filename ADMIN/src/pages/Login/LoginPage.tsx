import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiShield, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.16),transparent_24%)]" />

      <div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          className="card hidden overflow-hidden p-10 lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="eyebrow">Premium Admin Flow</span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-slate-950">
            A calmer, modern workspace for managing every Hajj Guide experience.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-8 text-slate-600">
            Review content, upload media, and shape the app from a flowing control surface built
            for fast editorial work.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              'Fluid navigation and dashboard views',
              'DigitalOcean Spaces media pipeline',
              'Dedicated panels for rituals, duas, and audio',
              'Polished motion and modern iconography',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/75 bg-white/80 p-4 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.75)]"
              >
                <div className="icon-badge icon-badge-primary mb-3">
                  <FiShield className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="card w-full max-w-xl justify-self-center p-6 sm:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow">Secure Access</span>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Sign in to open the Hajj Guide content studio.
              </p>
            </div>
            <div className="icon-badge icon-badge-primary text-lg">🕌</div>
          </div>

          {error && (
            <div className="mb-5 rounded-[24px] border border-rose-100 bg-rose-50/90 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Username</label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="input-field pl-11"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-field pl-11 pr-12"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full justify-between">
              <span>{loading ? 'Signing in...' : 'Enter admin studio'}</span>
              <FiArrowRight className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Hajj & Umrah Guide CMS © {new Date().getFullYear()}
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default LoginPage;