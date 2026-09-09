// API Base URL configuration
// During development on port 3000, explicitly route requests to backend port 5000
export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '3000'
    ? 'http://localhost:5000'
    : '');
