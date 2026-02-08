// app/(marketing)/page.tsx
import { ArrowRight, ShieldAlert, BarChart3, Zap, TrendingDown, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6 animate-fade-in">
          <Zap size={16} /> Now featuring 15+ Historical Scenarios
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
          Master the <span className="text-blue-600">Chaos.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
          The ultimate historical crisis simulation tool. Analyze 15+ global market crashes, 
          stress-test your portfolio, and survive the next black swan event.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all active:scale-95">
              Start Simulating <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* --- THE BENTO BOX GRID --- */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          
          {/* Card 1: Large Feature (Portfolio) */}
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group hover:border-blue-300 transition-all">
             <div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight">Portfolio Stress-Testing</h3>
                <p className="text-slate-500 max-w-md mt-2">
                  Upload your assets and watch how they would have survived Black Monday or the 2008 crash in real-time.
                </p>
             </div>
             {/* Decorative "App UI" element */}
             <div className="bg-slate-50 h-48 w-full rounded-2xl mt-6 border border-slate-100 translate-y-6 group-hover:translate-y-2 transition-transform duration-500 p-4">
                <div className="flex gap-2 mb-4">
                   <div className="h-2 w-12 bg-blue-200 rounded-full" />
                   <div className="h-2 w-8 bg-slate-200 rounded-full" />
                </div>
                <div className="space-y-3">
                   <div className="h-3 w-full bg-slate-100 rounded" />
                   <div className="h-3 w-3/4 bg-slate-100 rounded" />
                </div>
             </div>
          </div>

          {/* Card 2: Scenario Pulse */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-100 hover:scale-[1.02] transition-transform cursor-default">
             <ShieldAlert size={32} />
             <div>
                <h4 className="font-bold text-xl">Historical Scenarios</h4>
                <p className="text-blue-100 text-sm mt-1"></p>
             </div>
          </div>

          {/* Card 3: News Sentiment */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
             <div className="flex gap-2">
                <div className="h-2 w-8 bg-green-400 rounded-full" />
                <div className="h-2 w-12 bg-slate-100 rounded-full" />
             </div>
             <div>
                <h4 className="font-bold text-xl flex items-center gap-2">
                   <Newspaper size={20} className="text-slate-400" /> Global Pulse
                </h4>
                <p className="text-slate-500 text-sm mt-1">Real-time news & sentiment analysis for early warning signals.</p>
             </div>
          </div>

          {/* Card 4: Detailed Analytics (Wide Bottom) */}
          <div className="md:col-span-3 bg-slate-900 rounded-3xl p-10 text-white flex items-center justify-between overflow-hidden relative group">
             <div className="z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-2">Advanced Drawdown Models</h3>
                <p className="text-slate-400 text-sm">
                  
                </p>
             </div>
             <TrendingDown 
                size={180} 
                className="text-blue-500/10 absolute right-0 -bottom-10 group-hover:text-blue-500/20 transition-colors" 
             />
          </div>
          
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-6 text-center text-slate-400 text-sm">
          © 2026 CrisisLens Analytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}