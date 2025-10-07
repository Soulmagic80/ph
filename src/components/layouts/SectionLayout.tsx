"use client";

import { ButtonTabs } from "@/components/ui/ButtonTabs";
import { Divider } from "@/components/ui/Divider";

interface Tab {
  id: string;
  label: string;
  href?: string; // Optional, falls nur lokale Tabs ohne Navigation
}

interface SectionLayoutProps {
  title: string;
  subtitle: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  layoutId: string;
  children: React.ReactNode;
  showDivider?: boolean; // Optional: Divider ein/ausschalten
}

export function SectionLayout({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  layoutId,
  children,
  showDivider = true,
}: SectionLayoutProps) {
  return (
    <>
      {/* Title + Subtitle */}
      <div className="mb-12">
        <h1 className="heading-page">{title}</h1>
        <p className="text-body">{subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <ButtonTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          layoutId={layoutId}
        />
      </div>

      {/* Optional Divider */}
      {showDivider && <Divider />}

      {/* Content */}
      {children}
    </>
  );
}
