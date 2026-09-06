# PromoAlign AI - AI-Driven Promotion and Inventory Alignment Planner

**PromoAlign AI** is an intelligent decision-support software designed for retail merchandising and store operations teams. It bridges the gap between **Marketing** (sales lift), **Merchandising** (margin retention), and **Supply Chain Operations** (inventory availability and stockout risk prevention).

---

## Key Features

1. **AI-Driven Promotion & Inventory Alignment (Main Hub)**
   - Automatically computes **Days of Supply (DoS)**, sales velocity, and gross margins across all catalog SKUs.
   - Recommends exact discount percentages ($15\% - 35\%$) for overstocked items to recover tied-up capital.
   - Proactively enforces **Price Protection (0% Discount / Hold Price)** on high-velocity items with low inventory buffers to prevent stockouts and customer dissatisfaction.
   - Provides clear **AI Rationale**, strategic suggestions, and risk warnings for every product.

2. **Google Gemini Conversational AI Copilot**
   - Live context-aware retail assistant powered by the **Google Gemini API**.
   - Answers complex natural-language questions (e.g., *"What discounts should I run this weekend?", "Why shouldn't I discount running shoes?", "Give me a clearance strategy for apparel"*).
   - Built-in heuristic offline fallback mode ensuring 100% functionality even without an API key.

3. **Interactive What-If Scenario Simulator**
   - Real-time elasticity sandbox: slide discount rates ($0\% - 50\%$) and adjust campaign durations.
   - Visual charts for projected revenue, unit sales lift, net profit delta, and days until stockout.

4. **Dedicated Store Data & Inventory Management**
   - Separate view to keep the main decision page clean and focused.
   - Add new products, inline edit stock levels, cost prices, selling prices, and velocity.
   - View detailed transaction and discount history logs.
   - One-click CSV import and JSON catalog export.
   - Reset button to restore the realistic retail demo dataset at any time.

---

## Quick Start Guide

### 1. Start the Python FastAPI Backend
```bash
# From the project root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend will be live at: `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Python 3.14, FastAPI, Uvicorn, Pydantic, Python-Multipart
- **AI Integration**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) + Analytical Optimization Engine
# paytm-voice
