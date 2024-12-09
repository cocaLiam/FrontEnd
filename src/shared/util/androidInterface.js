/**
 * @typedef {Object} DeviceInfo
 * @property {string} macAddress - MAC 주소
 * @property {string} deviceName - 장치 이름
 */

const andInterface = {
  /**
   * Android WebView의 showToast 호출
   * @param {string} msg - 표시할 메시지
   */
  showToast: (msg) => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.andShowToast) {
        window.AndroidInterface.andShowToast(msg);
      } else {
        console.log("andShowToast is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  /**
   * Android에서 Web으로 데이터 전달
   * @param {string} data - Android에서 전달된 JSON 문자열
   */
  receiveDataFromApp: (data) => {
    try {
      const parsedData = JSON.parse(data); // JSON 데이터 파싱
      console.log("Parsed Data from Android: ", JSON.stringify(parsedData,null, 2));
    } catch (error) {
      console.error(`Json String Type 이 아닙니다. : ${data}`);
    }
  },

  /**
   * Android에서 전달된 데이터를 처리
   * @param {string|DeviceInfo} data - JSON 문자열 또는 DeviceInfo 객체
   * @returns {boolean} - 처리 결과
   */
  resConnect: (data) => {
    try {
      const jsonObject = typeof data === "string" ? keyCheck(data, "macAddress", "deviceName") : keyCheck(JSON.stringify(data), "macAddress", "deviceName");

      console.log("macAddress:", jsonObject.macAddress); // macAddress 출력
      console.log("deviceName:", jsonObject.deviceName); // deviceName 출력

      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  }
};

/**
 * JSON 문자열인지 확인하고, 필수 키가 모두 존재하는지 검사하는 함수
 * @param {string} jsonString - JSON 문자열
 * @param {...string} keys - 필수 키 목록
 * @returns {DeviceInfo} - JSON 문자열이 유효하고, 필수 키가 모두 존재하면 파싱된 DeviceInfo 객체 반환
 * @throws {Error} - JSON 문자열이 유효하지 않거나 필수 키가 누락된 경우 에러 발생
 */
function keyCheck(jsonString, ...keys) {
  const data = JSON.parse(jsonString);

  if (typeof data !== "object" || data === null) {
    throw new Error("JSON 데이터가 유효한 객체가 아닙니다.");
  }

  const missingKeys = keys.filter((key) => !(key in data));
  if (missingKeys.length > 0) {
    throw new Error(`필수 키가 누락되었습니다: ${missingKeys.join(", ")}`);
  }

  return data;
}

export default andInterface;
