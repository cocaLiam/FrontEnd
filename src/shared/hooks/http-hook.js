import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);
  // [] 빈 배열의 주소값 같은거라고 생각 하면 됨. activeHttpRequests.current <- &activeHttpRequests
  // useRef(); 인 경우, 주로 DOM 요소에 대한 직접적인 참조를 관리하기 위해 사용되고,
  // activeHttpRequests는 컴포넌트의 상태와는 독립적으로 유지되어야 하는 변경 가능한 데이터를 관리하기 위해 사용됩니다.

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {

      const parts = url.split('/');
      const beforeThirdSlash = parts.slice(0, 3).join('/'); // 세 번째 '/' 전까지
      const afterThirdSlash = '/' + parts.slice(3).join('/'); // 세 번째 '/' 이후

      console.trace(" - 디버깅 : sendRequest 호출됨!");  // 호출 스택 출력
      // body 가 null 인 경우, headers 가 json 타입이면 fetch에 fail 한다.
      console.log(`HTTP 요청 url --> ${method} }
        ${beforeThirdSlash}
        ${afterThirdSlash}`);
      
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (response.ok) {
          // responseData.ok 는 상태코드가 200번대 일때 true를 반환한다
          return responseData;
        } else {
          throw new Error(responseData.message);
        }
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort()); // abort 메서드를 호출하여 HTTP 요청을 취소
      /**
          for (let i = 0; i < activeHttpRequests.current.length; i++) {
            const abortCtrl = activeHttpRequests.current[i];
            abortCtrl.abort();
          }
       */
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};

// // axios 서드파티Lib 쓰는 경우
// if (isLoginMode) {
//     // 로그인 모드일 때의 로직
// } else {
//     // 회원가입 모드일 때의 로직
//     try {
//         const response = await axios.post('http://localhost:5000/api/users/signup', {
//             name: formState.inputs.name.value,
//             email: formState.inputs.email.value,
//             password: formState.inputs.password.value
//         }, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         const responseData = response.data;
//         console.log(responseData);
//         auth.login();
//     } catch (err) {
//         console.log(err);
//     }
// }
