import io
import csv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from backend.models import (
    Product,
    ProductUpdate,
    SalesRecord,
    PromotionRecommendation,
    ExecutiveSummary,
    SimulationRequest,
    SimulationResult,
    ChatRequest,
    ChatResponse,
    ApiKeyUpdate
)
from backend.data_store import data_store
from backend.optimizer import generate_recommendations, run_simulation
from backend.gemini_service import query_gemini_api

app = FastAPI(
    title="PromoAlign AI - Retail Promotion & Inventory Alignment Engine",
    version="1.0.0",
    description="Intelligent retail decision-support platform for inventory-aligned promotion planning."
)

# Enable CORS for React frontend (Vite default port 5173 and any local port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PromoAlign AI Backend",
        "has_gemini_key": bool(data_store.gemini_api_key)
    }

# ================= Product & Inventory CRUD =================

@app.get("/api/products", response_model=List[Product])
def get_products():
    return data_store.get_products()

@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    prod = data_store.get_product(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@app.post("/api/products", response_model=Product)
def create_product(product: Product):
    return data_store.add_product(product)

@app.put("/api/products/{product_id}", response_model=Product)
def update_product(product_id: str, updates: ProductUpdate):
    updated = data_store.update_product(product_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@app.delete("/api/products/{product_id}")
def delete_product(product_id: str):
    success = data_store.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# ================= Sales History =================

@app.get("/api/sales-history", response_model=List[SalesRecord])
def get_sales_history(product_id: Optional[str] = None, limit: int = 150):
    return data_store.get_sales(product_id=product_id, limit=limit)

# ================= AI Recommendations & Executive Dashboard =================

@app.get("/api/recommendations")
def get_promotion_recommendations():
    products = data_store.get_products()
    recommendations, summary = generate_recommendations(products)
    return {
        "summary": summary,
        "recommendations": recommendations
    }

# ================= What-If Scenario Simulator =================

@app.post("/api/simulate", response_model=SimulationResult)
def simulate_promotion(request: SimulationRequest):
    prod = data_store.get_product(request.product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found for simulation")
    
    result = run_simulation(
        product=prod,
        discount_pct=request.discount_pct,
        campaign_days=request.campaign_duration_days
    )
    return result

# ================= Gemini AI Copilot Chatbot =================

@app.post("/api/chat", response_model=ChatResponse)
def chat_with_copilot(request: ChatRequest):
    products = data_store.get_products()
    api_key = request.api_key or data_store.gemini_api_key or ""
    
    response = query_gemini_api(
        message=request.message,
        history=request.conversation_history,
        api_key=api_key,
        products=products
    )
    return response

# ================= Data Management, CSV & API Key Configuration =================

@app.post("/api/set-api-key")
def set_api_key(payload: ApiKeyUpdate):
    data_store.set_api_key(payload.api_key)
    return {"message": "API key updated successfully", "has_key": bool(payload.api_key)}

@app.post("/api/reset-data")
def reset_demo_data():
    data_store.reset_to_defaults()
    return {"message": "Store dataset reset to default retail sample successfully"}

@app.post("/api/upload-csv")
async def upload_inventory_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        
        imported_count = 0
        for i, row in enumerate(reader):
            try:
                # Map fields with sensible defaults
                prod_id = row.get("id") or f"custom_csv_{i+1}"
                name = row.get("name") or row.get("product_name") or f"Item {i+1}"
                category = row.get("category") or "General Merchandise"
                sku = row.get("sku") or f"SKU-{i+1:04d}"
                cost_price = float(row.get("cost_price", 10.0))
                selling_price = float(row.get("selling_price", 20.0))
                current_stock = int(float(row.get("current_stock", 50)))
                safety_stock = int(float(row.get("safety_stock", 15)))
                velocity = float(row.get("daily_sales_velocity", 2.0))
                elasticity = float(row.get("price_elasticity", 1.5))
                segment = row.get("target_customer_segment") or "General"
                region = row.get("region") or "Central Hub"
                image_url = row.get("image_url") or None
                
                prod = Product(
                    id=prod_id,
                    name=name,
                    category=category,
                    sku=sku,
                    cost_price=cost_price,
                    selling_price=selling_price,
                    current_stock=current_stock,
                    safety_stock=safety_stock,
                    daily_sales_velocity=velocity,
                    price_elasticity=elasticity,
                    target_customer_segment=segment,
                    region=region,
                    image_url=image_url
                )
                data_store.add_product(prod)
                imported_count += 1
            except Exception as row_err:
                print(f"Error parsing row {i}: {row_err}")
                continue
                
        return {"message": f"Successfully imported {imported_count} products from CSV"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
