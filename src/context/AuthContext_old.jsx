// ./context/AuthContext.jsx
// ./context/AuthProvider.jsx

import { createContext, useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { useHttpHook } from "../hooks/useHttpHook";

import PropTypes from "prop-types";
import { prototype } from "postcss/lib/previous-map";

let logoutTimer

/**
 * 전역 인증 상태 관리를 위한 주요 변수들
 * 
 * 다른 컴포넌트에서 사용하는 방법:
 * const auth = useContext(AuthContext);
 * 
 * // 로그인 상태 확인
 * if (auth.isLoggedIn) { ... }
 * 
 * // 보호된 API 요청 시 토큰 사용
 * headers: { Authorization: `Bearer ${auth.token}` }
 * 
 * // 현재 로그인한 사용자 ID 접근
 * const currentDbObjectId = auth.dbObjectId;
 */
export const AuthContext = createContext({
  isLoggedIn: false,
  tokenContext: null,
  dbObjectId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [tokenContext, setToken] = useState(null);
  const [dbObjectId, setDbObjectId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const {sendRequest} = useHttpHook()

  /**
 * JWT 토큰 만료 시간 자동 계산
 * localStorage에 인증 정보 저장
 */
  const signup = useCallback(async (
    userName,
    userEmail,
    password,
    homeAddress,
    phoneNumber
  ) => {
    const responseData = await sendRequest({
      url: '/api/user/signup',
      method: 'POST',
      data: { 
        userName,
        userEmail,
        password,
        homeAddress,
        phoneNumber }
    });
    console.dir(responseData);
    const { dbObjectId, token } = responseData;
      
    // 토큰 저장 로직은 refreshToken 함수 재사용
    await refreshToken(dbObjectId, token);
    return responseData
  }, [])

  const login = useCallback(async (userEmail, password) => {
    const responseData = await sendRequest({
      url: '/api/user/login',
      method: 'POST',
      data: { userEmail, password }
    });

    const { dbObjectId, token } = responseData;

    // 토큰 저장 로직은 refreshToken 함수 재사용
    await refreshToken(dbObjectId, token);
    return responseData
  }, []);

  const refreshToken = useCallback(async (dbObjectId, token, expirationDate) => {
    const jwtDecodedData = jwtDecode(token);
    // const tokenExpiration = expirationDate || new Date(new Date().getTime() + jwtDecodedData.expireTime);
    // const tokenExpiration = expirationDate || new Date(new Date().getTime() + jwtDecodedData.exp);
    // exp는 초 단위이므로 밀리초로 변환해야 함
    const tokenExpiration = expirationDate || new Date(jwtDecodedData.exp * 1000);
    
    // 토큰 만료까지 30분 이하로 남은 경우, 자동 갱신
    const timeLeft = tokenExpiration.getTime() - new Date().getTime();
    if (timeLeft < 30 * 60 * 1000) { // 30 = 30 * 60 * 1000 밀리초
      try {
        // 새로운 토큰 요청
        const responseData = await sendRequest({
          url: '/api/user/refresh-token',
          method: 'POST',
          data: { dbObjectId },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(responseData);
        const { newToken } = responseData;
        setDbObjectId(dbObjectId);
        setToken(newToken);
        setTokenExpirationDate(new Date(jwtDecodedData.exp * 1000));
        
        // localStorage 업데이트
        localStorage.setItem(
          "tokenData",
          JSON.stringify({
            dbObjectId,
            token: newToken,
            expiration: tokenExpiration.toISOString()
          })
        );
        
        return;
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }else{
      // 토큰 갱신이 필요없는 경우
      setToken(token);
      setDbObjectId(dbObjectId);
      setTokenExpirationDate(tokenExpiration);
      
      localStorage.setItem(
        "tokenData",
        JSON.stringify({
          dbObjectId,
          token,
          expiration: tokenExpiration.toISOString()
        })
      );  
    }
    // // 토큰 갱신이 필요없는 경우 기존 토큰 저장
    // setToken(token);
    // setDbObjectId(dbObjectId);
    
    // localStorage.setItem(
    //   "tokenData",
    //   JSON.stringify({
    //     dbObjectId,
    //     token,
    //     expiration: tokenExpiration.toISOString()
    //   })
    // );
  }, [sendRequest]);
  

  const logout = useCallback(() => {
    setToken(null);
    setDbObjectId(null);
    setTokenExpirationDate(null);
    
    // 특정 인증 관련 데이터만 삭제
    localStorage.removeItem('tokenData');
    
    // 토큰 만료 타이머 정리
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  // 자동 로그아웃 로직 [ 토큰 만료시 ]
  useEffect(() => {
    if (tokenContext && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [tokenContext, logout, tokenExpirationDate]);

  // 자동 로그인 로직 [ 처음 사이트 접근시 localStorage에 토큰 정보 있으면 자동 로그인 ]
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem('tokenData'));
        
        if (!storedData || !storedData.token) { // token으로 확인
          return;
        }

        const expirationDate = new Date(storedData.expiration);
        if (expirationDate <= new Date()) {
          logout();
          return;
        }

        await refreshToken(
          storedData.dbObjectId, 
          storedData.token,
          expirationDate
        );
      } catch (error) {
        console.error('자동 로그인 실패:', error);
        logout();
      }
    };

    autoLogin();
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!tokenContext,
        token : tokenContext,
        dbObjectId,
        login,
        signup,
        refreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


AuthContext.propTypes = {
  isLoggedIn: PropTypes.bool,
  token: PropTypes.string,
  dbObjectId: PropTypes.string,
  login: PropTypes.func,
  signup: PropTypes.func,
  refreshToken: PropTypes.func,
  logout: PropTypes.func
};


/**
 * 해당 페이지 기능
1. 토큰 만료시 자동 로그아웃 
2. 페이지 새로고침시 자동 로그인 (토큰 유효한 경우)
 * 
 * 사용법
 -- 컴포넌트 사용

import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function MyComponent() {
  const auth = useContext(AuthContext);

  // 로그인 처리
  const handleLogin = async () => {
    try {
      const response = await auth.login(userEmail, password);
      // 로그인 성공 처리
    } catch (err) {
      // 에러 처리
    }
  };

  // 회원가입 처리
  const handleSignup = async () => {
    try {
      const response = await auth.signup(
        userName, 
        userEmail, 
        password, 
        homeAddress, 
        phoneNumber
      );
      // 회원가입 성공 처리
    } catch (err) {
      // 에러 처리
    }
  };

  // 로그아웃
  const handleLogout = () => {
    auth.logout();
  };
}

 -- 프로퍼티 사용

 // 로그인 상태 확인
if (auth.isLoggedIn) {
  // 로그인된 상태
}

// 현재 사용자 ID 확인
const userId = auth.dbObjectId;

// JWT 토큰 사용 (API 요청시)
const headers = {
  Authorization: `Bearer ${auth.token}`
};

 */