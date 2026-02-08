"use client";

import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ReferenceLine 
} from "recharts";

// 1. TypeScript Props Definition
interface PerformanceChartProps {
  scenarioId: string;
  isZoomed: boolean;
}

export default function PerformanceChart({ scenarioId, isZoomed }: PerformanceChartProps) {
  
  // 2. MOCK DATA LOGIC: Swaps data based on scenarioId
  // In the future, this will be a fetch() to your server
  const getChartData = () => {
    const fullData = [
      { date: "T-1m", portfolio: 100, market: 100 },
      { date: "Crash Start", portfolio: 95, market: 92 },
      { date: "Peak Fear", portfolio: 70, market: 65 }, // Zoom target
      { date: "Bottom", portfolio: 62, market: 58 },    // Zoom target
      { date: "Recovery", portfolio: 85, market: 80 },
      { date: "T+1m", portfolio: 105, market: 98 },
    ];

    // If zoomed, we slice the array to only show the "bad" parts
    return isZoomed ? fullData.slice(1, 4) : fullData;
  };

  const data = getChartData();

  return (
    <div className="w-full h-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          
          {/* Market Benchmark Line */}
          <Area 
            type="monotone" 
            dataKey="market" 
            stroke="#cbd5e1" 
            fill="transparent" 
            strokeWidth={2} 
            strokeDasharray="5 5" 
            name="S&P 500"
          />

          {/* Portfolio Area */}
          <Area 
            type="monotone" 
            dataKey="portfolio" 
            stroke="#2563eb" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorPort)" 
            name="Your Portfolio"
            animationDuration={1500}
          />

          {/* Highlight the "Crash" Point */}
          {isZoomed && (
            <ReferenceLine x="Bottom" stroke="#ef4444" label={{ position: 'top', value: 'Max Drawdown', fill: '#ef4444', fontSize: 10 }} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}