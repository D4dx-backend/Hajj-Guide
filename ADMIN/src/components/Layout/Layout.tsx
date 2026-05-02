import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../Sidebar/Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden lg:pl-[19rem]">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/55 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8 lg:py-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="icon-action lg:hidden"
                aria-label="Open navigation"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Content Control Center
                </p>
                <h1 className="text-lg font-semibold text-slate-950 sm:text-xl">
                  Hajj Guide Admin
                </h1>
              </div>
            </div>
          </div>
        </header>

        <motion.main
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;