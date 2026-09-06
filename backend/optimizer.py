from typing import List, Dict, Any, Tuple
from backend.models import (
    Product,
    PromotionRecommendation,
    ExecutiveSummary,
    SimulationRequest,
    SimulationResult,
    SimulationPoint
)

def calculate_days_of_supply(product: Product) -> float:
    velocity = max(0.1, product.daily_sales_velocity)
    return round(product.current_stock / velocity, 1)

def calculate_gross_margin_pct(selling_price: float, cost_price: float) -> float:
    if selling_price <= 0:
        return 0.0
    return round(((selling_price - cost_price) / selling_price) * 100, 1)

def generate_recommendations(products: List[Product]) -> Tuple[List[PromotionRecommendation], ExecutiveSummary]:
    recommendations: List[PromotionRecommendation] = []
    
    total_skus = len(products)
    total_units = sum(p.current_stock for p in products)
    total_val = sum(p.current_stock * p.selling_price for p in products)
    overstock_count = 0
    stockout_danger_count = 0
    margin_sum = 0.0
    promo_count = 0
    potential_revenue_unlock = 0.0

    for prod in products:
        dos = calculate_days_of_supply(prod)
        current_margin = calculate_gross_margin_pct(prod.selling_price, prod.cost_price)
        margin_sum += current_margin
        
        # Determine stockout risk & recommendation logic
        # 1. Critical Stockout / Low stock
        if dos <= 14 or prod.current_stock <= prod.safety_stock:
            stockout_danger_count += 1
            risk_level = "CRITICAL" if dos <= 7 else "HIGH"
            rec = PromotionRecommendation(
                product_id=prod.id,
                product_name=prod.name,
                category=prod.category,
                current_stock=prod.current_stock,
                days_of_supply=dos,
                current_margin_pct=current_margin,
                recommended_discount_pct=0.0,
                action_type="PROTECT_MARGIN",
                priority="HIGH",
                projected_units_lift_pct=0.0,
                projected_revenue_lift=0.0,
                projected_margin_pct=current_margin,
                stockout_risk=risk_level,
                confidence_score=94.0,
                reasoning=f"High risk of stockout with only {prod.current_stock} units on hand ({dos} days of supply left vs safety threshold of {prod.safety_stock} units). Organic demand velocity is strong at {prod.daily_sales_velocity} units/day.",
                strategic_advice=f"DO NOT DISCOUNT. Keep at standard retail price (${prod.selling_price:.2f}) to preserve {current_margin:.1f}% gross margin. Trigger immediate inventory reorder from supplier.",
                risk_warning=f"Promoting this item will cause immediate stockout within {int(dos)} days, resulting in lost sales and unfulfilled customer demand."
            )
        
        # 2. Overstock / Deadstock (> 35 days supply)
        elif dos > 35:
            overstock_count += 1
            promo_count += 1
            
            # Decide discount magnitude based on severity of overstock and margin headroom
            if dos >= 60:
                discount_pct = 30.0 if current_margin > 45 else 25.0
                priority = "HIGH"
                action_type = "CLEAR_OVERSTOCK"
            else:
                discount_pct = 20.0 if current_margin > 35 else 15.0
                priority = "HIGH" if dos > 45 else "MEDIUM"
                action_type = "CLEAR_OVERSTOCK"
                
            disc_price = prod.selling_price * (1.0 - discount_pct / 100.0)
            proj_margin = calculate_gross_margin_pct(disc_price, prod.cost_price)
            
            lift_factor = 1.0 + (discount_pct / 100.0) * prod.price_elasticity
            units_lift_pct = round((lift_factor - 1.0) * 100, 1)
            
            # Projected 14-day campaign revenue lift
            base_14_units = prod.daily_sales_velocity * 14
            proj_14_units = min(prod.current_stock, base_14_units * lift_factor)
            proj_rev = round(proj_14_units * disc_price, 2)
            base_rev = round(base_14_units * prod.selling_price, 2)
            rev_lift = round(proj_rev - base_rev, 2)
            
            excess_units = max(0, prod.current_stock - (prod.daily_sales_velocity * 30))
            potential_revenue_unlock += excess_units * disc_price
            
            rec = PromotionRecommendation(
                product_id=prod.id,
                product_name=prod.name,
                category=prod.category,
                current_stock=prod.current_stock,
                days_of_supply=dos,
                current_margin_pct=current_margin,
                recommended_discount_pct=discount_pct,
                action_type=action_type,
                priority=priority,
                projected_units_lift_pct=units_lift_pct,
                projected_revenue_lift=rev_lift,
                projected_margin_pct=proj_margin,
                stockout_risk="LOW",
                confidence_score=91.5,
                reasoning=f"High inventory surplus with {prod.current_stock} units on hand ({dos} days of supply). Price elasticity is {prod.price_elasticity:.1f}, meaning customer demand is highly responsive to price cuts.",
                strategic_advice=f"Apply a {discount_pct:.0f}% promotional discount (special price: ${disc_price:.2f}). Target {prod.target_customer_segment} in {prod.region}. Retains a healthy {proj_margin:.1f}% gross margin while freeing working capital.",
                risk_warning=None
            )
            
        # 3. Balanced Moderate Promotion (15 - 35 days supply)
        else:
            if current_margin >= 45:
                discount_pct = 15.0
                promo_count += 1
                disc_price = prod.selling_price * (1.0 - discount_pct / 100.0)
                proj_margin = calculate_gross_margin_pct(disc_price, prod.cost_price)
                lift_factor = 1.0 + (discount_pct / 100.0) * prod.price_elasticity
                units_lift_pct = round((lift_factor - 1.0) * 100, 1)
                
                base_14_units = prod.daily_sales_velocity * 14
                proj_14_units = min(prod.current_stock, base_14_units * lift_factor)
                rev_lift = round((proj_14_units * disc_price) - (base_14_units * prod.selling_price), 2)
                
                rec = PromotionRecommendation(
                    product_id=prod.id,
                    product_name=prod.name,
                    category=prod.category,
                    current_stock=prod.current_stock,
                    days_of_supply=dos,
                    current_margin_pct=current_margin,
                    recommended_discount_pct=discount_pct,
                    action_type="BALANCED_PROMO",
                    priority="MEDIUM",
                    projected_units_lift_pct=units_lift_pct,
                    projected_revenue_lift=rev_lift,
                    projected_margin_pct=proj_margin,
                    stockout_risk="MEDIUM",
                    confidence_score=86.0,
                    reasoning=f"Inventory is balanced ({dos} days of supply) with strong margin cushion ({current_margin:.1f}%). A targeted {discount_pct:.0f}% discount accelerates volume while preserving profitability.",
                    strategic_advice=f"Run a weekend deal at ${disc_price:.2f} to boost basket size and customer retention for {prod.target_customer_segment}.",
                    risk_warning="Monitor regional stock if campaign extends beyond 14 days."
                )
            else:
                rec = PromotionRecommendation(
                    product_id=prod.id,
                    product_name=prod.name,
                    category=prod.category,
                    current_stock=prod.current_stock,
                    days_of_supply=dos,
                    current_margin_pct=current_margin,
                    recommended_discount_pct=0.0,
                    action_type="PROTECT_MARGIN",
                    priority="LOW",
                    projected_units_lift_pct=0.0,
                    projected_revenue_lift=0.0,
                    projected_margin_pct=current_margin,
                    stockout_risk="LOW",
                    confidence_score=88.0,
                    reasoning=f"Current gross margin ({current_margin:.1f}%) is too slim to absorb significant discounting without eroding bottom-line profitability.",
                    strategic_advice=f"Maintain price at ${prod.selling_price:.2f}. Consider bundling with a higher-margin accessory rather than a direct price markdown.",
                    risk_warning=None
                )
                
        recommendations.append(rec)

    # Sort recommendations by Priority: HIGH first, then CLEAR_OVERSTOCK
    priority_order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}
    recommendations.sort(key=lambda r: (priority_order.get(r.priority, 3), 0 if r.action_type == "CLEAR_OVERSTOCK" else 1))

    summary = ExecutiveSummary(
        total_skus=total_skus,
        total_inventory_units=total_units,
        total_inventory_value=round(total_val, 2),
        overstocked_skus=overstock_count,
        at_risk_stockout_skus=stockout_danger_count,
        avg_gross_margin_pct=round(margin_sum / max(1, total_skus), 1),
        recommended_promo_count=promo_count,
        potential_revenue_unlock=round(potential_revenue_unlock, 2)
    )

    return recommendations, summary

def run_simulation(product: Product, discount_pct: float, campaign_days: int = 7) -> SimulationResult:
    discount_pct = max(0.0, min(60.0, discount_pct))
    disc_price = product.selling_price * (1.0 - discount_pct / 100.0)
    
    # Elasticity demand multiplier
    demand_multiplier = 1.0 + (discount_pct / 100.0) * product.price_elasticity
    projected_daily_velocity = product.daily_sales_velocity * demand_multiplier
    
    # Baseline 
    baseline_units = product.daily_sales_velocity * campaign_days
    baseline_rev = baseline_units * product.selling_price
    baseline_profit = baseline_units * (product.selling_price - product.cost_price)
    
    # Projected
    projected_units = min(float(product.current_stock), projected_daily_velocity * campaign_days)
    projected_rev = projected_units * disc_price
    projected_profit = projected_units * (disc_price - product.cost_price)
    profit_delta = projected_profit - baseline_profit
    
    # Days until stockout under this discount
    days_to_stockout = product.current_stock / max(0.01, projected_daily_velocity)
    
    if days_to_stockout < campaign_days:
        stockout_risk = "CRITICAL"
        verdict = f"Stockout Alert: Will run out of stock in {days_to_stockout:.1f} days!"
        advice = f"At {discount_pct:.0f}% discount, velocity surges to {projected_daily_velocity:.1f} units/day. You will exhaust all {product.current_stock} units before the campaign ends."
    elif days_to_stockout < campaign_days * 1.5:
        stockout_risk = "HIGH"
        verdict = "Tight Stock: High stockout risk near campaign conclusion."
        advice = "Monitor regional replenishment closely. Prepare buffer stock."
    elif profit_delta > 0:
        stockout_risk = "LOW"
        verdict = f"Highly Favorable: Generates +${profit_delta:.2f} extra gross profit."
        advice = f"Strong demand elasticity ({product.price_elasticity}) compensates for the lower unit margin."
    elif profit_delta < 0 and discount_pct > 0:
        stockout_risk = "LOW"
        verdict = f"Margin Compression: Reduces net profit by -${abs(profit_delta):.2f}."
        advice = "Use only if the goal is rapid inventory clearance / working capital recovery."
    else:
        stockout_risk = "LOW"
        verdict = "Baseline: Standard price performance."
        advice = "Steady sales at normal margin."
        
    # Generate points across 0% to 50% discount for chart curve
    curve_data: List[SimulationPoint] = []
    for d in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]:
        d_price = product.selling_price * (1.0 - d / 100.0)
        d_mult = 1.0 + (d / 100.0) * product.price_elasticity
        d_vel = product.daily_sales_velocity * d_mult
        d_units = min(float(product.current_stock), d_vel * campaign_days)
        d_rev = round(d_units * d_price, 2)
        d_profit = round(d_units * (d_price - product.cost_price), 2)
        d_dos = round(product.current_stock / max(0.01, d_vel), 1)
        
        d_risk = "CRITICAL" if d_dos < campaign_days else ("HIGH" if d_dos < campaign_days * 1.5 else "LOW")
        
        curve_data.append(SimulationPoint(
            discount_pct=float(d),
            projected_units=round(d_units, 1),
            projected_revenue=d_rev,
            projected_profit=d_profit,
            stockout_risk=d_risk,
            days_until_stockout=d_dos
        ))
        
    return SimulationResult(
        product_id=product.id,
        product_name=product.name,
        discount_pct=discount_pct,
        original_price=round(product.selling_price, 2),
        discounted_price=round(disc_price, 2),
        baseline_units_sold=round(baseline_units, 1),
        projected_units_sold=round(projected_units, 1),
        baseline_revenue=round(baseline_rev, 2),
        projected_revenue=round(projected_rev, 2),
        baseline_profit=round(baseline_profit, 2),
        projected_profit=round(projected_profit, 2),
        profit_delta=round(profit_delta, 2),
        stockout_risk=stockout_risk,
        days_until_stockout=round(days_to_stockout, 1),
        verdict=verdict,
        advice=advice,
        curve_data=curve_data
    )
