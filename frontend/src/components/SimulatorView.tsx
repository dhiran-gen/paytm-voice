import React, { useState, useEffect } from 'react';
import { Product, SimulationResult } from '../types';
import { runSimulation } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import {
  Sliders,
  DollarSign,
  Package,
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';

interface SimulatorViewProps {
  products: Product[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onAskCopilotAboutSimulation: (productName: string, discount: number, verdict: string) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  products,
  selectedProductId,
  onSelectProduct,
  onAskCopilotAboutSimulation
}) => {
  const [discountPct, setDiscountPct] = useState<number>(20);
  const [campaignDays, setCampaignDays] = useState<number>(7);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (selectedProduct) {
      handleSimulate(selectedProduct.id, discountPct, campaignDays);
    }
  }, [selectedProduct?.id, discountPct, campaignDays]);

  const handleSimulate = async (prodId: string, disc: number, days: number) => {
    setLoading(true);
    try {
      const res = await runSimulation(prodId, disc, days);
      setSimulation(res);
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setLoading(false);
    }
  };

  const isCritical = simulation?.stockout_risk === 'CRITICAL';
  const isHighRisk = simulation?.stockout_risk === 'HIGH';
  const isProfitable = (simulation?.profit_delta ?? 0) >= 0;

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>What-If Scenario Simulator</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Interactive Elasticity Model
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Test different discount percentages before launching to simulate projected demand lift, profit impact, and stockout risk.
          </p>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Configuration Controls */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Simulation Parameters</span>
          </div>

          {/* Product Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Select Product to Test</label>
            <select
              value={selectedProduct?.id}
              onChange={(e) => onSelectProduct(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.current_stock} in stock)
                </option>
              ))}
            </select>
          </div>

          {/* Selected Product Snapshot */}
          {selectedProduct && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="text-slate-200 font-medium">{selectedProduct.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current Stock:</span>
                <span className="text-slate-200 font-medium">{selectedProduct.current_stock} units</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Base Velocity:</span>
                <span className="text-slate-200 font-medium">{selectedProduct.daily_sales_velocity} units/day</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Original Price / Cost:</span>
                <span className="text-slate-200 font-medium">${selectedProduct.selling_price.toFixed(2)} / ${selectedProduct.cost_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Price Elasticity:</span>
                <span className="text-sky-400 font-medium">{selectedProduct.price_elasticity.toFixed(1)}x</span>
              </div>
            </div>
          )}

          {/* Discount Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-slate-300">Discount Percentage</label>
              <span className="text-lg font-bold text-sky-400 font-mono">{discountPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Full Price)</span>
              <span>25%</span>
              <span>50% (Clearance)</span>
            </div>
          </div>

          {/* Campaign Duration */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Campaign Duration (Days)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 7, 14].map((d) => (
                <button
                  key={d}
                  onClick={() => setCampaignDays(d)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                    campaignDays === d
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Column 2 & 3: Results, Impact Metrics & Elasticity Curves */}
        <div className="lg:col-span-2 space-y-6">

          {/* AI Verdict Banner */}
          {simulation && (
            <div
              className={`p-5 rounded-2xl border flex items-start gap-4 ${
                isCritical
                  ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                  : isHighRisk
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-950/60 shrink-0">
                {isCritical ? (
                  <AlertOctagon className="w-6 h-6 text-rose-400" />
                ) : isHighRisk ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    {simulation.verdict}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isHighRisk
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {simulation.stockout_risk} STOCKOUT RISK
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {simulation.advice}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => onAskCopilotAboutSimulation(simulation.product_name, discountPct, simulation.verdict)}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Copilot for alternative pricing tactics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projected KPI Matrix */}
          {simulation && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium">Promotional Price</span>
                <div className="text-xl font-bold text-white mt-1 font-mono">
                  ${simulation.discounted_price.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500 line-through">${simulation.original_price.toFixed(2)}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium">Projected Units Sold</span>
                <div className="text-xl font-bold text-sky-400 mt-1 font-mono">
                  {simulation.projected_units_sold.toFixed(0)} <span className="text-xs text-slate-400 font-normal">units</span>
                </div>
                <span className="text-[10px] text-slate-400">vs {simulation.baseline_units_sold.toFixed(0)} baseline</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium">Projected Revenue</span>
                <div className="text-xl font-bold text-white mt-1 font-mono">
                  ${simulation.projected_revenue.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">vs ${simulation.baseline_revenue.toFixed(2)}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 font-medium">Gross Profit Impact</span>
                <div className={`text-xl font-bold mt-1 font-mono ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simulation.profit_delta >= 0 ? '+' : ''}${simulation.profit_delta.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">Net change in margin</span>
              </div>

            </div>
          )}

          {/* Interactive Profit & Demand Curves */}
          {simulation && simulation.curve_data && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Profit & Revenue Curve by Discount %</h3>
                  <p className="text-xs text-slate-400">Projected total gross profit at each discount rate</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-300">Gross Profit ($)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                    <span className="text-slate-300">Revenue ($)</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulation.curve_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="discount_pct" stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(val: any, name: any) => [`$${Number(val).toFixed(2)}`, name === 'projected_profit' ? 'Gross Profit' : 'Revenue']}
                      labelFormatter={(label) => `Discount: ${label}%`}
                    />
                    <Area type="monotone" dataKey="projected_revenue" stroke="#0ea5e9" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="projected_profit" stroke="#10b981" fillOpacity={1} fill="url(#profitGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
