"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data for now 
const data = [
  { date: "Jan", portfolio: 100, sp500: 100 },
  { date: "Feb", portfolio: 105, sp500: 102 },
  { date: "Mar", portfolio: 95, sp500: 98 }, 
  { date: "Apr", portfolio: 88, sp500: 92 },
  { date: "May", portfolio: 92, sp500: 96 },
  { date: "Jun", portfolio: 98, sp500: 101 },
  { date: "Jul", portfolio: 104, sp500: 105 },
];

export default function PerformanceChart() {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", color: "#fff", border: "none" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="portfolio"
            name="Your Portfolio"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          
          <Line
            type="monotone"
            dataKey="sp500"
            name="S&P 500"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5" 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}