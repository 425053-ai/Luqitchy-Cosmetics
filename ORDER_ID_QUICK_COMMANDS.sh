#!/bin/bash

# 🚀 Luqitchy Cosmetics - Order ID Fix Quick Commands
# استخدم هذه الأوامر لـ Testing و Deployment

echo "═══════════════════════════════════════════════════"
echo " 🚀 Order ID System - Quick Reference Commands"
echo "═══════════════════════════════════════════════════"
echo ""

# ============= TESTING COMMANDS =============
echo "🧪 TESTING COMMANDS"
echo "─────────────────────────────────────────────────────"
echo ""
echo "1️⃣  Verify no hardcoded ORD-0001:"
echo "   $ grep -n \"'ORD-0001'\" app/api/create-order/route.ts"
echo "   Expected: 0 results"
echo ""

echo "2️⃣  Check current counter:"
echo "   $ cat data/order-counter.json | jq"
echo "   Expected: counter > 0"
echo ""

echo "3️⃣  Test API locally (single order):"
echo "   $ curl -X POST http://localhost:3000/api/create-order \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"products\":[{\"name\":\"Test\",\"quantity\":1,\"price\":100}],\"customer\":{\"fullName\":\"Test\",\"email\":\"test@test.com\",\"phone\":\"01234567890\"}}' \\"
echo "     | jq '.orderNumber'"
echo "   Expected: ORD-00XX (not ORD-0001)"
echo ""

echo "4️⃣  Test concurrent orders (5 at same time):"
echo "   $ node tests/concurrent-orders.js"
echo "   Expected: 5 different Order IDs"
echo ""

echo "5️⃣  Check browser console (frontend test):"
echo "   localStorage.removeItem('lastOrderId')"
echo "   // Submit order and check response"
echo "   Expected: Unique Order ID in response"
echo ""

# ============= GIT COMMANDS =============
echo ""
echo "📦 GIT/DEPLOYMENT COMMANDS"
echo "─────────────────────────────────────────────────────"
echo ""

echo "1️⃣  Review changes:"
echo "   $ git diff app/api/create-order/route.ts"
echo ""

echo "2️⃣  Stage changes:"
echo "   $ git add app/api/create-order/route.ts"
echo ""

echo "3️⃣  Commit with message:"
echo "   $ git commit -m \"fix: Remove hardcoded ORD-0001 fallback and implement proper counter-based generation\""
echo ""

echo "4️⃣  Push to production:"
echo "   $ git push origin main"
echo ""

echo "5️⃣  Monitor Vercel deployment:"
echo "   Opens: https://vercel.com/dashboard"
echo "   Check: Logs for 'Counter incremented' messages"
echo ""

# ============= MONITORING COMMANDS =============
echo ""
echo "📊 MONITORING COMMANDS (Post-Deployment)"
echo "─────────────────────────────────────────────────────"
echo ""

echo "1️⃣  Check Vercel logs for Redis:"
echo "   grep '✅ \\[Redis\\] Counter incremented' .vercel/logs"
echo "   Expected: Sequential numbers (51, 52, 53...)"
echo ""

echo "2️⃣  Check for any ORD-0001 repeats:"
echo "   grep 'ORD-0001' .vercel/logs"
echo "   Expected: 0 results (or only in comments)"
echo ""

echo "3️⃣  Check database order numbers:"
echo "   # In Prisma Studio:"
echo "   SELECT orderNumber FROM Order ORDER BY createdAt DESC LIMIT 10"
echo "   Expected: Sequential ORD-00XX numbers"
echo ""

echo "4️⃣  Test in production (sample order):"
echo "   Visit: https://luqitchy.vercel.app (your domain)"
echo "   Submit order and verify Order ID in receipt"
echo "   Expected: Unique number (not ORD-0001)"
echo ""

# ============= DEBUGGING COMMANDS =============
echo ""
echo "🔧 DEBUG COMMANDS (If something goes wrong)"
echo "─────────────────────────────────────────────────────"
echo ""

echo "1️⃣  Reset counter to specific value:"
echo "   cat > data/order-counter.json << EOF"
echo "   {"
echo "     \"counter\": 100,"
echo "     \"updatedAt\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\","
echo "     \"version\": 1"
echo "   }"
echo "   EOF"
echo ""

echo "2️⃣  Clear Redis cache (if connected):"
echo "   # Contact Upstash to clear luqitchy_order_counter"
echo ""

echo "3️⃣  Check environment variables:"
echo "   # In Vercel Settings → Environment Variables"
echo "   - UPSTASH_REDIS_REST_URL"
echo "   - UPSTASH_REDIS_REST_TOKEN"
echo "   - DATABASE_URL"
echo ""

echo "4️⃣  Run local build:"
echo "   $ pnpm build"
echo "   $ pnpm dev"
echo ""

# ============= QUICK TEST SCRIPT =============
echo ""
echo "💡 QUICK TEST SCRIPT (Copy-Paste Ready)"
echo "─────────────────────────────────────────────────────"
echo ""

echo "Create file: tests/verify-order-id.js"
echo ""
echo 'const testOrderCreation = async () => {
  console.log("🧪 Testing Order ID generation...");
  
  const orders = [];
  for (let i = 0; i < 3; i++) {
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: [{ name: `Test ${i}`, quantity: 1, price: 100 }],
        customer: {
          fullName: `User ${i}`,
          email: `user${i}@test.com`,
          phone: `010000000${i}`
        }
      })
    });
    const data = await response.json();
    orders.push(data.orderNumber);
  }
  
  console.log("Order IDs:", orders);
  
  // Check if all are unique
  const unique = new Set(orders).size === orders.length;
  console.log(unique ? "✅ All unique!" : "❌ Duplicates found!");
  
  // Check if first is not ORD-0001
  const noZeroOnes = !orders.some(o => o === "ORD-0001");
  console.log(noZeroOnes ? "✅ No ORD-0001!" : "❌ Found ORD-0001!");
};

testOrderCreation();'
echo ""

# ============= CHECKLISTS =============
echo ""
echo "✅ PRE-DEPLOYMENT CHECKLIST"
echo "─────────────────────────────────────────────────────"
echo ""
echo "Before pushing to production, verify:"
echo ""
echo "[ ] No hardcoded ORD-0001 in code"
echo "[ ] Counter file has value > 0"
echo "[ ] Redis/Database configured"
echo "[ ] Local testing passed (unique IDs)"
echo "[ ] Concurrent testing passed"
echo "[ ] All changes committed"
echo "[ ] Ready to push"
echo ""

echo "✅ POST-DEPLOYMENT CHECKLIST"
echo "─────────────────────────────────────────────────────"
echo ""
echo "After deployment, verify:"
echo ""
echo "[ ] First 5 orders have sequential IDs"
echo "[ ] No ORD-0001 repeats in logs"
echo "[ ] Customer receives correct Order ID"
echo "[ ] Email/Telegram show correct Order ID"
echo "[ ] Admin can lookup orders"
echo "[ ] Monitor logs for 24 hours"
echo "[ ] Set up monitoring alert"
echo ""

# ============= QUICK REFERENCE =============
echo ""
echo "📚 QUICK REFERENCE"
echo "─────────────────────────────────────────────────────"
echo ""
echo "File Changed:    app/api/create-order/route.ts"
echo "Lines Modified:  ~20"
echo "Critical:        YES"
echo "Breaking:        NO"
echo "Rollback:        Easy (git revert)"
echo ""
echo "Expected Impact:"
echo "  - ✅ Orders get unique sequential IDs"
echo "  - ✅ No more ORD-0001 duplicates"
echo "  - ✅ System is production-ready"
echo "  - ✅ Zero performance impact"
echo ""

echo "═══════════════════════════════════════════════════"
echo "Ready to deploy! Run: git push origin main"
echo "═══════════════════════════════════════════════════"
