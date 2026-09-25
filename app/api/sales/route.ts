import { NextResponse } from "next/server";
import { createSale, getSales } from "@/services/salesService";
import { createSaleSchema } from "@/validations/sale";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || "demo-tenant";
    const sales = await getSales(tenantId);
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSaleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const sale = await createSale(parsed.data);
    return NextResponse.json({ success: true, data: sale }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
