import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationBar } from './UIComponents/NavigationBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased ">
      <div className="border border-white/20 ">
        <NavigationBar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;