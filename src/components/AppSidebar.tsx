import { BarChart3, ChevronLeft, Home, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function AppSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar, state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
            aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${state === "collapsed" ? "rotate-180" : ""}`} />
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/")}
                  tooltip="Dashboard"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/insights")}
                  tooltip="Insights"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/account")}
                  tooltip="Account"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}