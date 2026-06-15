function formatCurrency(amount, symbol = "₹") {
  return `${symbol}${Math.round(amount).toLocaleString("en-IN")}`;
}
function relativeTime(iso) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1e3;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}
export {
  formatCurrency as f,
  relativeTime as r
};
