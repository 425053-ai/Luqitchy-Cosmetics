# Luqitchy Cosmetics - AI Coding Instructions

## Project Overview
E-commerce cosmetics store built with **Next.js 14 App Router**, deployed on Vercel. Arabic/Egyptian market focus.

## Architecture

### Core Data Flow (Order Submission)
```
User submits order → product-page.tsx / cart/page.tsx
  ↓
POST /api/orderCounter (Redis atomic increment) → ORD-0001
  ↓
POST /api/sendOrder (Brevo email to customer)
  ↓
sendSingleProductOrder() / sendCartOrderToTelegram() → Admin notification
```

### Key Directories
- `app/api/` - API routes (sendOrder, orderCounter, n8n-webhook)
- `components/` - React components (product-page.tsx handles single product orders)
- `context/` - React contexts (Cart, Wishlist, OrderHistory) with localStorage persistence
- `lib/telegram-service.ts` - Telegram bot notifications (unlimited, no API limits)

## Critical Patterns

### Preventing Double Submissions
Always include in form handlers:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (isSubmitting) return  // ← CRITICAL: Early return check
  setIsSubmitting(true)
  // ... rest of logic
}
```
And disable submit buttons: `disabled={isSubmitting}`

### External Services Configuration
| Service | Env Variable | Limit |
|---------|-------------|-------|
| Brevo Email | `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` | 300/day (customer only) |
| Telegram | Hardcoded in `lib/telegram-service.ts` | Unlimited |
| Redis (Upstash) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Order counter |

### Order ID Generation
Uses Upstash Redis `INCR` for atomic, sequential IDs (ORD-0001, ORD-0002...). Fallback to timestamp if Redis fails.

## Component Conventions
- Product pages: `app/order/[product-id]/page.tsx` → renders `<ProductPage product={...} />`
- All product data defined inline in page files, not in separate data files
- UI components in `components/ui/` (shadcn/ui pattern)

## Commands
```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm lint     # ESLint
```

## Important Notes
- **No admin email notifications** - Admin uses Telegram (saves email quota)
- Prices in **EGP** (Egyptian Pounds)
- localStorage keys: `luqitchy-cart`, `luqitchy-wishlist`, `luqitchy-orders`
