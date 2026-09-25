import { NextResponse } from "next/server";
import { recordCustomerDuePayment } from "@/services/customerService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerId || !body.amount) {
      return NextResponse.json({ success: false, error: "Missing customerId or amount" }, { status: 400 });
    }

    const result = await recordCustomerDuePayment({
      tenantId: body.tenantId || "demo-tenant",
      customerId: body.customerId,
      amount: Number(body.amount),
      method: body.method || "CASH",
      referenceNo: body.referenceNo || null,
      notes: body.notes || null,
      userId: body.userId || "admin@unbeatable.com",
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
