import React, { useState } from 'react';
import { Product, ProductUpdate, SalesRecord } from '../types';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadInventoryCsv,
  resetDemoData
} from '../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  RotateCcw,
  Search,
  Check,
  X,
  Package,
  Layers,
  DollarSign,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface StoreDataViewProps {
  products: Product[];
  salesHistory: SalesRecord[];
  onRefreshData: () => void;
}

export const StoreDataView: React.FC<StoreDataViewProps> = ({
  products,
  salesHistory,
  onRefreshData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'sales'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Electronics',
    sku: '',
    cost_price: 20.0,
    selling_price: 49.99,
    current_stock: 100,
    safety_stock: 20,
    daily_sales_velocity: 2.5,
    price_elasticity: 1.8,
    target_customer_segment: 'Mainstream',
    region: 'Central Hub'
  });

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateProduct(id, {
        cost_price: Number(editForm.cost_price),
        selling_price: Number(editForm.selling_price),
        current_stock: Number(editForm.current_stock),
        safety_stock: Number(editForm.safety_stock),
        daily_sales_velocity: Number(editForm.daily_sales_velocity),
        price_elasticity: Number(editForm.price_elasticity),
        region: editForm.region,
        target_customer_segment: editForm.target_customer_segment
      });
      setEditingId(null);
      onRefreshData();
    } catch (err: any) {
      alert(`Error updating product: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        onRefreshData();
      } catch (err: any) {
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) {
      alert('Please fill in product name and SKU');
      return;
    }

    try {
      const prod: Product = {
        id: `prod_${Date.now()}`,
        name: newProduct.name!,
        category: newProduct.category || 'General',
        sku: newProduct.sku!,
        cost_price: Number(newProduct.cost_price || 10),
        selling_price: Number(newProduct.selling_price || 20),
        current_stock: Number(newProduct.current_stock || 50),
        safety_stock: Number(newProduct.safety_stock || 15),
        daily_sales_velocity: Number(newProduct.daily_sales_velocity || 2.0),
        price_elasticity: Number(newProduct.price_elasticity || 1.5),
        target_customer_segment: newProduct.target_customer_segment || 'Mainstream',
        region: newProduct.region || 'Central Hub',
        image_url: newProduct.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'
      };

      await createProduct(prod);
      setShowAddModal(false);
      onRefreshData();
    } catch (err: any) {
      alert(`Failed to add product: ${err.message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus('Uploading and parsing CSV...');
      const res = await uploadInventoryCsv(file);
      setUploadStatus(res.message);
      onRefreshData();
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err.message}`);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all products and sales records to the default retail demo dataset?')) {
      try {
        await resetDemoData();
        onRefreshData();
      } catch (err: any) {
        alert(`Reset failed: ${err.message}`);
      }
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `retail_catalog_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Store Data & Inventory Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain your product catalog, real-time warehouse stock levels, pricing, cost margins, and review sales logs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 shadow-sm">
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Catalog</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center gap-1.5 shadow-lg shadow-sky-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/60 text-sky-300 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Sub Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'inventory'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sales')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeSubTab === 'sales'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Sales & Discount History ({salesHistory.length} records)</span>
        </button>
      </div>

      {/* ================= INVENTORY TAB ================= */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Product & SKU</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5 text-right">Cost Price</th>
                    <th className="px-4 py-3.5 text-right">Selling Price</th>
                    <th className="px-4 py-3.5 text-right">Margin %</th>
                    <th className="px-4 py-3.5 text-right">Stock</th>
                    <th className="px-4 py-3.5 text-right">Velocity</th>
                    <th className="px-4 py-3.5">Hub / Region</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p) => {
                    const isEditing = editingId === p.id;
                    const margin = p.selling_price > 0 
                      ? (((p.selling_price - p.cost_price) / p.selling_price) * 100).toFixed(1)
                      : '0.0';

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Product Info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.image_url && (
                              <img src={p.image_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                            )}
                            <div>
                              <div className="font-bold text-white text-xs sm:text-sm">{p.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{p.sku}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                            {p.category}
                          </span>
                        </td>

                        {/* Cost Price */}
                        <td className="px-4 py-3 text-right font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editForm.cost_price}
                              onChange={(e) => setEditForm({ ...editForm, cost_price: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-slate-950 border border-sky-500 rounded px-1.5 py-1 text-right text-xs text-white"
                            />
                          ) : (
                            `$${p.cost_price.toFixed(2)}`
                          )}
                        </td>

                        {/* Selling Price */}
                        <td className="px-4 py-3 text-right font-mono font-bold text-white">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editForm.selling_price}
                              onChange={(e) => setEditForm({ ...editForm, selling_price: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-slate-950 border border-sky-500 rounded px-1.5 py-1 text-right text-xs text-white"
                            />
                          ) : (
                            `$${p.selling_price.toFixed(2)}`
                          )}
                        </td>

                        {/* Margin % */}
                        <td className="px-4 py-3 text-right font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            Number(margin) >= 40 ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'
                          }`}>
                            {margin}%
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3 text-right font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm.current_stock}
                              onChange={(e) => setEditForm({ ...editForm, current_stock: parseInt(e.target.value) || 0 })}
                              className="w-16 bg-slate-950 border border-sky-500 rounded px-1.5 py-1 text-right text-xs text-white"
                            />
                          ) : (
                            <span className={`font-bold ${p.current_stock <= p.safety_stock ? 'text-rose-400' : 'text-white'}`}>
                              {p.current_stock}
                            </span>
                          )}
                        </td>

                        {/* Velocity */}
                        <td className="px-4 py-3 text-right font-mono text-slate-300">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={editForm.daily_sales_velocity}
                              onChange={(e) => setEditForm({ ...editForm, daily_sales_velocity: parseFloat(e.target.value) || 0 })}
                              className="w-16 bg-slate-950 border border-sky-500 rounded px-1.5 py-1 text-right text-xs text-white"
                            />
                          ) : (
                            `${p.daily_sales_velocity}/d`
                          )}
                        </td>

                        {/* Hub */}
                        <td className="px-4 py-3 text-slate-400">
                          {p.region}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => handleSaveEdit(p.id)}
                                className="p-1 text-emerald-400 hover:bg-emerald-950/60 rounded"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= SALES HISTORY TAB ================= */}
      {activeSubTab === 'sales' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5 text-right">Units Sold</th>
                    <th className="px-4 py-3.5 text-right">Discount Given</th>
                    <th className="px-4 py-3.5 text-right">Revenue</th>
                    <th className="px-4 py-3.5 text-right">Net Margin</th>
                    <th className="px-4 py-3.5">Customer Segment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {salesHistory.slice(-50).reverse().map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400">{s.date}</td>
                      <td className="px-4 py-3 font-medium text-white">{s.product_name}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sky-400">{s.units_sold}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {s.discount_pct > 0 ? (
                          <span className="text-amber-400 font-semibold">{s.discount_pct}%</span>
                        ) : (
                          <span className="text-slate-500">0%</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-white">${s.revenue.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-400">${s.margin.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          {s.customer_segment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PRODUCT MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-sky-400" />
                <span>Add Product to Store Catalog</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="General Merchandise">General Merchandise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">SKU / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ELEC-MOU-01"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.cost_price}
                    onChange={(e) => setNewProduct({ ...newProduct, cost_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.selling_price}
                    onChange={(e) => setNewProduct({ ...newProduct, selling_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Current Stock (Units)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.current_stock}
                    onChange={(e) => setNewProduct({ ...newProduct, current_stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Safety Stock Threshold</label>
                  <input
                    type="number"
                    required
                    value={newProduct.safety_stock}
                    onChange={(e) => setNewProduct({ ...newProduct, safety_stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Daily Sales Velocity</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProduct.daily_sales_velocity}
                    onChange={(e) => setNewProduct({ ...newProduct, daily_sales_velocity: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Region / Distribution Hub</label>
                  <select
                    value={newProduct.region}
                    onChange={(e) => setNewProduct({ ...newProduct, region: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Central Hub">Central Hub</option>
                    <option value="North Hub">North Hub</option>
                    <option value="South Hub">South Hub</option>
                    <option value="East Hub">East Hub</option>
                    <option value="West Hub">West Hub</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
