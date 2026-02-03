# Abel E-Commerce Project - AI Agent Instructions

## Project Overview

**Abel Store** is a full-featured Angular 20+ e-commerce application demonstrating modern front-end development practices. It's a single-page application (SPA) built with Angular, TypeScript, Angular Material, and RxJS for product catalog browsing, shopping cart management, and checkout functionality.

**Key Technologies:**
- Angular 20.3+ (standalone components, zoneless change detection)
- TypeScript 5.5+
- Angular Material 20.2+
- RxJS (Observables, BehaviorSubject)
- SCSS styling
- Reactive Forms with validation

---

## Architecture & Structure

### Project Layout
```
abel-ecommerce/
├── src/
│   ├── app/
│   │   ├── components/          # Standalone Angular components
│   │   │   ├── navbar/          # Navigation bar with cart badge
│   │   │   ├── home/            # Hero section, features, categories
│   │   │   ├── product-list/    # Grid with filters, search, category chips
│   │   │   ├── product-detail/  # Single product view with quantity selector
│   │   │   ├── shopping-cart/   # Cart items table with summary
│   │   │   └── checkout/        # Multi-field form with order confirmation
│   │   ├── services/            # Business logic
│   │   │   ├── product.service.ts   # Products & categories data
│   │   │   └── cart.service.ts      # Cart state & checkout
│   │   ├── models/              # TypeScript interfaces
│   │   │   └── product.model.ts     # Product, Cart, Order, CustomerInfo
│   │   ├── pipes/               # Custom transformation pipes
│   │   │   └── product.pipe.ts      # Filter, search, in-stock pipes
│   │   ├── directives/          # Custom DOM directives
│   │   │   └── product.directive.ts # Discount highlight, out-of-stock, price highlight
│   │   ├── app.routes.ts        # Route definitions
│   │   ├── app.config.ts        # Application configuration & providers
│   │   ├── app.ts              # Root component
│   │   └── app.html            # Root template with navbar, outlet, footer
│   ├── styles.scss             # Global Material theme & base styles
│   ├── index.html              # HTML entry point
│   └── main.ts                 # Bootstrap entry
├── package.json
├── angular.json                # Build & serve configuration
└── tsconfig.app.json
```

### Component Hierarchy

```
App
├── Navbar (shows cart count badge)
├── Router Outlet
│   ├── Home (hero, features, category cards)
│   ├── ProductList (grid, filters, search)
│   ├── ProductDetail (single product, quantity control)
│   ├── ShoppingCart (items table, totals, checkout button)
│   └── Checkout (form, order summary, confirmation)
└── Footer
```

---

## Core Concepts & Patterns

### 1. **State Management with RxJS**
- `ProductService` maintains observable streams of products & categories
- `CartService` uses `BehaviorSubject` for real-time cart updates
- Components subscribe to services with `cart$` and `products$` observables
- Local storage persists cart state across sessions

**Key Files:** `services/product.service.ts`, `services/cart.service.ts`

### 2. **Standalone Components & Dependency Injection**
- All components are `standalone: true` (no NgModule needed)
- Explicit `imports` array in component decorators
- Services provided at root level with `providedIn: 'root'`
- No zone.js (zoneless change detection for better performance)

**Key Example:** `components/navbar/navbar.component.ts` - imports Material modules directly

### 3. **Custom Pipes for Data Transformation**
- `FilterByCategoryPipe` - filters product array by selected category
- `SearchProductsPipe` - text search by name/description
- `InStockPipe` - boolean filter for availability

**Usage in Template:**
```html
<product *ngFor="let p of products | filterByCategory: selectedCategory | searchProducts: searchTerm | inStock: inStockOnly">
```

### 4. **Custom Directives for DOM Manipulation**
- `HighlightDiscountDirective` - highlights cards with 20%+ discounts (yellow border)
- `OutOfStockDirective` - dims unavailable products & adds "OUT OF STOCK" badge
- `PriceHighlightDirective` - bolds prices over $500

**Usage:**
```html
<mat-card [appHighlightDiscount]="product.discount" [appOutOfStock]="!product.inStock">
```

### 5. **Reactive Forms with Validation**
- Checkout form uses `FormBuilder` with reactive validators
- Email, phone, ZIP code patterns validated with regex
- Min/max length, required field validation
- Error messages display for each validation rule

**File:** `components/checkout/checkout.component.ts` - `initializeForm()` method

### 6. **Material Design Components**
- `MatToolbar` - navigation bar with primary color
- `MatCard` - product cards, order summary, checkout form
- `MatGridList` - responsive product grid (4→2→1 columns by breakpoint)
- `MatButton`, `MatIcon`, `MatBadge`, `MatChips` - UI controls
- `MatSnackBar` - toast notifications on add-to-cart
- Form fields with `MatFormField`, `MatInput`

---

## Key Developer Workflows

### Build & Development
```bash
# Start dev server (http://localhost:4200)
npm start

# Production build (SSR disabled, output in dist/)
npm run build

# Run tests
ng test

# Lint
ng lint
```

### Adding a New Product
1. Edit `ProductService.getMockProducts()` in `src/app/services/product.service.ts`
2. Add entry with `Product` interface (id, name, price, image URL, etc.)
3. Restart dev server; product appears automatically via observable stream

### Modifying Product Grid Layout
1. Edit `updateGridCols()` in `ProductListComponent`
2. Adjust breakpoints: `cols` value changes based on window width
3. GridList `rowHeight` (450px) affects card dimensions

### Adding Cart Checkout Rules
1. Edit `CartService.checkout()` method
2. Add business logic before creating `Order` object
3. Tax calculation in `ShoppingCartComponent.getTaxAmount()`
4. Shipping logic in `ShoppingCartComponent.getShippingCost()`

### Styling & Theming
- Global Material theme: `src/styles.scss` (Azure/Blue palette)
- Component-specific SCSS: each component has `.scss` file
- Responsive breakpoints: 1200px, 768px, 600px (largest to smallest)
- Color scheme: Primary (#0d6efd), Accent (#ff6b6b), Gray (#666)

---

## Critical Architectural Decisions

### Why Standalone Components?
- Simpler module structure; explicit dependencies
- Tree-shaking friendly; smaller bundle sizes
- Easier testing and feature isolation
- Aligns with Angular 14+ best practices

### Why BehaviorSubject in CartService?
- Persists latest cart state for new subscribers
- Real-time cart badge update in navbar
- Initial value available immediately (no null checks needed)

### Why Pipes Instead of Component Methods?
- Template-friendly; reduces component logic
- Reusable across components
- Pure functions (same input → same output)
- Better performance with `OnPush` change detection

### Why Local Storage for Cart?
- Persistence across page reloads
- No backend required (mock data only)
- Simple JSON serialization with `localStorage.setItem/getItem`

---

## Common Patterns & Anti-Patterns

### ✅ DO:
- **Use async pipe** where possible: `{{ cart$ | async | json }}`
- **Unsubscribe** from observables in `ngOnDestroy` (or use async pipe)
- **Type all data** with interfaces; avoid `any`
- **Validate forms** before submission
- **Handle loading/error states** explicitly
- **Use trackBy in *ngFor** for performance: `trackBy: (i, item) => item.id`

### ❌ DON'T:
- **Mix template logic** with complex calculations (move to component)
- **Mutate service data directly** (break reactivity)
- **Hard-code magic strings** (use enums/constants)
- **Forget responsive design** (test on mobile breakpoints)
- **Block UI during async operations** (use loading flags)

---

## Testing Strategy

### Unit Tests (Jasmine/Karma)
- Service tests: mock dependencies, test Observable streams
- Component tests: test user interactions, form validation
- Pipe/Directive tests: verify transformation logic

### E2E Tests (Cypress/Playwright)
- User workflows: browse products → add to cart → checkout
- Form validation: invalid email rejected, valid submitted
- Navigation: routing between pages works

---

## Performance Optimizations

1. **Change Detection**: Zoneless (no zone.js) for faster detection cycles
2. **Grid Layout**: Responsive `MatGridList` re-calculates columns on resize
3. **Pipes**: Pure functions; cached results if inputs unchanged
4. **Lazy Loading**: Routes could use `loadComponent` for code splitting (currently eager)
5. **Image Loading**: Uses Unsplash CDN; could add `loading="lazy"` attribute

---

## Data Flow Examples

### Adding Item to Cart
```
User clicks "Add to Cart" in ProductCard
  ↓
ProductListComponent.addToCart(product)
  ↓
CartService.addToCart(product, quantity) 
  ↓
Updates cart BehaviorSubject + localStorage
  ↓
Navbar subscribes to cart$ → badge updates
  ↓
SnackBar shows confirmation toast
```

### Checkout Process
```
User fills form → clicks "Place Order"
  ↓
CheckoutComponent.placeOrder() validates form
  ↓
CartService.checkout(customerInfo) creates Order
  ↓
Clears cart from state + localStorage
  ↓
Sets orderPlaced = true → shows confirmation screen
  ↓
Order ID displayed; user can continue shopping
```

---

## External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @angular/core | 20.3+ | Framework |
| @angular/material | 20.2+ | UI Components |
| @angular/forms | 20.3+ | Reactive Forms |
| @angular/router | 20.3+ | Routing |
| @angular/platform-browser | 20.3+ | Browser APIs |
| @angular/animations | 20.3+ | Material animations |
| rxjs | 7.x | Observable streams |
| typescript | 5.5+ | Language |

---

## Troubleshooting

### Cart not persisting after refresh
- Check `CartService.saveCart()` is called after updates
- Verify localStorage is enabled in browser
- Check browser DevTools → Application tab → Local Storage

### Products not showing in grid
- Verify `ProductService.products$` emits data
- Check `updateGridCols()` calculates cols > 0
- Inspect network tab for image 404s (Unsplash CDN issue?)

### Form validation not working
- Ensure `ReactiveFormsModule` imported in component
- Check validators in `FormBuilder.group()` match requirements
- Verify `mat-error` displays on invalid field

### Styling not applying
- Confirm SCSS compiled to CSS (dev server handles this)
- Check CSS specificity (Material styles may override)
- Use browser DevTools → Styles tab to debug cascade

---

## Future Enhancements

1. **Backend API Integration**: Replace mock `ProductService` with HTTP calls
2. **Authentication**: Add login/signup with JWT tokens
3. **Payment Gateway**: Stripe/PayPal integration for real checkout
4. **Product Reviews**: User-submitted ratings and comments
5. **Wishlist Feature**: Save favorite products
6. **Advanced Filtering**: Price range, ratings, brand filtering
7. **Order History**: User dashboard with past purchases
8. **Inventory Management**: Real-time stock updates
9. **Analytics**: Track user behavior, popular products
10. **Multi-language Support**: i18n translation service

---

## How to Use This Document

- **New Feature**: Consult "Architecture & Structure" + "Common Patterns"
- **Bug Fix**: Check "Troubleshooting" + "Data Flow Examples"
- **Performance Issue**: Review "Performance Optimizations"
- **Question about a component**: Find its section in "Project Layout" + related service
- **Styling question**: See "Material Design Components" + grep component `.scss` file

**Questions? Search codebase for:**
- Service methods: `grep -r "addToCart\|checkout" src/app/services/`
- Component logic: `grep -r "selectedCategory\|quantity" src/app/components/`
- Styles: Look for `.scss` files with matching component name
