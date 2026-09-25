"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCsv } from "@/lib/export";

type AttendanceStatus = "PRESENT" | "LATE" | "LEAVE" | "ABSENT" | "HALF_DAY";
type StaffRole = "MANAGER" | "CASHIER" | "SALES_EXECUTIVE" | "STOCK_KEEPER" | "ACCOUNTANT";

interface StaffMember {
  id: string;
  employeeCode: string;
  name: string;
  phone: string;
  role: StaffRole;
  shift: "MORNING" | "EVENING" | "GENERAL";
  basicSalary: number;
  commissionPercent: number;
  monthlySalesTarget: number;
  actualSalesMonth: number;
  joiningDate: string;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
}

interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  employeeCode: string;
  role: StaffRole;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workHours: number;
  notes?: string;
}

const initialStaff: StaffMember[] = [
  {
    id: "st-1",
    employeeCode: "EMP-001",
    name: "Mohammad Tanvir Hossain",
    phone: "01711-223344",
    role: "MANAGER",
    shift: "GENERAL",
    basicSalary: 35000,
    commissionPercent: 0.5,
    monthlySalesTarget: 500000,
    actualSalesMonth: 480000,
    joiningDate: "2024-01-15",
    status: "ACTIVE",
  },
  {
    id: "st-2",
    employeeCode: "EMP-002",
    name: "Nusrat Jahan",
    phone: "01819-876543",
    role: "CASHIER",
    shift: "MORNING",
    basicSalary: 20000,
    commissionPercent: 1.0,
    monthlySalesTarget: 250000,
    actualSalesMonth: 285400,
    joiningDate: "2024-06-01",
    status: "ACTIVE",
  },
  {
    id: "st-3",
    employeeCode: "EMP-003",
    name: "Arifur Rahman",
    phone: "01912-345678",
    role: "SALES_EXECUTIVE",
    shift: "EVENING",
    basicSalary: 18000,
    commissionPercent: 2.0,
    monthlySalesTarget: 200000,
    actualSalesMonth: 240000,
    joiningDate: "2025-02-10",
    status: "ACTIVE",
  },
  {
    id: "st-4",
    employeeCode: "EMP-004",
    name: "Kamrul Hasan",
    phone: "01678-998877",
    role: "STOCK_KEEPER",
    shift: "GENERAL",
    basicSalary: 16000,
    commissionPercent: 0.0,
    monthlySalesTarget: 0,
    actualSalesMonth: 0,
    joiningDate: "2025-05-15",
    status: "ACTIVE",
  },
];

const initialAttendance: AttendanceRecord[] = [
  { id: "att-1", staffId: "st-1", staffName: "Mohammad Tanvir Hossain", employeeCode: "EMP-001", role: "MANAGER", date: "2026-09-25", checkIn: "08:55 AM", checkOut: "--", status: "PRESENT", workHours: 8.5 },
  { id: "att-2", staffId: "st-2", staffName: "Nusrat Jahan", employeeCode: "EMP-002", role: "CASHIER", date: "2026-09-25", checkIn: "09:20 AM", checkOut: "--", status: "LATE", workHours: 7.5, notes: "ট্রাফিক জ্যামের কারণে ২০ মিনিট দেরি" },
  { id: "att-3", staffId: "st-3", staffName: "Arifur Rahman", employeeCode: "EMP-003", role: "SALES_EXECUTIVE", date: "2026-09-25", checkIn: "01:00 PM", checkOut: "--", status: "PRESENT", workHours: 8.0 },
  { id: "att-4", staffId: "st-4", staffName: "Kamrul Hasan", employeeCode: "EMP-004", role: "STOCK_KEEPER", date: "2026-09-25", checkIn: "--", checkOut: "--", status: "LEAVE", workHours: 0, notes: "অসুস্থতাজনিত অনুমোদিত ছুটি" },
];

export default function HRManagementPage() {
  const [activeTab, setActiveTab] = useState<"STAFF" | "ATTENDANCE" | "COMMISSION" | "PAYROLL">("STAFF");
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(initialAttendance);
  const [search, setSearch] = useState("");

  // New Staff Modal State
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    phone: "",
    role: "SALES_EXECUTIVE" as StaffRole,
    shift: "GENERAL" as "MORNING" | "EVENING" | "GENERAL",
    basicSalary: 18000,
    commissionPercent: 1.5,
    monthlySalesTarget: 200000,
  });

  // Pay Slip Print Modal
  const [selectedPaySlip, setSelectedPaySlip] = useState<{
    staff: StaffMember;
    commission: number;
    totalPayable: number;
  } | null>(null);

  // Quick Attendance Status Toggle
  const handleUpdateAttendance = (staffId: string, newStatus: AttendanceStatus) => {
    setAttendanceList((prev) =>
      prev.map((rec) => {
        if (rec.staffId === staffId) {
          return {
            ...rec,
            status: newStatus,
            checkIn: newStatus === "PRESENT" ? "09:00 AM" : newStatus === "LATE" ? "09:30 AM" : "--",
            workHours: newStatus === "PRESENT" ? 8 : newStatus === "LATE" ? 7.5 : 0,
          };
        }
        return rec;
      })
    );
  };

  // Add New Staff Member
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.phone) {
      alert("অনুগ্রহ করে কর্মচারীর নাম এবং মোবাইল নম্বর দিন!");
      return;
    }

    const created: StaffMember = {
      id: `st-${Date.now()}`,
      employeeCode: `EMP-00${staffList.length + 1}`,
      name: newStaff.name,
      phone: newStaff.phone,
      role: newStaff.role,
      shift: newStaff.shift,
      basicSalary: Number(newStaff.basicSalary),
      commissionPercent: Number(newStaff.commissionPercent),
      monthlySalesTarget: Number(newStaff.monthlySalesTarget),
      actualSalesMonth: 0,
      joiningDate: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    };

    setStaffList([...staffList, created]);
    setAttendanceList([
      ...attendanceList,
      {
        id: `att-${Date.now()}`,
        staffId: created.id,
        staffName: created.name,
        employeeCode: created.employeeCode,
        role: created.role,
        date: "2026-09-25",
        status: "PRESENT",
        checkIn: "09:00 AM",
        workHours: 8,
      },
    ]);
    setShowStaffModal(false);
    setNewStaff({
      name: "",
      phone: "",
      role: "SALES_EXECUTIVE",
      shift: "GENERAL",
      basicSalary: 18000,
      commissionPercent: 1.5,
      monthlySalesTarget: 200000,
    });
  };

  // Export CSV
  const handleExportCsv = () => {
    if (activeTab === "STAFF") {
      exportToCsv({
        filename: "Staff_Employees_Directory",
        headers: [
          { key: "employeeCode", label: "Employee Code" },
          { key: "name", label: "Full Name" },
          { key: "phone", label: "Phone" },
          { key: "role", label: "Role" },
          { key: "shift", label: "Assigned Shift" },
          { key: "basicSalary", label: "Basic Salary (BDT)" },
          { key: "commissionPercent", label: "Sales Commission %" },
          { key: "status", label: "Status" },
        ],
        data: staffList,
      });
    } else if (activeTab === "ATTENDANCE") {
      exportToCsv({
        filename: "Daily_Attendance_Sheet_2026_09_25",
        headers: [
          { key: "employeeCode", label: "EMP Code" },
          { key: "staffName", label: "Name" },
          { key: "role", label: "Role" },
          { key: "date", label: "Date" },
          { key: "checkIn", label: "Check In" },
          { key: "status", label: "Attendance Status" },
          { key: "workHours", label: "Total Hours" },
        ],
        data: attendanceList,
      });
    } else {
      const payrollData = staffList.map((s) => {
        const commission = (s.actualSalesMonth * s.commissionPercent) / 100;
        return {
          employeeCode: s.employeeCode,
          name: s.name,
          role: s.role,
          basicSalary: s.basicSalary,
          actualSalesMonth: s.actualSalesMonth,
          commission,
          netSalary: s.basicSalary + commission,
        };
      });
      exportToCsv({
        filename: "Monthly_Staff_Payroll_Statement",
        headers: [
          { key: "employeeCode", label: "EMP Code" },
          { key: "name", label: "Staff Name" },
          { key: "role", label: "Designation" },
          { key: "basicSalary", label: "Basic Salary (BDT)" },
          { key: "actualSalesMonth", label: "Sales Achieved (BDT)" },
          { key: "commission", label: "Commission Earned (BDT)" },
          { key: "netSalary", label: "Total Net Payable (BDT)" },
        ],
        data: payrollData,
      });
    }
  };

  // Metrics Calculation
  const totalStaffCount = staffList.length;
  const presentCount = attendanceList.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
  const totalMonthlyCommission = staffList.reduce(
    (acc, curr) => acc + (curr.actualSalesMonth * curr.commissionPercent) / 100,
    0
  );
  const totalNetPayroll =
    staffList.reduce((acc, curr) => acc + curr.basicSalary, 0) + totalMonthlyCommission;

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>👔 মানবসম্পদ ও কর্মচারী ব্যবস্থাপনা (HR & Staff Management)</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            দৈনিক হাজিরা, সেলস টার্গেট ও কমিশন ট্র্যাকিং, শিফট রোস্টার এবং মাসিক পে-রোল শীট।
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCsv} className="btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => setShowStaffModal(true)} className="btn-primary">
            ＋ নতুন কর্মচারী যুক্ত করুন
          </button>
        </div>
      </div>

      {/* Top HR Metrics */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-card-title">মোট সক্রিয় কর্মচারী</span>
          <div className="stat-card-value">{totalStaffCount} জন</div>
          <div className="stat-card-sub">ম্যানেজার, ক্যাশিয়ার ও সেলস স্টাফ</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">আজকের উপস্থিতি (Attendance)</span>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {presentCount} / {totalStaffCount} জন
          </div>
          <div className="stat-card-sub">উপস্থিতি হার: {Math.round((presentCount / totalStaffCount) * 100)}%</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">চলতি মাসের সেলস কমিশন</span>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {formatCurrency(totalMonthlyCommission)}
          </div>
          <div className="stat-card-sub">POS সেলসের উপর অর্জিত প্রণোদনা</div>
        </div>

        <div className="stat-card">
          <span className="stat-card-title">সর্বমোট প্রদেয় বেতন (Net Payroll)</span>
          <div className="stat-card-value" style={{ color: "var(--primary-dark)" }}>
            {formatCurrency(totalNetPayroll)}
          </div>
          <div className="stat-card-sub">মূল বেতন + সেলস কমিশন</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "1px solid var(--border-color)", paddingBottom: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("STAFF")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "STAFF" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "STAFF" ? "#fff" : "var(--text-main)",
          }}
        >
          👥 কর্মচারী তালিকা ও প্রোফাইল
        </button>

        <button
          onClick={() => setActiveTab("ATTENDANCE")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "ATTENDANCE" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "ATTENDANCE" ? "#fff" : "var(--text-main)",
          }}
        >
          🕒 দৈনিক হাজিরা ও শিফট ট্র্যাকার (Attendance Log)
        </button>

        <button
          onClick={() => setActiveTab("COMMISSION")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "COMMISSION" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "COMMISSION" ? "#fff" : "var(--text-main)",
          }}
        >
          🎯 সেলস টার্গেট ও কমিশন ইঞ্জিন
        </button>

        <button
          onClick={() => setActiveTab("PAYROLL")}
          style={{
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            border: "none",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            background: activeTab === "PAYROLL" ? "var(--primary)" : "var(--bg-subtle)",
            color: activeTab === "PAYROLL" ? "#fff" : "var(--text-main)",
          }}
        >
          💵 মাসিক পে-রোল ও পে-স্লিপ
        </button>
      </div>

      {/* TAB 1: STAFF DIRECTORY */}
      {activeTab === "STAFF" && (
        <div>
          <div className="card" style={{ marginBottom: 20, padding: 12 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 কর্মচারীর নাম, কোড (EMP-001) বা পদবি দিয়ে খুঁজুন..."
              style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", outline: "none", fontSize: 13 }}
            />
          </div>

          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>এমপ্লয়ি কোড</th>
                  <th>নাম ও মোবাইল</th>
                  <th>পদবি / রোল</th>
                  <th>শিফট</th>
                  <th>মূল বেতন</th>
                  <th>সেলস কমিশন হার</th>
                  <th>যোগদানের তারিখ</th>
                  <th>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="badge badge-neutral" style={{ fontFamily: "monospace", fontWeight: 700 }}>
                        {s.employeeCode}
                      </span>
                    </td>
                    <td>
                      <strong>{s.name}</strong>
                      <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>📞 {s.phone}</span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{s.role}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{s.shift} SHIFT</span>
                    </td>
                    <td>
                      <strong>{formatCurrency(s.basicSalary)}</strong>
                    </td>
                    <td>
                      {s.commissionPercent > 0 ? (
                        <span className="badge badge-success">{s.commissionPercent}% on sales</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>N/A</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(s.joiningDate)}</td>
                    <td>
                      <span className="badge badge-success">{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE TRACKER */}
      {activeTab === "ATTENDANCE" && (
        <div>
          <div className="card" style={{ marginBottom: 20, background: "var(--bg-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>📅 আজকের উপস্থিতি শিট: {formatDate("2026-09-25")}</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>স্টাফদের চেক-ইন ও ছুটি স্ট্যাটাস পরিচালনা করুন।</span>
              </div>
              <span className="badge badge-primary">Dhaka Counter 01</span>
            </div>
          </div>

          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>কর্মচারী</th>
                  <th>পদবি</th>
                  <th>প্রবেশ সময় (In)</th>
                  <th>প্রস্থান সময় (Out)</th>
                  <th>কাজের সময়</th>
                  <th>হাজিরা স্ট্যাটাস</th>
                  <th>নোট / কারণ</th>
                  <th style={{ textAlign: "right" }}>একশন</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((att) => (
                  <tr key={att.id}>
                    <td>
                      <strong>{att.staffName}</strong>
                      <span style={{ fontSize: 11, fontFamily: "monospace", display: "block", color: "var(--text-muted)" }}>{att.employeeCode}</span>
                    </td>
                    <td><span className="badge badge-neutral">{att.role}</span></td>
                    <td><strong style={{ color: "var(--primary-dark)" }}>{att.checkIn}</strong></td>
                    <td style={{ color: "var(--text-muted)" }}>{att.checkOut}</td>
                    <td><strong>{att.workHours} ঘণ্টা</strong></td>
                    <td>
                      <span
                        className={`badge ${
                          att.status === "PRESENT"
                            ? "badge-success"
                            : att.status === "LATE"
                            ? "badge-warning"
                            : att.status === "LEAVE"
                            ? "badge-neutral"
                            : "badge-danger"
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{att.notes || "--"}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 4 }}>
                        <button
                          onClick={() => handleUpdateAttendance(att.staffId, "PRESENT")}
                          className="btn-secondary"
                          style={{ padding: "3px 7px", fontSize: 11, color: "var(--success)" }}
                          title="উপস্থিত মার্ক করুন"
                        >
                          ✓ Present
                        </button>
                        <button
                          onClick={() => handleUpdateAttendance(att.staffId, "LATE")}
                          className="btn-secondary"
                          style={{ padding: "3px 7px", fontSize: 11, color: "var(--warning)" }}
                          title="দেরি মার্ক করুন"
                        >
                          ⏳ Late
                        </button>
                        <button
                          onClick={() => handleUpdateAttendance(att.staffId, "LEAVE")}
                          className="btn-secondary"
                          style={{ padding: "3px 7px", fontSize: 11, color: "var(--text-muted)" }}
                          title="ছুটি মার্ক করুন"
                        >
                          🏖️ Leave
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

      {/* TAB 3: COMMISSION & SALES TARGET */}
      {activeTab === "COMMISSION" && (
        <div>
          <div className="card" style={{ marginBottom: 20, background: "var(--bg-subtle)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🎯 সেলস কমিশন ও টার্গেট অগ্রগতি (Sales Commission Engine)</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              POS কাউন্টারের বিক্রয় ভলিউমের উপর ভিত্তি করে কর্মচারীদের স্বয়ংক্রিয় কমিশন হিসাব।
            </p>
          </div>

          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>কর্মচারী</th>
                  <th>পদবি</th>
                  <th>মাসিক সেলস টার্গেট</th>
                  <th>অর্জিত বিক্রয় (POS Sales)</th>
                  <th>টার্গেট পূরণ (%)</th>
                  <th>কমিশন রেট</th>
                  <th>অর্জিত মোট কমিশন</th>
                  <th>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => {
                  const percent = s.monthlySalesTarget > 0 ? Math.min(100, Math.round((s.actualSalesMonth / s.monthlySalesTarget) * 100)) : 0;
                  const earnedCommission = (s.actualSalesMonth * s.commissionPercent) / 100;
                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <span style={{ fontSize: 11, fontFamily: "monospace", display: "block", color: "var(--text-muted)" }}>{s.employeeCode}</span>
                      </td>
                      <td><span className="badge badge-neutral">{s.role}</span></td>
                      <td>{s.monthlySalesTarget > 0 ? formatCurrency(s.monthlySalesTarget) : "--"}</td>
                      <td>
                        <strong style={{ color: "var(--text-main)" }}>{formatCurrency(s.actualSalesMonth)}</strong>
                      </td>
                      <td style={{ minWidth: 140 }}>
                        {s.monthlySalesTarget > 0 ? (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                              <span>{percent}%</span>
                              <span>{s.actualSalesMonth >= s.monthlySalesTarget ? "✓ পূরণ হয়েছে" : "চলমান"}</span>
                            </div>
                            <div style={{ width: "100%", height: 6, background: "var(--border-color)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${percent}%`, height: "100%", background: percent >= 100 ? "var(--success)" : "var(--primary)" }} />
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>টার্গেট প্রযোজ্য নয়</span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontWeight: 700 }}>{s.commissionPercent}%</span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--success)", fontSize: 15 }}>{formatCurrency(earnedCommission)}</strong>
                      </td>
                      <td>
                        <span className="badge badge-success">Accrued to Payroll</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MONTHLY PAYROLL */}
      {activeTab === "PAYROLL" && (
        <div>
          <div className="card" style={{ marginBottom: 20, background: "var(--bg-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800 }}>💵 মাসিক পে-রোল বিবরণী (Payroll Statement: September 2026)</h2>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>মূল বেতন, সেলস কমিশন এবং চূড়ান্ত প্রদেয় অর্থ।</span>
              </div>
              <strong style={{ fontSize: 18, color: "var(--primary)" }}>
                মোট প্রদেয়: {formatCurrency(totalNetPayroll)}
              </strong>
            </div>
          </div>

          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>কর্মচারী</th>
                  <th>পদবি</th>
                  <th>মূল বেতন</th>
                  <th>সেলস কমিশন</th>
                  <th>বোনাস / ওভারটাইম</th>
                  <th>চূড়ান্ত নিট বেতন</th>
                  <th>পেমেন্ট স্ট্যাটাস</th>
                  <th style={{ textAlign: "right" }}>একশন</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => {
                  const comm = (s.actualSalesMonth * s.commissionPercent) / 100;
                  const net = s.basicSalary + comm;
                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.name}</strong>
                        <span style={{ fontSize: 11, fontFamily: "monospace", display: "block", color: "var(--text-muted)" }}>{s.employeeCode}</span>
                      </td>
                      <td><span className="badge badge-neutral">{s.role}</span></td>
                      <td>{formatCurrency(s.basicSalary)}</td>
                      <td style={{ color: "var(--success)" }}>+{formatCurrency(comm)}</td>
                      <td>৳ 0</td>
                      <td>
                        <strong style={{ fontSize: 15, color: "var(--primary-dark)" }}>{formatCurrency(net)}</strong>
                      </td>
                      <td>
                        <span className="badge badge-warning">Ready for Payout</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => setSelectedPaySlip({ staff: s, commission: comm, totalPayable: net })}
                          className="btn-secondary"
                          style={{ padding: "4px 10px", fontSize: 12 }}
                        >
                          📄 Pay Slip
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

      {/* MODAL 1: ADD STAFF */}
      {showStaffModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>👥 নতুন কর্মচারী যুক্ত করুন (Staff Registration)</h2>
              <button onClick={() => setShowStaffModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>কর্মচারীর পুরো নাম *</label>
                <input
                  required
                  placeholder="যেমন: মো: কামরুল হাসান"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মোবাইল নম্বর *</label>
                  <input
                    required
                    placeholder="017XXXXXXXX"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>পদবি / রোল *</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffRole })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 600 }}
                  >
                    <option value="SALES_EXECUTIVE">Sales Executive (বিক্রয়কর্মী)</option>
                    <option value="CASHIER">Cashier (ক্যাশিয়ার)</option>
                    <option value="MANAGER">Branch Manager (ম্যানেজার)</option>
                    <option value="STOCK_KEEPER">Stock Keeper (স্টক ইনচার্জ)</option>
                    <option value="ACCOUNTANT">Accountant (হিসাবরক্ষক)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মাসিক মূল বেতন (BDT) *</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newStaff.basicSalary}
                    onChange={(e) => setNewStaff({ ...newStaff, basicSalary: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)", fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>শিফট রোস্টার</label>
                  <select
                    value={newStaff.shift}
                    onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value as any })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  >
                    <option value="GENERAL">General Shift (09:00 AM - 06:00 PM)</option>
                    <option value="MORNING">Morning Shift (08:00 AM - 04:00 PM)</option>
                    <option value="EVENING">Evening Shift (02:00 PM - 10:00 PM)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>সেলস কমিশন হার (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newStaff.commissionPercent}
                    onChange={(e) => setNewStaff({ ...newStaff, commissionPercent: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>মাসিক সেলস টার্গেট (BDT)</label>
                  <input
                    type="number"
                    min="0"
                    value={newStaff.monthlySalesTarget}
                    onChange={(e) => setNewStaff({ ...newStaff, monthlySalesTarget: Number(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowStaffModal(false)} className="btn-secondary">
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE PAY SLIP */}
      {selectedPaySlip && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 460, padding: 28, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>📄 মাসিক বেতন স্লিপ (Pay Slip)</h3>
              <button onClick={() => setSelectedPaySlip(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ border: "2px solid var(--border-color)", padding: 18, borderRadius: 8, background: "#fafafa" }}>
              <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: 10, marginBottom: 12 }}>
                <strong style={{ fontSize: 16, display: "block" }}>UNBEATABLE RETAIL ERP</strong>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>মাসিক বেতন রশিদ (September 2026)</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "var(--text-muted)" }}>কর্মচারী:</span>
                <strong>{selectedPaySlip.staff.name}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "var(--text-muted)" }}>কোড ও পদবি:</span>
                <span>{selectedPaySlip.staff.employeeCode} ({selectedPaySlip.staff.role})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, borderBottom: "1px dashed var(--border-color)", paddingBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>যোগদান:</span>
                <span>{formatDate(selectedPaySlip.staff.joiningDate)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>মূল বেতন (Basic Salary):</span>
                <strong>{formatCurrency(selectedPaySlip.staff.basicSalary)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "var(--success)" }}>
                <span>অর্জিত সেলস কমিশন ({selectedPaySlip.staff.commissionPercent}%):</span>
                <strong>+{formatCurrency(selectedPaySlip.commission)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, borderTop: "2px solid var(--border-color)", paddingTop: 10, marginTop: 10, color: "var(--primary-dark)" }}>
                <span>সর্বমোট প্রদেয় (Net Total):</span>
                <span>{formatCurrency(selectedPaySlip.totalPayable)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button onClick={() => setSelectedPaySlip(null)} className="btn-secondary">
                বন্ধ করুন
              </button>
              <button onClick={() => window.print()} className="btn-primary">
                🖨️ প্রিন্ট পে-স্লিপ
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
