"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRight, Wallet, ShieldAlert, ShieldCheck } from "lucide-react";

// Mock Data
const portfolios = [
  { 
    id: 1, 
    name: "Retirement 2055", 
    description: "Long-term growth with a mix of ETFs and blue-chip stocks.", 
    value: "$142,500", 
    holdingsCount: 12,
    risk: "Moderate" 
  },
  { 
    id: 2, 
    name: "High-Risk Tech Spec", 
    description: "Concentrated bets on AI and semiconductor stocks.", 
    value: "$28,400", 
    holdingsCount: 5,
    risk: "High" 
  },
  { 
    id: 3, 
    name: "Recession Hedge", 
    description: "Gold, utilities, and consumer staples.", 
    value: "$65,000", 
    holdingsCount: 8,
    risk: "Low" 
  },
];

export default function PortfolioHubPage() {
  return (
    <div className="space-y-8 h-full">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portfolio Hub</h1>
          <p className="text-slate-500 mt-1">
            Manage your holdings and select a portfolio to stress-test against historical crises.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm">
          <PlusCircle size={18} />
          Create New Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="flex flex-col hover:shadow-md transition-all border-slate-200">
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mb-3 w-fit">
                  <Wallet size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                    portfolio.risk === "High" ? "bg-red-50 text-red-700 border-red-200" :
                    portfolio.risk === "Low" ? "bg-green-50 text-green-700 border-green-200" :
                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}>
                  {portfolio.risk} Risk
                </span>
              </div>
              <CardTitle className="text-xl">{portfolio.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {portfolio.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <div className="flex justify-between items-end border-t pt-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900">{portfolio.value}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Holdings</p>
                    <p className="text-sm font-medium text-slate-900">{portfolio.holdingsCount} Assets</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Link href="/analysis" className="w-full">
                <Button variant="outline" className="w-full gap-2 border-slate-300 hover:bg-slate-50 hover:text-blue-700">
                  Run Scenario Analysis <ArrowRight size={16} />
                </Button>
              </Link>
            </CardFooter>
            
          </Card>
        ))}

        <button className="group border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all h-full min-h-[300px]">
           <div className="p-4 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors mb-4">
              <PlusCircle size={32} className="text-slate-400 group-hover:text-blue-600" />
           </div>
           <h3 className="text-lg font-semibold text-slate-600 group-hover:text-blue-700">Add Portfolio</h3>
           <p className="text-sm text-slate-400 text-center mt-2 max-w-[200px]">
             Import from CSV or enter tickers manually
           </p>
        </button>

      </div>
    </div>
  );
}