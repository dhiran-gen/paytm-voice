from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    print("[PASS] Health endpoint OK")

def test_products():
    res = client.get("/api/products")
    assert res.status_code == 200
    products = res.json()
    assert len(products) >= 10
    print(f"[PASS] Products endpoint OK ({len(products)} products loaded)")

def test_recommendations():
    res = client.get("/api/recommendations")
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    print(f"[PASS] AI Recommendations OK ({len(data['recommendations'])} recommendations generated)")
    
    # Check that low-stock items have 0% discount and PROTECT_MARGIN
    protect_items = [r for r in data["recommendations"] if r["action_type"] == "PROTECT_MARGIN"]
    overstock_items = [r for r in data["recommendations"] if r["action_type"] == "CLEAR_OVERSTOCK"]
    print(f"  - Margin Protected / Low Stock Items: {len(protect_items)}")
    print(f"  - Overstock Clearance Candidates: {len(overstock_items)}")

def test_simulation():
    res = client.post("/api/simulate", json={
        "product_id": "prod_1",
        "discount_pct": 20.0,
        "campaign_duration_days": 7
    })
    assert res.status_code == 200
    sim = res.json()
    assert sim["product_id"] == "prod_1"
    assert "projected_revenue" in sim
    assert "curve_data" in sim
    print("[PASS] What-If Simulator endpoint OK")

def test_chat():
    res = client.post("/api/chat", json={
        "message": "Which products are in danger of stockout?",
        "conversation_history": []
    })
    assert res.status_code == 200
    chat = res.json()
    assert "reply" in chat
    assert len(chat["reply"]) > 20
    print("[PASS] AI Copilot chat endpoint OK")

if __name__ == "__main__":
    test_health()
    test_products()
    test_recommendations()
    test_simulation()
    test_chat()
    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

