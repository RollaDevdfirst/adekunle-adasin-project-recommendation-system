# Frontend Project Structure

```
client/src/
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Admin.jsx
│   ├── Search.jsx
│   └── NotFound.jsx
│
├── components/
│   ├── common/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   ├── SearchBar/
│   │   └── ...
│   │
│   ├── admin/
│   │   ├── FileUpload/
│   │   ├── ResourceForm/
│   │   ├── AdminTable/
│   │   └── AdminStats/
│   │
│   └── recommendation/
│       ├── ResourceCard/
│       ├── ResourceGrid/
│       ├── RecommendationList/
│       └── FilterPanel/
│
├── services/
│   ├── api.js
│   ├── resourceService.js
│   ├── authService.js
│   ├── adminService.js
│   └── searchService.js
│
├── hooks/
│   ├── useFetch.js
│   ├── useSearch.js
│   ├── useFilter.js
│   ├── useAuth.js
│   └── usePagination.js
│
├── utils/
│   ├── helpers.js
│   ├── constants.js
│   ├── validators.js
│   ├── formatters.js
│   └── errorHandler.js
│
└── assets/
    ├── images/
    └── icons/
```

## Architecture Overview

### 📄 Pages
Top-level page components that represent entire routes. Each page is a container that combines multiple smaller components.

### 🧩 Components
Reusable UI components organized into three categories:
- **common**: Shared UI elements used throughout the app
- **admin**: Admin panel specific components
- **recommendation**: Recommendation and resource display components

### 🔌 Services
API integration layer. All backend calls go through services to keep components clean and logic centralized.

### ⚙️ Hooks
Custom React hooks for reusable logic like data fetching, search, filtering, and authentication.

### 🛠️ Utils
Pure utility functions for helpers, constants, validators, formatters, and error handling.

### 🎨 Assets
Static files: images, icons, and other media resources.

## Best Practices

1. **Component Structure**: Each component should have its own folder with JSX and CSS files
   ```
   components/common/Header/
   ├── Header.jsx
   ├── Header.css
   └── index.js
   ```

2. **Services**: Use services to handle all API communication
   ```
   const { data, loading, error } = useFetch(resourceService.getResources);
   ```

3. **Hooks**: Custom hooks encapsulate stateful logic
   ```
   const { results, search, filter } = useSearch();
   ```

4. **Utils**: Keep utility functions pure and testable
   ```
   import { validateEmail, formatDate } from '@/utils';
   ```

## Getting Started

1. Create page files in `pages/`
2. Build reusable components in `components/`
3. Set up API services in `services/`
4. Create custom hooks in `hooks/`
5. Add helper functions in `utils/`
6. Store static assets in `assets/`

This structure is scalable, modular, and beginner-friendly!
