import {
  Product,
  ProductUpdate,
  SalesRecord,
  RecommendationsResponse,
  SimulationResult,
  ChatMessage,
  ChatResponse
} from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string; has_gemini_key: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchRecommendations(): Promise<RecommendationsResponse> {
  const res = await fetch(`${API_BASE}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch AI recommendations');
  return res.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(product: Product): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

export async function fetchSalesHistory(productId?: string): Promise<SalesRecord[]> {
  const url = productId ? `${API_BASE}/sales-history?product_id=${productId}` : `${API_BASE}/sales-history`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sales history');
  return res.json();
}

export async function runSimulation(productId: string, discountPct: number, durationDays: number = 7): Promise<SimulationResult> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      discount_pct: discountPct,
      campaign_duration_days: durationDays
    }),
  });
  if (!res.ok) throw new Error('Failed to run simulation');
  return res.json();
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  apiKey?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversation_history: history,
      api_key: apiKey
    }),
  });
  if (!res.ok) throw new Error('Failed to communicate with AI Copilot');
  return res.json();
}

export async function updateApiKey(apiKey: string): Promise<{ message: string; has_key: boolean }> {
  const res = await fetch(`${API_BASE}/set-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) throw new Error('Failed to update API key');
  return res.json();
}

export async function resetDemoData(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/reset-data`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}

export async function uploadInventoryCsv(file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload-csv`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload CSV');
  return res.json();
}
