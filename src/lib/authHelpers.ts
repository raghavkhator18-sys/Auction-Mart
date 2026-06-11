// These functions provide a local storage wrapper as requested, 
// though Supabase manages its own session persistence automatically under the hood.

export const saveToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

export const saveUser = (user: { name: string; email: string }) => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const getUser = (): { name: string; email: string } | null => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('auth_user');
};
