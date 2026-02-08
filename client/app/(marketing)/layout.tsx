import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "./Footer"; // Make sure Footer.tsx is in the same folder

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* --- TOP NAVIGATION --- */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="text-2xl font-black text-blue-600 tracking-tighter cursor-default">
            CrisisLens
          </div>
          
          <div className="flex items-center gap-4">
            {/* These links will go to Nick's OAuth routes later */}
            <Link href="/login">
              <Button variant="ghost" className="font-medium text-slate-600">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT (Bento Box) --- */}
      <main className="flex-1">
        {children}
      </main>

      {/* --- PERSONALIZED FOOTER --- */}
      <Footer />
    </div>
  );
}