import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { useAuthHook } from "../hooks/useAuthHook";
import { andInterface } from "@/utils/android/androidInterFace";

// 로그아웃 타이머를 전역 변수로 선언
let logoutTimer;

// AuthProvider 컴포넌트: 인증 상태를 관리하고, 하위 컴포넌트에 인증 관련 데이터를 제공
export const AuthProvider = ({ children }) => {
  // 인증 상태를 관리하는 state
  const [token, setToken] = useState(null); // 현재 사용자의 인증 토큰
  const [dbObjectId, setDbObjectId] = useState(null); // 데이터베이스에서 사용자를 식별하는 ID
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null); // 토큰 만료 시간

  // useAuthHook에서 제공하는 인증 관련 함수들
  const { login, signup, refreshToken, logout } = useAuthHook({
    setToken,
    setDbObjectId,
    setTokenExpirationDate,
  });

  // 자동 로그아웃 로직
  useEffect(() => {
    // 토큰과 만료 시간이 존재할 경우, 남은 시간을 계산하여 로그아웃 타이머 설정
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime); // 남은 시간이 지나면 로그아웃 실행
    } else {
      clearTimeout(logoutTimer); // 토큰이 없으면 기존 타이머를 초기화
    }
  }, [token, tokenExpirationDate, logout]); // token, tokenExpirationDate, logout이 변경될 때마다 실행

  /*{"dbObjectId":"678df6f12129b1d1915fc4fd",
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYk9iamVjdElkIjoiNjc4ZGY2ZjEyMTI5YjFkMTkxNWZjNGZkIiwidXNlckVtYWlsIjoicXFxQHFxcS5jb20iLCJpYXQiOjE3Mzc0Mzc1NjcsImV4cCI6MTczODczMzU2N30.9HWLy7SVmL_Y4WZAKxEVNHM7DUZN34O0yBz82Nw1ZzI",
  "expiration":"2025-02-05T05:32:47.000Z"}*/
  // 자동 로그인 로직
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // Web 로컬 스토리지에서 저장된 인증 데이터를 가져옴
      let storedData = localStorage.getItem("tokenData"); 
      // getItem 시 JsonString or null 리턴

      if(storedData === null){
        // Web 로컬 스토리지에 Token 없을 시, Andorid 로컬 스토리지 검색
        storedData = andInterface.getLocalStorageToken()
      }else{
        // Web 로컬 스토리지에 Token 있을 시, Andorid 로컬 스토리지 저장
        andInterface.setLocalStorageToken(storedData);
      }

      storedData = JSON.parse(storedData);

      if (storedData && storedData.token) {
        const expirationDate = new Date(storedData.expiration); // 저장된 만료 시간을 Date 객체로 변환
        if (expirationDate > new Date()) {
          // 만료 시간이 현재 시간보다 이후라면, 토큰 갱신(refreshToken) 실행
          await refreshToken(storedData.dbObjectId, storedData.token, expirationDate);
        }
      }
    };

    checkAndRefreshToken();
  }, [refreshToken, logout]); // refreshToken, logout이 변경될 때마다 실행

  // AuthContext.Provider를 통해 하위 컴포넌트에 인증 상태와 함수들을 제공
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token, // 사용자가 로그인 상태인지 여부 (토큰이 존재하면 true)
        token, // 현재 인증 토큰
        dbObjectId, // 데이터베이스 사용자 ID
        login, // 로그인 함수
        signup, // 회원가입 함수
        refreshToken, // 토큰 갱신 함수
        logout, // 로그아웃 함수
      }}
    >
      {children} {/* AuthProvider로 감싼 하위 컴포넌트들 */}
    </AuthContext.Provider>
  );
};

// AuthProvider의 children prop 타입을 정의 (React 노드가 필수)
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
