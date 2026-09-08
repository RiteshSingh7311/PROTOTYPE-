# 🛡️ LabelGuard AI

### **Autonomous Legal Metrology & FSSAI Label Compliance Enforcement System**
*Developed for Smart India Hackathon (SIH) — Ministry of Consumer Affairs, Food & Public Distribution*

---

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue?style=for-the-badge)](https://sih.gov.in)
[![Legal Metrology](https://img.shields.io/badge/PCR%20Rules-2011%20Amended-emerald?style=for-the-badge)](https://consumeraffairs.nic.in)
[![FSSAI Compliance](https://img.shields.io/badge/FSSAI%20Regulations-2020%20Active-green?style=for-the-badge)](https://fssai.gov.in)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)

---

## 📌 Executive Summary

Current prototype scanners often **hallucinate** or **guess** company names, product variants, and Maximum Retail Prices (MRP) when packaging images are low-resolution, angled, or torn. Furthermore, many generic checkers apply arbitrary rules without category awareness and silently overwrite physical label values with random online data.

**LabelGuard AI** solves this with an **Evidence-First Multi-Signal Verification Architecture**:
> **Core Principle:**  
> **`Identify → Extract → Verify → Confirm → Check Rules → Generate Report`**  
> *Do not guess. Do not silently overwrite. Always show statutory evidence.*

---

## 🔄 End-to-End System Workflow

```mermaid
flowchart TD
    A["📸 Upload Commodity Packaging Photo"] --> B["Stage 1: Multi-Signal Optical Extraction (OCR)"]
    
    subgraph S1 ["Stage 1: Evidence Extraction"]
        B --> B1["Extract Brand Name"]
        B --> B2["Extract Commodity / Generic Name"]
        B --> B3["Extract Barcode / GTIN (EAN-13)"]
        B --> B4["Extract MRP & Net Quantity"]
        B --> B5["Extract Packer Postal Address & PIN"]
    end

    S1 --> C["Stage 2: Online Registry Cross-Check (IProductVerificationService)"]
    
    subgraph S2 ["Stage 2 & 3: Verification & Conflict Detection"]
        C --> D{"Confidence & Signals Evaluation"}
        D -->|Confident Multi-Signal Match| E["Matched Registry Source (e.g., GS1 DataKart)"]
        D -->|Uncertain / Missing Signals| F["Flag: 'Product identity not confirmed'"]
        E --> G["Compare Label vs Registry Values"]
        G -->|Values Differ e.g. ₹120 vs ₹110| H["Generate Conflicting Information Alert"]
        G -->|Values Corroborate| I["Verified from Source"]
    end

    S2 --> J["Stage 4: Product Identity Confirmation Gate (Modal)"]
    
    subgraph S3 ["Stage 4: Officer Confirmation"]
        J --> K1["Option A: Confirm Product & Proceed"]
        J --> K2["Option B: Inline Edit Details"]
        J --> K3["Option C: Search Again"]
        J --> K4["Option D: Continue Without Online Verification"]
        K4 --> L["Mark: 'Identity not confirmed — manual verification required'"]
    end

    S3 --> M["Stage 5: Category-Aware Statutory Rule Engine"]
    
    subgraph S4 ["Stage 5: Statutory Compliance Engine"]
        M --> N1["Legal Metrology (PCR 2011) Engine"]
        N1 --> N1a["Rule 6: Mandatory Declarations"]
        N1 --> N1b["Rule 7 / Sch. II: Numeral Height"]
        N1 --> N1c["Rule 11: Unit Sale Price (USP)"]
        
        M --> N2{"Commodity Classification"}
        N2 -->|Packaged Food Product| O1["Active FSSAI 2020 Module (8 Food Declarations)"]
        N2 -->|Non-Food Commodity| O2["FSSAI Module Exempted (Cosmetics / Electronics)"]
    end

    S4 --> P["Stage 6: Honest Audit Determination & Statutory Documents"]
    
    subgraph S5 ["Stage 6: Output & Enforcement Action"]
        P --> Q1["Section A (Label Ground Truth) vs Section B (Registry)"]
        P --> Q2["Official Certificate of Statutory Compliance (PDF/QR)"]
        P --> Q3["Section 36 Legal Metrology Show-Cause Notice (PDF/Print)"]
        P --> Q4["Digital Inspection Memorandum (Legal PDF)"]
    end
```

---

## 🏛️ The 6-Stage Operational Pipeline

### **Stage 1: Multi-Signal Optical Extraction (OCR)**
* Never guesses or fabricates product names, company titles, MRPs, or license numbers.
* Simultaneously parses 8 visual signals from physical packaging:
  1. **Brand Name / Commercial Mark**
  2. **Generic / Specific Commodity Name**
  3. **Manufacturer / Packer / Importer Name & Postal Address with PIN Code** (Rule 6(1)(a))
  4. **Maximum Retail Price (MRP)** and *"inclusive of all taxes"* statement (Rule 6(1)(c))
  5. **Net Quantity** in standard metric units ($g$, $kg$, $ml$, $l$) (Rule 6(1)(b))
  6. **Schedule II Font Size / Numeral Height** (Rule 7)
  7. **Unit Sale Price (USP)** (Rule 6(11))
  8. **Month & Year of Manufacture / Packing** (Rule 6(1)(d))

---

### **Stage 2: Online Registry Cross-Check (`IProductVerificationService`)**
* Modular, pluggable architecture designed to connect to authoritative external databases (GS1 India DataKart, Open Food Facts, or brand registries).
* In demo mode, clearly stamped as **“Demo verification data (mock service)”** — no fake URLs or simulated internet crawls.
* Cross-checks using multi-field matching:
  $$\text{Match Signals} = \text{Brand} + \text{Product Name} + \text{Barcode/GTIN} + \text{Net Qty} + \text{MRP}$$
* Issues five statutory verification statuses:
  - `Verified from source`
  - `Partially matched`
  - `Conflicting information`
  - `Not found`
  - `Manual verification required`

---

### **Stage 3: Strict Separation of Ground Truth vs Verified Data**
* **Section A (Extracted from Uploaded Label)**: Retains raw OCR readings as primary legal ground truth for statutory inspection.
* **Section B (Online Verification)**: Corroborates secondary catalog records.
* **No Silent Overwrites**: If the physical label says ₹120.00 and an online listing says ₹110.00:
  - Both values are explicitly displayed side-by-side.
  - A **Conflicting Information Alert** is logged.
  - The physical label value is preserved for enforcement determination.

---

### **Stage 4: Product Identity Confirmation Gate**
Before any legal evaluation is executed, the user or enforcement officer must review the confirmation modal:
- **Displays**: Label Image, Detected Brand, Detected Product Name, Barcode, Online Match, and Confidence Score.
- **Controls**:
  - `Confirm Product & Proceed`
  - `Edit Details` (inline manual correction of misread OCR text)
  - `Search Again` (re-query product databases)
  - `Continue Without Online Verification` (flags record as: *“Identity not confirmed — manual verification required”*)

---

### **Stage 5: Category-Aware Compliance & Food-Only FSSAI Module**

#### **A. Legal Metrology (Packaged Commodities) Rules, 2011 (Amended)**
- Applied based on packaging type, category, and net quantity thresholds:
  - **Rule 6(1)(a)**: Complete manufacturer/packer address with mandatory postal PIN.
  - **Rule 6(1)(b) & Rule 7**: Standard metric net quantity declarations meeting minimum Schedule II numeral heights.
  - **Rule 6(1)(c)**: MRP in ₹ inclusive of all taxes (flags non-compliant suffixes like *+ Local Taxes*).
  - **Rule 6(11)**: Mandatory Unit Sale Price (USP) per $g$, $kg$, or $ml$.
  - **Rule 6(1)(f)**: Complete Consumer Care Redressal Cell (Designation, Phone, Email, Address).

#### **B. FSSAI Food Label Compliance (FSS Regulations, 2020)**
- **Evaluated EXCLUSIVELY for packaged food products**:
  - **Regulation 5(1)**: 14-digit FSSAI License Number & Official Logo.
  - **Regulation 5(2)**: Specific Food Product Name & Category.
  - **Regulation 5(3)**: Descending order ingredient declaration.
  - **Regulation 5(4)**: Allergen warning statements.
  - **Regulation 5(5)**: Nutritional Information Panel (Energy, Protein, Carbs, Sugars, Sodium).
  - **Regulation 5(6)**: Veg / Non-Veg Green/Brown Logo.
  - **Regulation 5(10)**: Date marking (*Best Before* / *Expiry*).
  - **Regulation 5(13)**: Customer Care & Grievance Cell.
- **Non-Food Commodity Exemption**: Cosmetics (shampoos, lotions), electronics, and cleaning products are exempted from FSSAI checks with an official exemption tag.

---

### **Stage 6: Honest Audit Determinations & Statutory Documents**

#### **Honest Result Categories** (No generic "100% compliant" banners):
1. `Compliant based on configured checks`
2. `Potential violation`
3. `Needs manual verification`
4. `Product identity not confirmed`
5. `Insufficient evidence`

#### **Statutory Documents Generated (1-Click Print / PDF)**:
- **Official Certificate of Statutory Compliance**: Issued for compliant packaging with SHA-256 digital signature hash, inspection ID, and dynamic verification QR code.
- **Section 36 Legal Metrology Show-Cause Notice**: Statutory charge sheet citing Section 36(1) of the Legal Metrology Act, 2009 for compounding or summons.
- **Digital Compliance Inspection Memorandum**: 8-point inspection memo for court and department archives.

---

## 🧪 Interactive Demo Scenarios (For SIH Evaluators)

| Test Metric | **Demo 1: Confirmed Food Commodity** | **Demo 2: Uncertain / Torn Label** | **Demo 3: Non-Food Cosmetic** |
| :--- | :--- | :--- | :--- |
| **Product** | *NutriSnack Roasted & Salted Almonds* | *Unidentified Herbal Formulation* | *Sparkle Glow Herbal Shampoo* |
| **Commodity Type** | Packaged Food (`Food & Snacks`) | General Commodity | Personal Care & Cosmetics |
| **OCR Signals** | Complete, crisp, high-confidence (98%) | Incomplete, blurred, torn (15–42%) | Stamped label, missing tax wording |
| **Online Registry** | GS1 DataKart / National Catalog | No reliable catalog match (0%) | Matched online catalog (88%) |
| **Confirmation Gate** | Confirmed by officer | Identity Not Confirmed warning | Confirmed by officer |
| **FSSAI Module** | **Active** (All 8 declarations passed) | Excluded (Identity unconfirmed) | **Exempted** (Non-Food Product) |
| **Determination** | `Compliant based on configured checks` | `Product identity not confirmed` | `Needs manual verification` |

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS (Vanilla utilities + Glassmorphism design system)
- **Tooling & Bundling**: Vite 6.2 (production bundle under 600 kB gzipped)
- **Icons & Visuals**: Lucide React, Custom SVG vector assets
- **Compliance Engines**: Modular TypeScript classes (`complianceEngine.ts`, `productVerificationService.ts`)
- **Theme Engine**: Light & Dark mode support with zero-overflow viewport containment

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Execution
```bash
# 1. Clone the repository
git clone https://github.com/RiteshSingh7311/PROTOTYPE-.git

# 2. Navigate to project directory
cd PROTOTYPE-

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build production bundle (Verification)
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser to test the live application.

---

## 👥 Smart India Hackathon 2026 Team
- **Project Title**: LabelGuard AI
- **Problem Statement**: Automated Verification of Legal Metrology (Packaged Commodities) Rules & Food Safety Declarations
- **Repository**: [https://github.com/RiteshSingh7311/PROTOTYPE-.git](https://github.com/RiteshSingh7311/PROTOTYPE-.git)

