# GlobalPathwayHub Enterprise Architecture & Implementation Plan
**Platform Valuation Tier:** $20,000 Production Enterprise System  
**Version:** 2.0.0 (Next.js 14 App Router + Neon Postgres + Cloudflare R2)  
**Target Audience:** Business Owner, Engineering Team, Education Agents & Counselors  
**Last Updated:** October 2026

---

## 1. Executive Summary & Strategic Vision

**GlobalPathwayHub** is an end-to-end Enterprise Resource Planning (ERP), Customer Relationship Management (CRM), and Financial Management platform purpose-built for global education consultancies and study-abroad agencies. 

Unlike generic off-the-shelf software, GlobalPathwayHub integrates **omnichannel student lead acquisition**, **digital dossier and KYC file management**, **Cloudflare R2 document storage**, **multi-branch counselor compensation**, and **dual-entry financial intelligence** (marketing costs vs. university tuition commission revenue).

### Core Business Model
1. **Public Client Layer:** An interactive, high-converting digital storefront showcasing top partner universities and degree programs across the UK, USA, Canada, Australia, Germany, and Malaysia. All public authentication is removed from public view so prospective students are routed directly into lead inquiries and free consultations.
2. **Restricted Staff & Agent Management Portal (`/admin`):** Secure administrative hub accessible solely to company executives, branch counselors, sub-agents, and accountants. The primary portal entrypoint is located at `http://localhost:3000/admin` (with `/login` automatically redirected to `/admin`).
3. **Revenue Engine:** Tracks high-value first-year tuition commissions (typically 10%–18% per enrolled student), application processing fees, and visa advisory services while automatically calculating and disbursing partner counselor commissions.

---

## 2. Multi-Stakeholder Operational Blueprints

### 2.1 Blueprint for the Business Owner & Managing Director
* **Total Financial Sovereignty:** Real-time visibility into Gross Cash Inflows, Net Retained Agency Revenue, Counselor Commission Splits, and Operating Expenses.
* **Marketing Budget Attribution:** Direct tracking of Meta (Facebook/Instagram) and Google Ads ad-spend against student lead conversion to calculate exact Return on Ad Spend (ROAS) and Customer Acquisition Cost (CAC).
* **Leakage Prevention:** Automated commission locking ensures that an agent’s payout cannot be authorized without verified university enrollment and tuition clearance.
* **Multi-Branch Scaling:** Centralized monitoring of branches in Dhaka (Banani, Dhanmondi), Chittagong, Sylhet, and overseas representative offices.

### 2.2 Blueprint for Education Counselors & Partner Agents
* **Streamlined Student Dossier Management:** Create comprehensive digital files with unique student IDs (`GPH-2026-XXXX`).
* **Document Vault:** Upload and verify passport scans, IELTS scorecards, academic transcripts, Statements of Purpose (SOP), CAS/I-20, and visa grant notices directly to Cloudflare R2.
* **Automated Commission Calculations:** Transparent tracking of accrued commissions per successful university placement with instant payout status (`Approved`, `Paid`).
* **1-Click Lead Conversion:** Convert qualified inquiries into active student dossiers with zero manual re-typing.

### 2.3 Blueprint for Developers & DevOps Engineers
* **Technology Stack:**
  * **Framework:** Next.js 14+ (React 18, App Router, Server Components & Route Handlers)
  * **Database:** Neon Serverless PostgreSQL with connection pooling (`pg` Pool)
  * **File Storage:** Cloudflare R2 (S3-compatible, edge-distributed, zero egress fees)
  * **Styling & UI:** Tailwind CSS, Glassmorphic Design System, Lucide React icons, Radix UI
  * **Authentication:** Cryptographic Scrypt/PBKDF2 salted password hashing with HMAC-SHA256 session tokens
* **System Boundaries:** Public routes and admin management interfaces are completely decoupled. Administrative dashboards use an isolated layout without public navigation interference.

---

## 3. System Architecture & Database Schema

The database is built on **Neon Serverless PostgreSQL** with 11 relational tables optimized for concurrency and sub-millisecond query performance.

```
                              ┌────────────────────────┐
                              │         USERS          │
                              │ (Admins, Agents, Staff)│
                              └───────────┬────────────┘
                                          │
                  ┌───────────────────────┼────────────────────────┐
                  │ 1:N                   │ 1:N                    │ 1:N
                  ▼                       ▼                        ▼
         ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
         │     LEADS       │     │    STUDENTS     │     │    EXPENSES     │
         │  (CRM Pipeline) │     │ (Student Files) │     │ (Costs & Ads)   │
         └────────┬────────┘     └────────┬────────┘     └─────────────────┘
                  │                       │
                  │ 1-Click Convert       │ 1:N
                  └───────────────────────┼────────────────────────┐
                                          ▼                        ▼
                                ┌───────────────────┐    ┌───────────────────┐
                                │ STUDENT_DOCUMENTS │    │     REVENUES      │
                                │  (Cloudflare R2)  │    │ (University Comm.)│
                                └───────────────────┘    └─────────┬─────────┘
                                                                   │ 1:N
                                                                   ▼
                                                         ┌───────────────────┐
                                                         │   AGENT_PAYOUTS   │
                                                         │ (Commission Pool) │
                                                         └───────────────────┘
```

### 3.1 Data Dictionary

#### 1. `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique user ID (`usr_admin_...`, `usr_agent_...`) |
| `name` | TEXT | NOT NULL | Full name of counselor / administrator |
| `email` | TEXT | UNIQUE, NOT NULL | Corporate work email |
| `password_hash` | TEXT | NOT NULL | Cryptographic scrypt salted password hash |
| `role` | TEXT | DEFAULT 'agent' | `admin`, `agent`, `accountant` |
| `branch` | TEXT | DEFAULT 'Dhaka' | Branch location (e.g. Banani, Sylhet) |
| `commission_rate` | NUMERIC | DEFAULT 15.0 | Agreed percentage split on university commissions |
| `status` | TEXT | DEFAULT 'active' | `active`, `inactive` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

#### 2. `students` (Digital Dossiers)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Student ID (`stu_...`) |
| `student_code` | TEXT | UNIQUE | Human-readable file code (e.g., `GPH-2026-0101`) |
| `full_name` | TEXT | NOT NULL | Full legal name matching passport |
| `email` | TEXT | NOT NULL | Student contact email |
| `phone` | TEXT | — | WhatsApp-enabled phone number |
| `passport_number` | TEXT | — | International travel passport number |
| `highest_education` | TEXT | — | Academic level (e.g. B.Sc, HSC, A-Levels) |
| `gpa` | TEXT | — | Grade Point Average |
| `english_test` | TEXT | — | `IELTS`, `PTE`, `TOEFL`, `Duolingo`, `MOI` |
| `english_score` | TEXT | — | Overall test band (e.g. 7.0, 68) |
| `target_country` | TEXT | — | Destination (UK, Canada, USA, Australia, etc.) |
| `target_university` | TEXT | — | Preferred or enrolled institution |
| `target_course` | TEXT | — | Degree program title |
| `target_intake` | TEXT | — | Target admission intake (e.g. September 2026) |
| `status` | TEXT | DEFAULT 'counseling' | Stage in application lifecycle |
| `assigned_agent_id` | TEXT | REFERENCES users(id) | Assigned counselor handling the file |
| `notes` | TEXT | — | Internal counselor notes & remarks |

#### 3. `student_documents` (Cloudflare R2 Vault)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Document ID (`doc_...`) |
| `student_id` | TEXT | REFERENCES students(id) | Linked student file |
| `title` | TEXT | NOT NULL | Document name (e.g. Passport Bio Page) |
| `document_type` | TEXT | NOT NULL | `passport`, `transcript`, `ielts`, `sop`, `offer_letter`, `cas_i20`, `visa`, `bank_statement` |
| `file_url` | TEXT | NOT NULL | Public/Presigned URL from Cloudflare R2 |
| `r2_key` | TEXT | — | Object path in Cloudflare bucket `gph` |
| `file_size` | TEXT | — | Human-readable size (e.g., 2.4 MB) |
| `status` | TEXT | DEFAULT 'verified' | `pending`, `verified`, `rejected` |

#### 4. `leads` (Omnichannel Pipeline)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Lead identifier (`lead_...`) |
| `full_name` | TEXT | NOT NULL | Lead applicant name |
| `phone` | TEXT | NOT NULL | Contact telephone |
| `email` | TEXT | — | Email address |
| `lead_source` | TEXT | DEFAULT 'facebook_ads' | `facebook_ads`, `google_search`, `tiktok`, `walk_in`, `website_inquiry`, `sub_agent` |
| `status` | TEXT | DEFAULT 'new' | `new`, `contacted`, `counseling_scheduled`, `documents_pending`, `converted_to_student`, `cold_lost` |
| `priority` | TEXT | DEFAULT 'high' | `high` (Hot Inquiry), `medium`, `low` |
| `assigned_agent_id` | TEXT | REFERENCES users(id) | Counselor assigned for follow-up |
| `estimated_commission`| NUMERIC | DEFAULT 1500.00 | Anticipated revenue upon visa enrollment |

#### 5. `expenses` (Cost Ledger)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Expense identifier (`exp_...`) |
| `title` | TEXT | NOT NULL | Description (e.g. Meta Ads Fall Intake) |
| `category` | TEXT | NOT NULL | `marketing_meta`, `marketing_google`, `daily_office`, `salaries`, `software_saas`, `event_expo`, `travel`, `legal`, `other` |
| `amount` | NUMERIC(12,2)| NOT NULL | Amount in USD |
| `expense_date` | DATE | DEFAULT CURRENT_DATE | Transaction date |
| `paid_to` | TEXT | — | Beneficiary / Vendor |
| `payment_method` | TEXT | — | `bank_transfer`, `credit_card`, `bkash_nagad`, `cash` |

#### 6. `revenues` & `agent_payouts`
* **`revenues`**: Stores tuition commission and service fee invoices. Automatically deducts the agent's agreed percentage split to compute `net_company_amount`.
* **`agent_payouts`**: Tracks individual counselor commission disbursements linked directly to verified revenue invoices.

#### 7. `visitors`
Tracks marketing UTM campaign source, medium, country, device, and landing path for attribution modeling.

---

## 4. Module by Module Functional Specification

### 4.1 Executive Dashboard (`/admin`)
* **Real-time Financial Ribbon:**
  * Gross Cash Inflow
  * Total Operating & Ad Costs
  * Net Operating Margin ($ & %)
  * Counselor Commissions Accrued
* **Operational Ribbon:** Active student dossiers, lead volume, visa approvals, unique web traffic.
* **Interactive Shortcuts:** Rapid modal launchers for new student files, lead capture, expense posting, and invoice generation.

### 4.2 Student File Management System (`/admin/students`)
* **Dossier Lifecycle:** `Counseling` → `Documents Pending` → `Application Lodged` → `Conditional Offer` → `Unconditional Offer` → `CAS / I-20` → `Visa Lodged` → `Visa Approved` → `Enrolled`.
* **Cloudflare R2 Document Vault:** Upload, view, and delete verified PDF/Image attachments with edge performance and zero egress fees.

### 4.3 Omnichannel Lead Management System (`/admin/leads`)
* **Lead Ingestion:** Filter by acquisition channel (Meta Ads, Google Search, TikTok, Walk-in).
* **Hot Priority Tagging:** Highlight urgent leads for immediate counseling callback.
* **1-Click Conversion:** Instantly elevates an inquiry into a permanent student dossier.

### 4.4 Counselors & Agent Management System (`/admin/agents`)
* **Performance Leaderboard:** Ranks counselors by students assigned, revenue generated, and commissions earned.
* **Commission Engine:** Configurable percentage share (e.g., 15% standard, 18% senior counselor).
* **Credential Provisioning:** Secure administrative creation of counselor accounts without open public registration.

### 4.5 Financial Cost & Marketing Ledger (`/admin/finance/costs`)
* Full audit trail of all operational outflows.
* Segregated digital marketing analytics (Meta Ads vs Google Ads vs Office Overhead).

### 4.6 Revenue & Invoicing Management (`/admin/finance/revenue`)
* Tracks university commission wires and student processing fees.
* Automated dual-entry calculation: Gross Inflow - Counselor Commission = Net Company Profit.
* **Bulk Selection & Actions:** Multi-select invoices for bulk status clearance or bulk deletion.
* **Server-Synced Pagination:** Navigates large ledger records smoothly with customizable page sizes.

### 4.7 Visitor & Marketing Attribution (`/admin/analytics`)
* Tracks web traffic, landing page views, and UTM referral channels to calculate campaign conversion velocity.

### 4.8 Universities & Course Catalog (`/admin/universities`)
* Complete catalog management with Cloudflare R2 university logos, country filters, and tuition fee schedules.

### 4.9 Interactive Financial & Pipeline Area Graph (`components/admin/AreaGraphChart.jsx`)
* **Smooth Cubic Bezier Rendering:** Native SVG Bezier curves (`d="M ... C ..."`) with dual gradient area fills.
* **Dynamic Time Range Filters:** `7 Days`, `30 Days`, `Quarter (90D)`, and `12 Months`.
* **Multi-Metric Focus Filters:** Toggle between `Overview (All)`, `Gross Revenue`, `Marketing & Office Costs`, `Net Retained Profit`, and `Active Student Leads`.
* **Precision Interactive Crosshair & Tooltip:** Mouse-tracking vertical crosshair and floating glassmorphic tooltip with point-in-time financial delta indicators.

---

## 5. UI/UX Aesthetics, Bulk Operations & Notification Architecture

### 5.1 Client-Unified Color Palette & Glassmorphic Design System
The entire administrative back-office shares the elegant, premium aesthetic of the public client storefront:
* **Background Canvas:** Ambient `#f8fafc` canvas with radial blue/gold glow:
  `radial-gradient(at 0% 0%, hsla(221, 83%, 53%, 0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(48, 96%, 53%, 0.14) 0px, transparent 50%)`
* **Card & Container Surfaces:** High-translucency white glassmorphism (`bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm`).
* **Typography:** Modern dark slate hierarchy (`text-slate-900` headings, `text-slate-700` body, `text-slate-500` captions).
* **Brand Colors:** Royal blue primary (`#2563eb`), warm gold accent (`#f59e0b` / `#fbbf24`), emerald for revenue/visa approvals, and rose for costs/alerts.

### 5.2 Enterprise Bulk Operations Framework
Integrated across all data-heavy management modules (`/admin/students`, `/admin/leads`, `/admin/finance/costs`, `/admin/finance/revenue`):
* **Select All / Row Toggles:** Select individual records or all items on the active page via accessible checkbox controls.
* **Docked / Floating Bulk Action Bar:** Appears automatically at the bottom viewport when `selectedIds.length > 0`, featuring:
  * Dynamic item counter badge
  * Bulk stage & status modifiers
  * Bulk counselor assignment dropdown
  * Bulk priority update
  * Bulk permanent deletion with confirmation safeguards
* **Dedicated Bulk API Endpoints:** High-performance database operations utilizing SQL `WHERE id = ANY($1)`.

### 5.3 Reusable Pagination Architecture (`components/Pagination.jsx`)
* **Features:**
  * Active page selector with smart windowing (5 page range buttons + first/last fast jumps)
  * Dynamic items count summary: `Showing X to Y of Z items`
  * Per-page size selector: `5`, `10`, `20`, `25`, `50` items per page
  * Smooth auto-scroll to top upon page navigation
* **Implemented on:** Public `/universities` catalog and all `/admin` management modules.

### 5.4 Toast Notification System (`react-hot-toast`)
* Global `<Toaster />` mounted within `components/ClientShell.jsx`.
* Customized with glassmorphic backdrop blur, brand borders, and subtle box shadows.
* Provides non-blocking, immediate asynchronous user feedback for form submissions, file uploads to Cloudflare R2, status changes, and bulk mutations (`toast.loading()`, `toast.success()`, `toast.error()`).

---

## 6. Security & Access Control Architecture

1. **Client/Admin Segregation:** Public users have zero access to administrative routes. Navbar and footer components are automatically stripped on management routes.
2. **Password Security:** Salted scrypt key derivation function (Node.js native `crypto`) eliminates weak MD5/SHA1 vulnerabilities.
3. **Session Tokens:** HMAC-SHA256 authenticated cryptographic tokens with 7-day automated expiration.
4. **Cloudflare R2 Bucket Isolation:** University public logos are publicly edge-cached via `pub-62824071403f4f6ebb69c83b5dbef798.r2.dev`, while confidential student dossiers reside under structured prefixes (`students/{studentId}/*`).

---

## 7. Standard Operating Procedures (SOPs)

### SOP 1: Ingesting an Ad Lead to Visa Clearance
1. **Ad Click:** Student clicks Facebook ad or submits website contact form; lead is captured under `/admin/leads`.
2. **Counseling:** Assigned counselor calls lead via WhatsApp, shifts status to `Counseling Scheduled`.
3. **Conversion:** Counselor clicks **"Convert to Student File"**; system creates dossier `GPH-2026-XXXX`.
4. **Document Collection:** Counselor opens **"Document Vault"** and uploads student's passport and IELTS TRF to Cloudflare R2.
5. **Admission & Visa:** Counselor lodges university application, updates stage to `Unconditional Offer`, receives CAS/I-20, and logs `Visa Approved`.

### SOP 2: Commission Invoicing & Agent Payout
1. Student registers at university and completes semester tuition payment.
2. Managing Director navigates to `/admin/finance/revenue` and clicks **"Create Revenue Invoice"**.
3. Selects student and assigned counselor; enters gross commission ($5,000).
4. System automatically calculates counselor split ($750 at 15%) and sets Net Agency Profit ($4,250).
5. Payment is marked `Received` and payout record is archived in `agent_payouts`.

---

## 8. Scaling & Expansion Roadmap

* **Phase 1 (Completed):** Enterprise architecture migration, full database schema, R2 document vault, and unified management dashboard.
* **Phase 2 (Completed):** Reusable pagination, bulk selection systems, interactive Area Graph with multi-metric filters, client-unified glassmorphic theme, and `react-hot-toast` integration.
* **Phase 3 (Months 3–6):** Automated WhatsApp Business API integration for automatic status notifications to students upon offer/visa milestones.
* **Phase 4 (Months 6–12):** University direct application API integration and multi-currency exchange rate sync (USD, GBP, BDT, AUD, CAD).
* **Phase 5 (Months 12–24):** AI-powered Statement of Purpose (SOP) plagiarism and grammar analysis engine for prospective students.

---
*GlobalPathwayHub — Built with Enterprise Precision.*
