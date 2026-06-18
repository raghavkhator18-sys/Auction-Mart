import api from '@/lib/axios';

export const signup = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post('/auth/signup', {
    name,
    email,
    password,
  });

  return response.data;
};

export const verifyOTP = async (
  email: string,
  otp: string
) => {
  const response = await api.post('/auth/verify-otp', {
    email,
    otp,
  });

  return response.data;
};

export const login = async (
  email: string,
  password: string
) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  return response.data;
};