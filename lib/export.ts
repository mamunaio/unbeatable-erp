/**
 * Universal CSV / Excel Export Engine with UTF-8 BOM for Bangla text
 */

export function exportToCsv<T extends Record<string, any>>({
  filename,
  headers,
  data,
}: {
  filename: string;
  headers: Array<{ key: keyof T | string; label: string }>;
  data: T[];
}) {
  if (!data || !data.length) {
    alert("এক্সপোর্ট করার মতো কোনো ডেটা নেই।");
    return;
  }

  // 1. Create header row
  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(",");

  // 2. Create data rows
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h.key];
        if (val === null || val === undefined) return '""';
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  const csvContent = [headerRow, ...rows].join("\r\n");

  // 3. Prepend UTF-8 BOM (\uFEFF) so Excel correctly detects Bangla Unicode characters
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
