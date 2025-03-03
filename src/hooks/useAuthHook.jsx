import { useCallback } from "react";
import { decodeToken } from "@/utils/jwtUtils"; // JWT 토큰을 디코딩하는 유틸리티 함수
import { useHttpHook } from "@/hooks/useHttpHook"; // HTTP 요청을 처리하는 커스텀 훅
import { andInterface } from "@/utils/android/androidInterFace";

// useAuthHook: 인증 관련 로직을 캡슐화한 커스텀 훅
export const useAuthHook = ({
  setToken,
  setDbObjectId,
  setTokenExpirationDate,
}) => {
  // HTTP 요청을 처리하기 위한 커스텀 훅에서 sendRequest 함수 가져오기
  const { sendRequest } = useHttpHook();

  /**
   * 로그인 함수
   * @param {string} userEmail - 사용자의 이메일
   * @param {string} password - 사용자의 비밀번호
   */
  const login = useCallback(
    async (userEmail, password) => {
      // 로그인 API 요청
      
      const responseData = await sendRequest({
        url: "/api/user/login", // 로그인 엔드포인트
        method: "POST", // HTTP 메서드
        data: { userEmail, password }, // 요청 데이터
      });

      // 응답 데이터에서 사용자 ID와 토큰 추출
      const { dbObjectId, token } = responseData;

      // JWT 토큰 디코딩하여 만료 시간 추출
      const jwtDecodedData = decodeToken(token);
      const tokenExpiration = new Date(jwtDecodedData.exp * 1000); // 만료 시간은 초 단위이므로 밀리초로 변환

      // 상태 업데이트
      setToken(token); // 토큰 저장
      setDbObjectId(dbObjectId); // 사용자 ID 저장
      setTokenExpirationDate(tokenExpiration); // 토큰 만료 시간 저장

      // 로컬 스토리지에 인증 데이터 저장
      localStorage.setItem(
        "tokenData",
        JSON.stringify({
          dbObjectId,
          token,
          expiration: tokenExpiration.toISOString(), // ISO 형식으로 저장
        })
      );
    },
    [sendRequest, setToken, setDbObjectId, setTokenExpirationDate]
  );

  /**
   * 회원가입 함수
   * @param {string} userName - 사용자 이름
   * @param {string} userEmail - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @param {string} homeAddress - 사용자 주소
   * @param {string} phoneNumber - 사용자 전화번호
   */
  const signup = useCallback(
    async (userName, userEmail, password, homeAddress, phoneNumber) => {
      // 회원가입 API 요청
      const responseData = await sendRequest({
        url: "/api/user/signup", // 회원가입 엔드포인트
        method: "POST", // HTTP 메서드
        data: { userName, userEmail, password, homeAddress, phoneNumber }, // 요청 데이터
      });

      // 응답 데이터에서 사용자 ID와 토큰 추출
      const { dbObjectId, token } = responseData;
      console.log("responseData : ", responseData);

      if (dbObjectId && token) {
        // 회원가입 후 자동으로 로그인 처리
        await login(userEmail, password);
      } else {
        console.error("회원가입 실패:", responseData);
        throw new Error("회원가입에 실패했습니다.");
      }
    },
    [sendRequest, login]
  );

  /**
   * 토큰 갱신 함수
   * @param {string} dbObjectId - 사용자 ID
   * @param {string} token - 현재 토큰
   * @param {Date} expirationDate - 현재 토큰의 만료 시간
   */
  const refreshToken = useCallback(
    async (dbObjectId, token, expirationDate) => {
      // 현재 토큰의 만료 시간 계산
      const jwtDecodedData = decodeToken(token);
      const tokenExpiration =
        expirationDate || new Date(jwtDecodedData.exp * 1000);

      // 토큰 갱신 API 요청
      const responseData = await sendRequest({
        url: "/api/user/refreshToken", // 토큰 갱신 엔드포인트
        method: "POST", // HTTP 메서드
        data: { dbObjectId: dbObjectId }, // 요청 데이터
        headers: { Authorization: `Bearer ${token}` }, // 현재 토큰을 Authorization 헤더에 포함
      });

      // 응답 데이터에서 새로운 토큰 추출
      const { newToken } = responseData;

      // 새로운 토큰의 만료 시간 계산
      const newTokenExpiration = new Date(decodeToken(newToken).exp * 1000);

      // 상태 업데이트
      setToken(newToken); // 새로운 토큰 저장
      setDbObjectId(dbObjectId); // 사용자 ID 유지
      setTokenExpirationDate(newTokenExpiration); // 새로운 토큰 만료 시간 저장

      // 남은 시간 계산
      const timeLeft = tokenExpiration.getTime() - new Date().getTime();
      // 남은 시간이 60분 미만일 경우 토큰 갱신
      if (timeLeft < 60 * 60 * 1000) {
        // 토큰 갱신 API 요청
        const responseData = await sendRequest({
          url: "/api/user/refreshToken", // 토큰 갱신 엔드포인트
          method: "POST", // HTTP 메서드
          data: { dbObjectId: dbObjectId }, // 요청 데이터
          headers: { Authorization: `Bearer ${token}` }, // 현재 토큰을 Authorization 헤더에 포함
        });

        // 응답 데이터에서 새로운 토큰 추출
        const { newToken } = responseData;

        // 새로운 토큰의 만료 시간 계산
        const newTokenExpiration = new Date(decodeToken(newToken).exp * 1000);

        // 상태 업데이트
        setToken(newToken); // 새로운 토큰 저장
        setDbObjectId(dbObjectId); // 사용자 ID 유지
        setTokenExpirationDate(newTokenExpiration); // 새로운 토큰 만료 시간 저장

        // 로컬 스토리지에 갱신된 인증 데이터 저장
        localStorage.setItem(
          "tokenData",
          JSON.stringify({
            dbObjectId,
            token: newToken,
            expiration: newTokenExpiration.toISOString(),
          })
        );
      } else {
        // 남은 시간이 60분 이상일 경우 로컬저장소에 저장된 토큰 그대로 사용

        /* 로컬스토리지의 Token을 다시 저장하는 이유 : 
          -> 새로 고침 이벤트 React 상태는 초기화 됨
            -> 따라서 로컽 스토리지와 React 상태의 동기화가 필요함 */
        setToken(token); // 기존의 토큰 저장
        setDbObjectId(dbObjectId); // 사용자 ID 유지
        setTokenExpirationDate(expirationDate); // 기존의 토큰 만료 시간 저장
      }
    },
    [sendRequest, setToken, setDbObjectId, setTokenExpirationDate]
  );

  /**
   * 소셜 로그인 시, 사용하는 Token 셋업 함수수
   */
  const saveToken = useCallback(
    async (dbObjectId, token) => {

      // 새로운 토큰의 만료 시간 계산
      const newTokenExpiration = new Date(decodeToken(token).exp * 1000);

      // 상태 업데이트
      setToken(token); // 새로운 토큰 저장
      setDbObjectId(dbObjectId); // 사용자 ID 유지
      setTokenExpirationDate(newTokenExpiration); // 새로운 토큰 만료 시간 저장

      // TODO:소셜로그인시 id,pw로 로그인하는게 아니라 login함수를 사용 할 수 없으므로 refresh에서도 무지성으로 LocalStorage 저장 로직으로 바꿈 추후 고민해서 바꿔야함
      localStorage.setItem(
        "tokenData",
        JSON.stringify({
          dbObjectId,
          token,
          expiration: newTokenExpiration
        })
      );
    },
    []
  );

  /**
   * 로그아웃 함수
   */
  const logout = useCallback(async () => {
    // 상태 초기화
    setToken(null); // 토큰 제거
    setDbObjectId(null); // 사용자 ID 제거
    setTokenExpirationDate(null); // 토큰 만료 시간 제거
    andInterface.setLocalStorageToken(
      '{"dbObjectId":"","token":"","expiration":""}'
    ); // Android Cache Data 삭제제
    console.log(`Logout Called`);

    // 로컬 스토리지에서 인증 데이터 제거
    localStorage.removeItem("tokenData");
  }, [setToken, setDbObjectId, setTokenExpirationDate]);

  // 인증 관련 함수들을 반환
  return { login, signup, refreshToken, saveToken, logout };
};
