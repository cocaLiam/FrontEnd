// ./hooks/useHttpHook.jsx
import axios from 'axios';
import { useCallback, useRef, useEffect } from 'react';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000/',
  baseURL: 'http://192.168.45.56:5000/',
  timeout: 5000,
});

export const useHttpHook = () => {
  const activeRequests = useRef([]);

  /**
 * 보안이 필요한 API 요청을 처리하는 커스텀 훅
 * 
 * 사용방법:
 * const { sendRequest } = useHttpHook();
 * 
 * // 민감한 API 호출 시
 * const response = await sendRequest({
 *   url: '/api/secure-endpoint',
 *   method: 'POST',
 *   data: {sensitiveData:sensitiveData},
 *   headers: { Authorization: `Bearer ${authStatus.token}` }
 * });
 */
  const sendRequest = useCallback(async (config) => {
    const source = axios.CancelToken.source();
    activeRequests.current.push(source);

    // 상세 로깅 추가
    console.log('HTTP > 전체 설정값:', JSON.stringify(config,null, 2));

    try {
      const response = await axiosInstance({
        ...config,
        cancelToken: source.token
      });

      activeRequests.current = activeRequests.current.filter(
        req => req !== source
      );

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    return () => {
      activeRequests.current.forEach(source => source.cancel());
    };
  }, []);

  return { sendRequest };
};
