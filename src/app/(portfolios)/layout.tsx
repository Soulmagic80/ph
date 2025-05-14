import { Sidebar } from "@/components/ui/navigation/Sidebar";

export default function PortfoliosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}