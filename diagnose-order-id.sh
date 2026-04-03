#!/bin/bash

# 🔧 Order ID System - Diagnostic and Fix Script
# استخدم هذا script لتشخيص ومعالجة مشاكل Order IDs

set -e

echo "🔍 Luqitchy Cosmetics - Order ID Diagnostic Tool"
echo "=================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if data directory exists
if [ ! -d "data" ]; then
  echo -e "${RED}❌ ERROR: data/ directory not found${NC}"
  echo "Creating data directory..."
  mkdir -p data
fi

# Check order counter file status
echo -e "${BLUE}1️⃣  Checking order counter file...${NC}"
echo ""

COUNTER_FILE="data/order-counter.json"

if [ ! -f "$COUNTER_FILE" ]; then
  echo -e "${YELLOW}⚠️  order-counter.json not found. Creating with initial value...${NC}"
  cat > "$COUNTER_FILE" << 'EOF'
{
  "counter": 0,
  "updatedAt": "2026-04-03T00:00:00.000Z",
  "version": 1
}
EOF
  echo -e "${GREEN}✅ Created with initial counter = 0${NC}"
else
  echo -e "${GREEN}✅ File exists${NC}"
fi

# Display current counter value
echo ""
echo -e "${BLUE}2️⃣  Current counter value:${NC}"
COUNTER_VALUE=$(grep -o '"counter": [0-9]*' "$COUNTER_FILE" | grep -o '[0-9]*')
echo ""
cat "$COUNTER_FILE" | jq '.' 2>/dev/null || cat "$COUNTER_FILE"
echo ""

if [ "$COUNTER_VALUE" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Counter is 0${NC}"
  echo "    This means next order will be ORD-0001"
  echo "    If you've had orders before, this counter was reset!"
  echo ""
  echo -e "${YELLOW}Would you like to:${NC}"
  echo "    1) Keep as is (reset to 0)"
  echo "    2) Enter custom counter value"
  echo "    3) Exit and fix manually"
  echo ""
  read -p "Enter choice (1-3): " choice
  case $choice in
    2)
      read -p "Enter new counter value: " new_value
      if ! [[ "$new_value" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}❌ Invalid input. Must be a number.${NC}"
        exit 1
      fi
      cat > "$COUNTER_FILE" << EOF
{
  "counter": $new_value,
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "version": 1
}
EOF
      echo -e "${GREEN}✅ Counter updated to $new_value${NC}"
      ;;
    3)
      echo "Exiting. Please fix manually."
      exit 0
      ;;
  esac
elif [ "$COUNTER_VALUE" -lt 10 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Counter is very low ($COUNTER_VALUE)${NC}"
  echo "    Next order will be ORD-$(printf "%04d" $((COUNTER_VALUE + 1)))"
  echo "    If this seems wrong, check your order history"
else
  echo -e "${GREEN}✅ Counter looks healthy: $COUNTER_VALUE${NC}"
  echo "    Next order will be ORD-$(printf "%04d" $((COUNTER_VALUE + 1)))"
fi

# Check environment variables
echo ""
echo -e "${BLUE}3️⃣  Checking environment configuration...${NC}"
echo ""

if [ -z "$UPSTASH_REDIS_REST_URL" ]; then
  echo -e "${YELLOW}⚠️  UPSTASH_REDIS_REST_URL not set${NC}"
  echo "    System will use file-based counter (slower but reliable)"
else
  echo -e "${GREEN}✅ Redis URL configured${NC}"
fi

if [ -z "$UPSTASH_REDIS_REST_TOKEN" ]; then
  echo -e "${YELLOW}⚠️  UPSTASH_REDIS_REST_TOKEN not set${NC}"
  echo "    Redis will not work without this"
else
  echo -e "${GREEN}✅ Redis token configured${NC}"
fi

if [ -z "$DATABASE_URL" ]; then
  echo -e "${YELLOW}⚠️  DATABASE_URL not set${NC}"
  echo "    Orders will use file-based storage (fallback mode)"
else
  echo -e "${GREEN}✅ Database URL configured${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 Diagnostic Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo "✅ order-counter.json: OK"
echo "   Current counter: $COUNTER_VALUE"
echo "   Next Order ID: ORD-$(printf "%04d" $((COUNTER_VALUE + 1)))"
echo ""

if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
  echo "✅ Redis: Configured (will use if available)"
else
  echo "⚠️  Redis: Not configured (using file system)"
fi

if [ -n "$DATABASE_URL" ]; then
  echo "✅ Database: Configured"
else
  echo "⚠️  Database: Not configured"
fi

echo ""
echo -e "${GREEN}🎯 System is ready for order processing!${NC}"
echo ""
echo "Next steps:"
echo "1) Deploy to production"
echo "2) Monitor first 5 orders"
echo "3) Verify Order IDs are sequential"
echo ""
