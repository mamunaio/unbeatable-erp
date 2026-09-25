import { NextResponse } from "next/server";
import { processSaleReturn } from "@/services/returnService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.saleId || !body.items || body.items.length === 0 || !body.reason) {
      return NextResponse.json({ success: false, error: "Missing required return parameters" }, { status: 400 });
    }

    const result = await processSaleReturn({
      tenantId: body.tenantId || "demo-tenant",
      saleId: body.saleId,
      userId: body.userId || "admin@unbeatable.com",
      items: body.items,
      refundAmount: Number(body.refundAmount || 0),
      refundMethod: body.refundMethod || "CASH",
      reason: body.reason,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
