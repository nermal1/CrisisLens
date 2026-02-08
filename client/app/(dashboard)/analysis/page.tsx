"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Bot, Calendar } from "lucide-react";
import PerformanceChart from "@/components/ui/PerformanceChart";

// 1. Define your scenario list for the dropdown
const SCENARIOS = [
  { id: "covid-19", label: "COVID-19 Crash (2020)" },
  { id: "great-recession", label: "2008 Financial Crisis" },
  { id: "dot-com-bubble", label: "Dot-Com Bubble (2000)" },
  { id: "black-monday", label: "Black Monday (1987)" },
  { id: "panic-of-1907", label: "Panic of 1907" },
];

export default function AnalysisDashboardPage() {
  // 2. State for Scenario and Time Window
  const [selectedScenario, setSelectedScenario] = useState("covid-19");
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6 h-[85vh]">
      
      {/* LEFT COLUMN: CONFIGURATION */}
      <div className="col-span-12 md:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Simulation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">Crisis Scenario</label>
              <select 
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Timeline View</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={!isZoomed ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setIsZoomed(false)}
                  className="text-xs"
                >
                  Full Context
                </Button>
                <Button 
                  variant={isZoomed ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setIsZoomed(true)}
                  className="text-xs"
                >
                  Crash Only
                </Button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic text-center">
                {isZoomed ? "Focusing on peak-to-trough" : "Showing T-1m to Recovery+1m"}
              </p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
              Update Simulation
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm">Risk Exposure</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
                <div className="text-6xl font-bold text-red-500">85</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">High Vulnerability</div>
            </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: DATA VISUALS */}
      <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
        <Card className="flex-1 flex flex-col min-h-[450px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div className="space-y-1">
                    <CardTitle className="capitalize">{selectedScenario.replace(/-/g, ' ')} Performance</CardTitle>
                    <p className="text-xs text-slate-500">Simulated Drawdown & Recovery Path</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  <Calendar size={14} /> 
                  {isZoomed ? "Slicing: Crisis Core" : "Slicing: Full Timeline"}
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
                {/* 3. Pass Scenario and Zoom state to the Chart */}
                <PerformanceChart scenarioId={selectedScenario} isZoomed={isZoomed} />
            </CardContent>
        </Card>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-2 gap-6 h-[220px]">
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sector Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded text-green-700 text-sm font-medium">
                        <div className="flex gap-2"><ArrowUpRight size={16}/> <span>Utilities</span></div>
                        <span>+2.1%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded text-red-700 text-sm font-medium">
                        <div className="flex gap-2"><ArrowDownRight size={16}/> <span>Technology</span></div>
                        <span>-18.4%</span>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-blue-50 border-blue-100 relative overflow-hidden group">
                <CardHeader className="pb-2">
                    <CardTitle className="text-blue-900 text-base flex items-center gap-2">
                        <Bot size={18}/> Insights Engine
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-800/80 mb-4 italic">
                      "During the {selectedScenario.replace(/-/g, ' ')}, cash was king. Your current 5% cash position would lead to a 28% margin call risk."
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white z-10">Generate Detailed Report</Button>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}