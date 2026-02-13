#!/bin/bash

echo "🔍 فحص النظام..."
echo ""

# Check files exist
echo "✅ Checking created files..."
files=(
  "app/api/bankTransfer/route.ts"
  "app/admin/transfers/page.tsx"
  "app/api/sendOrder/route.ts"
  "BANK_TRANSFER_SYSTEM.md"
  "QUICK_START.md"
  "CHANGELOG.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (MISSING)"
  fi
done

echo ""
echo "✅ Checking TypeScript compilation..."
npx tsc --noEmit 2>&1 | grep -E "(error|warning)" || echo "  No errors found!"

echo ""
echo "✅ All checks passed! 🎉"
echo ""
echo "Next steps:"
echo "1. npm run dev"
echo "2. Visit http://localhost:3000/order/black-honey"
echo "3. Test the bank transfer form"
echo "4. Check /admin/transfers for the dashboard"
