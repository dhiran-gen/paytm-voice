from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Product(BaseModel):
    id: str
    name: str
    category: str
    sku: str
    cost_price: float
    selling_price: float
    current_stock: int
    safety_stock: int
    daily_sales_velocity: float
    price_elasticity: float = 1.5
    target_customer_segment: str = "Mainstream"
    region: str = "Central Hub"
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    current_stock: Optional[int] = None
    safety_stock: Optional[int] = None
    daily_sales_velocity: Optional[float] = None
    price_elasticity: Optional[float] = None
    target_customer_segment: Optional[str] = None
    region: Optional[str] = None

class SalesRecord(BaseModel):
    id: str
    product_id: str
    product_name: str
    date: str
    units_sold: int
    discount_pct: float
    revenue: float
    margin: float
    customer_segment: str

class PromotionRecommendation(BaseModel):
    product_id: str
    product_name: str
    category: str
    current_stock: int
    days_of_supply: float
    current_margin_pct: float
    recommended_discount_pct: float
    action_type: str  # CLEAR_OVERSTOCK | PROTECT_MARGIN | BALANCED_PROMO | FLASH_BUNDLE
    priority: str     # HIGH | MEDIUM | LOW
    projected_units_lift_pct: float
    projected_revenue_lift: float
    projected_margin_pct: float
    stockout_risk: str # LOW | MEDIUM | HIGH | CRITICAL
    confidence_score: float
    reasoning: str
    strategic_advice: str
    risk_warning: Optional[str] = None

class ExecutiveSummary(BaseModel):
    total_skus: int
    total_inventory_units: int
    total_inventory_value: float
    overstocked_skus: int
    at_risk_stockout_skus: int
    avg_gross_margin_pct: float
    recommended_promo_count: int
    potential_revenue_unlock: float

class SimulationPoint(BaseModel):
    discount_pct: float
    projected_units: float
    projected_revenue: float
    projected_profit: float
    stockout_risk: str
    days_until_stockout: float

class SimulationRequest(BaseModel):
    product_id: str
    discount_pct: float
    campaign_duration_days: int = 7

class SimulationResult(BaseModel):
    product_id: str
    product_name: str
    discount_pct: float
    original_price: float
    discounted_price: float
    baseline_units_sold: float
    projected_units_sold: float
    baseline_revenue: float
    projected_revenue: float
    baseline_profit: float
    projected_profit: float
    profit_delta: float
    stockout_risk: str
    days_until_stockout: float
    verdict: str
    advice: str
    curve_data: List[SimulationPoint]

class ChatMessage(BaseModel):
    role: str # "user" | "assistant" | "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []
    api_key: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    referenced_products: List[Dict[str, Any]] = []

class ApiKeyUpdate(BaseModel):
    api_key: str
