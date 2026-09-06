import React, { useState } from 'react';
import {
  PromotionRecommendation,
  ExecutiveSummary,
  Product
} from '../types';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Percent,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  Filter,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  BarChart2
} from 'lucide-react';

interface RecommendationsViewProps {
  summary: ExecutiveSummary | null;
  recommendations: PromotionRecommendation[];
  products: Product[];
  onSelectForSimulation: (productId: string) => void;
  onAskCopilotAboutProduct: (productName: string, reason: string) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  summary,
  recommendations,
  products,
  onSelectForSimulation,
  onAskCopilotAboutProduct,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(recommendations.map(r => r.category)))];

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || rec.category === selectedCategory;
    
    if (!matchesSearch || !matchesCategory) return false;

    if (filterType === 'CLEAR_OVERSTOCK') return rec.action_type === 'CLEAR_OVERSTOCK';
    if (filterType === 'PROTECT_MARGIN') return rec.action_type === 'PROTECT_MARGIN';
    if (filterType === 'BALANCED_PROMO') return rec.action_type === 'BALANCED_PROMO';
    if (filterType === 'HIGH_PRIORITY') return rec.priority === 'HIGH';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header & Quick Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>AI Promotion & Inventory Alignment</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Live Engine
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Data-driven promotional suggestions to balance inventory liquidation, prevent stockouts, and protect store margins.
          </p>
        </div>
      </div>

      {/* Executive KPI Summary Row */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Revenue Unlock */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-950/40 to-slate-900/60 border border-sky-900/40 relative overflow-hidden group hover:border-sky-700/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-sky-300">Revenue Unlock Opportunity</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                ${summary.potential_revenue_unlock.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-sky-300/80 mt-1 flex items-center gap-1">
                <span>From {summary.overstocked_skus} overstocked items</span>
              </p>
            </div>
          </div>

          {/* Card 2: Stockout Danger Shield */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/40 to-slate-900/60 border border-rose-900/40 relative overflow-hidden group hover:border-rose-700/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-rose-300">Stockout Risk Alerts</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {summary.at_risk_stockout_skus} <span className="text-sm font-normal text-slate-400">SKUs</span>
              </div>
              <p className="text-xs text-rose-300/80 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected from margin bleed</span>
              </p>
            </div>
          </div>

          {/* Card 3: Recommended Campaigns */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-900/40 relative overflow-hidden group hover:border-indigo-700/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-indigo-300">Active Promo Suggestions</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {summary.recommended_promo_count} <span className="text-sm font-normal text-slate-400">Ready</span>
              </div>
              <p className="text-xs text-indigo-300/80 mt-1">
                Optimized for elasticity & profit lift
              </p>
            </div>
          </div>

          {/* Card 4: Store Gross Margin */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900/60 border border-emerald-900/40 relative overflow-hidden group hover:border-emerald-700/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-300">Average Gross Margin</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {summary.avg_gross_margin_pct.toFixed(1)}%
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">
                Across {summary.total_skus} catalog items
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'ALL'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Recommendations ({recommendations.length})
          </button>
          
          <button
            onClick={() => setFilterType('CLEAR_OVERSTOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'CLEAR_OVERSTOCK'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Clear Overstock ({recommendations.filter(r => r.action_type === 'CLEAR_OVERSTOCK').length})</span>
          </button>

          <button
            onClick={() => setFilterType('PROTECT_MARGIN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'PROTECT_MARGIN'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protect Margin / Low Stock ({recommendations.filter(r => r.action_type === 'PROTECT_MARGIN').length})</span>
          </button>

          <button
            onClick={() => setFilterType('BALANCED_PROMO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'BALANCED_PROMO'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Balanced Promotions ({recommendations.filter(r => r.action_type === 'BALANCED_PROMO').length})</span>
          </button>
        </div>

        {/* Search & Category dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search product or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none w-full sm:w-48"
          />
        </div>

      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((rec) => {
          const product = products.find(p => p.id === rec.product_id);
          const isProtect = rec.action_type === 'PROTECT_MARGIN';
          const isOverstock = rec.action_type === 'CLEAR_OVERSTOCK';
          
          return (
            <div
              key={rec.product_id}
              className={`rounded-2xl border transition-all hover:shadow-xl ${
                isProtect
                  ? 'bg-slate-900/90 border-rose-900/40 hover:border-rose-600/60'
                  : isOverstock
                  ? 'bg-slate-900/90 border-amber-900/40 hover:border-amber-600/60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-sky-600/60'
              } p-6 flex flex-col justify-between relative overflow-hidden`}
            >
              {/* Card Top: Product Info & Discount Tag */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {product?.image_url && (
                      <img
                        src={product.image_url}
                        alt={rec.product_name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700/80"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {rec.category}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {product?.sku}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                        {rec.product_name}
                      </h3>
                    </div>
                  </div>

                  {/* Recommendation Action Badge */}
                  <div className="text-right">
                    {isProtect ? (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>0% (HOLD PRICE)</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{rec.recommended_discount_pct.toFixed(0)}% DISCOUNT</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-4 gap-2 py-3.5 my-4 border-y border-slate-800/80 bg-slate-950/40 rounded-xl px-3 text-center">
                  <div>
                    <div className="text-[11px] text-slate-400">Stock on Hand</div>
                    <div className="text-sm font-bold text-white mt-0.5">{rec.current_stock} units</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Days of Supply</div>
                    <div className={`text-sm font-bold mt-0.5 ${
                      rec.days_of_supply <= 14 ? 'text-rose-400' : rec.days_of_supply > 45 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {rec.days_of_supply} days
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Gross Margin</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {rec.current_margin_pct.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Post-Promo Margin</div>
                    <div className="text-sm font-bold text-sky-400 mt-0.5">
                      {rec.projected_margin_pct.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* AI Reasoning Section */}
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Rationale</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rec.reasoning}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Strategic Suggestion</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rec.strategic_advice}
                    </p>
                  </div>

                  {rec.risk_warning && (
                    <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{rec.risk_warning}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => onAskCopilotAboutProduct(rec.product_name, rec.reasoning)}
                  className="text-xs font-medium text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask Copilot</span>
                </button>

                <button
                  onClick={() => onSelectForSimulation(rec.product_id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-sky-600 text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Simulate Scenario</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
