export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Getting Started",
    href: "/howto",
  },
  {
    name: "Resources", 
    href: "#",
  },
];
