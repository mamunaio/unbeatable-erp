# Retail Shop ERP — Technology Stack

## 1. Architecture decisions

- POS হবে browser-based responsive web application
- প্রথম version-এ online-first workflow থাকবে
- Offline POS প্রথম MVP-তে থাকবে না; পরবর্তী phase-এর জন্য architecture প্রস্তুত রাখা হবে
- প্রথম target market হবে Bangladesh
- SaaS subscription system-এর basic/demo structure শুরু থেকেই থাকবে
- Database হিসেবে সরাসরি MySQL ব্যবহার করা হবে
- MongoDB দিয়ে prototype করে পরে MySQL-এ migration করা হবে না
- Multi-tenant-ready design শুরু থেকেই রাখা হবে

## 2. Recommended stack summary

| Layer | Technology | Purpose |
|---|---|---|
| Web frontend | Next.js + TypeScript | POS, admin panel, reports ও public pages |
| UI | Tailwind CSS + shadcn/ui | Consistent, responsive ও accessible interface |
| Backend | Next.js server layer/API | Initial business APIs ও server-side workflows |
| ORM | Prisma ORM | Type-safe database access, relations ও migrations |
| Database | MySQL 8+ | Transactional ERP data |
| Authentication | Auth.js বা custom secure session layer | Login, session ও user access |
| Validation | Zod | API input ও form validation |
| Forms | React Hook Form | POS ও admin forms |
| State/query | TanStack Query | Server state, caching ও mutation handling |
| File storage | S3-compatible object storage | Product images, documents ও exports |
| Cache/queue | Redis | Later: caching, jobs, notifications ও offline sync |
| Reports | ExcelJS + PDF library | Excel/CSV/PDF export |
| Testing | Vitest + Playwright | Unit, integration ও end-to-end testing |
| Deployment | Docker + Linux VPS/managed cloud | Reproducible deployment |
| Monitoring | Structured logs + error tracking | Production diagnostics |

## 3. Frontend

### Next.js

Next.js ব্যবহার করা হবে POS, dashboard, inventory, purchase, reports এবং SaaS administration-এর জন্য। একই codebase-এ frontend এবং initial server-side API রাখা যাবে।

প্রধান requirements:

- Responsive desktop/tablet POS layout
- Fast product search এবং keyboard navigation
- Role-aware navigation
- Server-side pagination ও filtering
- বাংলা/ইংরেজি localization-এর প্রস্তুতি
- Print-friendly invoice ও receipt pages

### TypeScript

সব application code TypeScript-এ লেখা হবে। Product, sale, purchase, payment, stock movement এবং permission-এর shared type ব্যবহার করা হবে।

### Tailwind CSS + shadcn/ui

ERP-এর table, form, dialog, dropdown, tabs, toast, command search এবং dashboard component-এর জন্য ব্যবহার করা হবে। Design tokens দিয়ে brand color, spacing ও typography কেন্দ্রীয়ভাবে নিয়ন্ত্রণ করা হবে।

## 4. Backend ও application structure

প্রথমে Next.js-এর server layer/API ব্যবহার করা হবে। Business logic সরাসরি UI component-এর মধ্যে রাখা যাবে না।

প্রস্তাবিত layer:

```text
UI / Route Handler
        ↓
Application Service
        ↓
Domain Rules
        ↓
Prisma Repository
        ↓
MySQL
```

প্রধান service boundary:

- ProductService
- InventoryService
- SalesService
- PurchaseService
- PaymentService
- CustomerService
- SupplierService
- AccountingService
- ReportService
- SubscriptionService
- AuditLogService

Sales, returns, payments এবং stock movements-এর মতো critical operation database transaction-এর মধ্যে সম্পন্ন করতে হবে।

## 5. Database

### MySQL

MySQL ব্যবহার করা হবে কারণ ERP-এর মূল data relational এবং transaction-heavy:

- Product ও variant
- Category ও brand
- Purchase ও purchase items
- Sales ও sale items
- Stock movement
- Supplier/customer ledger
- Payments ও refunds
- Branch, warehouse, counter ও users
- Subscription ও tenant data

Database requirements:

- MySQL 8 বা compatible managed MySQL
- InnoDB storage engine
- Foreign key constraints
- Decimal type for money; floating-point নয়
- UTC timestamp storage এবং application-level timezone display
- Unique constraints for SKU, barcode ও document number
- Indexes for tenant, branch, date, status ও searchable fields
- Soft delete/archive যেখানে historical data বজায় রাখতে হবে

### Prisma ORM

Prisma ব্যবহার করা হবে:

- Type-safe query-এর জন্য
- Relation management-এর জন্য
- Schema এবং migration history-এর জন্য
- Transaction ও nested writes-এর জন্য
- Developer productivity-এর জন্য

Prisma schema-তে datasource provider হবে MySQL। MongoDB দিয়ে শুরু করা হবে না, কারণ MongoDB থেকে MySQL-এ গেলে schema, relation, query এবং data migration পুনর্লিখতে হবে।

## 6. Multi-tenant design

SaaS subscription আপাতত demo হলেও data model শুরু থেকেই tenant-aware হবে। প্রধান entities-এ প্রয়োজন অনুযায়ী `tenantId` থাকবে।

```text
Tenant
 ├── Subscription
 ├── Users / Roles
 ├── Branches
 ├── Warehouses
 ├── Products
 ├── Customers
 ├── Suppliers
 ├── Sales
 ├── Purchases
 └── Reports
```

প্রতিটি request-এ tenant context নির্ধারণ করে সব query-তে tenant scope enforce করতে হবে। Cross-tenant data access নিষিদ্ধ থাকবে।

## 7. Authentication ও authorization

- Secure session-based authentication
- Password hashing
- Role-based access control
- Granular permission matrix
- Tenant এবং branch scope
- Login/session audit
- Sensitive mutation-এর জন্য permission check
- Owner/manager-এর জন্য ভবিষ্যতে optional 2FA

প্রস্তাবিত roles:

- Owner
- Admin
- Manager
- Cashier
- Stock Keeper
- Accountant

## 8. Validation ও API conventions

Zod দিয়ে request body, query parameters এবং form data validate করা হবে।

API conventions:

- Consistent success/error response format
- Pagination-এর standard parameters
- Idempotency key for payment/refund-sensitive requests
- Server-side permission enforcement
- Input sanitization
- Structured validation errors
- API versioning প্রস্তুত রাখা

## 9. File storage ও documents

S3-compatible object storage ব্যবহার করা হবে:

- Product images
- Supplier/customer attachments
- Generated invoices
- Export files
- Optional staff documents

Database-এ file binary না রেখে object key, metadata এবং access information রাখা হবে। Private file-এর জন্য signed URL ব্যবহার করা হবে।

## 10. Payments ও Bangladesh integrations

প্রথম MVP-তে payment methods হিসেবে রাখা হবে:

- Cash
- Card
- Bank
- bKash/Nagad/Rocket manual reference entry

পরবর্তী phase-এ adapter-based integration রাখা হবে:

- bKash Merchant
- SSLCommerz
- Nagad/Rocket, subject to API availability
- SMS provider
- Email provider
- Pathao, RedX ও Steadfast

প্রতিটি external integration-এর জন্য credentials, webhook, retry, failure log এবং reconciliation status রাখা হবে।

## 11. POS strategy

প্রথম version-এর POS হবে browser-based এবং online-first।

MVP POS requirements:

- Barcode scanner keyboard input
- Fast product search
- Cart state
- Payment capture
- Receipt print
- Hold/resume sale
- Return/refund permission
- Cash drawer shift open/close

Offline POS প্রথম version-এ থাকবে না। ভবিষ্যতে offline support যোগ করতে হলে IndexedDB/local storage, sync queue, conflict resolution এবং idempotent transaction design প্রয়োজন হবে। তাই critical business service-গুলো এখন থেকেই এমনভাবে আলাদা রাখা হবে যাতে পরে sync layer যোগ করা যায়।

## 12. Reporting ও export

- SQL-backed report queries
- Date, tenant, branch, warehouse, product ও cashier filters
- ExcelJS দিয়ে Excel export
- CSV export
- PDF invoice ও report generation
- Large export-এর জন্য background job প্রস্তুতি

Money calculation application-এ decimal-safe হতে হবে এবং report-এর sales, return, discount, tax, cost ও profit definitions document করতে হবে।

## 13. Testing strategy

### Unit tests

- Pricing
- Discount
- Tax
- Stock calculation
- Return/refund rules
- Permission rules
- Subscription status

### Integration tests

- Sale transaction ও stock deduction
- Purchase receiving ও stock addition
- Return ও refund
- Split payment
- Tenant isolation
- Audit log

### End-to-end tests

- Login থেকে POS sale
- Product creation থেকে sale
- Purchase থেকে stock report
- Shift close report
- Role-based restricted action

## 14. Deployment ও environments

Environment আলাদা থাকবে:

- Local development
- Test/staging
- Production

Deployment requirements:

- Dockerized application
- Environment variables/secrets management
- Automated database backup
- Migration review before production
- Health check endpoint
- Error log ও uptime monitoring
- Restore procedure এবং periodic restore test

## 15. Suggested repository structure

```text
src/
  app/
  components/
  modules/
    products/
    inventory/
    sales/
    purchases/
    customers/
    suppliers/
    accounting/
    reports/
    subscriptions/
  server/
  lib/
  types/
  validations/
prisma/
  schema.prisma
  migrations/
tests/
  unit/
  integration/
  e2e/
```

## 16. Delivery stages

### Stage 1 — Foundation

Next.js, TypeScript, Tailwind, authentication, tenant model, MySQL, Prisma, base layout, roles এবং audit log।

### Stage 2 — Core retail

Product, category, brand, inventory, supplier, purchase, customer এবং browser POS।

### Stage 3 — Operations ও reports

Returns, refunds, shifts, cashbook, expenses, stock count, dashboard এবং exports।

### Stage 4 — SaaS demo

Tenant onboarding, demo subscription plan, feature limits, billing-status UI এবং tenant administration।

### Stage 5 — Advanced features

Multi-branch, offline POS, Redis jobs, mobile app, accounting expansion, payment gateway ও delivery integrations।

## 17. Explicitly postponed

- MongoDB prototype
- Offline POS in MVP
- Native Android/iOS app in MVP
- Full NBR/VAT compliance before legal/accounting validation
- Live payment gateway before credential এবং sandbox testing
- Complex custom report builder before core reports stabilize

## 18. Stack decision

প্রাথমিকভাবে final stack:

**Next.js + TypeScript + Tailwind CSS + shadcn/ui + Prisma + MySQL + Zod + React Hook Form + TanStack Query + Docker**

Redis, object storage, payment gateways, mobile app এবং offline sync প্রয়োজন অনুযায়ী পরবর্তী phase-এ যুক্ত হবে।
