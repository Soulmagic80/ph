import { Compass, Home, Package } from "lucide-react";

export interface NavigationDropdownItem {
  name: string;
  href: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  mobileOnly?: boolean; // Only show in mobile sidebar
  dropdown?: NavigationDropdownItem[]; // Dropdown items
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
    href: "/toolkit/tools",
    icon: Package,
    dropdown: [
      { name: "Tools", href: "/toolkit/tools" },
      { name: "Templates", href: "/toolkit/templates" },
      { name: "Links", href: "/toolkit/links" },
    ],
  },
];
