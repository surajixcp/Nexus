# Nexus — AI-Powered Enterprise Incident & Escalation Platform

**Nexus** is an enterprise-grade incident management, operational tracking, escalation governance, and RAG-based AI knowledge platform frontend built for high-stakes mission-critical banking and fintech applications.

> **DEMO ENVIRONMENT · SYNTHETIC DATA ONLY**  
> This application uses 100% fictional and synthetic data. No external databases, private APIs, or company infrastructure are connected.

---

## Key Features

1. **Executive & Operational Command Dashboard**
   - 8 Real-time KPI Cards: Total Incidents, Open Incidents, In Progress, Resolved, Critical (P1), Active Escalations, SLA Compliance (96.8%), and Average MTTR.
   - Interactive Recharts charts: Incident Volume vs. Resolution Rate, Priority Distribution (P1–P4 Donut), Incidents by Application, SLA Trends, MTTR by Support Tier.
   - Application Health status monitoring across 6 core banking systems.

2. **Incident Management & Lifecycle**
   - Full lifecycle transitions: `Open` → `Acknowledged` → `In Progress` → `Escalated` → `Resolved` → `Closed`.
   - Comprehensive filtering by application, severity, priority, and status.
   - Real-time SLA countdown timers with dynamic breach detection.
   - Full CSV export and bulk acknowledge capabilities.

3. **Intelligent Incident Intake & Smart Routing**
   - Auto-generated unique IDs: `DEMO-INC-XXXX` and linked problem IDs `DEMO-P-261XXXX`.
   - Dynamic service dropdowns mapped to application selection.
   - Auto-assigned support teams, predefined `TO` and `CC` recipient lists.
   - Live email notification preview before dispatch.

4. **Dedicated Incident Tracker Matrix (24 Columns)**
   - Inspired by operational spreadsheet reporting workflows.
   - Dynamic mathematical calculations:
     - `Duration = End Time − Start Time`
     - `Reported MTTR = End Time − Reported Time`
     - Handles active incidents dynamically using current simulated time.
     - Gracefully prevents `#VALUE!`, `NaN`, and invalid timestamps.
   - Column customizer (toggle visibility of any of the 24 columns).
   - Horizontal scrolling with sticky headers, search, sorting, and print view.

5. **Tiered Escalation Center**
   - Levels: `L1` (T+0 min), `L2` (T+15 min), `L3` (T+30 min), `Management` (T+45 min).
   - SLA countdown timers and escalation handoff notes.
   - Manual escalation trigger and simulated auto-escalation paging.

6. **Simulated Email Notification Center**
   - Incident Creation, Update, Escalation, and Resolution templates.
   - Dynamic distribution lists.
   - Live email preview panel with instant copy to clipboard.
   - Simulated broadcast dispatcher with sent history logging.

7. **War Room Team Collaboration**
   - Scoped channels per incident.
   - Toggle between **Internal Confidential Notes** and **Public Stakeholder Updates**.
   - Presence directory of fictional on-call engineers.
   - Simulated real-time responses from on-call engineers.

8. **AI Incident Copilot & RAG Knowledge Base**
   - Predictive root cause analysis (RCA) and troubleshooting step recommendations.
   - Grounded RAG Chat with exact document and page number citations.
   - Semantic vector search with cosine similarity % ranking.
   - 15 Pre-indexed synthetic enterprise documents (PDF, DOCX, MD).
   - 10 Curated operational runbooks with helpfulness rating feedback.
   - Drag-and-drop document upload simulation with indexing animations.

9. **Role-Based Access & Demo Management**
   - 4 Demo Personas: **Admin** (Alex Morgan), **Support Engineer** (Priya Sharma), **Manager** (Marcus Vance), **Employee** (Elena Rostova).
   - Quick one-click role switcher in the navigation bar.
   - **Reset Demo Data** feature to instantly restore the pristine 32 synthetic incidents and tracker records.

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage
- **Testing**: `node:test` + `node:assert/strict` via `tsx`

---

## Installation & Local Development

1. **Clone repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000` or `http://localhost:3000?autostart=1`.

4. **Run pure logic unit tests**:
   ```bash
   npx --yes tsx --test src/utils/calculations.test.ts
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```
# Nexus
