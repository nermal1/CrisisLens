# CrisisLens

CrisisLens is an institutional-grade stress testing platform that allows users to simulate how their investment portfolios would perform during historical financial crises (e.g., COVID-19 Crash, 2008 Financial Crisis) and future hypothetical scenarios.

## Project Architecture

This project is structured as a Monorepo containing two distinct parts:
* **Client (/client):** A frontend application built with Next.js 14, React, Tailwind CSS, and shadcn/ui.
* **Server (/server):** A backend API built with Python FastAPI, Pandas, and yfinance.

---

## Getting Started

Follow these instructions to set up the project locally. You will need to run two separate terminals: one for the backend and one for the frontend.

### Prerequisites
Ensure you have the following installed on your machine:
* Node.js (Version 18 or higher)
* Python (Version 3.10 or higher)
* Git

### 1. Clone the Repository
Open your terminal and run:

git clone https://github.com/YOUR_USERNAME/CrisisLens.git
cd CrisisLens

---

### 2. Backend Setup (Python)
The backend handles data processing, market simulations, and the API.

1. Open a terminal in the root directory and navigate to the server folder:
   cd server

2. Create a virtual environment:
   # For Mac/Linux:
   python3 -m venv venv
   
   # For Windows:
   python -m venv venv

3. Activate the environment:
   # For Mac/Linux:
   source venv/bin/activate
   
   # For Windows:
   venv\Scripts\activate

4. Install the required dependencies:
   pip install -r requirements.txt

5. Start the server:
   uvicorn main:app --reload

Success Confirmation: You should see a message stating "Application startup complete". The API is now running at http://127.0.0.1:8000.

---

### 3. Frontend Setup (Next.js)
The frontend contains the user interface.

1. Open a NEW terminal window (keep the Python terminal running).

2. Navigate to the client folder:
   cd client

3. Install the node modules:
   npm install

4. Start the development server:
   npm run dev

Success Confirmation: You should see a message stating "Ready in [time]". Open your web browser to http://localhost:3000 to view the application.

---

## Key Features & File Locations

Use this reference to locate the code for specific features:

* **Portfolio Hub**
  Location: client/app/portfolios/page.tsx
  Description: The main dashboard for managing and creating investment portfolios.

* **Analysis Dashboard**
  Location: client/app/analysis/page.tsx
  Description: The primary view for historical stress testing results and risk scoring.

* **Simulation Lab**
  Location: client/app/simulation/page.tsx
  Description: Forecasting tools (Monte Carlo) and the AI scenario agent interface.

* **Scenario Library**
  Location: client/app/scenarios/page.tsx
  Description: Educational timeline and deep-dive details of historical financial crises.

* **News Sentiment**
  Location: client/app/news/page.tsx
  Description: Financial news feed with AI-powered sentiment analysis.

---

## Troubleshooting

### "Module not found" in Frontend
If the frontend fails to load due to missing UI components (e.g., Tabs, Badge, ScrollArea), navigate to the client folder and install the specific component:

cd client
npx shadcn@latest add tabs sheet scroll-area separator badge

### VS Code does not recognize "fastapi"
If your editor shows errors despite the server running correctly, ensure your Python interpreter is set to the virtual environment:
1. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows).
2. Type "Python: Select Interpreter".
3. Select the option that contains "('venv': venv)".
