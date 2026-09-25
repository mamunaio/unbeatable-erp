# 🌟 Unbeatable ERP — Next-Gen Retail POS & Shop Management Suite

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-6.16.2-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" alt="License" />
</p>

---

## 📖 পরিচিতি (Overview)

**Unbeatable ERP** হলো বাংলাদেশের রিটেইল ব্যবসা, সুপারশপ, ডিপার্টমেন্টাল স্টোর, গ্রোসারি চেইন, কসমেটিকস, ফার্মেসি, ইলেকট্রনিক্স ও হার্ডওয়্যার শপের জন্য বিশেষভাবে নির্মিত একটি আধুনিক, হাই-স্পিড এবং অল-ইন-ওয়ান ইআরপি ও ক্লাউড/অন-প্রিমিসিস পিওএস (POS) সফটওয়্যার।

সফটওয়্যারটি সম্পূর্ণ **Type-Safe**, **Next.js 15 App Router**, **React 19**, **Prisma ORM**, এবং **প্যারালাল ডাটাবেস আর্কিটেকচার** দিয়ে তৈরি — যা পিক আওয়ারের চরম ভিড়েও মিলি-সেকেন্ডে ইনভয়েস জেনারেট এবং স্টক সমন্বয় করতে সক্ষম।

---

## 🚀 প্রধান প্রধান ফিচার ও মডিউলসমূহ (Core Modules)

### 1. ⚡ আল্ট্রাফাস্ট পিওএস কাউন্টার (Ultra-fast POS Terminal) — `/pos`
* **বারকোড স্ক্যানিং ও কীবোর্ড শর্টকাট:** কিবোর্ড বা বারকোড স্ক্যানার দিয়ে চোখের পলকে কার্টে আইটেম যুক্তকরণ।
* **ডুয়াল-স্ক্রিন কাস্টমার ফেসিং ডিসপ্লে:** কাস্টমারের জন্য লাইভ বিল ও ডিসকাউন্ট স্ক্রিন।
* **মাল্টিপল পেমেন্ট মেথড স্প্লিট:** এক বিলেই ক্যাশ, বিকাশ/নগদ/কার্ড ও বাকিতে স্প্লিট পেমেন্ট।
* **দ্রুত ও হোল্ড বিল (Hold/Resume Bill):** একাধিক কাস্টমারের বিল হোল্ডে রেখে নতুন কাস্টমার হ্যান্ডেল করার সুবিধা।

### 2. 🧾 সরকারি মূসক মানসম্মত ইনভয়েস ইঞ্জিন — `/sales` & `components/PrintableInvoice.tsx`
* **৩ ধরনের প্রিন্টিং মোড:**
  1. **A4 সরকারি মূসক-৬.৩ ফরম্যাট (NBR Tax Invoice)**
  2. **A5 হাফ-পেইজ রিটেইল ভাউচার (A5 Half Page)**
  3. **৮০ মিমি / ৫৮ মিমি পিওএস থার্মাল রসিদ (80mm Thermal Receipt)**
* **স্বয়ংক্রিয় QR কোড ও বারকোড জেনারেটর**
* **বাংলায় মোট টাকা (In Words):** যেমন — *এক হাজার দুই শত পঞ্চাশ টাকা মাত্র*।

### 3. 💬 বাল্ক এসএমএস মার্কেটিং ও অটো-নোটিফিকেশন হাব — `/marketing/sms`
* **রিয়েল-টাইম স্মার্টফোন সিমুলেটর:** স্ক্রিনে লাইভ মোবাইল চ্যাট বাবেলে এসএমএস প্রিভিউ।
* **টার্গেট অডিয়েন্স ক্যাম্পেইন:** সকল কাস্টমার, বকেয়া থাকা কাস্টমার, বা ভিআইপি মেম্বারদের ফিল্টার করে বাল্ক ব্রডকাস্ট।
* **ইভেন্ট-ভিত্তিক অটোমেটেড ট্রিগার:**
  - বিক্রয়ের সাথে সাথে ইনভয়েস লিঙ্কসহ SMS
  - বকেয়া পরিশোধের তাগাদা SMS
  - বাকি আদায়ের কনফার্মেশন রসিদ SMS
  - কুরিয়ার পার্সেল ট্র্যাকিং SMS
* **দেশীয় গেটওয়ে রেডি:** Greenweb BD, SSL Wireless, BulkSMS BD ও Twilio API।

### 4. 🚚 কুরিয়ার ও ডেলিভারি হাব — `/logistics`
* **Steadfast, Pathao & RedX ইন্টিগ্রেশন:** সরাসরি সিস্টেম থেকে পার্সেল বুকিং।
* **লাইভ পার্সেল ট্র্যাকিং:** ডেলিভারি স্ট্যাটাস (In Transit, Delivered, Returned, Cancelled)।
* **সিওডি রেমিট্যান্স রিকনসিলিয়েশন:** কুরিয়ার থেকে শপের অ্যাকাউন্টে টাকা জমার অটো লেজার।

### 5. 🛒 পারচেজ চালান বিল্ডার ও সাপ্লায়ার রিটার্ন — `/purchases`
* **মাল্টি-আইটেম ক্রয় এন্ট্রি (`/purchases/new`):** পাইকারি ক্রয় চালানের সাথে সাথে রিটেইল বিক্রয়মূল্য (MRP) আপডেট ও স্টক ইনওয়ার্ড।
* **সাপ্লায়ার রিটার্ন ও ডেবিট নোট (`/purchases/returns`):** নষ্ট বা ভুল পণ্য ফেরত দিয়ে ডেবিট নোট প্রিন্ট ও বাকি সমন্বয়।
* **ইন্ডিভিজুয়াল সাপ্লায়ার লেজার স্টেটমেন্ট (`/suppliers/[id]`):** প্রতিটি সরবরাহকারী প্রতিষ্ঠানের রানিং ব্যালেন্স খাতা।

### 6. 👥 কাস্টমার ডাটাবেস, বাকি খাতা ও লেজার প্রোফাইল — `/customers`
* **কাস্টমার প্রোফাইল ও লেজার (`/customers/[id]`):** প্রতিটি ক্রেতার লাইফটাইম বিক্রয়, নগদ জমা ও প্রদেয় বাকির রানিং স্টেটমেন্ট।
* **অন-পেজ বকেয়া আদায় (Receive Due):** ক্যাশ/অনলাইন পেমেন্ট সংগ্রহ ও রসিদ প্রদান।
* **লয়্যালটি রিওয়ার্ড পয়েন্ট ও ক্রেডিট লিমিট ট্র্যাকিং।**

### 7. 🗑️ ড্যামেজ, মেয়াদোত্তীর্ণ ও অপচয় রেজিস্টার — `/inventory/damages`
* **ক্ষতির কারণভিত্তিক ক্যাটাগরি:** মেয়াদোত্তীর্ণ (Expired), ভাঙা (Broken), লিক/পচন (Spoilage), ইঁদুরের ক্ষতি (Pest), এবং অডিট স্টক ঘাটতি।
* **স্বয়ংক্রিয় স্টক রাইট-অফ ও ক্ষতি হিসাব (Total Loss in BDT)।**
* **সাপ্লায়ার ক্লেইম ও রিকভারি ট্র্যাকিং।**
* **অফিসিয়াল ড্যামেজ রাইট-অফ স্লিপ প্রিন্ট।**

### 8. 🏛️ এনবিআর ভ্যাট রিটার্ন ও মূসক-৯.১ ট্যাক্স শিট — `/reports/vat`
* **NBR MUSHAK-9.1 স্ট্যান্ডার্ড ট্যাক্স রিপোর্ট:** পার্ট ১ থেকে ৮ পর্যন্ত সরকারি নিয়মমাফিক চার্ট।
* **ইনপুট ট্যাক্স রেয়াত (Input Tax Rebate) ও উৎসে কর্তন (VDS Deduction)।**
* **ইনক্লুসিভ ও এক্সক্লুসিভ ফ্র্যাকশন ক্যালকুলেটর (15/115)।**

### 9. 💰 ব্যালেন্স শিট ও ব্যাংক/ক্যাশ অ্যাকাউন্টস — `/accounting/bank-accounts` & `/reports/balance-sheet`
* **ব্যাংক ও এমএফএস অ্যাকাউন্টস:** ক্যাশ ড্রয়ার, ব্যাংক (DBBL, City, Brac), এবং মোবাইল ব্যাংকিং (bKash, Nagad, Rocket)।
* **ব্যালেন্স শিট:** Current Assets + Fixed Assets = Total Liabilities + Owner Equity সমীকরণ সম্বলিত ফাইন্যান্সিয়াল শিট।

### 10. 👔 এইচআর, স্টাফ হাজিরা ও সেলস কমিশন — `/hr`
* **দৈনিক বায়োমেট্রিক/ডিজিটাল হাজিরা খাতা (Present, Late, Absent, Leave)।**
* **বিক্রয়কর্মীদের সেলস টার্গেট ও কমিশন ক্যালকুলেটর।**
* **মাসিক পে-রোল ও স্যালারি স্লিপ জেনারেটর।**

### 11. 🌐 দ্বিভাষিক লোকালাইজেশন ইঞ্জিন (i18n Engine)
* **বাংলা ⇄ English ইনস্ট্যান্ট সুইচিং:** কোনো পেজ রিলোড ছাড়াই যেকোনো মুহূর্তে সম্পূর্ণ ইআরপি ভাষা পরিবর্তন।

---

## 🛠️ টেকনোলজি স্ট্যাক (Technology Stack)

| স্তর (Layer) | প্রযুক্তি (Technologies Used) |
| :--- | :--- |
| **Frontend Framework** | **Next.js 15.5.4 (App Router)** & **React 19.1.1** |
| **Language** | **TypeScript 5.9.2** (100% Strict Type Checking) |
| **Styling & Design System** | Curated CSS Design System (Custom Tokens, CSS Variables, Glassmorphism, Micro-animations) |
| **ORM & Database Tool** | **Prisma ORM 6.16.2** |
| **Database** | **MySQL 8.0** (`utf8mb4_unicode_ci` for native Bengali Unicode support) |
| **Data Validation** | **Zod 4.1.5** |
| **Containerization** | **Docker Multi-stage Alpine** + **Docker Compose** + **Nginx Reverse Proxy** |

---

## 📂 প্রোজেক্ট ডিরেক্টরি স্ট্রাকচার (Directory Structure)

```text
unbeatable-erp/
├── app/                             # Next.js 15 App Router Routes
│   ├── layout.tsx                   # Master Root Layout & Auth/Language Providers
│   ├── page.tsx                     # Landing & Smart Route Dispatcher
│   ├── pos/                         # POS Counter Terminal
│   ├── dashboard/                   # Executive Dashboard & KPI Metrics
│   ├── products/                    # Product Catalog, Add-ons & Barcodes
│   ├── inventory/                   # Stock Ledger, Transfers, Audits & Damages
│   │   ├── audit/                   # Physical Stock Count Audits
│   │   ├── damages/                 # Damage, Expiry & Wastage Register
│   │   └── transfers/               # Inter-branch Stock Movements
│   ├── sales/                       # Invoices List & Permalink View (/sales/[id])
│   ├── marketing/                   # Marketing & Bulk SMS Hub (/marketing/sms)
│   ├── purchases/                   # Multi-item Builder & Supplier Returns
│   ├── customers/                   # Customers CRM & Individual Ledgers (/customers/[id])
│   ├── suppliers/                   # Supplier Directory & Ledgers (/suppliers/[id])
│   ├── logistics/                   # Steadfast, Pathao & RedX Courier Hub
│   ├── promotions/                  # Coupons, BOGO & VIP Discount Engine
│   ├── expenses/                    # Petty Cash & Daily Expense Tracker
│   ├── accounting/                  # Bank & MFS Accounts Ledger
│   ├── hr/                          # Staff Attendance, Sales Commission & Payroll
│   ├── reports/                     # Profit/Loss, Balance Sheet & NBR VAT (Mushak-9.1)
│   ├── settings/                    # Shop Profile, VAT Rules & User RBAC
│   └── api/                         # Backend REST API Handlers & Webhooks
├── components/                      # Reusable UI & Business Components
│   ├── Sidebar.tsx                  # Collapsible Navigation Menu with Role Guards
│   ├── PrintableInvoice.tsx         # A4 Mushak-6.3, A5 & 80mm Thermal Print Engine
│   ├── LanguageSwitcher.tsx         # Live BN ⇄ EN Switcher
│   └── AuthProvider.tsx             # RBAC Authentication State
├── lib/                             # Utility Libraries & Engines
│   ├── prisma.ts                    # Prisma Database Singleton Client
│   ├── formatters.ts                # BDT Currency, Bengali In-Words, Bangla Dates
│   ├── export.ts                    # CSV/Excel Exporter with \uFEFF UTF-8 BOM
│   └── i18n/                        # Master Dictionaries (Bengali & English)
├── nginx/                           # Production Nginx Reverse Proxy Config
├── prisma/                          # Database Schema & Seed Migrations
│   ├── schema.prisma                # Master Multi-tenant DB Schema
│   └── seed.ts                      # Demo Seed Data Builder
├── docker-compose.yml               # Multi-container Compose (Next.js, MySQL, Nginx)
├── Dockerfile                       # Multi-stage Standalone Docker Build
├── DEPLOYMENT.md                    # Step-by-step Cloud & On-Premises Guide
└── package.json                     # NPM Dependencies & Scripts
```

---

## ⚡ লোকাল ডেভেলপমেন্ট সেটআপ (Local Setup Guide)

### ১. রিপোজিটরি ক্লোন করুন
```bash
git clone <YOUR_GIT_REPO_URL>
cd unbeatable-erp
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

### ৩. এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগার করুন (`.env`)
রুট ডিরেক্টরিতে `.env` ফাইল তৈরি করুন:
```env
DATABASE_URL="mysql://root:password@localhost:3306/unbeatable_erp"
NEXT_PUBLIC_APP_NAME="Unbeatable Retail ERP"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### ৪. ডাটাবেস মাইগ্রেশন ও সীড ডাটা লোড করুন
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### ৫. ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`

---

## 🐳 ডকার প্রোডাকশন ডেপ্লয়মেন্ট (Docker Deployment)

সফটওয়্যারটি সরাসরি প্রোডাকশন ক্লাউড সার্ভার (AWS, DigitalOcean, Hetzner) অথবা শপের অন-প্রিমিসিস সেন্ট্রাল কম্পিউটারে এক কমান্ডেই রান করা যায়:

```bash
# প্রোডাকশন ডকার কন্টেইনার বিল্ড ও রান করুন
docker compose up -d --build
```
কন্টেইনারসমূহ ব্যাকগ্রাউন্ডে সক্রিয় হয়ে যাবে:
* **Next.js App Server**: `localhost:3000` (অভ্যন্তরীণ)
* **MySQL 8.0 Database**: `localhost:3306` (Persistent Named Volume)
* **Nginx Web Server**: `http://localhost:80` (Gzip কম্প্রেশন, SSL ও স্ট্যাটিক ক্যাশিং সহ)

---

## 👥 ইউজার রোল ও পারমিশন ম্যাট্রিক্স (RBAC Matrix)

| মডিউল / পেইজ | OWNER | ADMIN | MANAGER | CASHIER | STOCK KEEPER | ACCOUNTANT |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **পিওএস কাউন্টার (POS)** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **ইনভয়েস ও সেলস হিস্ট্রি** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **স্টক ও ইনভেন্টরি লেজার** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **ড্যামেজ ও অপচয় খাতা** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **ক্রয় চালান ও মহাজন হিসাব** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **এসএমএস মার্কেটিং ও ক্যাম্পেইন**| ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **ব্যাংক ও নগদ ক্যাশ বুক** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **এইচআর ও বেতন শিট** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **লাভ-ক্ষতি ও ভ্যাট রিটার্ন** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **সিস্টেম সেটিংস ও ব্রাঞ্চ** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔒 কোড কোয়ালিটি ও টাইপ সেফটি (Type Safety)

প্রোজেক্টের প্রতিটি কম্পোনেন্ট ও রাউট সম্পূর্ণ স্ট্রংলি টাইপড:
```bash
npm run typecheck
```
> **Output: Exit code 0 (০ টি এরর, ৪০+ টি রাউট ভ্যালিডেটেড)**

---

## 📄 লাইসেন্স (License)
এই সফটওয়্যারটি একটি প্রোপ্রাইটরি এবং কপিরাইট সংরক্ষিত এন্টারপ্রাইজ প্রোডাক্ট।

---
<p align="center">
  <b>Made with ❤️ for Bangladesh Retail & Superstore Innovation</b>
</p>
