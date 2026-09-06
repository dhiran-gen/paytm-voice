import json
import os
import requests
from typing import List, Dict, Any, Optional
from backend.models import ChatMessage, ChatResponse, Product
from backend.data_store import data_store
from backend.optimizer import generate_recommendations, calculate_days_of_supply

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
GEMINI_FALLBACK_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def build_retail_context_prompt(products: List[Product]) -> str:
    recommendations, summary = generate_recommendations(products)
    
    overstocked = [p for p in products if calculate_days_of_supply(p) > 35]
    stockout_risk = [p for p in products if calculate_days_of_supply(p) <= 14]
    
    context = f"""
### LIVE STORE CONTEXT & INVENTORY SNAPSHOT:
- Total Store SKUs: {summary.total_skus}
- Total Inventory Units on Hand: {summary.total_inventory_units}
- Total Inventory Asset Value: ${summary.total_inventory_value:,.2f}
- Average Store Gross Margin: {summary.avg_gross_margin_pct:.1f}%
- Overstocked SKUs (>35 Days of Supply): {summary.overstocked_skus} items (${summary.potential_revenue_unlock:,.2f} tied capital)
- Critical / Stockout Risk SKUs (<=14 Days of Supply): {summary.at_risk_stockout_skus} items

### KEY HIGH-RISK / STOCKOUT DANGER PRODUCTS (DO NOT DISCOUNT):
"""
    for p in stockout_risk[:5]:
        dos = calculate_days_of_supply(p)
        margin = round(((p.selling_price - p.cost_price)/p.selling_price)*100, 1)
        context += f"- **{p.name}** ({p.category}): Stock={p.current_stock}, Velocity={p.daily_sales_velocity}/day, DoS={dos} days, Margin={margin}%, Hub={p.region}. ADVICE: Hold price at ${p.selling_price:.2f}, reorder immediately.\n"
        
    context += "\n### TOP OVERSTOCKED PRODUCTS (RECOMMENDED FOR DISCOUNT / CLEARANCE):\n"
    for p in overstocked[:5]:
        dos = calculate_days_of_supply(p)
        margin = round(((p.selling_price - p.cost_price)/p.selling_price)*100, 1)
        rec = next((r for r in recommendations if r.product_id == p.id), None)
        discount = rec.recommended_discount_pct if rec else 20.0
        disc_price = round(p.selling_price * (1.0 - discount/100.0), 2)
        context += f"- **{p.name}** ({p.category}): Stock={p.current_stock}, Velocity={p.daily_sales_velocity}/day, DoS={dos} days, Margin={margin}%. SUGGESTED DISCOUNT: {discount:.0f}% (${disc_price:.2f}). Reason: Free up capital with healthy post-discount margin.\n"

    context += "\n### ALL STORE PRODUCTS CURRENTLY IN CATALOG:\n"
    for p in products:
        dos = calculate_days_of_supply(p)
        context += f"- {p.name} | Category: {p.category} | Stock: {p.current_stock} | Price: ${p.selling_price:.2f} | Cost: ${p.cost_price:.2f} | DoS: {dos}d | Hub: {p.region}\n"

    return context

def generate_heuristic_copilot_response(message: str, products: List[Product]) -> ChatResponse:
    recommendations, summary = generate_recommendations(products)
    msg_lower = message.lower()
    
    referenced_products = []
    
    if "stockout" in msg_lower or "danger" in msg_lower or "low stock" in msg_lower or "risk" in msg_lower:
        at_risk = [p for p in products if calculate_days_of_supply(p) <= 14]
        items_text = "\n".join([
            f"• **{p.name}** ({p.category}): Only **{p.current_stock} units** remaining ({calculate_days_of_supply(p)} days of supply). Daily velocity is {p.daily_sales_velocity} units/day. **Action:** Hold standard retail price (${p.selling_price:.2f}) to protect margin ({round(((p.selling_price - p.cost_price)/p.selling_price)*100, 1)}%) and trigger an immediate supplier reorder."
            for p in at_risk
        ])
        
        reply = f"""### ⚠️ Critical Stockout Risk Assessment

Based on real-time inventory velocity and safety stock thresholds, the following items are in **danger of imminent stockout**:

{items_text if items_text else "All products currently maintain healthy inventory levels above safety thresholds."}

#### Strategic Rule:
Never run promotional discounts on these products. High organic demand is already consuming stock, so discounts would merely cannibalize profit margin without driving incremental sustainable volume.
"""
        referenced_products = [{"id": p.id, "name": p.name, "stock": p.current_stock} for p in at_risk]
        actions = ["View Low Stock Alerts", "Adjust Safety Stock Thresholds", "Simulate Price Protection"]

    elif "clear" in msg_lower or "overstock" in msg_lower or "deadstock" in msg_lower or "discount" in msg_lower:
        overstocked = [p for p in products if calculate_days_of_supply(p) > 35]
        items_text = "\n".join([
            f"• **{p.name}** ({p.category}): **{p.current_stock} units** in stock ({calculate_days_of_supply(p)} days of supply). **Recommended Discount:** **{next((r.recommended_discount_pct for r in recommendations if r.product_id == p.id), 25):.0f}%** (Sale price: ${(p.selling_price * (1 - next((r.recommended_discount_pct for r in recommendations if r.product_id == p.id), 25)/100)):.2f}). Target: {p.target_customer_segment}."
            for p in overstocked[:4]
        ])
        
        reply = f"""### 🎯 Recommended Inventory Clearance Strategy

We identified **{len(overstocked)} overstocked items** holding approximately **${summary.potential_revenue_unlock:,.2f}** in tied-up working capital:

{items_text}

#### Why These Specific Discounts?
1. **Demand Elasticity**: These categories show strong customer price responsiveness ($>1.8\times$), so a 20%-30% discount will unlock rapid unit sales.
2. **Gross Margin Buffer**: Even after applying the discount, gross margin remains above 35%-50%, ensuring commercial profitability.
"""
        referenced_products = [{"id": p.id, "name": p.name, "stock": p.current_stock} for p in overstocked[:4]]
        actions = ["Apply 25% Clearance", "Run What-If Simulation", "View Margin Impact"]

    elif "weekend" in msg_lower or "campaign" in msg_lower or "flash" in msg_lower or "plan" in msg_lower:
        reply = f"""### 🚀 Recommended Weekend Promotion Campaign Plan

Here is a 3-pillar balanced campaign structure designed to maximize revenue while protecting inventory:

1. **The Hero Deal (Clearance Anchor)**:
   - **Target Item**: Classic Slim-Fit Denim Jeans or Smart Home Voice Assistant.
   - **Offer**: 25% OFF or Flash Sale.
   - **Objective**: Rapidly turn excess stock into liquid cash flow.

2. **The Margin Driver (Cross-Sell / Bundle)**:
   - **Target Item**: Radiance Vitamin C Serum (75% Gross Margin).
   - **Offer**: 15% OFF when purchased with any beauty accessory.
   - **Objective**: Increase average order value (AOV) with high-margin items.

3. **Price Protected (Zero Discount)**:
   - **Items**: Running Shoes & Wireless ANC Headphones.
   - **Rule**: Keep at 100% full price to prevent stockout disruptions.
"""
        actions = ["Simulate Weekend Plan", "Review Campaign Margins", "Export Recommendations"]
    else:
        reply = f"""### 🤖 AI Retail Strategist Overview

Hello! I have analyzed your store's active inventory of **{summary.total_skus} SKUs** worth **${summary.total_inventory_value:,.2f}**:

- **{summary.overstocked_skus} Overstocked SKUs**: Identified opportunities to unlock up to **${summary.potential_revenue_unlock:,.2f}** with targeted promotions.
- **{summary.at_risk_stockout_skus} High-Risk SKUs**: Protected from wasteful discounting to prevent customer stockout dissatisfaction.
- **Average Store Margin**: Currently averaging **{summary.avg_gross_margin_pct:.1f}%**.

How would you like to proceed? You can ask me:
- *"Which products should I discount this weekend?"*
- *"Why shouldn't I discount wireless headphones?"*
- *"Show me clearance candidates in the North Hub."*
"""
        actions = ["Show Best Discounts", "Audit Stockout Risks", "Simulate Custom Discount"]

    return ChatResponse(
        reply=reply,
        suggested_actions=actions,
        referenced_products=referenced_products
    )

def query_gemini_api(message: str, history: List[ChatMessage], api_key: str, products: List[Product]) -> ChatResponse:
    if not api_key or len(api_key.strip()) < 10:
        return generate_heuristic_copilot_response(message, products)

    store_context = build_retail_context_prompt(products)
    
    system_instruction = f"""You are PromoAlign AI, an expert Senior Retail Merchandising & Inventory Alignment Strategist.
Your mission is to help retailers maximize gross profits, clear excess inventory, and prevent stockout catastrophes through smart, data-driven promotion planning.

ALWAYS adhere to these core retail decision principles:
1. NEVER recommend discounts on items with low inventory or days of supply <= 14 days. Emphasize price protection and immediate reordering.
2. For overstocked items (>35 days of supply), recommend specific percentage discounts (15% to 35%) based on elasticity and post-discount margin retention.
3. Provide crisp, structured, executive-level explanations with numbers (e.g. Current Stock, Days of Supply, Margin %, Sales Velocity).
4. Suggest creative tactical ideas (e.g. Bundles, Flash Sales, Region-specific targeting, VIP cohort segmentation).

{store_context}
"""

    contents = []
    for h in history[-6:]: # last 6 messages
        role = "user" if h.role == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": h.content}]
        })
        
    contents.append({
        "role": "user",
        "parts": [{"text": message}]
    })

    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024
        }
    }

    urls_to_try = [
        f"{GEMINI_API_URL}?key={api_key}",
        f"{GEMINI_FALLBACK_URL}?key={api_key}"
    ]

    for url in urls_to_try:
        try:
            resp = requests.post(url, json=payload, timeout=12)
            if resp.status_code == 200:
                data = resp.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return ChatResponse(
                    reply=reply_text,
                    suggested_actions=["Simulate in What-If Sandbox", "View Overstock Items", "Check Margin Protection"],
                    referenced_products=[]
                )
            else:
                print(f"Gemini API returned status {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"Gemini API request error: {e}")

    # If API call fails or quota exceeded, fallback gracefully to heuristic engine
    return generate_heuristic_copilot_response(message, products)
