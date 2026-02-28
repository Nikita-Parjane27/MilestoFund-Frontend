export const formatMoney = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

export const daysLeft = (deadline) =>
  Math.max(0, Math.ceil((new Date(deadline) - Date.now()) / 86_400_000));

export const fundingPct = (raised, goal) =>
  goal > 0 ? Math.min(((raised / goal) * 100), 100) : 0;
