// Standard amortizing-loan math used by the illustrative estimator.
export function monthlyPayment(principal, aprPercent, months) {
  if (principal <= 0 || months <= 0) return 0
  const r = aprPercent / 100 / 12
  if (r === 0) return principal / months
  return (principal * r) / (1 - Math.pow(1 + r, -months))
}

export function estimateLoan({ price, down, tradeIn, fees, apr, term }) {
  const financed = Math.max(0, price + fees - down - tradeIn)
  const payment = monthlyPayment(financed, apr, term)
  const totalPaid = payment * term
  return {
    financed,
    payment,
    totalPaid,
    totalInterest: Math.max(0, totalPaid - financed),
  }
}

// Indian rupees with Indian digit grouping, e.g. ₹8,00,000.
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const inrPaise = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })

export const formatINR = (n) => inr.format(Number.isFinite(n) ? n : 0)
export const formatINRPaise = (n) => inrPaise.format(Number.isFinite(n) ? n : 0)
