import { Sidebar } from "@/components/ui/navigation/Sidebar";

export default function PortfoliosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}