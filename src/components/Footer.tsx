import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1c1917',
        color: 'rgba(255,255,255,0.7)',
        padding: '3rem 0 2rem',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap gap-8 justify-between items-start">
          <div>
            <span
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: '1.2rem',
                color: '#fff',
              }}
            >
              Medi<span style={{ color: '#3d8c87' }}>&middot;</span>Bridge
            </span>
            <p className="text-sm mt-2 max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Bibliotheek — Wetenschappelijke referentiebeheer voor zorgprofessionals.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Navigatie
              </div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <span className="hover:text-white transition-colors cursor-pointer">Bibliotheek</span>
                <span className="hover:text-white transition-colors cursor-pointer">Instellingen</span>
                <span className="hover:text-white transition-colors cursor-pointer">Over</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Medi-Bridge
              </div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <span className="hover:text-white transition-colors cursor-pointer">Clarizo</span>
                <span className="hover:text-white transition-colors cursor-pointer">Kwaliteit</span>
                <span className="hover:text-white transition-colors cursor-pointer">Digitalisering</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-8 pt-4 flex justify-between text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
        >
          <span>2026 Medi-Bridge — Maai Care</span>
          <span>Bibliotheek v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
