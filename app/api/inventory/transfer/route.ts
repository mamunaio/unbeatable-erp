import { NextResponse } from "next/server";
import { createStockTransfer } from "@/services/transferService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: "At least one item required" }, { status: 400 });
    }

    const transferNo = body.transferNo || `TRF-${Date.now().toString().slice(-6)}`;
    const result = await createStockTransfer({
      tenantId: body.tenantId || "demo-tenant",
      sourceWarehouseId: body.sourceWarehouseId || null,
      destinationWarehouseId: body.destinationWarehouseId || null,
      userId: body.userId || "admin@unbeatable.com",
      transferNo,
      items: body.items,
      notes: body.notes || null,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
