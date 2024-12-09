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

  resConnect: (data) => {
    try {
      // 전달된 데이터가 JSON 문자열인지 확인
      if (typeof data === "string") {
        data = JSON.parse(data); // JSON 문자열을 객체로 변환
      }
  
      console.log(JSON.stringify(data,null, 2)); // JSON 데이터 출력
      console.log(data); // 객체 출력
      console.log(data.macAddress); // macAddress 출력
      console.log(data.deviceName); // deviceName 출력
  
      return true; // Android로 반환
    } catch (error) {
      console.error(`Json String Type 이 아닙니다. : ${data}`);
      return false; // Android로 반환
    }
  }
}


export default andInterface;
