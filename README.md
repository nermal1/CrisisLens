# CrisisLens 

CrisisLens is an institutional-grade stress testing platform that allows users to simulate how their investment portfolios would perform during historical financial crises (e.g., COVID-19 Crash, 2008 Financial Crisis) and future hypothetical scenarios.

## Project Architecture

This is a **Monorepo** containing two distinct parts:
* **Client (`/client`):** Next.js 14, React, Tailwind CSS, shadcn/ui.
* **Server (`/server`):** Python FastAPI, Pandas, yfinance.

---

## Getting Started

Follow these steps exactly to run the project locally.

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (Version 18+)
* [Python](https://www.python.org/) (Version 3.10+)
* Git

### 2. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/CrisisLens.git](https://github.com/YOUR_USERNAME/CrisisLens.git)
cd CrisisLens
