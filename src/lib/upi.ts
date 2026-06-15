export function buildUpiUrl(opts: {
  payeeVpa: string;
  payeeName: string;
  amount: number;
  note: string;
  txnRef?: string;
}) {
  const params = new URLSearchParams({
    pa: opts.payeeVpa,
    pn: opts.payeeName,
    am: opts.amount.toFixed(2),
    cu: "INR",
    tn: opts.note,
  });
  if (opts.txnRef) params.set("tr", opts.txnRef);
  return `upi://pay?${params.toString()}`;
}
