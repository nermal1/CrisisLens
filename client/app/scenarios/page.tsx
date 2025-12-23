"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ArrowRight, Calendar, TrendingDown, TrendingUp, AlertTriangle, Clock, Info, CheckCircle, BarChart3, Globe } from "lucide-react";

// --- SCENARIO DATA ---
const scenarios = [
  {
    id: "covid-19",
    title: "COVID-19 Crash",
    dateRange: "Feb 19, 2020 - Mar 23, 2020",
    severity: "High",
    maxDrawdown: "-34%",
    shortDescription: "A rapid, panic-driven market sell-off triggered by the global pandemic lockdowns.",
    content: (
      <div className="space-y-8 pr-2">
        
        {/* 1. THE CRASH: WHAT & WHY */}
        <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Globe size={24} className="text-blue-600"/> The Crash: What Happened and Why
            </h3>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-slate-800">Origin of the Crash</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                    The COVID-19 pandemic emerged in late 2019 and spread globally by early 2020. As the virus spread, governments imposed lockdowns, travel bans, and quarantines to slow transmission. These actions dramatically slowed economic activity — factories halted, travel stopped, and consumer demand plummeted. Investors reacted with fear and uncertainty, selling stocks en masse.
                </p>
                <div className="flex gap-2 items-start mt-2 p-3 bg-white rounded border border-slate-200">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5"/>
                    <div className="text-xs text-slate-500">
                        <strong>Why markets fell:</strong> Global lockdowns caused massive economic disruption, investors feared a deep recession, and algorithms magnified sell-offs.
                    </div>
                </div>
            </div>
        </section>

        {/* 2. TIMELINE */}
        <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock size={24} className="text-slate-700"/> Timeline of the Crash
            </h3>
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pl-6 py-2">
                <div className="relative">
                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-300"></div>
                    <h4 className="font-bold text-slate-900">Feb 19, 2020</h4>
                    <p className="text-sm text-slate-600">The S&P 500 reached its last peak before the crash.</p>
                </div>
                <div className="relative">
                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-red-400"></div>
                    <h4 className="font-bold text-slate-900">Late Feb 2020</h4>
                    <p className="text-sm text-slate-600">Major indexes began significant declines—the fastest drop from all-time highs to correction territory in history.</p>
                </div>
                <div className="relative">
                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-red-600"></div>
                    <h4 className="font-bold text-slate-900">March 9–16, 2020</h4>
                    <p className="text-sm text-slate-600">Massive daily declines. The Dow Jones dropped almost 3,000 points on March 16 due to panic over lockdowns.</p>
                </div>
                <div className="relative">
                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-500"></div>
                    <h4 className="font-bold text-slate-900">March 23, 2020 (The Bottom)</h4>
                    <p className="text-sm text-slate-600">S&P 500 bottomed roughly 34% below its peak. This marked the start of the recovery as the Fed announced massive stimulus.</p>
                </div>
            </div>
        </section>

        {/* 3. MECHANISMS */}
        <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">Mechanisms Behind the Reaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-900 mb-1">Panic & Volatility</h4>
                    <p className="text-xs text-slate-600">Negative news (rising death counts) had a larger impact than positive news. Panic selling lowered liquidity and amplified volatility.</p>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                    <h4 className="font-bold text-sm text-slate-900 mb-1">Sentiment Effects</h4>
                    <p className="text-xs text-slate-600">Traditional predictors failed. Markets responded more to global shocks than conventional signals due to extreme uncertainty.</p>
                </div>
            </div>
        </section>

        <hr className="my-6 border-slate-200" />

        {/* 4. WINNERS & LOSERS */}
        <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Winners and Losers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Winners */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-green-100 text-green-800 rounded-md font-bold">
                        <TrendingUp size={20}/> 🟢 Winners
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="bg-green-50/50 p-2 rounded border border-green-100">
                            <strong>Tech & Software:</strong> Remote work tools (Zoom, Cloud) surged as work went virtual.
                        </li>
                        <li className="bg-green-50/50 p-2 rounded border border-green-100">
                            <strong>Healthcare:</strong> Vaccine developers and biotech firms became focal points.
                        </li>
                        <li className="bg-green-50/50 p-2 rounded border border-green-100">
                            <strong>Consumer Staples:</strong> Essential goods (food, household items) held up as demand remained stable.
                        </li>
                        <li className="bg-green-50/50 p-2 rounded border border-green-100">
                            <strong>Utilities:</strong> Natural gas and utilities performed better relative to oil.
                        </li>
                    </ul>
                </div>

                {/* Losers */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-red-100 text-red-800 rounded-md font-bold">
                        <TrendingDown size={20}/> 🔴 Losers
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="bg-red-50/50 p-2 rounded border border-red-100">
                            <strong>Energy & Oil:</strong> Demand collapsed with travel bans.
                        </li>
                        <li className="bg-red-50/50 p-2 rounded border border-red-100">
                            <strong>Hospitality:</strong> Hotels, casinos, and theaters suffered massive revenue drops.
                        </li>
                        <li className="bg-red-50/50 p-2 rounded border border-red-100">
                            <strong>Airlines & Cruises:</strong> Travel restrictions and fear decimated these sectors.
                        </li>
                        <li className="bg-red-50/50 p-2 rounded border border-red-100">
                            <strong>Real Estate:</strong> Commercial real estate prices dropped; banks faced heightened risk.
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* 5. RECOVERY */}
        <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900">The Recovery: Timing & Shape</h3>
            <p className="text-sm text-slate-600">
                Unlike 2008, the recovery was relatively quick (V-shaped for indices). Massive stimulus (interest rate cuts, spending) fueled a rebound starting late March 2020. Tech and healthcare surged, while travel lagged.
            </p>
        </section>

        {/* 6. PEAKS & VALLEYS TABLE */}
        <section className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={24} className="text-purple-600"/> Key Peaks & Valleys
            </h3>
            <div className="border rounded-lg overflow-hidden text-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                        <tr>
                            <th className="p-3">Event</th>
                            <th className="p-3">Approx. Date</th>
                            <th className="p-3">Market Reaction</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-3">Pre-Crash Peak</td>
                            <td className="p-3">Feb 19, 2020</td>
                            <td className="p-3">Stocks at All-Time Highs</td>
                        </tr>
                        <tr>
                            <td className="p-3">Rapid Sell-Off</td>
                            <td className="p-3">Late Feb 2020</td>
                            <td className="p-3">Fastest drop to correction in history</td>
                        </tr>
                        <tr>
                            <td className="p-3 bg-red-50 font-medium">Market Trough</td>
                            <td className="p-3 bg-red-50">Mar 23, 2020</td>
                            <td className="p-3 bg-red-50">~34% below Feb Peak</td>
                        </tr>
                        <tr>
                            <td className="p-3">Recovery Start</td>
                            <td className="p-3">April 2020</td>
                            <td className="p-3">Stimulus supports buy-backs</td>
                        </tr>
                        <tr>
                            <td className="p-3">All-Time Highs</td>
                            <td className="p-3">Late 2020</td>
                            <td className="p-3">Indices surpass pre-crisis peaks</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <hr className="my-6 border-slate-200" />

        {/* 7. WHY IT WAS DIFFERENT & LESSONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">Why This Was Different</h4>
                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-4">
                    <li><strong>Short Duration:</strong> Triggered externally by health, not financial rot.</li>
                    <li><strong>Intervention:</strong> Unprecedented stimulus decoupled markets from economic pain.</li>
                    <li><strong>Shift:</strong> Permanently shifted behavior to digital/remote services.</li>
                </ul>
            </div>

            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-900 uppercase tracking-wide text-xs flex items-center gap-2">
                    <CheckCircle size={14}/> Lessons for Investors
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>✅ <strong>Diversification matters</strong> — spreading risk helps survive shocks.</li>
                    <li>✅ <strong>Stay calm</strong> — panic selling often locks in losses.</li>
                    <li>✅ <strong>Long-term thinking</strong> — recovery can outpace short-term fear.</li>
                </ul>
            </div>
        </section>

      </div>
    )
  },
  {
    id: "financial-crisis-2008",
    title: "2008 Financial Crisis",
    dateRange: "Oct 2007 - Mar 2009",
    severity: "Critical",
    maxDrawdown: "-56%",
    shortDescription: "A systemic collapse of the banking sector caused by the subprime mortgage bubble.",
    content: (
        <div className="space-y-6">
            <p className="text-slate-600">
                The 2008 Financial Crisis was a major worldwide economic crisis. It was the most serious financial crisis since the Great Depression of the 1930s. Predatory lending targeting low-income homebuyers, excessive risk-taking by global financial institutions, and the bursting of the United States housing bubble culminated in a "perfect storm."
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded border border-green-100">
                    <h4 className="font-bold text-green-800 mb-2">Winners</h4>
                    <ul className="text-sm text-green-700 list-disc pl-4">
                        <li>Gold & Treasuries</li>
                        <li>Dollar General (Discounters)</li>
                        <li>Short Sellers</li>
                    </ul>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-100">
                    <h4 className="font-bold text-red-800 mb-2">Losers</h4>
                    <ul className="text-sm text-red-700 list-disc pl-4">
                        <li>Lehman Brothers (Financials)</li>
                        <li>Real Estate Sector</li>
                        <li>Automakers (GM)</li>
                    </ul>
                </div>
            </div>
        </div>
    )
  },
  {
    id: "dot-com-bubble",
    title: "Dot-Com Bubble",
    dateRange: "Mar 2000 - Oct 2002",
    severity: "High",
    maxDrawdown: "-49%",
    shortDescription: "The bursting of an inflated technology valuation bubble.",
    content: (
        <div className="space-y-6">
            <p className="text-slate-600">
                The Dot-com bubble was a historic economic bubble and period of excessive speculation that occurred roughly from 1997 to 2001, a period of extreme growth in the usage and adaptation of the Internet. Investors poured money into any company with a ".com" suffix, often disregarding traditional metrics like P/E ratio.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded border border-green-100">
                    <h4 className="font-bold text-green-800 mb-2">Winners</h4>
                    <ul className="text-sm text-green-700 list-disc pl-4">
                        <li>Real Estate (Capital Rotation)</li>
                        <li>Value Stocks</li>
                        <li>Bonds</li>
                    </ul>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-100">
                    <h4 className="font-bold text-red-800 mb-2">Losers</h4>
                    <ul className="text-sm text-red-700 list-disc pl-4">
                        <li>Pets.com (Internet Startups)</li>
                        <li>Telecom Infrastructure</li>
                        <li>Cisco / Intel (Hardware)</li>
                    </ul>
                </div>
            </div>
        </div>
    )
  }
];

export default function ScenarioPage() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Scenario Library</h1>
        <p className="text-slate-500 mt-2 max-w-3xl">
          Click on any card to view the full history, causes, and market winners/losers.
        </p>
      </div>

      {/* Grid of Clickable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          
          <Sheet key={scenario.id}>
            <SheetTrigger asChild>
                <Card 
                  className="cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group h-full flex flex-col"
                  onClick={() => setSelectedScenario(scenario)}
                >
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                scenario.severity === "Critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                             }`}>
                                {scenario.severity}
                             </span>
                             <Info size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-700 transition-colors">
                            {scenario.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <Calendar size={14}/> {scenario.dateRange}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-slate-600 text-sm line-clamp-3">
                            {scenario.shortDescription}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between text-sm font-medium pt-4 border-t border-slate-100">
                             <span className="text-slate-500">Max Drawdown</span>
                             <span className="text-red-600">{scenario.maxDrawdown}</span>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>

            {/* FIXED: Replaced ScrollArea with standard div + overflow-y-auto */}
            <SheetContent className="w-full sm:max-w-[900px] h-full flex flex-col p-0">
                
                {/* Fixed Header */}
                <SheetHeader className="px-6 py-6 border-b bg-white z-10 shrink-0">
                    <SheetTitle className="text-2xl font-bold text-slate-900">{scenario.title}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 text-base">
                        <Calendar size={16}/> {scenario.dateRange}
                    </SheetDescription>
                </SheetHeader>

                {/* SCROLLABLE CONTENT AREA */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Render the specific content for the scenario */}
                    {scenario.content}
                    
                    {/* Padding at bottom so content isn't hidden by footer */}
                    <div className="h-10"></div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t bg-slate-50 mt-auto shrink-0">
                    <Link href={`/analysis?scenario=${scenario.id}`} className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-md">
                            Simulate This Crisis <ArrowRight className="ml-2"/>
                        </Button>
                    </Link>
                </div>

            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
}