// client/app/(dashboard)/layout.tsx
import Sidebar from "@/components/ui/Navbar"; // navbar component

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar on the top of the screen */}
      <div className="w-full border-b bg-white">
        <Sidebar /> 
      </div>
      
      {/* content will be under the navbar */}
      <main className="flex-1 container mx-auto p-8">
        {children}
      </main>
    </div>
  );
}