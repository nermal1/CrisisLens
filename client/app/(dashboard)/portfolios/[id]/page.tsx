"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, TrendingUp, ShieldAlert, List, 
  LayoutGrid, Eye, Activity, Zap, PieChart, Bot, Info 
} from "lucide-react";

const TIMELINES = ["1D", "1W", "1M", "6M", "1Y", "5Y"];

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [selectedTimeline, setSelectedTimeline] = useState("1M");
  const [focusedAsset, setFocusedAsset] = useState<string | null>(null);

  // Mock Data
  const holdings = [
    { id: "1", ticker: "AAPL", name: "Apple Inc.", shares: 10, price: 185.20, change: "+2.4%" },
    { id: "2", ticker: "NVDA", name: "NVIDIA Corp.", shares: 5, price: 720.45, change: "+5.1%" },
    { id: "3", ticker: "TSLA", name: "Tesla, Inc.", shares: 15, price: 175.30, change: "-1.2%" },
  ];

  const mockChartData = [
    { time: "09:30", value: 42000 }, { time: "11:30", value: 42200 }, 
    { time: "13:30", value: 43500 }, { time: "16:00", value: 44050 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 p-6 bg-slate-50/30 min-h-screen">
      
      {/* Top Nav Row */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.push("/portfolios")} className="bg-white shadow-sm">
          <ArrowLeft size={16} className="mr-2" /> Back to Hub
        </Button>
        <Button 
          onClick={() => router.push(`/analysis?portfolioId=${params.id}`)}
          className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-100"
        >
          <ShieldAlert size={18} /> Run Crisis Analysis
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT: MAIN VISUALS (8 Columns) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <header>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {focusedAsset ? `${focusedAsset} Position` : "Portfolio Overview"}
            </h1>
            <div className="flex items-baseline gap-4 mt-2">
               <span className="text-3xl font-bold">$44,050.24</span>
               <span className="text-green-600 font-semibold flex items-center gap-1 text-lg">
                 <TrendingUp size={20} /> +3.65%
               </span>
               {focusedAsset && (
                 <Button variant="link" size="sm" onClick={() => setFocusedAsset(null)} className="text-blue-600 p-0 h-auto">
                   Return to Total Portfolio
                 </Button>
               )}
            </div>
          </header>

          {/* Timeline Selector */}
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
            {TIMELINES.map((t) => (
              <Button 
                key={t}
                variant={selectedTimeline === t ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeline(t)}
                className={`text-xs h-8 px-4 rounded-lg ${selectedTimeline === t ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                {t}
              </Button>
            ))}
          </div>

          {/* Main Chart Card */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <div className="h-[380px] w-full pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={focusedAsset ? "#3b82f6" : "#22c55e"} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={focusedAsset ? "#3b82f6" : "#22c55e"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`$${val.toLocaleString()}`, focusedAsset ? "Price" : "Value"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={focusedAsset ? "#3b82f6" : "#22c55e"} 
                    strokeWidth={3} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: "Beta", val: focusedAsset ? "1.12" : "1.24", icon: <Activity size={14}/> },
               { label: "Volatility", val: focusedAsset ? "22%" : "18%", icon: <Zap size={14}/> },
               { label: "Sectors", val: "4", icon: <PieChart size={14}/> },
               { label: "Holdings", val: holdings.length.toString(), icon: <List size={14}/> },
             ].map((stat, i) => (
               <Card key={i} className="bg-white border-slate-100 shadow-sm">
                 <CardContent className="p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                       {stat.icon} {stat.label}
                    </p>
                    <p className="text-xl font-bold text-slate-900">{stat.val}</p>
                 </CardContent>
               </Card>
             ))}
          </div>

          {/* HOLDINGS TABLE */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b py-4">
               <CardTitle className="text-sm font-bold uppercase text-slate-500">Assets & Positions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-sm">
                 <thead className="bg-slate-50/30 text-slate-400 text-left border-b">
                   <tr>
                     <th className="px-6 py-3 font-semibold uppercase text-[10px]">Ticker</th>
                     <th className="px-6 py-3 font-semibold uppercase text-[10px] text-right">Shares</th>
                     <th className="px-6 py-3 font-semibold uppercase text-[10px] text-right">Market Price</th>
                     <th className="px-6 py-3 font-semibold uppercase text-[10px] text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {holdings.map((stock) => (
                     <tr key={stock.ticker} className={`hover:bg-slate-50 transition-colors ${focusedAsset === stock.ticker ? "bg-blue-50/50" : ""}`}>
                       <td className="px-6 py-4 font-bold text-slate-900">{stock.ticker}</td>
                       <td className="px-6 py-4 text-right font-medium">{stock.shares}</td>
                       <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          ${stock.price}
                          <span className={`ml-2 text-xs font-normal ${stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setFocusedAsset(stock.ticker)}
                            className={`h-8 gap-2 border ${focusedAsset === stock.ticker ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-500"}`}
                          >
                             <Eye size={14} /> {focusedAsset === stock.ticker ? "Viewing" : "View Chart"}
                          </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: SIDEBAR (4 Columns) */}
        <div className="col-span-12 lg:col-span-4 space-y-6 pt-[104px]">
          <Card className="bg-blue-600 text-white shadow-xl shadow-blue-100 border-none">
            <CardContent className="p-6 space-y-4">
               <div className="flex items-center gap-2">
                 <Bot size={28} className="text-blue-200" />
                 <h3 className="text-xl font-bold">Insights Engine</h3>
               </div>
               <p className="text-blue-100 text-sm leading-relaxed italic">
                 "Your portfolio currently has a <strong>High Vulnerability</strong> to interest rate spikes. During the {selectedTimeline} view, we see correlations rising between your Tech and Consumer holdings."
               </p>
               <div className="pt-2">
                 <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold">
                   Optimize Allocation
                 </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-slate-400" />
                <CardTitle className="text-base">Risk Disclosure</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Analysis is based on historical market data and simulated stress tests. Past performance of {focusedAsset || 'this portfolio'} does not guarantee future results in a real-world crisis scenario.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}