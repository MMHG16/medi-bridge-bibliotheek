import React from 'react';

interface StatusBarProps {
  totalCount: number;
  filteredCount: number;
  selectedCount: number;
  lastSynced: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ totalCount, filteredCount, selectedCount, lastSynced }) => {
  return (
    <div
      className="flex items-center justify-between px-4 text-xs"
      style={{
        height: 32,
        backgroundColor: 'var(--color-paper)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-ink-tertiary)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <div className="flex items-center gap-4">
        <span>
          {filteredCount} items in deze weergave
        </span>
        {selectedCount > 0 && (
          <span style={{ color: 'var(--color-teal)' }}>
            {selectedCount} geselecteerd
          </span>
        )}
      </div>
      <div>
        Laatst gesynchroniseerd: {lastSynced}
      </div>
    </div>
  );
};

export default StatusBar;
