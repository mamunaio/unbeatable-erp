# Retail Shop ERP — UI/UX Design Specification

## 1. Design goals

- দ্রুত এবং কম click-এ দৈনন্দিন retail operation সম্পন্ন করা
- Cashier-এর জন্য simple POS workflow
- Manager/owner-এর জন্য পরিষ্কার dashboard এবং actionable reports
- বাংলা ও ইংরেজি উভয় ভাষায় ব্যবহারযোগ্য interface
- Desktop-first কিন্তু tablet-responsive design
- Permission অনুযায়ী navigation এবং data visibility
- Consistent component, spacing, color এবং interaction pattern
- Low training requirement: নতুন user যেন দ্রুত system বুঝতে পারে

## 2. Design principles

### Speed first

বিশেষ করে POS screen-এ search, barcode scan, cart update এবং payment workflow সর্বনিম্ন সময়ে সম্পন্ন হতে হবে।

### Clarity over decoration

ERP interface-এ অতিরিক্ত visual decoration না রেখে data, status, action এবং warning স্পষ্টভাবে দেখানো হবে।

### Progressive disclosure

সাধারণ কাজের জন্য প্রয়োজনীয় field আগে দেখানো হবে। Advanced option expandable section বা secondary tab-এ থাকবে।

### Safe destructive actions

Delete, refund, return, stock adjustment এবং discount-এর মতো sensitive action-এ confirmation, permission এবং reason capture থাকবে।

### Consistency

একই ধরনের action, table, form, filter, status এবং feedback সব module-এ একইভাবে কাজ করবে।

## 3. Visual design direction

### Overall style

- Clean, professional এবং business-focused
- Light theme প্রথম release-এ
- Subtle border এবং moderate rounded corners
- Compact কিন্তু readable data tables
- Limited animation
- High contrast status এবং action buttons

### Recommended colors

| Purpose | Color direction |
|---|---|
| Primary | Deep blue বা indigo |
| Success | Green |
| Warning | Amber |
| Danger | Red |
| Information | Blue |
| Page background | Light neutral gray |
| Card background | White |
| Primary text | Dark slate |
| Secondary text | Muted slate |

Color শুধু status বোঝানোর একমাত্র মাধ্যম হবে না; label, icon বা text-ও ব্যবহার করতে হবে।

### Typography

- English: Inter বা equivalent sans-serif
- Bangla: Noto Sans Bengali বা equivalent readable font
- Page title: prominent কিন্তু compact
- Table text: readable এবং dense
- Numeric values: consistent tabular numeral style
- Currency ও totals: strong visual hierarchy

### Spacing and shape

- Consistent 4/8px spacing scale
- Form control height: desktop-এ approximately 40–44px
- Primary button height: approximately 40–44px
- Border radius: small-to-medium
- Focus state সব interactive element-এ দৃশ্যমান

## 4. Application shell

```text
┌──────────────────────────────────────────────┐
│ Logo │ Global Search │ Notifications │ User  │
├──────────────┬───────────────────────────────┤
│ Sidebar      │ Breadcrumb / Page Header       │
│              ├───────────────────────────────┤
│ Navigation   │ Main content                   │
│              │                               │
└──────────────┴───────────────────────────────┘
```

### Topbar

- Business/tenant name
- Current branch selector
- Global search
- Notification center
- Language switcher
- Help link
- User menu ও logout

### Sidebar

প্রস্তাবিত navigation:

- Dashboard
- POS
- Products
- Inventory
- Purchases
- Sales
- Customers
- Suppliers
- Accounting
- Employees
- Reports
- Branches
- Settings

যে module-এর permission নেই সেটি menu-তে দেখানো হবে না। Collapsible sidebar desktop-এ এবং drawer navigation tablet-এ থাকবে।

## 5. Dashboard design

### Layout

```text
Page header: Dashboard | Date range | Branch filter

┌──────────┬──────────┬──────────┬──────────┐
│ Sales    │ Profit   │ Orders   │ Due      │
├──────────┴──────────┴──────────┴──────────┤
│ Sales trend chart        │ Payment summary │
├──────────────────────────┼─────────────────┤
│ Low stock products       │ Recent sales    │
├──────────────────────────┴─────────────────┤
│ Top products / branch comparison           │
└────────────────────────────────────────────┘
```

### Dashboard widgets

- Today’s sales
- Today’s gross profit
- Order count
- Cash/card/mobile payment summary
- Customer due
- Supplier due
- Low-stock products
- Expiring products
- Recent sales
- Best-selling products
- Branch comparison

প্রতিটি metric-এর সঙ্গে date range, comparison এবং drill-down link থাকবে।

## 6. POS design

POS হবে আলাদা focused workspace যাতে admin sidebar কম prominent এবং selling workflow প্রধান থাকে।

```text
┌──────────────────────────────────────────────┐
│ Counter │ Cashier │ Shift │ Held Sales │ Menu │
├──────────────────────────┬───────────────────┤
│ Search / Barcode input    │ Customer selector │
├──────────────────────────┼───────────────────┤
│ Category filters          │ Cart              │
│ Product grid/list         │ Items             │
│                          │ Discount          │
│                          │ Tax               │
│                          │ Total             │
│                          │ Pay button        │
└──────────────────────────┴───────────────────┘
```

### POS behavior

- Barcode scanner input automatically focus করবে
- Search result keyboard দিয়ে navigate করা যাবে
- Product select করলে দ্রুত cart-এ যোগ হবে
- Cart সবসময় দৃশ্যমান থাকবে
- Quantity inline edit করা যাবে
- Product ও bill discount আলাদা দেখাতে হবে
- Tax, subtotal, discount, paid এবং due স্পষ্টভাবে দেখাতে হবে
- Pay button prominent হবে
- Cash, card, mobile এবং split payment modal-এ থাকবে
- Hold sale, return, exchange ও recent sales দ্রুত accessযোগ্য হবে
- Receipt preview এবং print action payment-এর পরে দেখানো হবে

### POS keyboard shortcuts

- `/` — product search focus
- `F2` — customer selection
- `F4` — hold sale
- `F6` — discount
- `F8` — payment
- `Esc` — modal close

Shortcutগুলো visible help menu-তে documented থাকবে এবং conflict হলে browser default override করা হবে না।

## 7. List/table page design

প্রতিটি list page-এ common structure থাকবে:

```text
Page title + primary action
Summary cards (optional)
Search + filters + date range
Bulk actions (permission-based)
Data table
Pagination
```

Table requirements:

- Sticky header যেখানে প্রয়োজন
- Sortable columns
- Column visibility option পরবর্তী phase-এ
- Empty state
- Loading skeleton
- Error state এবং retry action
- Mobile/tablet-এ responsive card বা horizontal scroll
- Row action permission অনুযায়ী প্রদর্শন

## 8. Product management screens

### Product list

Columns:

- Image
- Product name
- SKU/barcode
- Category/brand
- Stock
- Selling price
- Status
- Last updated
- Actions

### Product form tabs

- Basic information
- Pricing
- Inventory
- Variants
- Tax/VAT
- Images
- History

Form design rules:

- Required field-এ clear indicator
- Inline validation
- Unsaved changes warning
- Auto-generated SKU/barcode preview
- Archive action delete-এর চেয়ে বেশি prominent

## 9. Inventory design

Inventory overview-এ থাকবে:

- Current stock
- Available stock
- Reserved stock
- Low-stock status
- Warehouse/location
- Stock value

Inventory screens:

- Stock overview
- Stock movement
- Stock transfer
- Stock adjustment
- Physical count
- Expiry/batch list
- Reorder list

Stock adjustment form-এ reason, quantity, source location এবং approval requirement স্পষ্ট থাকবে।

## 10. Purchase design

Purchase workflow:

```text
Supplier → Purchase Order → Goods Received → Invoice → Payment
```

প্রতিটি stage status badge দিয়ে দেখানো হবে। Purchase detail page-এ items, received quantity, due amount, payment history এবং audit history থাকবে।

## 11. Sales, returns ও refunds design

- Sales list-এ invoice number, customer, cashier, branch, amount, payment status এবং date থাকবে
- Sale detail page-এ item-level return action permission অনুযায়ী থাকবে
- Return screen original invoice-এর সঙ্গে linked হবে
- Refund amount, method, reason এবং approver দেখাতে হবে
- Partial return এবং exchange আলাদা flow হিসেবে স্পষ্ট করতে হবে
- Refund complete হওয়ার আগে confirmation ও audit reason দরকার হবে

## 12. Customer ও supplier design

Profile page-এ summary header এবং tab structure ব্যবহার করা হবে:

- Overview
- Transactions
- Due/ledger
- Payments
- Notes
- Activity

Customer profile-এ purchase history, loyalty points, credit limit এবং outstanding due prominently দেখাতে হবে।

## 13. Reports design

Report page structure:

```text
Report title
Date / branch / category / user filters
Summary metrics
Chart or visualization
Detailed table
Export actions
```

প্রতিটি report-এ:

- Applied filter summary
- Last generated time
- Export to Excel/CSV/PDF
- Permission-based sensitive columns
- Clear definition of sales, cost, tax, return এবং profit

## 14. Forms, dialogs ও feedback

### Forms

- Logical sections
- Clear labels; placeholder-এর উপর নির্ভর করা যাবে না
- Field-level validation
- Server error summary
- Save এবং cancel action consistent location-এ

### Dialogs

- Short title
- Consequence explanation
- Primary action এবং cancel action
- Destructive action-এ danger styling
- Long form modal-এর বদলে dedicated page

### Feedback

- Success toast
- Inline validation error
- Warning banner
- Empty state guidance
- Loading skeleton
- Retry action
- Long-running export-এর জন্য progress/status

## 15. Responsive behavior

### Desktop

- Full sidebar
- Split-pane POS
- Multi-column dashboard
- Dense tables

### Tablet

- Collapsible sidebar
- POS দুই-column layout সম্ভব না হলে stacked layout
- Horizontal table scroll বা responsive card
- Touch-friendly controls

### Mobile

প্রথম MVP mobile POS-এর জন্য optimized হবে না, তবে:

- Dashboard এবং basic reports readable থাকবে
- Forms single-column হবে
- Sidebar drawer হবে
- Tables card view বা horizontal scroll ব্যবহার করবে

## 16. Accessibility

- Keyboard navigation
- Visible focus state
- Semantic headings
- Accessible labels
- Sufficient color contrast
- Color-independent status indicators
- Screen-reader-friendly form errors
- Touch target যথেষ্ট বড় রাখা

## 17. Localization ও Bangladesh conventions

- বাংলা/ইংরেজি toggle
- বাংলা product/customer data support
- BDT currency format
- Bangladesh timezone
- Configurable date format
- বাংলা invoice text support
- bKash/Nagad/Rocket payment labels
- VAT/tax labels configurable রাখা

## 18. Permission-aware UX

Permission শুধু backend-এ নয়, interface-এও প্রতিফলিত হবে:

- Unauthorized menu hide
- Unauthorized button hide বা disabled
- Sensitive amount/ledger data mask করা সম্ভব
- Refund, discount, stock adjustment-এ approval state
- Audit history read permission আলাদা

তবে UI-তে button hide করলেও backend authorization বাধ্যতামূলক থাকবে।

## 19. Important states to design

প্রতিটি screen-এর জন্য নিচের state আগে থেকে design করতে হবে:

- Initial loading
- Empty data
- Search no result
- Validation error
- Permission denied
- Network error
- Server error
- Unsaved changes
- Success confirmation
- Partial data বা pending integration

## 20. Design delivery order

### Phase 1 — Foundation

- Design tokens
- Typography
- Color system
- App shell
- Sidebar/topbar
- Buttons, inputs, table, modal, toast

### Phase 2 — Core screens

- Dashboard
- POS
- Product list/form
- Inventory overview
- Sales list/detail

### Phase 3 — Operations

- Purchase workflow
- Supplier/customer profile
- Returns/refunds
- Cashbook ও shift close

### Phase 4 — Reports ও administration

- Reports
- User/role management
- Branches
- Settings
- Subscription demo screens

## 21. Initial design decisions

- Primary visual direction: deep blue/indigo business UI
- Primary font direction: Inter + Noto Sans Bengali
- Theme: light theme first
- Layout: desktop-first responsive
- POS: focused split-pane interface
- Navigation: permission-aware sidebar
- Data-heavy screens: filterable tables
- Critical operations: confirmation, approval এবং audit feedback
- Design priority: Dashboard এবং POS প্রথমে
