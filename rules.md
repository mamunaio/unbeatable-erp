# Retail Shop ERP — Business & System Rules

এই ডকুমেন্টে ERP-এর সকল গুরুত্বপূর্ণ business rule, data rule, permission rule এবং operational constraint সংজ্ঞায়িত করা হয়েছে। Backend, database, POS এবং reports—সব layer-এ এই নিয়ম প্রযোজ্য হবে।

## 1. General rules

1. প্রতিটি business transaction-এর সঙ্গে tenant, branch, user এবং timestamp সংরক্ষণ করতে হবে।
2. Historical transaction সরাসরি delete করা যাবে না। প্রয়োজনে void, cancel, reverse বা archive status ব্যবহার করতে হবে।
3. প্রতিটি গুরুত্বপূর্ণ পরিবর্তনের audit log থাকতে হবে।
4. Money value floating-point দিয়ে সংরক্ষণ করা যাবে না; decimal precision ব্যবহার করতে হবে।
5. Server-side validation ছাড়া কোনো গুরুত্বপূর্ণ data mutation গ্রহণ করা যাবে না।
6. UI-তে action hide করলেও backend permission check বাধ্যতামূলক।
7. System-এর সব timestamp UTC-তে সংরক্ষণ করে Bangladesh timezone-এ display করা হবে।
8. Document number যেমন invoice, purchase, return ও payment number unique হতে হবে।

## 2. Tenant ও business rules

1. প্রতিটি business একটি আলাদা tenant হিসেবে গণ্য হবে।
2. কোনো tenant অন্য tenant-এর data দেখতে বা পরিবর্তন করতে পারবে না।
3. Tenant-scoped entity-তে tenant context বাধ্যতামূলক।
4. Tenant-এর branch, warehouse, counter, user এবং settings আলাদা scope-এ থাকবে।
5. Tenant inactive/suspended হলে নতুন sales, purchases এবং sensitive mutations বন্ধ থাকবে।
6. Read-only access প্রয়োজনে tenant status অনুযায়ী সীমিত রাখা যাবে।
7. Demo subscription-এ feature limit থাকলে backend এবং UI—দুই layer-এই limit enforce করতে হবে।

## 3. User, role ও permission rules

1. প্রতিটি user একটি tenant-এর অন্তর্ভুক্ত হবে।
2. User-এর এক বা একাধিক role থাকতে পারে।
3. Permission resource এবং action ভিত্তিক হবে: view, create, update, delete/archive, approve, export এবং manage।
4. User কেবল অনুমোদিত branch-এর data দেখতে পারবে।
5. Owner সব business configuration পরিচালনা করতে পারবে।
6. Cashier সাধারণত product view, POS sale এবং নিজের shift পরিচালনা করবে।
7. Cashier অনুমোদন ছাড়া price change, high discount, refund বা stock adjustment করতে পারবে না।
8. Stock Keeper inventory, transfer এবং stock count পরিচালনা করতে পারবে; financial data সীমিত থাকবে।
9. Manager operational approval এবং branch-level report দেখতে পারবে।
10. Role পরিবর্তন, permission পরিবর্তন এবং user deactivation audit log-এ থাকতে হবে।
11. শেষ active Owner-কে delete বা deactivate করা যাবে না।

## 4. Product ও catalog rules

1. Product name, unit, selling price এবং status বাধ্যতামূলক।
2. SKU tenant-এর মধ্যে unique হতে হবে।
3. Barcode tenant-এর মধ্যে unique হতে হবে, যদি barcode ব্যবহৃত হয়।
4. Product archive করলে নতুন sale/purchase-এ selectable হবে না; পুরনো transaction-এ history থাকবে।
5. Historical transaction-এর product name, SKU বা price পরে পরিবর্তন হলেও transaction snapshot অক্ষুণ্ণ থাকবে।
6. Variant থাকলে stock এবং price variant-level-এ track করতে হবে।
7. Bundle product-এর component quantity এবং availability সংরক্ষণ করতে হবে।
8. Bundle sale হলে component stock কমবে; bundle return হলে configured return rule অনুযায়ী component stock ফেরত যাবে।
9. Purchase price, selling price, MRP, wholesale price এবং tax price-এর meaning আলাদা রাখতে হবে।
10. Product import-এ duplicate SKU/barcode, invalid unit, invalid price এবং missing required field reject বা review queue-তে যাবে।

## 5. Price, discount ও tax rules

1. Selling price negative হতে পারবে না।
2. Discount percentage 0–100-এর মধ্যে হতে হবে।
3. Flat discount subtotal-এর বেশি হতে পারবে না।
4. Product discount এবং invoice discount আলাদা line item হিসেবে সংরক্ষণ করতে হবে।
5. Discount-এর আগে ও পরে subtotal report-এ আলাদা দেখাতে হবে।
6. Price override কেবল অনুমোদিত role করতে পারবে।
7. Discount threshold অতিক্রম করলে manager approval প্রয়োজন হবে।
8. Tax-inclusive এবং tax-exclusive price configuration tenant-level-এ নির্ধারিত হবে।
9. Tax rate transaction-এর সময় snapshot হবে; পরবর্তী tax configuration পরিবর্তনে পুরনো invoice বদলাবে না।
10. Rounding rule সর্বত্র একই হতে হবে এবং invoice-এ rounding adjustment প্রয়োজনে দেখাতে হবে।

## 6. Inventory ও stock rules

1. Stock balance সরাসরি edit করা যাবে না; stock movement বা approved adjustment-এর মাধ্যমে পরিবর্তন করতে হবে।
2. Sale completed হলে available stock কমবে।
3. Purchase received হলে available stock বাড়বে।
4. Cancelled বা draft transaction stock পরিবর্তন করবে না।
5. Return approved হলে configured condition অনুযায়ী stock বাড়বে বা damaged stock-এ যাবে।
6. Damage, theft, wastage এবং correction-এর adjustment reason বাধ্যতামূলক।
7. Negative stock defaultভাবে নিষিদ্ধ থাকবে। Owner-level setting দিয়ে অনুমোদিত হলে প্রতিটি negative movement audit হবে।
8. Stock transfer-এর source location-এ পর্যাপ্ত stock থাকতে হবে।
9. Transfer sent এবং transfer received আলাদা status হতে পারে। Received না হওয়া পর্যন্ত destination available stock-এ যোগ হবে না।
10. Physical count variance adjustment করার আগে count sheet এবং approver সংরক্ষণ করতে হবে।
11. Batch/lot ব্যবহার করলে stock movement-এ batch reference থাকতে হবে।
12. Expired batch defaultভাবে sale-এ selectable হবে না।
13. Low-stock alert available stock বনাম reorder point-এর ভিত্তিতে তৈরি হবে।
14. Stock valuation method tenant-level-এ নির্ধারিত হবে এবং accounting period-এর মধ্যে পরিবর্তন সীমিত থাকবে।
15. Inventory report এবং stock ledger-এর total একই transaction source থেকে গণনা হতে হবে।

## 7. POS ও sales rules

1. Sale সম্পন্ন করার আগে cart-এ অন্তত একটি valid item থাকতে হবে।
2. Product price, quantity, discount, tax এবং payment server-side পুনরায় হিসাব করতে হবে।
3. Client-side total কখনো authoritative হবে না।
4. Sale number unique হতে হবে।
5. Payment total invoice grand total-এর সঙ্গে মিলতে হবে, যদি due বা overpayment policy প্রযোজ্য না থাকে।
6. Split payment-এর payment total grand total-এর সমান হতে হবে।
7. Payment method এবং reference number প্রযোজ্য ক্ষেত্রে বাধ্যতামূলক।
8. Hold sale stock reserve করবে কি না—tenant setting দ্বারা নির্ধারিত হবে।
9. Held sale-এর status active, resumed, converted বা cancelled হতে পারে।
10. Shift open না থাকলে cashier sale করতে পারবে না।
11. Shift close-এর সময় expected cash এবং actual cash variance সংরক্ষণ করতে হবে।
12. Sale complete হওয়ার পর original invoice সরাসরি edit করা যাবে না।
13. ভুল সংশোধনে return, refund, void বা reversal workflow ব্যবহার করতে হবে।
14. Receipt reprint audit log-এ থাকতে হবে।
15. Duplicate payment request idempotency key দ্বারা প্রতিরোধ করতে হবে।

## 8. Sales return, exchange ও refund rules

1. Return সাধারণত original sale invoice-এর সঙ্গে linked হবে।
2. Returned quantity original sold quantity-এর বেশি হতে পারবে না।
3. Partial return সমর্থিত হবে।
4. Return window tenant policy অনুযায়ী নির্ধারিত হবে।
5. Returnable এবং non-returnable product policy থাকতে পারে।
6. Returned item condition: resellable, damaged বা expired হিসেবে চিহ্নিত করতে হবে।
7. Resellable item available stock-এ ফেরত যাবে।
8. Damaged/expired item available stock-এ যোগ হবে না।
9. Refund original payment method-এ বা configured alternative method-এ হতে পারে; reason থাকতে হবে।
10. Refund, exchange এবং return approval permission-based হবে।
11. Refund amount return item, discount, tax এবং prior payment অনুযায়ী server-side হিসাব হবে।

## 9. Purchase ও supplier rules

1. Purchase order draft, submitted, approved, partially received, received, cancelled এবং closed status রাখতে পারে।
2. Purchase order তৈরি করলে stock বাড়বে না।
3. Goods received হলে received quantity অনুযায়ী stock বাড়বে।
4. Received quantity ordered quantity-এর বেশি হলে approval বা over-receive policy প্রয়োজন হবে।
5. Purchase invoice এবং GRN-এর relation থাকতে হবে।
6. Purchase return received stock-এর বেশি হতে পারবে না।
7. Supplier payment supplier ledger-এ post হবে।
8. Supplier opening balance আলাদা opening transaction হিসেবে থাকবে।
9. Purchase cost change হলে inventory valuation এবং profit calculation policy অনুযায়ী update হবে।
10. Purchase cancellation-এর আগে linked payment, GRN এবং return status যাচাই করতে হবে।

## 10. Customer ও credit rules

1. Customer profile-এ unique phone/email policy tenant setting দ্বারা নির্ধারিত হবে।
2. Walk-in customer ব্যবহার করা যাবে; তার জন্য পূর্ণ profile বাধ্যতামূলক নয়।
3. Credit sale কেবল customer এবং credit permission থাকলে করা যাবে।
4. Customer credit limit অতিক্রম করলে approval দরকার হবে।
5. Customer due invoice, payment, return এবং adjustment দিয়ে হিসাব হবে।
6. Customer payment invoice বা account balance-এর সঙ্গে allocate করতে হবে।
7. Loyalty points completed এবং eligible sale-এর পরেই যোগ হবে।
8. Return/refund হলে সংশ্লিষ্ট loyalty points reverse হবে।
9. Customer archive করলে পুরনো transaction history থাকবে।

## 11. Cash, payment ও shift rules

1. Cashier sale করার আগে shift open করতে হবে।
2. Opening cash amount সংরক্ষণ করতে হবে।
3. Cash-in ও cash-out-এর reason বাধ্যতামূলক।
4. Shift close-এর সময় cash sales, cash-in, cash-out, refund এবং opening cash দিয়ে expected cash হিসাব হবে।
5. Actual cash এবং expected cash variance আলাদা দেখাতে হবে।
6. Shift close করার পর সাধারণত নতুন transaction করা যাবে না।
7. Shift reopen কেবল manager/owner permission-এ এবং reason সহ করা যাবে।
8. Non-cash payment-এর reference বা provider status প্রযোজ্য ক্ষেত্রে সংরক্ষণ করতে হবে।
9. Payment reversal এবং refund payment audit trail-এ থাকতে হবে।

## 12. Accounting rules

1. Sale, purchase, return, refund, payment, expense এবং stock adjustment-এর accounting impact সংজ্ঞায়িত থাকতে হবে।
2. Posted accounting transaction সরাসরি delete করা যাবে না।
3. Correction reversal বা adjustment entry দিয়ে করতে হবে।
4. Accounting period close হলে সাধারণ user পুরনো period পরিবর্তন করতে পারবে না।
5. Opening balance আলাদা source হিসেবে চিহ্নিত হবে।
6. Accounts receivable এবং payable customer/supplier ledger-এর সঙ্গে reconcile করতে হবে।
7. Profit report-এর revenue, cost, discount, tax, return এবং expense definition documented থাকতে হবে।
8. VAT/tax report-এর জন্য transaction tax snapshot সংরক্ষণ করতে হবে।
9. NBR-compliant reporting চালুর আগে qualified accounting/legal validation প্রয়োজন।

## 13. Reporting rules

1. Report user-এর tenant এবং branch scope মেনে data দেখাবে।
2. Report filter applied হলে filter summary export-এ থাকবে।
3. Dashboard metric এবং detailed report একই calculation rule ব্যবহার করবে।
4. Cancelled, void এবং draft transaction defaultভাবে report থেকে বাদ যাবে।
5. Return এবং refund sales report-এ আলাদা বা net basis—report definition অনুযায়ী দেখাতে হবে।
6. Profit report cost method এবং date basis স্পষ্টভাবে দেখাবে।
7. Sensitive financial report export করার জন্য permission প্রয়োজন হবে।
8. Large report asynchronous export হতে পারে এবং user-কে status দেখাতে হবে।

## 14. Branch ও warehouse rules

1. Branch এবং warehouse আলাদা entity হবে।
2. একটি branch-এর একাধিক warehouse এবং counter থাকতে পারে।
3. Sale transaction counter ও branch scope-এ হবে।
4. Stock movement source এবং destination location স্পষ্ট হতে হবে।
5. Branch user কেবল অনুমোদিত branch-এর operational data দেখবে।
6. Central user সব branch দেখলেও mutation permission আলাদা হবে।
7. Branch deactivate করলে নতুন transaction বন্ধ হবে; historical report থাকবে।

## 15. Audit ও security rules

1. Login, logout, failed login, password change এবং permission change log করতে হবে।
2. Create, update, archive, approve, refund, export এবং configuration change audit করতে হবে।
3. Audit log immutable হবে; সাধারণ user এটি edit/delete করতে পারবে না।
4. Audit record-এ actor, action, entity, entity ID, timestamp, before/after summary এবং reason থাকতে হবে।
5. Sensitive data log-এ plaintext credential বা full payment secret রাখা যাবে না।
6. Session expiry এবং secure logout থাকতে হবে।
7. Password কখনো plaintext সংরক্ষণ করা যাবে না।
8. External integration credential encrypted বা secret manager-এ রাখতে হবে।
9. Backup encrypted এবং access-controlled হবে।
10. Restore operation অনুমোদিত administrator-এর মধ্যে সীমিত থাকবে।

## 16. SaaS subscription demo rules

1. Tenant-এর subscription status active, trial, past_due, suspended বা cancelled হতে পারে।
2. Demo mode-এ real billing হবে না।
3. Feature limit যেমন users, branches, products বা monthly transactions configurable হবে।
4. Limit অতিক্রম করলে নতুন create action বন্ধ বা upgrade prompt দেখাতে হবে; পুরনো data delete করা যাবে না।
5. Subscription status change audit log-এ থাকবে।
6. Future billing integration-এর জন্য plan, entitlement এবং subscription status আলাদা entity হিসেবে রাখা হবে।

## 17. Import/export rules

1. Import-এর আগে template এবং required column documentation দিতে হবে।
2. Import transaction atomic অথবা row-level result সহ হতে হবে।
3. Invalid row-এর error reason দেখাতে হবে।
4. Duplicate handling policy আগে নির্ধারিত থাকবে: reject, update বা skip।
5. Export user-এর permission এবং tenant scope মেনে হবে।
6. Export file-এ generated time, filter এবং branch scope উল্লেখ থাকবে।

## 18. Notification rules

1. Low stock, expiry, payment due, failed integration এবং approval request notification event তৈরি করতে পারবে।
2. Notification in-app হবে; SMS/email/push optional channel হিসেবে থাকবে।
3. একই event-এর duplicate notification control করতে হবে।
4. Notification preference user বা tenant level-এ configurable হতে পারে।
5. Sensitive customer বা financial data notification message-এ সীমিত রাখতে হবে।

## 19. Integration rules

1. External API call adapter/service layer-এর মাধ্যমে হবে।
2. API credential tenant-specific এবং encrypted হবে।
3. Timeout, retry এবং failure status সংরক্ষণ করতে হবে।
4. Webhook signature verify না করে কোনো payment/order update গ্রহণ করা যাবে না।
5. Duplicate webhook idempotency দ্বারা প্রতিরোধ করতে হবে।
6. Integration failure হলেও local transaction-এর final state অস্পষ্ট রাখা যাবে না; pending/retry state ব্যবহার করতে হবে।

## 20. Offline POS future rules

1. Offline mode MVP-তে সক্রিয় থাকবে না।
2. Future offline transaction local queue-তে unique client ID সহ সংরক্ষণ করতে হবে।
3. Sync-এর সময় duplicate sale প্রতিরোধ করতে হবে।
4. Price, tax, stock এবং customer credit conflict-এর জন্য explicit resolution policy দরকার হবে।
5. Offline transaction sync না হওয়া পর্যন্ত reporting status আলাদা থাকবে।

## 21. Data retention ও lifecycle

1. Transactional history archive করা যেতে পারে; silently delete করা যাবে না।
2. Product, customer, supplier ও user deactivation soft status-এর মাধ্যমে হবে।
3. Audit log retention tenant/legal policy অনুযায়ী নির্ধারিত হবে।
4. Backup retention এবং restore point policy লিখিত থাকতে হবে।
5. Tenant deletion হলে export, confirmation এবং retention policy অনুসরণ করতে হবে।

## 22. Rule enforcement priority

Business rule enforce করার priority:

1. Database constraints
2. Backend/domain service validation
3. API authorization
4. Frontend validation ও user guidance
5. Reports ও audit verification

Frontend validation user experience উন্নত করবে, কিন্তু backend এবং database validation-এর বিকল্প হবে না।
