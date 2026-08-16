# Role & Project Scope: Multi-Entity Enterprise Portal

You are an expert Principal Full-Stack Architect and System Designer. Your task is to design, scaffold, and build a scalable, multi-tenant enterprise portal application for **Savinon Holdings LLC**. 

The goal of this application is to serve as the unified operational, management, and service dashboard for the parent entity (**Savinon Holdings LLC**) and its 10 operating subsidiary businesses.

---

## 1. System Architecture & Tech Stack Specifications

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Shadcn UI / Radix UI.
- **Backend/API:** Next.js Server Actions / API Routes, Node.js, TypeScript.
- **Database:** PostgreSQL (via Prisma ORM or Supabase) with multi-tenant row-level security (RLS) indexed by `entity_id`.
- **Authentication & RBAC:** NextAuth.js / Clerk with support for Role-Based Access Control (Super Admin = Smith Savinon, Entity Admin, Client, Customer).
- **State & Architecture:** Modular monolith design pattern where each subsidiary operates as an isolated domain model/module under the parent workspace.

---

## 2. Parent Holding Company Architecture

- **Parent Entity:** Savinon Holdings LLC
- **Core Platform Features:**
 - Executive Dashboard displaying consolidated revenue, intercompany fee transfers, and status across all 10 OpCos.
 - Intercompany Management Fee Automation: Central billing module connecting OpCos to the central Management S-Corp for administrative & IP licensing fees.
 - Entity Compliance Tracker: Tracks state filing dates, annual report deadlines, registered agent status, and EIN records for all 11 entities.

---

## 3. Subsidiary Specifications & Technical Workflows

Build specific feature modules, data models, and workflow capabilities for each of the 10 operating subsidiaries:

### Module 1: smithsavinon.com
- **Services:** AI Business Consulting, Full-Stack Application Development, AI Systems Architecture.
- **Core Features:** Client onboarding portal, interactive project scope builder, AI architecture blueprint generator, consultation booking engine (Cal.com API integration), portfolio showcase.

### Module 2: Hacker Blocker
- **Services:** Cybersecurity Application & Threat Prevention.
- **Core Features:** Real-time IP threat monitoring dashboard, automated firewall rule manager, attack log visualizer, web application firewall (WAF) API integration, automated alert triggers.

### Module 3: Market App
- **Services:** Peer-to-Peer / Buyer-Seller Social Marketplace Application.
- **Core Features:** Dynamic product/service listing manager, integrated payment processing (Stripe Connect), user review/rating system, messaging system between buyers and sellers, custom UI theme selector.

### Module 4: Saya's Hot Sauce
- **Services:** E-Commerce Food Product Brand.
- **Core Features:** Direct-to-Consumer (D2C) e-commerce storefront, inventory management system, batch tracking, product subscription module (recurring sauce club), shipping label integration (ShipStation API).

### Module 5: Smith Savinon Book Publishing
- **Services:** Publishing, Author Marketing & KDP Distribution.
- **Core Features:** Book listing showcase, KDP metadata formatter, automated sales landing page generator (sales letters/pitch decks), digital downloadable assets vault, royalty distribution tracker.

### Module 6: [Reserved OpCo Slot]
- **Services:** Secondary Tech / Digital Asset Entity.
- **Core Features:** Scalable micro-SaaS workspace holder, domain redirect engine, and asset performance analytics.

### Module 7: Enlightem Anunnaki
- **Services:** Music Production & Beat Store.
- **Core Features:** Audio player with waveform visualization, beat licensing/lease contract builder (Exclusive, Non-Exclusive, Stems), instant digital audio delivery system, producer portfolio showcase.

### Module 8: Real Estate Wholesaling
- **Services:** Real Estate Acquisition & Off-Market Property Deals.
- **Core Features:** Property deal CRM, seller lead intake pipeline, automated ARV (After Repair Value) & repair cost calculator, disposition buyer list manager, assignment contract generator.

### Module 9: Local Restaurant
- **Services:** Food Service & Hospitality.
- **Core Features:** Digital menu manager with online ordering, reservation management system, kitchen display system (KDS) integration, local pickup/delivery tracking.

### Module 10: Grocery Store
- **Services:** Local Retail & Inventory Sales.
- **Core Features:** Inventory/SKU management system, barcode scanner integration, local delivery/curbside pickup scheduler, daily sales & wastage reporting.

---

## 4. Execution Plan & Implementation Steps

Execute this codebase build step-by-step in the following sequence:

1. **Step 1: Core Database Schema & Multi-Tenancy**
 - Generate `schema.prisma` defining `Organization`, `Entity` (Holding + 10 OpCos), `User`, `Role`, and subsidiary-specific models.
2. **Step 2: Shared UI Components & Layout**
 - Build the master executive dashboard sidebar and navigation switcher allowing instant switching between **Savinon Holdings LLC** and individual OpCo workspaces.
3. **Step 3: Subsidiary Feature Modules**
 - Scaffold folder-based feature routes under `app/(dashboard)/entities/[entity-slug]/` for each of the 10 businesses.
4. **Step 4: Intercompany Financial Engine**
 - Implement data structures to track cash movements, management fee invoices, and owner draws/salary distributions.

Begin by generating the **database schema (`schema.prisma`)** and the **folder structure** for this Next.js project.
