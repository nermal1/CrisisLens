"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Bot } from "lucide-react";
import PerformanceChart from "@/components/ui/PerformanceChart"; 

export default function AnalysisDashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6 h-[85vh]">
      
      <div className="col-span-12 md:col-span-3 space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <label className="text-xs font-bold uppercase text-slate-400">Select Scenario</label>
                <select className="w-full mt-2 p-2 border rounded-md text-sm bg-white">
                    <option>COVID-19 Crash (Feb-Mar 2020)</option>
                    <option>2008 Financial Crisis</option>
                    <option>Dot-Com Bubble (2000-2002)</option>
                </select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Run Simulation</Button>
          </CardContent>
        </Card>

        {/* Risk Score Gauge */}
        <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm">Portfolio Risk Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
                <div className="text-6xl font-bold text-red-500">85</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">High Vulnerability</div>
                <div className="mt-4 text-xs text-slate-500 px-4">
                  Driven by high exposure to Tech and low cash reserves during this crisis.
                </div>
            </CardContent>
        </Card>

        {/* Key Metrics Table */}
        <Card>
            <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Max Drawdown</span>
                    <span className="text-sm font-bold text-red-600">-34.2%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Volatility</span>
                    <span className="text-sm font-bold">18.5%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Sharpe Ratio</span>
                    <span className="text-sm font-bold">0.85</span>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
        
        {/* Main Performance Chart Area */}
        <Card className="flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div className="space-y-1">
                    <CardTitle>Cumulative Performance</CardTitle>
                    <p className="text-xs text-slate-500">Portfolio vs S&P 500 (Rebased to 100)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Price</Button>
                    <Button variant="outline" size="sm">Drawdown</Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pt-6">
                
                {/* The Recharts Component replaces the placeholder text */}
                <PerformanceChart />
                
            </CardContent>
        </Card>

        {/* Bottom Row Sector Lens & Chatbot */}
        <div className="grid grid-cols-2 gap-6 h-[250px]">
             
             {/* Sector Winners/Losers */}
             <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sector Impact</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 mt-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded text-green-700 text-sm">
                            <div className="flex gap-2"><ArrowUpRight size={16}/> <span>Health Care</span></div>
                            <span className="font-bold">+4.2%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded text-red-700 text-sm">
                            <div className="flex gap-2"><ArrowDownRight size={16}/> <span>Technology</span></div>
                            <span className="font-bold">-12.5%</span>
                        </div>
                    </div>
                </CardContent>
             </Card>

             {/* AI Assistant */}
             <Card className="bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-blue-900 text-base flex items-center gap-2">
                        <Bot size={18}/> AI Assistant
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-800 mb-4">
                        "Your portfolio suffered due to high tech exposure. Would you like to compare this to the 2008 crash?"
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Ask Grok</Button>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}