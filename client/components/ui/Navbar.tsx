"use client";
import Link from "next/link";
import { LayoutDashboard, PieChart, Newspaper, BookOpen, Activity } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">CL</div>
        <span className="text-xl font-bold text-slate-900">CrisisLens</span>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
        <Link href="/portfolios" className="flex items-center gap-2 hover:text-blue-600"><LayoutDashboard size={18}/> Portfolio Hub</Link>
        <Link href="/analysis" className="flex items-center gap-2 hover:text-blue-600"><PieChart size={18}/> Analysis</Link>
        <Link href="/scenarios" className="flex items-center gap-2 hover:text-blue-600"><BookOpen size={18}/> Scenarios</Link>
        <Link href="/simulation" className="flex items-center gap-2 hover:text-blue-600"><Activity size={18}/> Simulation</Link>
        <Link href="/news" className="flex items-center gap-2 hover:text-blue-600"><Newspaper size={18}/> News</Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium hover:underline">Log in</button>
      </div>
    </nav>
  );
}