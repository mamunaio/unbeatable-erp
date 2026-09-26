/**
 * Bangladesh Currency, Date & Number Formatters
 * Supports standard South Asian / Bangladeshi Lakh-Crore Numbering (e.g. ৳4,86,500 / ৳12,34,567)
 */

export type NumberingSystem = "lakh" | "international";

export interface CurrencyFormatOptions {
  decimals?: number;
  showDecimals?: boolean;
  system?: NumberingSystem;
  symbol?: string;
  symbolPosition?: "prefix" | "suffix";
}

/**
 * Format number into South Asian / Bangladeshi Lakh-Crore format:
 * 1000 -> 1,000
 * 10000 -> 10,000
 * 100000 -> 1,00,000 (1 Lakh)
 * 10000000 -> 1,00,00,000 (1 Crore)
 */
export function formatBanglaLakhNumber(val: number, decimals = 2, showDecimals = false): string {
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  
  const fixedStr = showDecimals ? absVal.toFixed(decimals) : Math.round(absVal).toString();
  const [integerPart, decimalPart] = fixedStr.split(".");
  
  let result = "";
  if (integerPart.length <= 3) {
    result = integerPart;
  } else {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherDigits = integerPart.substring(0, integerPart.length - 3);
    const groups = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    result = groups + "," + lastThree;
  }
  
  if (showDecimals && decimalPart !== undefined && (decimals > 0 && decimalPart !== "00")) {
    result += "." + decimalPart;
  }
  
  return (isNegative ? "-" : "") + result;
}

export function formatCurrency(
  amount: number | string | { toString(): string } | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  const num = typeof amount === "number" ? amount : Number(amount ?? 0);
  if (isNaN(num)) return "৳0";

  const {
    decimals = 2,
    showDecimals = false,
    system = "lakh",
    symbol = "৳",
    symbolPosition = "prefix",
  } = options;

  let formattedNum = "";
  if (system === "lakh") {
    formattedNum = formatBanglaLakhNumber(num, decimals, showDecimals);
  } else {
    formattedNum = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: showDecimals ? decimals : 0,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  return symbolPosition === "prefix" ? `${symbol}${formattedNum}` : `${formattedNum} ${symbol}`;
}

export function formatNumber(
  num: number | string | null | undefined,
  system: NumberingSystem = "lakh"
): string {
  const val = typeof num === "number" ? num : Number(num ?? 0);
  if (isNaN(val)) return "0";
  return system === "lakh" ? formatBanglaLakhNumber(val, 0, false) : new Intl.NumberFormat("en-US").format(val);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(d);
}

export function generateInvoiceNo(prefix = "INV"): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}
