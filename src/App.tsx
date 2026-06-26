import { Routes, Route } from 'react-router';
import { useState, useCallback, useMemo } from 'react';
import Bibliotheek from './pages/Bibliotheek';
import Instellingen from './pages/Instellingen';
import Over from './pages/Over';
import Layout from './components/Layout';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [lastSynced, setLastSynced] = useState('2 min geleden');

  const handleSync = useCallback(() => {
    setSyncStatus('syncing');
    setLastSynced('Bezig met synchroniseren...');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSynced('zojuist');
    }, 2000);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const BibliotheekWrapper = () => <Bibliotheek />;

  const topbarProps = useMemo(() => ({
    searchQuery,
    onSearchChange: handleSearchChange,
    syncStatus,
    lastSynced,
    onSync: handleSync,
  }), [searchQuery, syncStatus, lastSynced, handleSearchChange, handleSync]);

  const statusBarProps = useMemo(() => ({
    totalCount: 502,
    filteredCount: 502,
    selectedCount: 0,
    lastSynced,
  }), [lastSynced]);

  return (
    <Layout topbarProps={topbarProps} statusBarProps={statusBarProps}>
      <Routes>
        <Route path="/" element={<BibliotheekWrapper />} />
        <Route path="/instellingen" element={<Instellingen />} />
        <Route path="/over" element={<Over />} />
      </Routes>
    </Layout>
  );
}