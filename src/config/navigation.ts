import { Compass, Home, Package } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  mobileOnly?: boolean; // Only show in mobile sidebar
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    mobileOnly: true, // Only in mobile drawer for UX
  },
  {
    name: "Getting Started",
    href: "/getting-started",
    icon: Compass,
  },
  {
    name: "Toolkit", 
    href: "/toolkit",
    icon: Package,
  },
];
