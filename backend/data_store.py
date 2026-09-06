import json
import os
import random
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from backend.models import Product, ProductUpdate, SalesRecord

DATA_FILE = os.path.join(os.path.dirname(__file__), "store_data.json")

DEFAULT_PRODUCTS: List[Dict[str, Any]] = [
    # Electronics
    {
        "id": "prod_1",
        "name": "UltraHD 4K Smart TV 55\"",
        "category": "Electronics",
        "sku": "ELEC-TV-4K55",
        "cost_price": 320.0,
        "selling_price": 499.99,
        "current_stock": 42,
        "safety_stock": 20,
        "daily_sales_velocity": 1.8,
        "price_elasticity": 1.6,
        "target_customer_segment": "Family / Mainstream",
        "region": "North Hub",
        "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80"
    },
    {
        "id": "prod_2",
        "name": "Wireless ANC Headphones Pro",
        "category": "Electronics",
        "sku": "ELEC-HP-ANC9",
        "cost_price": 85.0,
        "selling_price": 199.99,
        "current_stock": 12,
        "safety_stock": 25,
        "daily_sales_velocity": 4.2,
        "price_elasticity": 1.3,
        "target_customer_segment": "Audiophiles / Commuters",
        "region": "Central Hub",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
    },
    {
        "id": "prod_3",
        "name": "Smart Home Voice Assistant Speaker",
        "category": "Electronics",
        "sku": "ELEC-SPK-SMT3",
        "cost_price": 28.0,
        "selling_price": 69.99,
        "current_stock": 195,
        "safety_stock": 30,
        "daily_sales_velocity": 2.5,
        "price_elasticity": 2.2,
        "target_customer_segment": "Tech Enthusiasts & Deal Seekers",
        "region": "East Hub",
        "image_url": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&q=80"
    },
    {
        "id": "prod_4",
        "name": "RGB Mechanical Gaming Keyboard",
        "category": "Electronics",
        "sku": "ELEC-KB-RGB7",
        "cost_price": 45.0,
        "selling_price": 109.99,
        "current_stock": 65,
        "safety_stock": 20,
        "daily_sales_velocity": 2.1,
        "price_elasticity": 1.8,
        "target_customer_segment": "Gamers / Tech",
        "region": "West Hub",
        "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80"
    },
    {
        "id": "prod_5",
        "name": "Fast-Charging Power Bank 20,000mAh",
        "category": "Electronics",
        "sku": "ELEC-PB-20K",
        "cost_price": 14.0,
        "selling_price": 39.99,
        "current_stock": 140,
        "safety_stock": 35,
        "daily_sales_velocity": 3.4,
        "price_elasticity": 2.0,
        "target_customer_segment": "Budget Travelers",
        "region": "South Hub",
        "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80"
    },

    # Fashion & Apparel
    {
        "id": "prod_6",
        "name": "Classic Slim-Fit Denim Jeans",
        "category": "Fashion & Apparel",
        "sku": "APP-JNS-SLM01",
        "cost_price": 22.0,
        "selling_price": 69.99,
        "current_stock": 240,
        "safety_stock": 40,
        "daily_sales_velocity": 3.8,
        "price_elasticity": 2.4,
        "target_customer_segment": "Bargain Hunters / Young Adults",
        "region": "North Hub",
        "image_url": "https://images.unsplash.com/photo-1542272604-780c96856592?w=400&q=80"
    },
    {
        "id": "prod_7",
        "name": "Premium Wool Blend Winter Coat",
        "category": "Fashion & Apparel",
        "sku": "APP-COT-WOL99",
        "cost_price": 95.0,
        "selling_price": 249.99,
        "current_stock": 110,
        "safety_stock": 15,
        "daily_sales_velocity": 1.2,
        "price_elasticity": 2.5,
        "target_customer_segment": "Style Conscious / Clearance Seekers",
        "region": "Central Hub",
        "image_url": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80"
    },
    {
        "id": "prod_8",
        "name": "Performance Marathon Running Shoes",
        "category": "Fashion & Apparel",
        "sku": "APP-SHO-RUN02",
        "cost_price": 55.0,
        "selling_price": 149.99,
        "current_stock": 14,
        "safety_stock": 30,
        "daily_sales_velocity": 4.8,
        "price_elasticity": 1.1,
        "target_customer_segment": "Athletes / Brand Loyalists",
        "region": "West Hub",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
    },
    {
        "id": "prod_9",
        "name": "Organic Breathable Cotton Tees (3-Pack)",
        "category": "Fashion & Apparel",
        "sku": "APP-TEE-ORG3P",
        "cost_price": 12.0,
        "selling_price": 34.99,
        "current_stock": 88,
        "safety_stock": 30,
        "daily_sales_velocity": 2.9,
        "price_elasticity": 1.7,
        "target_customer_segment": "Eco-Conscious / Everyday",
        "region": "South Hub",
        "image_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80"
    },

    # Home & Kitchen
    {
        "id": "prod_10",
        "name": "Digital Air Fryer Max XL 5.8Qt",
        "category": "Home & Kitchen",
        "sku": "HOME-AF-58XL",
        "cost_price": 48.0,
        "selling_price": 119.99,
        "current_stock": 135,
        "safety_stock": 25,
        "daily_sales_velocity": 3.2,
        "price_elasticity": 2.1,
        "target_customer_segment": "Home Cooks / Families",
        "region": "East Hub",
        "image_url": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&q=80"
    },
    {
        "id": "prod_11",
        "name": "Smart LiDAR Robot Vacuum Cleaner",
        "category": "Home & Kitchen",
        "sku": "HOME-VAC-LID01",
        "cost_price": 160.0,
        "selling_price": 349.99,
        "current_stock": 82,
        "safety_stock": 15,
        "daily_sales_velocity": 1.4,
        "price_elasticity": 2.3,
        "target_customer_segment": "Busy Professionals",
        "region": "Central Hub",
        "image_url": "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&q=80"
    },
    {
        "id": "prod_12",
        "name": "Japanese Damascus Chef's Knife 8-inch",
        "category": "Home & Kitchen",
        "sku": "HOME-KNF-DAM08",
        "cost_price": 35.0,
        "selling_price": 89.99,
        "current_stock": 9,
        "safety_stock": 20,
        "daily_sales_velocity": 2.6,
        "price_elasticity": 1.2,
        "target_customer_segment": "Culinary Hobbyists / Premium",
        "region": "West Hub",
        "image_url": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80"
    },

    # Health & Beauty
    {
        "id": "prod_13",
        "name": "Sonic Rechargeable Electric Toothbrush",
        "category": "Health & Beauty",
        "sku": "BEAU-TB-SONIC",
        "cost_price": 18.0,
        "selling_price": 49.99,
        "current_stock": 175,
        "safety_stock": 25,
        "daily_sales_velocity": 2.7,
        "price_elasticity": 2.2,
        "target_customer_segment": "Wellness / Daily Routine",
        "region": "North Hub",
        "image_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80"
    },
    {
        "id": "prod_14",
        "name": "Radiance 20% Vitamin C + HA Serum",
        "category": "Health & Beauty",
        "sku": "BEAU-SRM-VITC",
        "cost_price": 7.5,
        "selling_price": 29.99,
        "current_stock": 55,
        "safety_stock": 25,
        "daily_sales_velocity": 3.9,
        "price_elasticity": 1.4,
        "target_customer_segment": "Skincare Enthusiasts / Loyalists",
        "region": "South Hub",
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80"
    },
    {
        "id": "prod_15",
        "name": "Broad-Spectrum Mineral Sunscreen SPF 50",
        "category": "Health & Beauty",
        "sku": "BEAU-SUN-SPF50",
        "cost_price": 6.0,
        "selling_price": 24.99,
        "current_stock": 210,
        "safety_stock": 30,
        "daily_sales_velocity": 2.2,
        "price_elasticity": 2.5,
        "target_customer_segment": "Summer Shoppers / Deal Seekers",
        "region": "East Hub",
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80"
    }
]

def generate_default_sales_history(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    records = []
    base_date = datetime.now() - timedelta(days=45)
    
    segments = ["Bargain Hunters", "Loyal VIPs", "Mainstream Shoppers", "Lapsed Customers"]
    record_id = 1
    
    for day in range(45):
        current_date = (base_date + timedelta(days=day)).strftime("%Y-%m-%d")
        # Is weekend?
        is_weekend = (base_date + timedelta(days=day)).weekday() >= 5
        
        for p in products:
            # Base velocity variation
            daily_var = random.uniform(0.6, 1.4)
            if is_weekend:
                daily_var *= 1.3
            
            # occasional historical discount campaign
            has_discount = random.random() < 0.15
            discount_pct = random.choice([10.0, 15.0, 20.0, 25.0]) if has_discount else 0.0
            
            lift_factor = 1.0 + (discount_pct / 100.0) * p.get("price_elasticity", 1.5)
            units = max(1, int(round(p["daily_sales_velocity"] * daily_var * lift_factor)))
            
            unit_price = p["selling_price"] * (1.0 - discount_pct / 100.0)
            rev = round(units * unit_price, 2)
            margin = round(rev - (units * p["cost_price"]), 2)
            
            records.append({
                "id": f"sale_{record_id}",
                "product_id": p["id"],
                "product_name": p["name"],
                "date": current_date,
                "units_sold": units,
                "discount_pct": discount_pct,
                "revenue": rev,
                "margin": margin,
                "customer_segment": random.choice(segments)
            })
            record_id += 1
            
    return records

class StoreDataStore:
    def __init__(self):
        self.products: List[Product] = []
        self.sales_history: List[SalesRecord] = []
        self.gemini_api_key: Optional[str] = os.getenv("GEMINI_API_KEY", "")
        self.load_data()

    def load_data(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.products = [Product(**p) for p in data.get("products", [])]
                    self.sales_history = [SalesRecord(**s) for s in data.get("sales_history", [])]
                    if "gemini_api_key" in data and data["gemini_api_key"]:
                        self.gemini_api_key = data["gemini_api_key"]
                    return
            except Exception as e:
                print(f"Error loading {DATA_FILE}: {e}. Initializing default data.")
        
        self.reset_to_defaults()

    def save_data(self):
        try:
            data = {
                "products": [p.model_dump() for p in self.products],
                "sales_history": [s.model_dump() for s in self.sales_history],
                "gemini_api_key": self.gemini_api_key
            }
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving to {DATA_FILE}: {e}")

    def reset_to_defaults(self):
        self.products = [Product(**p) for p in DEFAULT_PRODUCTS]
        self.sales_history = [SalesRecord(**s) for s in generate_default_sales_history(DEFAULT_PRODUCTS)]
        self.save_data()

    def get_products(self) -> List[Product]:
        return self.products

    def get_product(self, product_id: str) -> Optional[Product]:
        for p in self.products:
            if p.id == product_id:
                return p
        return None

    def add_product(self, product: Product) -> Product:
        # Check duplicate
        for i, p in enumerate(self.products):
            if p.id == product.id or p.sku == product.sku:
                self.products[i] = product
                self.save_data()
                return product
        self.products.append(product)
        self.save_data()
        return product

    def update_product(self, product_id: str, updates: ProductUpdate) -> Optional[Product]:
        for i, p in enumerate(self.products):
            if p.id == product_id:
                update_dict = updates.model_dump(exclude_unset=True)
                updated_prod = p.model_copy(update=update_dict)
                self.products[i] = updated_prod
                self.save_data()
                return updated_prod
        return None

    def delete_product(self, product_id: str) -> bool:
        initial_len = len(self.products)
        self.products = [p for p in self.products if p.id != product_id]
        if len(self.products) != initial_len:
            self.sales_history = [s for s in self.sales_history if s.product_id != product_id]
            self.save_data()
            return True
        return False

    def get_sales(self, product_id: Optional[str] = None, limit: int = 200) -> List[SalesRecord]:
        if product_id:
            return [s for s in self.sales_history if s.product_id == product_id][-limit:]
        return self.sales_history[-limit:]

    def add_sales_records(self, records: List[SalesRecord]):
        self.sales_history.extend(records)
        self.save_data()

    def set_api_key(self, key: str):
        self.gemini_api_key = key.strip()
        self.save_data()

data_store = StoreDataStore()
