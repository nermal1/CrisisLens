"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Newspaper, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock Data representing 
const sentimentSummary = [
  { ticker: "AAPL", score: 0.85, sentiment: "Positive", articles: 12 },
  { ticker: "TSLA", score: -0.42, sentiment: "Negative", articles: 8 },
  { ticker: "GOOGL", score: 0.12, sentiment: "Neutral", articles: 5 },
  { ticker: "SPY", score: -0.10, sentiment: "Neutral", articles: 25 },
];

const newsFeed = [
  {
    id: 1,
    source: "Bloomberg",
    date: "2020-03-12",
    title: "Markets Plunge as Pandemic Fears Grip Global Investors",
    sentiment: "Negative",
    score: -0.92,
    related: ["SPY", "DIA"]
  },
  {
    id: 2,
    source: "TechCrunch",
    date: "2020-03-15",
    title: "Tech Giants Shift to Remote Work: What This Means for Cloud Stocks",
    sentiment: "Positive",
    score: 0.65,
    related: ["AAPL", "GOOGL", "MSFT"]
  },
  {
    id: 3,
    source: "Reuters",
    date: "2020-03-18",
    title: "Federal Reserve Announces Emergency Rate Cut to Stabilize Economy",
    sentiment: "Neutral",
    score: 0.05,
    related: ["SPY"]
  },
];

export default function NewsPage() {
  return (
    <div className="space-y-6 h-full">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">News Sentiment</h1>
            <p className="text-slate-500 mt-1">
                AI-powered analysis of financial headlines using FinBERT.
            </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Filter by ticker (e.g. AAPL)" className="pl-8 bg-white" />
            </div>
            <Button variant="outline" className="gap-2">
                <Filter size={16} /> Filters
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sentimentSummary.map((item) => (
            <Card key={item.ticker} className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                        {item.ticker}
                        {item.sentiment === "Positive" ? <TrendingUp size={20} className="text-green-600"/> : 
                         item.sentiment === "Negative" ? <TrendingDown size={20} className="text-red-600"/> : 
                         <Minus size={20} className="text-slate-400"/>}
                    </CardTitle>
                    <CardDescription>Based on {item.articles} articles</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${
                        item.sentiment === "Positive" ? "text-green-700" :
                        item.sentiment === "Negative" ? "text-red-700" : "text-slate-700"
                    }`}>
                        {item.score > 0 ? "+" : ""}{item.score}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">{item.sentiment}</p>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="min-h-[400px]">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Newspaper size={20} /> Latest Headlines
            </CardTitle>
            <CardDescription>
                Showing headlines for the <strong>COVID-19 Crash</strong> scenario window.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {newsFeed.map((article) => (
                    <div key={article.id} className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-lg bg-slate-50 border hover:border-blue-200 transition-colors">
                        
                        {/* Article Info */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-semibold">
                                <span className="text-blue-600">{article.source}</span>
                                <span>•</span>
                                <span>{article.date}</span>
                            </div>
                            <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                                {article.title}
                            </h3>
                            <div className="flex gap-2 mt-2">
                                {article.related.map(tag => (
                                    <span key={tag} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Sentiment Score Badge */}
                        <div className={`px-4 py-2 rounded-lg text-center min-w-[100px] border ${
                             article.sentiment === "Positive" ? "bg-green-100 border-green-200 text-green-800" :
                             article.sentiment === "Negative" ? "bg-red-100 border-red-200 text-red-800" :
                             "bg-slate-100 border-slate-200 text-slate-800"
                        }`}>
                            <div className="text-xl font-bold">{article.score > 0 ? "+" : ""}{article.score}</div>
                            <div className="text-xs uppercase font-bold tracking-wide">{article.sentiment}</div>
                        </div>

                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}