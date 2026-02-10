"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Upload, Save, Loader2, X } from "lucide-react";

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Manual Entry State
  const [manualHoldings, setManualHoldings] = useState([
    { ticker: "", shares: "", price: "" }
  ]);

  const addManualRow = () => {
    setManualHoldings([...manualHoldings, { ticker: "", shares: "", price: "" }]);
  };

  const removeManualRow = (index: number) => {
    setManualHoldings(manualHoldings.filter((_, i) => i !== index));
  };

  const updateManualRow = (index: number, field: string, value: string) => {
    const newHoldings = [...manualHoldings];
    newHoldings[index] = { ...newHoldings[index], [field]: value.toUpperCase() };
    setManualHoldings(newHoldings);
  };

  const handleCreatePortfolio = async () => {
    if (!name) return alert("Please give your portfolio a name.");
    setLoading(true);

    try {
      // 1. Create the Portfolio Record
      // Note: user_id will be handled by Supabase Auth once Nick is done.
      // For now, it will work if you have RLS disabled or set to "Allow All".
      const { data: portfolio, error: pError } = await supabase
        .from("portfolios")
        .insert([{ name, description }])
        .select()
        .single();

      if (pError) throw pError;

      // 2. Prepare Holdings Data
      const holdingsData = manualHoldings
        .filter(h => h.ticker && h.shares) // Only save rows that aren't empty
        .map(h => ({
          portfolio_id: portfolio.id,
          ticker: h.ticker,
          shares: parseFloat(h.shares),
          avg_price_paid: parseFloat(h.price || "0"),
        }));

      if (holdingsData.length > 0) {
        const { error: hError } = await supabase
          .from("holdings")
          .insert(holdingsData);
        if (hError) throw hError;
      }

      router.push("/portfolio-hub"); // Redirect back to hub
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Portfolio</h1>
          <p className="text-slate-500">Add a name and your assets to get started.</p>
        </div>
        <Button 
          onClick={handleCreatePortfolio} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
          Save Portfolio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Portfolio Name</label>
            <Input 
              placeholder="e.g. My Tech Stocks" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Input 
              placeholder="e.g. Focus on AI and semiconductors" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
                    <Input 
                      placeholder="AAPL" 
                      value={row.ticker}
                      onChange={(e) => updateManualRow(index, "ticker", e.target.value)}
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
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <Upload size={32} className="text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Coming Soon</h3>
                <p className="text-sm text-slate-500">CSV parsing logic will be added here next.</p>
              </div>
              <Button disabled variant="outline">Select File</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}