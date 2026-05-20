# Services Directory

API integration and external service calls.

## Files:
- `api.js` - Axios/fetch configuration and base API instance
- `resourceService.js` - Fetch, create, update, delete resources
- `authService.js` - User authentication and login
- `adminService.js` - Admin-specific API calls
- `searchService.js` - Search and filter operations

## Purpose:
Centralize all backend API calls to make them reusable and easy to maintain.
Keep components clean by delegating API logic to services.
