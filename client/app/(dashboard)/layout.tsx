// client/app/(dashboard)/layout.tsx
import Sidebar from "@/components/ui/Navbar"; // Double check this path to your Sidebar/Navbar component

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 1. The Sidebar stays on the left */}
      <Sidebar /> 
      
      {/* 2. The page content goes on the right */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}