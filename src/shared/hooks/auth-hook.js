import { useState, useCallback, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((userId, token, expirationDate) => {
    setToken(token);
    setUserId(userId);
    const jwtDecodedData = jwtDecode(token);
    
    const renewedDate =
      expirationDate || new Date(new Date().getTime() + jwtDecodedData.expireTime);
    setTokenExpirationDate(renewedDate);

    localStorage.setItem("userData", JSON.stringify({
      userId,
      token,
      expiration: renewedDate.toISOString()
    }));
  }, [])

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    // console.log('Logout')
    localStorage.removeItem("userData");
  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      (new Date(storedData.expiration) > new Date())
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login])

  return { userId, token, login, logout};
};