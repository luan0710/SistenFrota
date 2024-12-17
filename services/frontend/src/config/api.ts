const API_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  REFRESH_TOKEN: `${API_URL}/api/auth/refresh-token`,
  REGISTER: `${API_URL}/api/auth/register`,
  FORGOT_PASSWORD: `${API_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/api/auth/reset-password`,
};

export default API_ENDPOINTS; 