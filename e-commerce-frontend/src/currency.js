export const CURRENCY = "₹";

export function formatPrice(amount) {
  if (amount == null) return "N/A";
  return `${CURRENCY}${Number(amount).toLocaleString("en-IN")}`;
}