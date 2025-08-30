import React from 'react';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  showHeader?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ showHeader = true, children }) => {
  return (
    <div className="layout">
      {showHeader && <Header />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
