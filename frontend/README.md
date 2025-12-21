# NuFurnix Frontend

Production-grade React frontend for the NuFurnix B2B procurement platform.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand (client-side cart)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Structure

```
src/
├── public/           # Public catalog interface
│   ├── pages/        # Catalog, product detail, cart, confirmation
│   ├── components/   # Product cards, filters, forms
│   └── services/     # Public API client
├── admin/            # Admin portal
│   ├── pages/        # Login, dashboard, catalog mgmt, submissions
│   ├── components/   # Admin-specific components
│   ├── services/     # Admin API client
│   └── auth/         # Auth context and protected routes
├── shared/           # Shared components and types
│   ├── components/   # Button, Input, Modal
│   └── types/        # TypeScript interfaces
└── store/            # Zustand stores (cart)
```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Features

### Public Interface

- Browse product catalog with category filtering
- View detailed product specifications and applications
- Client-side cart management with localStorage persistence
- Submit enquiries and orders
- Confirmation page with submission ID

### Admin Portal

- Secure JWT-based authentication
- Catalog management (create, edit, deactivate items)
- Submission management (view, filter, update status)
- CSV export of submissions
- Protected routes with authentication guards

## State Management

Cart state is managed with Zustand and persisted to localStorage:

```typescript
const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
```

## API Integration

All API calls are proxied through Vite to the backend at `/api`.

Public API client:
```typescript
import { catalogService } from './public/services/catalog.service';
```

Admin API client:
```typescript
import { adminService } from './admin/services/admin.service';
```

## Authentication

Admin authentication uses JWT tokens stored in localStorage:

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

Protected routes automatically redirect to login if not authenticated.

## Styling

Tailwind CSS utility classes only. No custom CSS beyond Tailwind utilities.

Component example:
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Submit
</button>
```

## Environment

The frontend expects the backend API to be available at the configured proxy target (default: `http://localhost:3000`).

## License

Proprietary - NuFurnix Internal Use Only