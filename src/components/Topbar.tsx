import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  Plus,
  Download,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

export interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  syncStatus: 'synced' | 'syncing' | 'error';
  lastSynced: string;
  onSync: () => void;
}

export default function Topbar({
  searchQuery,
  onSearchChange,
  syncStatus,
  lastSynced,
  onSync,
}: TopbarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getSyncLabel = () => {
    switch (syncStatus) {
      case 'synced': return 'Gesynchroniseerd';
      case 'syncing': return 'Bezig met synchroniseren...';
      case 'error': return 'Sync-fout';
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'synced': return '#7aac6e';
      case 'syncing': return '#3d8c87';
      case 'error': return '#c25e5e';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="sticky top-0 z-10 flex items-center justify-between h-[56px] px-5 bg-white border-b"
      style={{ borderColor: '#e5e1dc' }}
    >
      <div className="flex items-center gap-1 text-[13px] font-medium" style={{ color: '#8a827a' }}>
        <a href="#" className="hover:underline transition-colors" style={{ color: '#8a827a' }}>Medi-Bridge</a>
        <span className="mx-1">/</span>
        <span style={{ color: '#5a5550' }}>Bibliotheek</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: '#3d8c87' }} />
        <h1 className="text-[20px] font-normal tracking-normal" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>
          Bibliotheek
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={16} style={{ color: '#8a827a' }} />
          <input
            type="text"
            placeholder="Zoek publicaties..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="h-9 pl-9 pr-8 text-[14px] font-normal rounded-[10px] border transition-all duration-[250ms] outline-none"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              backgroundColor: '#faf8f5',
              borderColor: isSearchFocused ? '#3d8c87' : '#e5e1dc',
              width: isSearchFocused ? '360px' : '240px',
              boxShadow: isSearchFocused ? '0 0 0 3px rgba(61,140,135,0.12)' : 'none',
            }}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: '#8a827a' }} />
            </button>
          )}
        </div>

        <button
          onClick={onSync}
          disabled={syncStatus === 'syncing'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200"
          style={{ borderColor: '#e5e1dc', backgroundColor: '#faf8f5', opacity: syncStatus === 'syncing' ? 0.7 : 1 }}
          title={`Laatst gesynchroniseerd: ${lastSynced}`}
        >
          <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: getSyncColor(), animation: syncStatus === 'syncing' ? 'pulse 1.5s infinite' : 'none' }} />
          <span className="text-[12px] font-medium" style={{ color: getSyncColor(), fontFamily: "'DM Sans', system-ui, sans-serif" }}>{getSyncLabel()}</span>
        </button>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]" style={{ color: '#5a5550' }} title="Publicatie Toevoegen"><Plus size={18} /></button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]" style={{ color: '#5a5550' }} title="Exporteren"><Download size={18} /></button>
          <Link to="/instellingen" className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]" style={{ color: '#5a5550' }} title="Instellingen"><Settings size={18} /></Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[12px] font-semibold transition-colors duration-200"
            style={{ borderColor: showUserMenu ? '#3d8c87' : '#e5e1dc', color: '#3d8c87', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >MB</button>
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 z-50 w-48 py-2 rounded-xl border bg-white shadow-lg"
                style={{ borderColor: '#e5e1dc' }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: '#eeeae5' }}>
                  <p className="text-[13px] font-medium" style={{ color: '#1c1917' }}>Medi-Bridge Gebruiker</p>
                  <p className="text-[11px]" style={{ color: '#8a827a' }}>gebruiker@medi-bridge.nl</p>
                </div>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-[13px] transition-colors hover:bg-[#f4f1ed]" style={{ color: '#5a5550' }}><User size={14} />Profiel</button>
                <Link to="/instellingen" className="flex items-center gap-2 w-full px-4 py-2 text-[13px] transition-colors hover:bg-[#f4f1ed]" style={{ color: '#5a5550' }} onClick={() => setShowUserMenu(false)}><Settings size={14} />Instellingen</Link>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-[13px] transition-colors hover:bg-[#f4f1ed]" style={{ color: '#c25e5e' }}><LogOut size={14} />Uitloggen</button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}