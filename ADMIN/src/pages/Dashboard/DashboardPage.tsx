import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiBookOpen,
  FiLayers,
  FiLoader,
  FiMusic,
  FiStar,
} from 'react-icons/fi';
import api from '../../api/axios';
import type { DashboardStats } from '../../types';

const StatCard: React.FC<{
  label: string;
  value: number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  to?: string;
}> = ({ label, value, sub, icon, color, to }) => {
  const inner = (
    <motion.div
      className={`metric-card ${to ? 'cursor-pointer' : ''}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-4xl font-semibold text-slate-950">{value}</p>
          {sub && <p className="mt-2 text-xs leading-6 text-slate-500">{sub}</p>}
        </div>
        <div className={`icon-badge ${color}`}>{icon}</div>
      </div>
    </motion.div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data as DashboardStats);
      } catch {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="flex h-64 items-center justify-center">
          <div className="card flex items-center gap-3 px-5 py-4 text-sm font-semibold text-slate-700">
            <FiLoader className="h-4 w-4 animate-spin text-cyan-600" />
            Preparing dashboard
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <div className="rounded-[28px] border border-rose-100 bg-rose-50/90 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="page-hero">
        <span className="eyebrow">Overview</span>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Track the structure of rituals, duas, and audio assets from a single editorial view.
            </p>
          </div>
          <div className="section-panel flex items-center gap-3 self-start px-4 py-3 text-sm font-semibold text-slate-600">
            <FiActivity className="h-4 w-4 text-cyan-600" />
            Live content overview
          </div>
        </div>
      </section>

      {stats && (
        <>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Ritual Steps
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Steps"
                value={stats.totalRitualSteps}
                icon={<FiLayers className="h-5 w-5" />}
                color="icon-badge-primary"
                to="/ritual-steps"
              />
              <StatCard
                label="Hajj Steps"
                value={stats.hajjSteps}
                icon={<span className="text-lg">🕋</span>}
                color="bg-emerald-50 text-emerald-700"
                to="/ritual-steps"
              />
              <StatCard
                label="Umrah Steps"
                value={stats.umrahSteps}
                icon={<span className="text-lg">🌙</span>}
                color="bg-sky-50 text-sky-700"
                to="/ritual-steps"
              />
              <StatCard
                label="Highlighted"
                value={stats.highlightedSteps}
                icon={<FiStar className="h-5 w-5" />}
                color="bg-amber-50 text-amber-700"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Duas & Dhikrs
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Duas"
                value={stats.totalDuas}
                icon={<FiBookOpen className="h-5 w-5" />}
                color="bg-orange-50 text-orange-700"
                to="/duas"
              />
              <StatCard
                label="Hajj Duas"
                value={stats.hajjDuas}
                icon={<span className="text-lg">🕋</span>}
                color="bg-emerald-50 text-emerald-700"
                to="/duas"
              />
              <StatCard
                label="Umrah Duas"
                value={stats.umrahDuas}
                icon={<span className="text-lg">🌙</span>}
                color="bg-sky-50 text-sky-700"
                to="/duas"
              />
              <StatCard
                label="Highlighted Duas"
                value={stats.highlightedDuas}
                icon={<FiStar className="h-5 w-5" />}
                color="bg-amber-50 text-amber-700"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Audio
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Total Audio"
                value={stats.totalAudio}
                icon={<FiMusic className="h-5 w-5" />}
                color="bg-rose-50 text-rose-700"
                to="/audio"
              />
              <StatCard
                label="Active Audio"
                value={stats.activeAudio}
                sub="Published & visible in app"
                icon={<FiMusic className="h-5 w-5" />}
                color="bg-emerald-50 text-emerald-700"
                to="/audio"
              />
            </div>
          </section>

          <section className="section-panel">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Quick actions</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Jump into the main editorial surfaces.
                </p>
              </div>
              <div className="icon-badge icon-badge-primary">
                <FiArrowRight className="h-5 w-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                to="/ritual-steps"
                className="content-card flex items-center gap-3 border border-transparent hover:border-cyan-100"
              >
                <div className="icon-badge bg-cyan-50 text-cyan-700">
                  <FiLayers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Manage Ritual Steps</p>
                  <p className="text-xs text-slate-500">Update step order, links, and media.</p>
                </div>
              </Link>
              <Link
                to="/duas"
                className="content-card flex items-center gap-3 border border-transparent hover:border-orange-100"
              >
                <div className="icon-badge bg-orange-50 text-orange-700">
                  <FiBookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Manage Duas & Dhikrs</p>
                  <p className="text-xs text-slate-500">Curate prayers with rich context.</p>
                </div>
              </Link>
              <Link
                to="/audio"
                className="content-card flex items-center gap-3 border border-transparent hover:border-rose-100"
              >
                <div className="icon-badge bg-rose-50 text-rose-700">
                  <FiMusic className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Manage Audio</p>
                  <p className="text-xs text-slate-500">Publish recitations and uploads.</p>
                </div>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;