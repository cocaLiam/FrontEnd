/**
 * @typedef {Object} jsonString
 * @property {string} macAddress - MAC 주소
 * @property {string} deviceName - 장치 이름
 */

const andInterface = {
  /**
   * ######################## Web ---API---> Android Function 호출 ########################
   */
  // Android WebView의 showToast 호출
  showToast: (msg) => {
    if (window.AndroidInterface && window.AndroidInterface.andShowToast) {
      window.AndroidInterface.andShowToast(msg);
    } else {
      console.log("AndroidInterface is not available.");
    }
  },


  /**
   * ################## Android ---JsonObject---> Web 으로 DataInfo 전달  ##################
   */
  // 실제 receiveDataFromApp 함수 정의
  receiveDataFromApp: (data) => {
    try {
      const parsedData = JSON.parse(data); // JSON 데이터 파싱
      console.log("Parsed Data from Android: ", JSON.stringify(parsedData, null, 2));
      return true  // Android 쪽에 return 값 반환
    } catch (error) {
      console.error(`Json String Type 이 아닙니다. : ${data}`);
      return false // Android 쪽에 return 값 반환
    }
  },

  /**
 * @param {string|jsonString} data - JSON 문자열 또는 Data 객체
 * @returns {boolean} - 처리 결과
 */
  resConnect: (jsonString) => {
    try {
      // keyCheck 함수로 JSON 문자열 확인 및 필수 키 검사
      const jsonObject = keyCheck(jsonString, "macAddress", "deviceName");

      // keyCheck에서 반환된 data 객체를 사용
      console.log("macAddress:", jsonObject.macAddress); // macAddress 출력
      console.log("deviceName:", jsonObject.deviceName); // deviceName 출력

      return true; // Android로 반환
    } catch (error) {
      // 에러 처리
      console.error(`에러 발생: ${error.message}`);
      return false; // Android로 반환
    }
  }
};

/**
 * JSON 문자열인지 확인하고, 필수 키가 모두 존재하는지 검사하는 함수
 * @param {string} jsonString - JSON 문자열
 * @param {...string} keys - 필수 키 목록
 * @returns {Object} - JSON 문자열이 유효하고, 필수 키가 모두 존재하면 파싱된 객체 반환
 * @throws {Error} - JSON 문자열이 유효하지 않거나 필수 키가 누락된 경우 에러 발생
 */
function keyCheck(jsonString, ...keys) {
  try {
    // JSON 문자열을 객체로 변환
    const data = JSON.parse(jsonString);

    // 데이터가 객체인지 확인
    if (typeof data !== "object" || data === null) {
      throw new Error("JSON 데이터가 유효한 객체가 아닙니다.");
    }

    // 필수 키가 모두 존재하는지 확인
    const hasAllKeys = keys.every((key) => key in data);
    if (!hasAllKeys) {
      throw new Error(`필수 키가 누락되었습니다: ${keys.join(", ")}`);
    }

    // 모든 검사를 통과하면 data 객체 반환
    return data;
  } catch (error) {
    // 에러 처리
    console.error(`에러 발생: ${error.message}`);
    throw error; // 에러를 호출한 쪽으로 전달
  }
}


export default andInterface;
