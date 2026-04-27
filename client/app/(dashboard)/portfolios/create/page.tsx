"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortfolio, addHoldings } from "@/lib/api";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Upload, Save, Loader2, FileText, X } from "lucide-react";

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [manualHoldings, setManualHoldings] = useState([
    { ticker: "", shares: "", price: "" }
  ]);

  const [csvHoldings, setCsvHoldings] = useState<{ ticker: string; shares: string; price: string }[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string) {
    setCsvError(null);
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (lines.length < 2) {
      setCsvError("CSV must have a header row and at least one data row.");
      return;
    }

    const header = lines[0].toLowerCase().replace(/\s/g, "").split(",");
    const tickerIdx = header.findIndex(h => h.includes("ticker") || h.includes("symbol"));
    const sharesIdx = header.findIndex(h => h.includes("share") || h.includes("qty") || h.includes("quantity"));
    const priceIdx = header.findIndex(h => h.includes("price") || h.includes("avg") || h.includes("cost"));

    if (tickerIdx === -1 || sharesIdx === -1) {
      setCsvError("CSV must have 'ticker' and 'shares' columns.");
      return;
    }

    const parsed = lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim().replace(/"/g, ""));
      return {
        ticker: (cols[tickerIdx] || "").toUpperCase(),
        shares: cols[sharesIdx] || "",
        price: priceIdx !== -1 ? cols[priceIdx] || "" : "",
      };
    }).filter(r => r.ticker && r.shares);

    if (parsed.length === 0) {
      setCsvError("No valid rows found in CSV.");
      return;
    }

    setCsvHoldings(parsed);
  }

  function handleFileUpload(file: File) {
    if (!file.name.endsWith(".csv")) {
      setCsvError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(e.target?.result as string);
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const content = "ticker,shares,avg_price\nAAPL,10,150.00\nNVDA,5,200.00\n";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCreateFromCSV() {
    if (!name) return alert("Please give your portfolio a name.");
    if (csvHoldings.length === 0) return alert("Please upload a CSV with holdings first.");
    setLoading(true);
    try {
      const portfolio = await createPortfolio(name, description);
      const holdingsData = csvHoldings
        .filter(h => h.ticker && h.shares)
        .map(h => ({
          ticker: h.ticker,
          shares: parseFloat(h.shares),
          avg_price_paid: parseFloat(h.price || "0"),
        }));
      await addHoldings(portfolio.id, holdingsData);
      router.push("/portfolios");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const addManualRow = () => {
    setManualHoldings([...manualHoldings, { ticker: "", shares: "", price: "" }]);
  };

  const removeManualRow = (index: number) => {
    setManualHoldings(manualHoldings.filter((_, i) => i !== index));
  };

  const updateManualRow = (index: number, field: string, value: string) => {
    const newHoldings = [...manualHoldings];
    // value = ticker symbol 
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setManualHoldings(newHoldings);
  };

  const handleCreatePortfolio = async () => {
    if (!name) return alert("Please give your portfolio a name.");
    setLoading(true);
    const invalidRows: number[] = [];

    try {
      await Promise.all(
        manualHoldings.map(async (h, index) => {
        if (!h.ticker) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://crisislens.onrender.com"}/tickers/search?q=${h.ticker}`);
          const data = await res.json();

          if (!Array.isArray(data) || data.length ===0)
          {
            invalidRows.push(index + 1);
          }
        } catch (err) {
          invalidRows.push(index + 1);
        }

      })
    );

    if (invalidRows.length > 0) {
      // Sort them so the message looks nice: "Rows 1, 3"
      const sortedRows = invalidRows.sort((a, b) => a - b);
      throw new Error(`Invalid or unknown tickers found on row(s): ${sortedRows.join(", ")}`);
    }

      const portfolio = await createPortfolio(name, description);
      
      const holdingsData = manualHoldings
        .filter(h => h.ticker && h.shares)
        .map(h => ({
          ticker: h.ticker,
          shares: parseFloat(h.shares),
          avg_price_paid: parseFloat(h.price || "0"),
        }));

      await addHoldings(portfolio.id, holdingsData);
      router.push("/portfolios");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header and Basic Info Card remain the same as your original code */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Portfolio</h1>
          <p className="text-slate-500">Add a name and your assets to get started.</p>
        </div>
        <Button onClick={handleCreatePortfolio} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
          Save Portfolio
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Portfolio Name</label>
            <Input placeholder="e.g. My Tech Stocks" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Input placeholder="e.g. Focus on AI and semiconductors" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="csv">Upload CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Holdings</CardTitle>
                <Button variant="outline" size="sm" onClick={addManualRow}>
                  <Plus size={16} className="mr-1" /> Add Row
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 text-xs font-bold text-slate-500 px-2">
                  <div>TICKER</div>
                  <div>SHARES</div>
                  <div>AVG PRICE</div>
                  <div></div>
                </div>
                {manualHoldings.map((row, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-center border-b pb-2 last:border-0">
                    {/* UPDATED: Replaced Input with TickerSearch */}
                    <TickerSearch 
                      value={row.ticker} 
                      onChange={(val) => updateManualRow(index, "ticker", val)} 
                    />
                    <Input 
                      type="number" 
                      placeholder="10" 
                      value={row.shares}
                      onChange={(e) => updateManualRow(index, "shares", e.target.value)}
                    />
                    <Input 
                      type="number" 
                      placeholder="150.00" 
                      value={row.price}
                      onChange={(e) => updateManualRow(index, "price", e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeManualRow(index)}>
                      <Trash2 size={18} className="text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Upload CSV</CardTitle>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <FileText size={14} className="mr-1" /> Download Template
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
              >
                <Upload size={28} className="mx-auto mb-3 text-slate-400" />
                <p className="font-medium text-slate-700">Click or drag a CSV file here</p>
                <p className="text-xs text-slate-400 mt-1">Required columns: ticker, shares — optional: avg_price</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                />
              </div>

              {csvError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <X size={16} /> {csvError}
                </div>
              )}

              {csvHoldings.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{csvHoldings.length} holdings parsed</p>
                    <Button variant="ghost" size="sm" className="text-red-500 text-xs" onClick={() => setCsvHoldings([])}>
                      Clear
                    </Button>
                  </div>
                  <div className="rounded-xl border overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 px-4 py-2 bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                      <span>Ticker</span><span>Shares</span><span>Avg Price</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y">
                      {csvHoldings.map((row, i) => (
                        <div key={i} className="grid grid-cols-3 gap-4 px-4 py-2 text-sm">
                          <span className="font-semibold text-slate-800">{row.ticker}</span>
                          <span>{row.shares}</span>
                          <span className="text-slate-500">{row.price || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreateFromCSV}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={16} />}
                    Create Portfolio from CSV
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}