import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiBookOpen,
  FiChevronRight,
  FiHome,
  FiLayers,
  FiLogOut,
  FiMusic,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/ritual-steps', label: 'Ritual Steps', icon: FiLayers },
  { to: '/duas', label: 'Duas & Dhikrs', icon: FiBookOpen },
  { to: '/audio', label: 'Audio', icon: FiMusic },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[19rem] shrink-0 transform flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        initial={false}
        animate={{ x: 0 }}
      >
        <div className="flex h-full flex-col border-r border-white/60 bg-[rgba(248,250,252,0.9)] px-4 py-5 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.7)] backdrop-blur-2xl lg:px-5">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-5">
            <div className="flex items-center gap-3">
              <div className="icon-badge icon-badge-primary text-lg font-bold">🕋</div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Hajj Guide</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin Suite</p>
              </div>
            </div>
            <button onClick={onClose} className="icon-action lg:hidden">
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-6 flex-1 space-y-2 overflow-y-auto">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-[0_20px_50px_-30px_rgba(8,145,178,0.85)]'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
                  }`
                }
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                  <Icon className="h-4 w-4 shrink-0" />
                </span>
                <span className="flex-1">{label}</span>
                <FiChevronRight
                  className={`h-4 w-4 transition ${
                    location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-200/70 pt-4">
            <button onClick={logout} className="btn-secondary w-full justify-between px-4">
              <span className="flex items-center gap-2">
                <FiLogOut className="h-4 w-4" />
                Logout
              </span>
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;