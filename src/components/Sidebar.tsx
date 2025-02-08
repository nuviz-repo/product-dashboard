import React, { useState } from 'react';
import { LayoutDashboard, Lightbulb, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      title: 'Insights',
      icon: Lightbulb,
      path: '/insights',
    },
    {
      title: 'Account',
      icon: User,
      path: '/account',
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#dedfda] border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-gray-200 bg-white"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Logo */}
      <div className="p-4">
        <h1 
          className={`font-bold transition-all duration-300 ${
            isCollapsed ? "text-2xl" : "text-3xl"
          } text-[#343dea]`}
          style={{ fontFamily: "'Pivot Grotesk Regular', sans-serif" }}
        >
          {isCollapsed ? "nv" : "nuviz"}
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link 
            key={item.title}
            to={item.path}
            className={`flex items-center px-4 py-3 transition-colors ${
              isCollapsed ? "justify-center" : "space-x-3"
            } ${
              location.pathname === item.path 
                ? "bg-gray-100 text-[#343dea]" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;