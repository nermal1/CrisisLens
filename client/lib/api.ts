import { supabase } from "./supabaseClient";

const API_URL = "http://localhost:8000";

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }
  return {
    "Authorization": `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchPortfolios() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/portfolios/`, { headers });
  if (!res.ok) throw new Error("Failed to fetch portfolios");
  return res.json();
}

export async function createPortfolio(name: string, description: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/portfolios/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) throw new Error("Failed to create portfolio");
  return res.json();
}

export async function deletePortfolio(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/portfolios/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete portfolio");
}

export async function addHoldings(
  portfolioId: string,
  holdings: { ticker: string; shares: number; avg_price_paid: number }[]
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/portfolios/${portfolioId}/holdings`, {
    method: "POST",
    headers,
    body: JSON.stringify(holdings),
  });
  if (!res.ok) throw new Error("Failed to add holdings");
  return res.json();
}

