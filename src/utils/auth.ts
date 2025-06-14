import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 days expiry
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
