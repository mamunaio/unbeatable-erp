"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

type CourierPartner = "STEADFAST" | "PATHAO" | "REDX" | "PAPERFLY";
type ParcelStatus = "PENDING_PICKUP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED" | "PARTIAL_DELIVERED";

interface ParcelItem {
  id: string;
  consignmentId: string;
  invoiceNo: string;
  courier: CourierPartner;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  district: string;
  codAmount: number;
  deliveryFee: number;
  status: ParcelStatus;
  dispatchedAt: string;
  deliveredAt?: string;
  remittanceSettled: boolean;
  notes?: string;
  trackingHistory: { time: string; event: string; location: string }[];
}

const initialParcels: ParcelItem[] = [
  {
    id: "par-1",
    consignmentId: "ST-8921001",
    invoiceNo: "INV-2026-001",
    courier: "STEADFAST",
    recipientName: "Rafiqul Islam",
    recipientPhone: "01711223344",
    recipientAddress: "House 12, Road 4, Sector 7, Uttara",
    district: "Dhaka",
    codAmount: 2450,
    deliveryFee: 70,
    status: "DELIVERED",
    dispatchedAt: "2026-09-23T14:30:00",
    deliveredAt: "2026-09-24T17:15:00",
    remittanceSettled: true,
    trackingHistory: [
      { time: "2026-09-23 14:30", event: "Parcel Booked by Merchant", location: "Unbeatable ERP Store" },
      { time: "2026-09-23 18:00", event: "Picked up by Steadfast Rider", location: "Dhaka Hub" },
      { time: "2026-09-24 10:30", event: "Out for Delivery", location: "Uttara Delivery Hub" },
      { time: "2026-09-24 17:15", event: "Delivered & COD Collected", location: "Uttara, Dhaka" },
    ],
  },
  {
    id: "par-2",
    consignmentId: "PTH-992341",
    invoiceNo: "INV-2026-002",
    courier: "PATHAO",
    recipientName: "Sumaiya Akhter",
    recipientPhone: "01819876543",
    recipientAddress: "Agrabad C/A, Plot 45",
    district: "Chattogram",
    codAmount: 1850,
    deliveryFee: 130,
    status: "IN_TRANSIT",
    dispatchedAt: "2026-09-24T11:00:00",
    remittanceSettled: false,
    trackingHistory: [
      { time: "2026-09-24 11:00", event: "Parcel Manifest Created", location: "Dhaka Main Hub" },
      { time: "2026-09-24 22:00", event: "In Transit to Destination District", location: "Chittagong Sorting Facility" },
    ],
  },
  {
    id: "par-3",
    consignmentId: "RDX-554219",
    invoiceNo: "INV-2026-003",
    courier: "REDX",
    recipientName: "Tanvir Ahmed",
    recipientPhone: "01912345678",
    recipientAddress: "Zindabazar, Road 2",
    district: "Sylhet",
    codAmount: 3200,
    deliveryFee: 140,
    status: "OUT_FOR_DELIVERY",
    dispatchedAt: "2026-09-24T09:30:00",
    remittanceSettled: false,
    trackingHistory: [
      { time: "2026-09-24 09:30", event: "Pickup Completed", location: "Dhaka Central" },
      { time: "2026-09-25 08:00", event: "Arrived at Destination Hub", location: "Sylhet Hub" },
      { time: "2026-09-25 11:30", event: "Rider Out for Delivery", location: "Zindabazar" },
    ],
  },
  {
    id: "par-4",
    consignmentId: "ST-8921045",
    invoiceNo: "INV-2026-004",
    courier: "STEADFAST",
    recipientName: "Mahmud Hasan",
    recipientPhone: "01678112233",
    recipientAddress: "Shaheb Bazar, Ghoramara",
    district: "Rajshahi",
    codAmount: 950,
    deliveryFee: 130,
    status: "RETURNED",
    dispatchedAt: "2026-09-22T16:00:00",
    deliveredAt: "2026-09-25T14:00:00",
    remittanceSettled: false,
    notes: "Customer canceled due to delayed travel",
    trackingHistory: [
      { time: "2026-09-22 16:00", event: "Parcel Dispatched", location: "Dhaka Hub" },
      { time: "2026-09-24 15:00", event: "Delivery Attempt Failed - Customer unreachable", location: "Rajshahi Hub" },
      { time: "2026-09-25 14:00", event: "Return to Merchant Initiated", location: "Rajshahi Hub" },
    ],
  },
];

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<"PARCELS" | "REMITTANCE" | "SETTINGS">("PARCELS");
  const [parcels, setParcels] = useState<ParcelItem[]>(initialParcels);
  const [search, setSearch] = useState("");
  const [courierFilter, setCourierFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dispatch Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [newParcel, setNewParcel] = useState({
    invoiceNo: "",
    courier: "STEADFAST" as CourierPartner,
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    district: "Dhaka",
    codAmount: 1500,
    deliveryFee: 70,
    weightKg: 1,
    notes: "",
  });

  // Track Timeline Modal
  const [selectedParcel, setSelectedParcel] = useState<ParcelItem | null>(null);

  // Label Print Modal
  const [printParcel, setPrintParcel] = useState<ParcelItem | null>(null);

  // API Config State
  const [apiConfigs, setApiConfigs] = useState({
    steadfastApiKey: "",
    steadfastSecretKey: "",
    pathaoClientId: "",
    pathaoClientSecret: "",
    pathaoStoreId: "",
    redxToken: "",
    autoSyncWebhooks: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtering
  const filteredParcels = parcels.filter((p) => {
    const matchSearch =
      p.consignmentId.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      p.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      p.recipientPhone.includes(search) ||
      p.district.toLowerCase().includes(search.toLowerCase());

    const matchCourier = courierFilter === "ALL" || p.courier === courierFilter;
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchSearch && matchCourier && matchStatus;
  });

  // Statistics
  const totalParcelsCount = parcels.length;
  const deliveredCount = parcels.filter((p) => p.status === "DELIVERED").length;
  const inTransitCount = parcels.filter((p) => p.status === "IN_TRANSIT" || p.status === "OUT_FOR_DELIVERY" || p.status === "PENDING_PICKUP").length;
  const returnedCount = parcels.filter((p) => p.status === "RETURNED").length;
  const pendingRemittanceAmount = parcels
    .filter((p) => p.status === "DELIVERED" && !p.remittanceSettled)
    .reduce((acc, curr) => acc + (curr.codAmount - curr.deliveryFee), 0);
  const totalCodCollected = parcels
    .filter((p) => p.status === "DELIVERED")
    .reduce((acc, curr) => acc + curr.codAmount, 0);

  // Handle Create Dispatch
  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParcel.recipientName || !newParcel.recipientPhone || !newParcel.recipientAddress) {
      alert("অনুগ্রহ করে প্রাপকের নাম, ফোন এবং সম্পূর্ণ ঠিকানা প্রদান করুন!");
      return;
    }

    const prefix = newParcel.courier === "STEADFAST" ? "ST" : newParcel.courier === "PATHAO" ? "PTH" : "RDX";
    const newConsignmentId = `${prefix}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const created: ParcelItem = {
      id: `par-${Date.now()}`,
      consignmentId: newConsignmentId,
      invoiceNo: newParcel.invoiceNo || `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      courier: newParcel.courier,
      recipientName: newParcel.recipientName,
      recipientPhone: newParcel.recipientPhone,
      recipientAddress: newParcel.recipientAddress,
      district: newParcel.district,
      codAmount: Number(newParcel.codAmount),
      deliveryFee: Number(newParcel.deliveryFee),
      status: "PENDING_PICKUP",
      dispatchedAt: new Date().toISOString(),
      remittanceSettled: false,
      notes: newParcel.notes,
      trackingHistory: [
        { time: formatDate(new Date().toISOString()), event: "Parcel Booking Created in Unbeatable ERP", location: "Store Dispatch Counter" },
        { time: formatDate(new Date().toISOString()), event: `Consignment Generated via ${newParcel.courier} API`, location: "Courier Dispatch Gateway" },
      ],
    };

    setParcels([created, ...parcels]);
    setShowDispatchModal(false);
    setNewParcel({
      invoiceNo: "",
      courier: "STEADFAST",
      recipientName: "",
      recipientPhone: "",
      recipientAddress: "",
      district: "Dhaka",
      codAmount: 1500,
      deliveryFee: 70,
      weightKg: 1,
      notes: "",
    });
  };

  // Toggle Remittance
  const handleToggleRemittance = (parcelId: string) => {
    setParcels(
      parcels.map((p) => {
        if (p.id === parcelId) {
          return { ...p, remittanceSettled: !p.remittanceSettled };
        }
        return p;
      })
    );
  };

  // Export CSV
  const handleExportCsv = () => {
    exportToCsv({
      filename: "Courier_Logistics_Shipments_Report",
      headers: [
        { key: "consignmentId", label: "Consignment Tracking ID" },
        { key: "invoiceNo", label: "Invoice No" },
        { key: "courier", label: "Courier Partner" },
        { key: "recipientName", label: "Customer Name" },
        { key: "recipientPhone", label: "Customer Phone" },
        { key: "district", label: "Destination District" },
        { key: "recipientAddress", label: "Delivery Address" },
        { key: "codAmount", label: "COD Amount (BDT)" },
        { key: "deliveryFee", label: "Delivery Charge (BDT)" },
        { key: "status", label: "Delivery Status" },
        { key: "dispatchedAt", label: "Dispatch Date" },
        { key: "remittanceSettled", label: "Remittance Settled" },
      ],
      data: filteredParcels,
    });
  };

  const getStatusBadge = (status: ParcelStatus) => {
    switch (status) {
      case "DELIVERED":
        return <span className="badge badge-success">সফল ডেলিভার্ড (Delivered)</span>;
      case "IN_TRANSIT":
        return <span className="badge badge-primary">পথে রয়েছে (In Transit)</span>;
      case "OUT_FOR_DELIVERY":
        return <span className="badge badge-warning">ডেলিভারির জন্য বের হয়েছে</span>;
      case "PENDING_PICKUP":
        return <span className="badge badge-neutral">পিকআপ পেন্ডিং</span>;
      case "RETURNED":
        return <span className="badge badge-danger">রিটার্ন / ফেরত (Returned)</span>;
      case "PARTIAL_DELIVERED":
        return <span className="badge badge-warning">আংশিক ডেলিভারি</span>;
    }
  };

  const getCourierLogoBadge = (courier: CourierPartner) => {
    switch (courier) {
      case "STEADFAST":
        return (
          <span style={{ fontWeight: 800, color: "#2563eb", background: "#eff6ff", padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "1px solid #bfdbfe" }}>
            🚀 Steadfast
          </span>
        );
      case "PATHAO":
        return (
          <span style={{ fontWeight: 800, color: "#dc2626", background: "#fef2f2", padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "1px solid #fecaca" }}>
            🛵 Pathao
          </span>
        );
      case "REDX":
        return (
          <span style={{ fontWeight: 800, color: "#b91c1c", background: "#fff1f2", padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "1px solid #ffe4e6" }}>
            📦 RedX
          </span>
        );
      case "PAPERFLY":
        return (
          <span style={{ fontWeight: 800, color: "#4f46e5", background: "#eef2ff", padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "1px solid #c7d2fe" }}>
            🦋 Paperfly
          </span>
        );
    }
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>🚚 কুরিয়ার ও ডেলিভারি লজিস্টিকস হাব (Courier Integration)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Steadfast, Pathao ও RedX কুরিয়ার পার্সেল বুকিং, লাইভ ট্র্যাকিং, COD কালেকশন ও রেমিট্যান্স হিসেব।
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => setShowDispatchModal(true)} className="btn-primary">
            ＋ নতুন পার্সেল পাঠান (Dispatch)
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">মোট প্রেরিত পার্সেল</span>
          <div className="stat-card-value">{totalParcelsCount}টি</div>
          <div className="stat-card-sub">সব কুরিয়ার পার্টনার মিলিয়ে</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">ডেলিভারি প্রক্রিয়ায় আছে</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {inTransitCount}টি
          </div>
          <div className="stat-card-sub">পিকআপ / ট্রানজিট / ডেলিভারি রাইডার</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">সফল ডেলিভারি ও সিওডি</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {deliveredCount}টি
          </div>
          <div className="stat-card-sub">মোট সংগৃহীত: {formatCurrency(totalCodCollected)}</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">পেন্ডিং কুরিয়ার রেমিট্যান্স</span>
          <div className="stat-card-value" style={{ color: "var(--warning)" }}>
            {formatCurrency(pendingRemittanceAmount)}
          </div>
          <div className="stat-card-sub">দোকানের ব্যাংক/বিকাশে পাওয়ার অপেক্ষায়</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, borderBottom: "1px solid var(--border-color)", paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab("PARCELS")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "PARCELS" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "PARCELS" ? "#fff" : "var(--text-main)",
          }}
        >
          📦 পার্সেল তালিকা ও লাইভ ট্র্যাকিং ({filteredParcels.length})
        </button>

        <button
          onClick={() => setActiveTab("REMITTANCE")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "REMITTANCE" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "REMITTANCE" ? "#fff" : "var(--text-main)",
          }}
        >
          💰 সিওডি রেমিট্যান্স সেটেলমেন্ট (COD Reconciliation)
        </button>

        <button
          onClick={() => setActiveTab("SETTINGS")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "SETTINGS" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "SETTINGS" ? "#fff" : "var(--text-main)",
          }}
        >
          ⚙️ কুরিয়ার API ক্রেডেনশিয়াল ও ওয়েবহুক
        </button>
      </div>

      {/* TAB 1: PARCELS LIST */}
      {activeTab === "PARCELS" && (
        <div>
          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: 20, padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 কনসাইনমেন্ট ট্র্যাকিং আইডি, ইনভয়েস, কাস্টমার নাম বা ফোন দিয়ে খুঁজুন..."
                style={{
                  padding: "9px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                  fontSize: 13,
                }}
              />

              <select
                value={courierFilter}
                onChange={(e) => setCourierFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <option value="ALL">সকল কুরিয়ার (All Couriers)</option>
                <option value="STEADFAST">Steadfast Courier</option>
                <option value="PATHAO">Pathao Courier</option>
                <option value="REDX">RedX Delivery</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <option value="ALL">সকল স্ট্যাটাস (All Status)</option>
                <option value="PENDING_PICKUP">পিকআপ পেন্ডিং</option>
                <option value="IN_TRANSIT">পথে রয়েছে (In Transit)</option>
                <option value="OUT_FOR_DELIVERY">আউট ফর ডেলিভারি</option>
                <option value="DELIVERED">সফল ডেলিভার্ড</option>
                <option value="RETURNED">রিটার্ন / ফেরত</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>কনসাইনমেন্ট ট্র্যাকিং নং</th>
                  <th>কুরিয়ার পার্টনার</th>
                  <th>প্রাপক (Customer)</th>
                  <th>গন্তব্য জেলা ও ঠিকানা</th>
                  <th>সিওডি (COD) কালেকশন</th>
                  <th>ডেলিভারি চার্জ</th>
                  <th>স্ট্যাটাস</th>
                  <th style={{ textAlign: "right" }}>একশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ fontFamily: "monospace", color: "var(--primary-dark)", fontSize: 13, display: "block" }}>
                        {p.consignmentId}
                      </strong>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Inv: {p.invoiceNo}</span>
                    </td>
                    <td>{getCourierLogoBadge(p.courier)}</td>
                    <td>
                      <strong>{p.recipientName}</strong>
                      <span style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
                        📞 {p.recipientPhone}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                        {p.district}
                      </span>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.recipientAddress}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: 14, color: "var(--primary)" }}>{formatCurrency(p.codAmount)}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatCurrency(p.deliveryFee)}</span>
                    </td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setSelectedParcel(p)}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="লাইভ ট্র্যাকিং টাইমলাইন দেখুন"
                        >
                          🛰️ Track
                        </button>
                        <button
                          onClick={() => setPrintParcel(p)}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="শিপিং লেবেল প্রিন্ট করুন"
                        >
                          🏷️ Label
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REMITTANCE SETTLEMENT */}
      {activeTab === "REMITTANCE" && (
        <div>
          <div className="card" style={{ marginBottom: 20, background: "var(--bg-subtle)", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🏦 কুরিয়ার সিওডি ক্যাশ রেমিট্যান্স সেটেলমেন্ট</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              কুরিয়ার কোম্পানিগুলো ডেলিভার্ড পার্সেলের সংগৃহীত টাকা আপনার ব্যাংক বা বিকাশ অ্যাকাউন্টে ট্রান্সফার করলে তা এখানে সেটেল্ড হিসেবে মার্ক করুন।
            </p>
          </div>

          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>কনসাইনমেন্ট নং</th>
                  <th>কুরিয়ার</th>
                  <th>ইনভয়েস</th>
                  <th>কাস্টমার</th>
                  <th>মোট সিওডি</th>
                  <th>ডেলিভারি ফি</th>
                  <th>দোকানের প্রাপ্য নিট টাকা</th>
                  <th>সেটেলমেন্ট স্ট্যাটাস</th>
                  <th style={{ textAlign: "right" }}>একশন</th>
                </tr>
              </thead>
              <tbody>
                {parcels
                  .filter((p) => p.status === "DELIVERED")
                  .map((p) => {
                    const netPayout = p.codAmount - p.deliveryFee;
                    return (
                      <tr key={p.id}>
                        <td>
                          <strong style={{ fontFamily: "monospace" }}>{p.consignmentId}</strong>
                        </td>
                        <td>{getCourierLogoBadge(p.courier)}</td>
                        <td>{p.invoiceNo}</td>
                        <td>{p.recipientName}</td>
                        <td>{formatCurrency(p.codAmount)}</td>
                        <td style={{ color: "var(--danger)" }}>-{formatCurrency(p.deliveryFee)}</td>
                        <td>
                          <strong style={{ color: "var(--success)", fontSize: 14 }}>{formatCurrency(netPayout)}</strong>
                        </td>
                        <td>
                          {p.remittanceSettled ? (
                            <span className="badge badge-success">✓ অ্যাকাউন্টে জমা হয়েছে</span>
                          ) : (
                            <span className="badge badge-warning">⏳ পেমেন্ট বকেয়া রয়েছে</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => handleToggleRemittance(p.id)}
                            className={p.remittanceSettled ? "btn-secondary" : "btn-primary"}
                            style={{ padding: "5px 12px", fontSize: 12 }}
                          >
                            {p.remittanceSettled ? "Mark as Unpaid" : "✓ Mark Received"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: API CONFIGURATION */}
      {activeTab === "SETTINGS" && (
        <div style={{ maxWidth: 850 }}>
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>🔑 কুরিয়ার API ইন্টিগ্রেশন ক্রেডেনশিয়ালস</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
              Steadfast, Pathao এবং RedX মার্চেন্ট প্যানেল থেকে আপনার গোপন API কী এখানে সংরক্ষণ করুন।
            </p>

            {saveSuccess && (
              <div style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success)", borderRadius: 6, color: "var(--success)", marginBottom: 16, fontWeight: 600, fontSize: 13 }}>
                ✓ কুরিয়ার API ক্রেডেনশিয়াল সফলভাবে সংরক্ষণ করা হয়েছে!
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Steadfast */}
              <div style={{ padding: 16, border: "1px solid #bfdbfe", background: "#f8faff", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e40af" }}>🚀 Steadfast Courier API</h3>
                  <span className="badge badge-success">Live Connected</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>API Key</label>
                    <input
                      value={apiConfigs.steadfastApiKey}
                      onChange={(e) => setApiConfigs({ ...apiConfigs, steadfastApiKey: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Secret Key</label>
                    <input
                      type="password"
                      value={apiConfigs.steadfastSecretKey}
                      onChange={(e) => setApiConfigs({ ...apiConfigs, steadfastSecretKey: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              {/* Pathao */}
              <div style={{ padding: 16, border: "1px solid #fecaca", background: "#fffafa", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#991b1b" }}>🛵 Pathao Courier API</h3>
                  <span className="badge badge-success">Live Connected</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Client ID</label>
                    <input
                      value={apiConfigs.pathaoClientId}
                      onChange={(e) => setApiConfigs({ ...apiConfigs, pathaoClientId: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Client Secret</label>
                    <input
                      type="password"
                      value={apiConfigs.pathaoClientSecret}
                      onChange={(e) => setApiConfigs({ ...apiConfigs, pathaoClientSecret: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Store ID</label>
                    <input
                      value={apiConfigs.pathaoStoreId}
                      onChange={(e) => setApiConfigs({ ...apiConfigs, pathaoStoreId: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              {/* RedX */}
              <div style={{ padding: 16, border: "1px solid #ffe4e6", background: "#fffbfb", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#9f1239" }}>📦 RedX Logistics API</h3>
                  <span className="badge badge-success">Live Connected</span>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>API Access Token</label>
                  <input
                    value={apiConfigs.redxToken}
                    onChange={(e) => setApiConfigs({ ...apiConfigs, redxToken: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: 12 }}
                  />
                </div>
              </div>

              {/* Webhook & Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    id="webhookSync"
                    checked={apiConfigs.autoSyncWebhooks}
                    onChange={(e) => setApiConfigs({ ...apiConfigs, autoSyncWebhooks: e.target.checked })}
                  />
                  <label htmlFor="webhookSync" style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Enable Automated Webhook Status Syncing (24/7 লাইভ সিঙ্ক)
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="btn-primary"
                >
                  💾 ক্রেডেনশিয়াল সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NEW DISPATCH BOOKING */}
      {showDispatchModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 560 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>🚚 নতুন কুরিয়ার পার্সেল বুকিং (Dispatch Booking)</h2>
              <button onClick={() => setShowDispatchModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>কুরিয়ার পার্টনার নির্বাচন করুন *</label>
                  <select
                    value={newParcel.courier}
                    onChange={(e) => setNewParcel({ ...newParcel, courier: e.target.value as CourierPartner })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  >
                    <option value="STEADFAST">🚀 Steadfast Courier</option>
                    <option value="PATHAO">🛵 Pathao Courier</option>
                    <option value="REDX">📦 RedX Delivery</option>
                    <option value="PAPERFLY">🦋 Paperfly</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ইনভয়েস নম্বর (Optional)</label>
                  <input
                    placeholder="যেমন: INV-2026-005"
                    value={newParcel.invoiceNo}
                    onChange={(e) => setNewParcel({ ...newParcel, invoiceNo: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>প্রাপক / কাস্টমার নাম *</label>
                  <input
                    required
                    placeholder="যেমন: জনাব আরিফুল হক"
                    value={newParcel.recipientName}
                    onChange={(e) => setNewParcel({ ...newParcel, recipientName: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মোবাইল নম্বর *</label>
                  <input
                    required
                    placeholder="017XXXXXXXX"
                    value={newParcel.recipientPhone}
                    onChange={(e) => setNewParcel({ ...newParcel, recipientPhone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>জেলা (District) *</label>
                  <select
                    value={newParcel.district}
                    onChange={(e) => setNewParcel({ ...newParcel, district: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barishal">Barishal (বরিশাল)</option>
                    <option value="Rangpur">Rangpur (রংপুর)</option>
                    <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                    <option value="Gazipur">Gazipur (গাজীপুর)</option>
                    <option value="Narayanganj">Narayanganj (নারায়ণগঞ্জ)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>সম্পূর্ণ ঠিকানা *</label>
                  <input
                    required
                    placeholder="রোড, বাড়ি, এলাকা বা ইউনিয়ন"
                    value={newParcel.recipientAddress}
                    onChange={(e) => setNewParcel({ ...newParcel, recipientAddress: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>সিওডি (COD) টাকা *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newParcel.codAmount}
                    onChange={(e) => setNewParcel({ ...newParcel, codAmount: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ডেলিভারি ফি (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={newParcel.deliveryFee}
                    onChange={(e) => setNewParcel({ ...newParcel, deliveryFee: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ওজন (Weight kg)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newParcel.weightKg}
                    onChange={(e) => setNewParcel({ ...newParcel, weightKg: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ডেলিভারি নোট / নির্দেশিকা</label>
                <input
                  placeholder="যেমন: ডেলিভারির আগে ফোন দিবেন, কাঁচের পণ্য সাবধানে রাখবেন"
                  value={newParcel.notes}
                  onChange={(e) => setNewParcel({ ...newParcel, notes: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowDispatchModal(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  🚀 কুরিয়ার পার্সেল তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LIVE TIMELINE TRACKER */}
      {selectedParcel && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800 }}>🛰️ লাইভ পার্সেল ট্র্যাকিং</h2>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--primary)" }}>
                  {selectedParcel.consignmentId} ({selectedParcel.courier})
                </span>
              </div>
              <button onClick={() => setSelectedParcel(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ background: "var(--bg-subtle)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>প্রাপক: <strong>{selectedParcel.recipientName}</strong></span>
                <span>সিওডি: <strong style={{ color: "var(--primary)" }}>{formatCurrency(selectedParcel.codAmount)}</strong></span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                ঠিকানা: {selectedParcel.recipientAddress}, {selectedParcel.district}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, borderLeft: "2px solid var(--primary-light)", paddingLeft: 16, marginLeft: 8 }}>
              {selectedParcel.trackingHistory.map((item, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: -23,
                      top: 2,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: idx === selectedParcel.trackingHistory.length - 1 ? "var(--primary)" : "var(--border-color)",
                      border: "2px solid #fff",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>{item.time}</span>
                  <strong style={{ fontSize: 13, color: "var(--text-main)", display: "block" }}>{item.event}</strong>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>📍 {item.location}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => setSelectedParcel(null)} className="btn-secondary">
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SHIPPING STICKER PRINT PREVIEW */}
      {printParcel && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 420, padding: 24, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>🏷️ 4×6 কুরিয়ার শিপিং স্টিকার</h3>
              <button onClick={() => setPrintParcel(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            {/* Thermal Label Card */}
            <div
              style={{
                border: "2px solid #000",
                padding: 16,
                borderRadius: 4,
                fontFamily: "monospace",
                background: "#fff",
                color: "#000",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #000", paddingBottom: 8, marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 16, display: "block" }}>UNBEATABLE ERP</strong>
                  <span style={{ fontSize: 11 }}>MERCHANT DISPATCH</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: 14 }}>{printParcel.courier}</strong>
                </div>
              </div>

              <div style={{ textAlign: "center", margin: "10px 0", padding: "8px 0", borderBottom: "1px dashed #000" }}>
                <div style={{ fontSize: 24, letterSpacing: 4, fontWeight: 900 }}>||| || ||| |||| ||</div>
                <strong style={{ fontSize: 14 }}>{printParcel.consignmentId}</strong>
                <div style={{ fontSize: 11 }}>Invoice: {printParcel.invoiceNo}</div>
              </div>

              <div style={{ borderBottom: "1px solid #000", paddingBottom: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, display: "block" }}>SHIP TO / প্রাপক:</span>
                <strong style={{ fontSize: 13, display: "block" }}>{printParcel.recipientName}</strong>
                <div style={{ fontSize: 12 }}>📞 {printParcel.recipientPhone}</div>
                <div style={{ fontSize: 11, marginTop: 2 }}>{printParcel.recipientAddress}, {printParcel.district}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f1f1", padding: 8, borderRadius: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800 }}>CASH ON DELIVERY (COD):</span>
                <strong style={{ fontSize: 16 }}>{formatCurrency(printParcel.codAmount)}</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button onClick={() => setPrintParcel(null)} className="btn-secondary">
                বন্ধ করুন
              </button>
              <button onClick={() => window.print()} className="btn-primary">
                🖨️ প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
