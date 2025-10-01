import { Home, BarChart3, User, Grid, Plus, Building } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

interface BottomNavigationProps {
  role: "student" | "teacher" | "headteacher";
}

const navigationConfig: Record<string, NavItem[]> = {
  student: [
    { icon: Home, label: "Dashboard", path: "/student/dashboard" },
    { icon: BarChart3, label: "Progress", path: "/student/progress" },
    { icon: User, label: "Profile", path: "/profile" },
  ],
  teacher: [
    { icon: Home, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: Grid, label: "Classes", path: "/teacher/classes" },
    { icon: Plus, label: "Add Progress", path: "/teacher/progress/add" },
    { icon: User, label: "Profile", path: "/profile" },
  ],
  headteacher: [
    { icon: Home, label: "Dashboard", path: "/headteacher/dashboard" },
    { icon: BarChart3, label: "Analytics", path: "/headteacher/analytics" },
    { icon: Building, label: "School", path: "/headteacher/school" },
    { icon: User, label: "Profile", path: "/profile" },
  ],
};

export const BottomNavigation = ({ role }: BottomNavigationProps) => {
  const location = useLocation();
  const items = navigationConfig[role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center touch-friendly gap-1 transition-smooth",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
