import React, { useState, useEffect } from 'react';
import {
  Product,
  PromotionRecommendation,
  ExecutiveSummary,
  SalesRecord
} from './types';
import {
  fetchRecommendations,
  fetchProducts,
  fetchSalesHistory,
  fetchHealth,
  resetDemoData
} from './services/api';
import { Navbar } from './components/Navbar';
import { RecommendationsView } from './components/RecommendationsView';
import { ChatCopilot } from './components/ChatCopilot';
import { SimulatorView } from './components/SimulatorView';
import { StoreDataView } from './components/StoreDataView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Loader2, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'copilot' | 'simulator' | 'data'>('recommendations');
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<SalesRecord[]>([]);
  const [recommendations, setRecommendations] = useState<PromotionRecommendation[]>([]);
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [health, recsRes, prodsRes, salesRes] = await Promise.all([
        fetchHealth(),
        fetchRecommendations(),
        fetchProducts(),
        fetchSalesHistory()
      ]);

      setHasGeminiKey(health.has_gemini_key);
      setRecommendations(recsRes.recommendations);
      setSummary(recsRes.summary);
      setProducts(prodsRes);
      setSalesHistory(salesRes);

      if (prodsRes.length > 0 && !selectedProductId) {
        setSelectedProductId(prodsRes[0].id);
      }
    } catch (err: any) {
      console.error('Data load error:', err);
      setError(err.message || 'Failed to connect to PromoAlign backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectForSimulation = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('simulator');
  };

  const handleAskCopilotAboutProduct = (productName: string, reason: string) => {
    setCopilotInitialPrompt(`Explain the promotion strategy and inventory risks for "${productName}". Background: ${reason}`);
    setActiveTab('copilot');
  };

  const handleAskCopilotAboutSimulation = (productName: string, discount: number, verdict: string) => {
    setCopilotInitialPrompt(`I simulated a ${discount}% discount on "${productName}". The verdict was: "${verdict}". What alternative merchandising strategies can you suggest?`);
    setActiveTab('copilot');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all catalog and transaction data to default sample dataset?')) {
      try {
        await resetDemoData();
        await loadAllData();
      } catch (err: any) {
        alert(`Reset failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onResetData={handleResetData}
        hasGeminiKey={hasGeminiKey}
        totalSkus={products.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-sm text-slate-400">Loading live inventory and computing AI alignment recommendations...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-rose-200 space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Backend Connection Notice</span>
            </div>
            <p className="text-xs text-rose-300">
              Could not fetch data from the FastAPI server at <code className="bg-slate-900 px-2 py-0.5 rounded">http://127.0.0.1:8000</code>.
            </p>
            <p className="text-xs text-slate-400">
              Make sure the Python backend is running: <code className="bg-slate-900 px-2 py-0.5 rounded font-mono text-slate-200">python -m uvicorn backend.main:app --port 8000</code>
            </p>
            <button
              onClick={loadAllData}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'recommendations' && (
              <RecommendationsView
                summary={summary}
                recommendations={recommendations}
                products={products}
                onSelectForSimulation={handleSelectForSimulation}
                onAskCopilotAboutProduct={handleAskCopilotAboutProduct}
              />
            )}

            {activeTab === 'copilot' && (
              <ChatCopilot
                products={products}
                initialMessage={copilotInitialPrompt}
                hasGeminiKey={hasGeminiKey}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            )}

            {activeTab === 'simulator' && (
              <SimulatorView
                products={products}
                selectedProductId={selectedProductId}
                onSelectProduct={setSelectedProductId}
                onAskCopilotAboutSimulation={handleAskCopilotAboutSimulation}
              />
            )}

            {activeTab === 'data' && (
              <StoreDataView
                products={products}
                salesHistory={salesHistory}
                onRefreshData={loadAllData}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>PromoAlign AI • Retail Merchandising & Inventory Alignment Platform</p>
      </footer>

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={loadAllData}
        hasKey={hasGeminiKey}
      />

    </div>
  );
}

export default App;
