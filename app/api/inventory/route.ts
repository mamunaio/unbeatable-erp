import { NextResponse } from "next/server";
import { getStockMovements, getInventorySummary, createStockAdjustment } from "@/services/inventoryService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || "demo-tenant";
    const type = searchParams.get("type");

    if (type === "summary") {
      const summary = await getInventorySummary(tenantId);
      return NextResponse.json({ success: true, data: summary });
    }

    const movements = await getStockMovements(tenantId);
    return NextResponse.json({ success: true, data: movements });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createStockAdjustment(body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
