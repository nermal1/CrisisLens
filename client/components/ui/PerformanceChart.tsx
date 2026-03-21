"use client";

import { useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, Table } from "lucide-react";

interface PerformanceChartProps {
  scenarioId: string;
  isZoomed: boolean;
  startDate?: string;
  endDate?: string;
  portfolioId?: string;
}

type ChartPoint = {
  date: string;
  portfolio: number;
  market: number;
};

export default function PerformanceChart({
  scenarioId,
  isZoomed,
  startDate,
  endDate,
  portfolioId,
}: PerformanceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const data = useMemo<ChartPoint[]>(() => {
    const scenarioDataMap: Record<string, ChartPoint[]> = {
      "covid-19": [
        { date: "Pre-Crash", portfolio: 100, market: 100 },
        { date: "Feb 2020", portfolio: 96, market: 94 },
        { date: "Mar 2020", portfolio: 72, market: 68 },
        { date: "Bottom", portfolio: 66, market: 63 },
        { date: "Recovery", portfolio: 88, market: 84 },
        { date: "Post-Crash", portfolio: 104, market: 99 },
      ],
      "great-recession": [
        { date: "2007 Q4", portfolio: 100, market: 100 },
        { date: "Bear Start", portfolio: 92, market: 89 },
        { date: "Lehman", portfolio: 74, market: 69 },
        { date: "Bottom", portfolio: 58, market: 55 },
        { date: "Recovery", portfolio: 77, market: 73 },
        { date: "2009 Q4", portfolio: 90, market: 87 },
      ],
      "dot-com-bubble": [
        { date: "Peak", portfolio: 100, market: 100 },
        { date: "Selloff", portfolio: 90, market: 93 },
        { date: "Tech Crash", portfolio: 68, market: 81 },
        { date: "Bottom", portfolio: 52, market: 76 },
        { date: "Stabilizing", portfolio: 61, market: 80 },
        { date: "Aftermath", portfolio: 70, market: 84 },
      ],
      "black-monday": [
        { date: "T-1w", portfolio: 100, market: 100 },
        { date: "T-2d", portfolio: 98, market: 97 },
        { date: "Crash Start", portfolio: 83, market: 80 },
        { date: "Bottom", portfolio: 71, market: 69 },
        { date: "Rebound", portfolio: 79, market: 77 },
        { date: "T+2w", portfolio: 86, market: 84 },
      ],
      "debt-ceiling-crisis": [
        { date: "Apr 2011", portfolio: 100, market: 100 },
        { date: "Debate", portfolio: 97, market: 95 },
        { date: "Downgrade Fear", portfolio: 88, market: 84 },
        { date: "Bottom", portfolio: 81, market: 80 },
        { date: "Relief", portfolio: 90, market: 88 },
        { date: "Aftermath", portfolio: 95, market: 93 },
      ],
      "oil-embargo-recession": [
        { date: "Pre-Embargo", portfolio: 100, market: 100 },
        { date: "Shock", portfolio: 90, market: 88 },
        { date: "Inflation Spike", portfolio: 76, market: 73 },
        { date: "Bottom", portfolio: 61, market: 58 },
        { date: "Recession", portfolio: 64, market: 61 },
        { date: "Stabilizing", portfolio: 72, market: 69 },
      ],
      "rate-hike-bear-market": [
        { date: "Jan 2022", portfolio: 100, market: 100 },
        { date: "Q1", portfolio: 93, market: 91 },
        { date: "Q2", portfolio: 81, market: 79 },
        { date: "Bottom", portfolio: 73, market: 76 },
        { date: "Relief Rally", portfolio: 79, market: 82 },
        { date: "Oct 2022", portfolio: 77, market: 80 },
      ],
      "russia-ukraine-war": [
        { date: "Pre-Invasion", portfolio: 100, market: 100 },
        { date: "Invasion", portfolio: 94, market: 92 },
        { date: "Commodity Shock", portfolio: 84, market: 85 },
        { date: "Bottom", portfolio: 79, market: 80 },
        { date: "Adjustment", portfolio: 87, market: 86 },
        { date: "Mid-2022", portfolio: 90, market: 89 },
      ],
      "svb-banking-crisis": [
        { date: "Pre-Crisis", portfolio: 100, market: 100 },
        { date: "SVB News", portfolio: 96, market: 97 },
        { date: "Bank Run", portfolio: 89, market: 91 },
        { date: "Bottom", portfolio: 87, market: 90 },
        { date: "Support", portfolio: 93, market: 95 },
        { date: "Recovery", portfolio: 97, market: 98 },
      ],
      "volcker-shock": [
        { date: "1979", portfolio: 100, market: 100 },
        { date: "Rate Surge", portfolio: 93, market: 94 },
        { date: "Tightening", portfolio: 84, market: 86 },
        { date: "Bottom", portfolio: 73, market: 75 },
        { date: "Inflation Eases", portfolio: 79, market: 81 },
        { date: "1982", portfolio: 88, market: 89 },
      ],
      volmageddon: [
        { date: "Jan 2018", portfolio: 100, market: 100 },
        { date: "Vol Spike", portfolio: 94, market: 95 },
        { date: "Panic", portfolio: 88, market: 90 },
        { date: "Bottom", portfolio: 84, market: 87 },
        { date: "Bounce", portfolio: 91, market: 92 },
        { date: "Late Feb", portfolio: 95, market: 96 },
      ],
    };

    const fallback = [
      { date: "T-1m", portfolio: 100, market: 100 },
      { date: "Crash Start", portfolio: 95, market: 92 },
      { date: "Peak Fear", portfolio: 70, market: 65 },
      { date: "Bottom", portfolio: 62, market: 58 },
      { date: "Recovery", portfolio: 85, market: 80 },
      { date: "T+1m", portfolio: 105, market: 98 },
    ];

    const fullData = scenarioDataMap[scenarioId] || fallback;
    return isZoomed ? fullData.slice(1, 4) : fullData;
  }, [scenarioId, isZoomed]);

  function exportCSV() {
    const headers = ["Date", "Portfolio", "Market"];
    const rows = data.map((point) => [point.date, point.portfolio, point.market]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const dateSuffix = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `${scenarioId || "analysis"}-${dateSuffix}-data.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  async function exportPNG() {
    if (!chartRef.current) return;

    try {
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      const dateSuffix = new Date().toISOString().slice(0, 10);
      link.download = `${scenarioId || "analysis"}-${dateSuffix}-chart.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export chart as PNG:", error);
    }
  }

  return (
    <div className="w-full h-full min-h-[350px] space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Table className="mr-2 h-4 w-4" />
          Export CSV
        </Button>

        <Button variant="outline" size="sm" onClick={exportPNG}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Export PNG
        </Button>
      </div>

      <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <div>
          <span className="font-medium text-slate-800">Scenario:</span>{" "}
          {scenarioId || "N/A"}
        </div>
        <div>
          <span className="font-medium text-slate-800">Portfolio:</span>{" "}
          {portfolioId || "Not selected"}
        </div>
        <div>
          <span className="font-medium text-slate-800">Window:</span>{" "}
          {startDate || "N/A"} → {endDate || "N/A"}
        </div>
      </div>

      <div ref={chartRef} className="w-full h-full min-h-[350px] rounded-xl bg-white p-4">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
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
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />

            <Area
              type="monotone"
              dataKey="market"
              stroke="#cbd5e1"
              fill="transparent"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="S&P 500"
            />

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

            {isZoomed && (
              <ReferenceLine
                x="Bottom"
                stroke="#ef4444"
                label={{
                  position: "top",
                  value: "Max Drawdown",
                  fill: "#ef4444",
                  fontSize: 10,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Date</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Portfolio</th>
              <th className="px-4 py-2 text-left font-medium text-slate-600">Market</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.date} className="border-t">
                <td className="px-4 py-2">{point.date}</td>
                <td className="px-4 py-2">${point.portfolio}</td>
                <td className="px-4 py-2">${point.market}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}