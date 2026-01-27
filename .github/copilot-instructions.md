# Ipixit Admin Dashboard - AI Coding Agent Guide

## Project Overview
**Ipixit** is a React + TypeScript admin dashboard built with Vite and Tailwind CSS v4. It's a feature-rich template featuring component libraries, data visualization, authentication, category management, and dark mode support.

**Tech Stack:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4 (styling)
- Redux Toolkit (state management)
- React Router v7 (routing)
- Axios (HTTP client)
- React Hook Form (form handling)

## Architecture & Key Patterns

### Directory Structure
```
src/
├── api/              # API calls (authApi.ts, category endpoints)
├── components/       # Reusable UI components organized by domain
│   ├── auth/        # Authentication forms
│   ├── common/      # Shared components (PageBreadcrumb, etc)
│   ├── form/        # Form elements & inputs
│   ├── tables/      # Table components
│   ├── charts/      # Chart components
│   └── categorymanagment/  # Category CRUD components
├── context/         # React Context (ThemeContext, SidebarContext)
├── hooks/           # Custom hooks (useModal, useGoBack)
├── layout/          # Layout wrappers (AppLayout, AppSidebar, AppHeader)
├── pages/           # Page components organized by feature
├── redux/           # Redux store, slices, hooks
├── routes/          # Route protection (ProtectedRoute.tsx)
├── utils/           # Utilities (axios instance, helpers)
└── config/          # Configuration (API_ROUTES constants)
```

### State Management
- **Redux Toolkit** for auth state in `redux/slices/authSlice`
- **React Context** for theme (light/dark) and sidebar state
- Use `redux/hooks.ts` exports (`useAppDispatch`, `useAppSelector`) for typed Redux access
- Theme persists to localStorage; sidebar state is ephemeral

**Example Redux usage:**
```tsx
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
const dispatch = useAppDispatch();
const { user } = useAppSelector(state => state.auth);
```

### API & HTTP
- **Axios instance** configured in `src/utils/axios.ts` with:
  - Base URL from `VITE_API_BASE_URL` env var
  - Auth token auto-injection from localStorage/sessionStorage
  - Auto-redirect to `/signin` on 401 response
  - Special header for ngrok tunneling support
- **API routes** defined as constants in `src/config/api.ts` (e.g., `API_ROUTES.LOGIN`)
- API functions in `src/api/` files (e.g., `authApi.ts` for auth endpoints)

### Component Patterns

**1. Functional Components with TypeScript**
- All components are functional components with explicit `React.FC` typing or typed `Props` interfaces
- Props interfaces defined above component: `interface BreadcrumbProps { pageTitle: string; }`

**2. Styling with Tailwind CSS v4**
- Use utility classes directly in `className` attributes
- Dark mode classes: prefix with `dark:` (e.g., `dark:bg-white/[0.03]`)
- Common patterns:
  - Spacing: `mb-6`, `p-5`, `gap-3`
  - Colors: `text-gray-800`, `bg-white`, `border-gray-200`
  - Responsive: `md:p-6`, `lg:ml-[290px]`
  - States: `hover:bg-gray-50`, `cursor-pointer`

**3. Form Components**
- Use `react-hook-form` for form management
- Form wrapper component in `src/components/form/Form.tsx` auto-prevents default submission
- Custom form inputs: Select.tsx, MultiSelect.tsx, date-picker.tsx, etc. in `form/` subdirectories
- Example: 
```tsx
const Form: FC<FormProps> = ({ onSubmit, children, className }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>
      {children}
    </form>
  );
};
```

**4. Icons**
- Icons exported from `src/icons/index.ts` (e.g., `ChevronLeftIcon`, `TrashBinIcon`)
- Used as React components: `<ChevronLeftIcon className="h-5 w-5" />`
- SVG support via vite-plugin-svgr for inline SVGs

**5. Toast Notifications**
- Use `react-hot-toast` for user feedback
- Import: `import toast from "react-hot-toast"`
- Usage: `toast.success("Message")`, `toast.error("Error message")`

**6. Modal/Dialog Management**
- Custom hook `useModal()` in `src/hooks/useModal.ts` handles modal state
- Returns: `{ isOpen, openModal, closeModal, toggleModal }`
- Example:
```tsx
const { isOpen, openModal, closeModal } = useModal();
// Use isOpen to conditionally render modal
```

### Layout System
- **AppLayout** (`src/layout/AppLayout.tsx`) wraps all authenticated pages
- **Sidebar** (`AppSidebar`) is context-driven with expand/hover/mobile states from `SidebarContext`
- **Responsive Design**: Sidebar collapses at breakpoints; main content adjusts via `lg:ml-[290px]` / `lg:ml-[90px]`
- **Backdrop** component handles mobile sidebar overlay

### Authentication & Protected Routes
- `ProtectedRoute.tsx` in `src/routes/` protects authenticated pages
- Auth token stored in localStorage or sessionStorage
- Logout clears token and redirects to `/signin`
- Axios interceptor auto-redirects to login on 401 response

### Data Fetching Pattern (Example: Categories)
```tsx
// 1. API call in src/api/authApi.ts
export const getAllCategories = async (search?: string) => {
  const response = await axiosInstance.get(
    "/api/category/getAllCategories",
    { params: { search: search || "" } }
  );
  return response.data;
};

// 2. Component state + effect in page/component
const [categories, setCategories] = useState([]);
useEffect(() => {
  getAllCategories(search).then(setCategories);
}, [search]);
```

## Developer Workflows

### Running the Project
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Adding a New Feature/Page
1. Create page component in `src/pages/FeatureName/`
2. Create domain-specific components in `src/components/featurename/`
3. Add API functions in `src/api/` (create new file if needed)
4. Add route constants to `src/config/api.ts`
5. Wire up routing in main route config
6. Wrap authenticated pages with `ProtectedRoute`

### Debugging
- Check browser console for errors (Vite shows HMR errors)
- Use Redux DevTools browser extension for state inspection
- Axios interceptor logs provide HTTP insight
- Tailwind IntelliSense extension recommended in VS Code

## Code Conventions

### Naming
- Components: PascalCase (e.g., `CategoryListComp.tsx`)
- Utilities/hooks: camelCase (e.g., `useModal.ts`, `axios.ts`)
- Constants: UPPER_SNAKE_CASE for API routes (e.g., `API_ROUTES.LOGIN`)
- Types/Interfaces: PascalCase (e.g., `BreadcrumbProps`, `Category`)

### TypeScript
- Always type component props with explicit interfaces or `React.FC<Props>`
- Export types alongside implementations
- Use strict null checks (project default)

### Import Organization
```tsx
// 1. React & libraries
import { useState } from "react";
import { useNavigate } from "react-router";

// 2. Relative components & utilities
import { ComponentCard } from "@/components/common";
import { useAppDispatch } from "@/redux/hooks";

// 3. Types (if needed)
import type { Category } from "@/types";
```

### Error Handling
- Use `react-hot-toast` for user-facing errors
- Always provide feedback on async operations (loading states, error messages)
- Example pattern in CategoryListComp:
```tsx
try {
  await removeCategory(id);
  toast.success("Category deleted successfully");
  onRefresh();
} catch (error) {
  toast.error("Failed to delete category");
}
```

## Important Notes

### Browser Warning Header
Axios automatically adds `ngrok-skip-browser-warning` header for development tunnel compatibility.

### Dark Mode
- Automatically persisted to localStorage on toggle
- Applied via `dark` class on document root
- Always include `dark:` variants for color-sensitive elements

### No Strict Redirect in PageBreadCrumb
⚠️ **Known Issue**: `PageBreadcrumb.tsx` line 15 uses `Navigate(-1)` which is incorrect—should use `useNavigate` hook's history API. This is a discoverable bug pattern for testing AI fixes.

---

**Last Updated:** January 2026 | **React:** 19 | **TypeScript:** Latest | **Tailwind:** v4
