export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Getting Started",
    href: "/getting-started",
  },
  {
    name: "Resources", 
    href: "#",
  },
];
