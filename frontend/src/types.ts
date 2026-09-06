export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  cost_price: number;
  selling_price: number;
  current_stock: number;
  safety_stock: number;
  daily_sales_velocity: number;
  price_elasticity: number;
  target_customer_segment: string;
  region: string;
  image_url?: string | null;
}

export interface ProductUpdate {
  name?: string;
  category?: string;
  sku?: string;
  cost_price?: number;
  selling_price?: number;
  current_stock?: number;
  safety_stock?: number;
  daily_sales_velocity?: number;
  price_elasticity?: number;
  target_customer_segment?: string;
  region?: string;
}

export interface SalesRecord {
  id: string;
  product_id: string;
  product_name: string;
  date: string;
  units_sold: number;
  discount_pct: number;
  revenue: number;
  margin: number;
  customer_segment: string;
}

export interface PromotionRecommendation {
  product_id: string;
  product_name: string;
  category: string;
  current_stock: number;
  days_of_supply: number;
  current_margin_pct: number;
  recommended_discount_pct: number;
  action_type: 'CLEAR_OVERSTOCK' | 'PROTECT_MARGIN' | 'BALANCED_PROMO' | 'FLASH_BUNDLE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  projected_units_lift_pct: number;
  projected_revenue_lift: number;
  projected_margin_pct: number;
  stockout_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence_score: number;
  reasoning: string;
  strategic_advice: string;
  risk_warning?: string | null;
}

export interface ExecutiveSummary {
  total_skus: number;
  total_inventory_units: number;
  total_inventory_value: number;
  overstocked_skus: number;
  at_risk_stockout_skus: number;
  avg_gross_margin_pct: number;
  recommended_promo_count: number;
  potential_revenue_unlock: number;
}

export interface RecommendationsResponse {
  summary: ExecutiveSummary;
  recommendations: PromotionRecommendation[];
}

export interface SimulationPoint {
  discount_pct: number;
  projected_units: number;
  projected_revenue: number;
  projected_profit: number;
  stockout_risk: 'LOW' | 'HIGH' | 'CRITICAL';
  days_until_stockout: number;
}

export interface SimulationResult {
  product_id: string;
  product_name: string;
  discount_pct: number;
  original_price: number;
  discounted_price: number;
  baseline_units_sold: number;
  projected_units_sold: number;
  baseline_revenue: number;
  projected_revenue: number;
  baseline_profit: number;
  projected_profit: number;
  profit_delta: number;
  stockout_risk: 'LOW' | 'HIGH' | 'CRITICAL';
  days_until_stockout: number;
  verdict: string;
  advice: string;
  curve_data: SimulationPoint[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggested_actions: string[];
  referenced_products: Array<{ id: string; name: string; stock: number }>;
}
