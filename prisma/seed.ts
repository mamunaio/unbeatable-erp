import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Unbeatable ERP master database...");

  // 1. Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: "unbeatable-store" },
    update: {},
    create: {
      id: "demo-tenant",
      name: "Unbeatable Super Store",
      slug: "unbeatable-store",
      phone: "+880 1700-000000",
      email: "owner@unbeatable.com",
      address: "House 12, Road 4, Dhanmondi, Dhaka, Bangladesh",
      currency: "BDT",
    },
  });

  // 2. Branch
  const branch = await prisma.branch.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: "DHAKA-MAIN" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Dhaka Main Branch",
      code: "DHAKA-MAIN",
      phone: "+880 1711-111111",
      address: "Dhanmondi, Dhaka",
      isMain: true,
    },
  });

  // 3. Counter
  const counter = await prisma.counter.upsert({
    where: { branchId_code: { branchId: branch.id, code: "POS-01" } },
    update: {},
    create: {
      tenantId: tenant.id,
      branchId: branch.id,
      name: "Main Counter 01",
      code: "POS-01",
    },
  });

  // 4. Admin User
  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "admin@unbeatable.com" } },
    update: {},
    create: {
      tenantId: tenant.id,
      branchId: branch.id,
      name: "Admin User",
      email: "admin@unbeatable.com",
      phone: "+880 1700-123456",
      passwordHash: "demo_hash_placeholder",
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  // 5. Units
  const unitsData = [
    { name: "Piece", symbol: "pcs" },
    { name: "Kilogram", symbol: "kg" },
    { name: "Litre", symbol: "ltr" },
    { name: "Box", symbol: "box" },
    { name: "Packet", symbol: "pkt" },
  ];

  const units: Record<string, string> = {};
  for (const u of unitsData) {
    const unit = await prisma.unit.upsert({
      where: { tenantId_symbol: { tenantId: tenant.id, symbol: u.symbol } },
      update: {},
      create: { tenantId: tenant.id, name: u.name, symbol: u.symbol },
    });
    units[u.symbol] = unit.id;
  }

  // 6. Categories
  const categoriesData = [
    { name: "Grocery", slug: "grocery" },
    { name: "Dairy", slug: "dairy" },
    { name: "Spices", slug: "spices" },
    { name: "Beverage", slug: "beverage" },
    { name: "Personal Care", slug: "personal-care" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: c.slug } },
      update: {},
      create: { tenantId: tenant.id, name: c.name, slug: c.slug },
    });
    categories[c.slug] = cat.id;
  }

  // 7. Brands
  const brandsData = [
    { name: "Pran", slug: "pran" },
    { name: "Radhuni", slug: "radhuni" },
    { name: "ACI", slug: "aci" },
    { name: "Aarong", slug: "aarong" },
    { name: "Unilever", slug: "unilever" },
    { name: "Dano", slug: "dano" },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: b.slug } },
      update: {},
      create: { tenantId: tenant.id, name: b.name, slug: b.slug },
    });
    brands[b.slug] = brand.id;
  }

  // 8. Products
  const products = [
    {
      name: "Miniket Rice 25kg",
      sku: "RICE-MIN-25",
      barcode: "89411001",
      categorySlug: "grocery",
      brandSlug: "pran",
      unitSymbol: "box",
      purchasePrice: 1650,
      sellingPrice: 1850,
      stock: 45,
      reorderPoint: 10,
    },
    {
      name: "Soyabean Oil 5 Litre",
      sku: "OIL-SOY-5L",
      barcode: "89411002",
      categorySlug: "grocery",
      brandSlug: "aci",
      unitSymbol: "ltr",
      purchasePrice: 760,
      sellingPrice: 820,
      stock: 30,
      reorderPoint: 15,
    },
    {
      name: "Aarong Milk 1 Litre",
      sku: "MILK-AAR-1L",
      barcode: "89411003",
      categorySlug: "dairy",
      brandSlug: "aarong",
      unitSymbol: "ltr",
      purchasePrice: 78,
      sellingPrice: 90,
      stock: 60,
      reorderPoint: 20,
    },
    {
      name: "Dano Milk Powder 1kg",
      sku: "MILK-DAN-1KG",
      barcode: "89411004",
      categorySlug: "dairy",
      brandSlug: "dano",
      unitSymbol: "pkt",
      purchasePrice: 780,
      sellingPrice: 840,
      stock: 15,
      reorderPoint: 10,
    },
    {
      name: "Radhuni Turmeric Powder 200g",
      sku: "RAD-TUR-200G",
      barcode: "89411005",
      categorySlug: "spices",
      brandSlug: "radhuni",
      unitSymbol: "pkt",
      purchasePrice: 92,
      sellingPrice: 110,
      stock: 50,
      reorderPoint: 15,
    },
    {
      name: "Ispahani Mirzapore Tea 400g",
      sku: "TEA-ISP-400G",
      barcode: "89411006",
      categorySlug: "beverage",
      brandSlug: "pran",
      unitSymbol: "pkt",
      purchasePrice: 195,
      sellingPrice: 220,
      stock: 40,
      reorderPoint: 12,
    },
    {
      name: "LUX Beauty Soap 100g",
      sku: "SOAP-LUX-100G",
      barcode: "89411007",
      categorySlug: "personal-care",
      brandSlug: "unilever",
      unitSymbol: "pcs",
      purchasePrice: 52,
      sellingPrice: 65,
      stock: 80,
      reorderPoint: 20,
    },
    {
      name: "Parachute Coconut Oil 200ml",
      sku: "OIL-PAR-200M",
      barcode: "89411008",
      categorySlug: "personal-care",
      brandSlug: "unilever",
      unitSymbol: "pcs",
      purchasePrice: 135,
      sellingPrice: 160,
      stock: 25,
      reorderPoint: 10,
    },
  ];

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const createdProd = await prisma.product.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: p.sku } },
      update: {
        stock: new Prisma.Decimal(p.stock),
        purchasePrice: new Prisma.Decimal(p.purchasePrice),
        sellingPrice: new Prisma.Decimal(p.sellingPrice),
      },
      create: {
        tenantId: tenant.id,
        name: p.name,
        slug,
        sku: p.sku,
        barcode: p.barcode,
        categoryId: categories[p.categorySlug],
        brandId: brands[p.brandSlug],
        unitId: units[p.unitSymbol],
        purchasePrice: new Prisma.Decimal(p.purchasePrice),
        sellingPrice: new Prisma.Decimal(p.sellingPrice),
        stock: new Prisma.Decimal(p.stock),
        reorderPoint: new Prisma.Decimal(p.reorderPoint),
      },
    });

    // Opening Stock Movement
    await prisma.stockMovement.create({
      data: {
        tenantId: tenant.id,
        productId: createdProd.id,
        type: "ADJUSTMENT",
        quantity: new Prisma.Decimal(p.stock),
        unitCost: new Prisma.Decimal(p.purchasePrice),
        reason: "Initial seeding opening stock",
        createdById: adminUser.id,
      },
    });
  }

  // 9. Demo Customer & Supplier
  await prisma.customer.upsert({
    where: { tenantId_phone: { tenantId: tenant.id, phone: "01700000000" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Walk-in Customer",
      phone: "01700000000",
      type: "WALK_IN",
    },
  });

  await prisma.customer.upsert({
    where: { tenantId_phone: { tenantId: tenant.id, phone: "01711223344" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Rahim Chowdhury",
      phone: "01711223344",
      type: "REGULAR",
      creditLimit: 5000,
      dueBalance: 1200,
      points: 85,
    },
  });

  await prisma.supplier.create({
    data: {
      tenantId: tenant.id,
      name: "Meghna Group of Industries",
      contactName: "Kamrul Hasan",
      phone: "01711000000",
      dueBalance: 0,
    },
  });

  // 10. Expense Categories
  const expenseCats = ["Utility", "Rent", "Entertainment", "Salary", "Maintenance"];
  for (const catName of expenseCats) {
    await prisma.expenseCategory.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: catName } },
      update: {},
      create: { tenantId: tenant.id, name: catName },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
