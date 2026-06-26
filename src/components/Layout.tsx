import React from 'react';
import Topbar from './Topbar';
import StatusBar from './StatusBar';

interface LayoutProps {
  children: React.ReactNode;
  topbarProps: React.ComponentProps<typeof Topbar>;
  statusBarProps: React.ComponentProps<typeof StatusBar>;
}

const Layout: React.FC<LayoutProps> = ({ children, topbarProps, statusBarProps }) => {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-paper)' }}>
      <Topbar {...topbarProps} />
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      <StatusBar {...statusBarProps} />
    </div>
  );
};

export default Layout;
