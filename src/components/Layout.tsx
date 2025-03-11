import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main 
        className={`flex-1 bg-[#dedfda] min-h-screen transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'ml-[5rem]' : 'ml-[16rem]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;