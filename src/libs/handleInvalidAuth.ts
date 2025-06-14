import { removeToken } from '@/utils/auth';

export function handleInvalidAuth() {
  // Remove token
  removeToken();
  // Remove user from localStorage
  localStorage.removeItem('user');
  // Redirect to login
  window.location.href = '/login';
}
