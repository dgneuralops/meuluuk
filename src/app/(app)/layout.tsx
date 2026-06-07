import { AppNavbar } from "@/components/layout/AppNavbar";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNavbar />
      <main className="flex-1 pb-24">
        <div className="max-w-lg mx-auto px-5 py-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
