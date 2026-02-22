"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPortfolios } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Bot, Calendar, ShieldAlert } from "lucide-react";
import PerformanceChart from "@/components/ui/PerformanceChart";

const SCENARIOS = [
  { id: "covid-19", label: "COVID-19 Crash (2020)" },
  { id: "great-recession", label: "2008 Financial Crisis" },
  { id: "dot-com-bubble", label: "Dot-Com Bubble (2000)" },
  { id: "black-monday", label: "Black Monday (1987)" },
];

export default function AnalysisDashboardPage() {
  const searchParams = useSearchParams();
  const portfolioIdFromUrl = searchParams.get("portfolioId");

  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioIdFromUrl || "");
  const [selectedScenario, setSelectedScenario] = useState("covid-19");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    async function loadPortfolios() {
      try {
        const data = await fetchPortfolios();
        if (data) setPortfolios(data);
        if (portfolioIdFromUrl) setSelectedPortfolio(portfolioIdFromUrl);
      } catch (error: any) {
        console.error("Error fetching portfolios:", error.message);
      }
    }
    loadPortfolios();
  }, [portfolioIdFromUrl]);

  return (
    <div className="grid grid-cols-12 gap-6 h-full p-4">
      
      {/* LEFT COLUMN: CONFIGURATION */}
      <div className="col-span-12 md:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Analysis Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* NEW: Portfolio Selection Dropdown */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">Target Portfolio</label>
              <select 
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a portfolio...</option>
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400">Crisis Scenario</label>
              <select 
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Timeline View</label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant={!isZoomed ? "default" : "outline"} size="sm" onClick={() => setIsZoomed(false)}>Full</Button>
                <Button variant={isZoomed ? "default" : "outline"} size="sm" onClick={() => setIsZoomed(true)}>Crash</Button>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg">
              Update Simulation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader className="pb-2 text-center">
                <CardTitle className="text-slate-400 text-sm">Vulnerability Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
                <div className="text-6xl font-bold text-red-500">85</div>
                <div className="text-xs text-slate-400 uppercase mt-2">Critical Exposure</div>
            </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: DATA VISUALS */}
      <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
        <Card className="flex-1 min-h-[450px]">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <CardTitle className="capitalize flex items-center gap-2">
                   <ShieldAlert size={20} className="text-red-500" />
                   {selectedScenario.replace(/-/g, ' ')} Impact
                </CardTitle>
                <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex gap-2">
                  <Calendar size={14} /> {isZoomed ? "Crisis Window" : "Full Context"}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <PerformanceChart scenarioId={selectedScenario} isZoomed={isZoomed} />
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                <CardHeader><CardTitle className="text-base">Sector Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded text-green-700 text-sm">
                        <span>Utilities (Hedge)</span><span>+2.1%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded text-red-700 text-sm">
                        <span>Technology (Aggressive)</span><span>-18.4%</span>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-blue-50 border-blue-100">
                <CardHeader><CardTitle className="text-blue-900 text-base flex items-center gap-2"><Bot size={18}/> Analysis Insight</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-800/80 italic">
                      "Warning: This portfolio is 80% concentrated in Tech. During {selectedScenario.replace(/-/g, ' ')}, similar portfolios saw a 40% drawdown."
                    </p>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}
