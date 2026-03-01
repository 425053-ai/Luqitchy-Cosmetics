// Centralized order totals calculation for Luqitchy Cosmetics
export function calculateOrderTotals(products: { price: number, quantity: number }[]) {
  const productsSubtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingFee = 70;
  const finalTotal = productsSubtotal + shippingFee;
  return { productsSubtotal, shippingFee, finalTotal };
}
