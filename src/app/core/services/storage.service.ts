enum KEYS {
  ACCESS_TOKEN = 'access_token',
}
export const setToken = (token: string) => {
  if (token) {
    localStorage.setItem(KEYS.ACCESS_TOKEN, token);
  }
};

export const getToken = () => {
  return localStorage.getItem(KEYS.ACCESS_TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(KEYS.ACCESS_TOKEN);
};
