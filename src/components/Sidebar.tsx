
import React, { useState } from 'react';
import { LayoutDashboard, Lightbulb, User, ChevronLeft, ChevronRight, LogOut, LifeBuoy, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/lib/supabase';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
      title: 'Video Analysis',
      icon: Video,
      path: '/video-analysis',
    },
    {
      title: 'Account',
      icon: User,
      path: '/account',
    },
    {
      title: 'Support',
      icon: LifeBuoy,
      path: '/support',
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-[#dedfda] border-gray-200 transition-all duration-300 flex flex-col z-50 ${
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
        <div className="p-4 pt-11">
          <h1 
            className={`font-bold transition-all duration-300 ${
              isCollapsed ? "text-xl" : "text-2xl"
            } text-[#fb651e]`}
            style={{ fontFamily: "'Pivot Grotesk Regular', sans-serif" }}
          >
            {isCollapsed ? "YC" : "YCombinator"}
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 flex-grow">
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

        {/* Logout Button */}
        <div className="p-4">
          <Button
            variant="ghost"
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            } text-gray-700 hover:bg-gray-100 hover:text-[#343dea]`}
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current session and you'll need to login again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
