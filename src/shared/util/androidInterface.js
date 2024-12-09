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
    // resConnect(macAddress: String, deviceName: String)
    try {
      console.log(JSON.stringify(data, null, 2))
      console.log(data)
      console.log(data.macAddress)
      console.log(data.deviceName)
      return true  // Android 쪽에 return 값 반환
    } catch (error) {
      console.error(`Json String Type 이 아닙니다. : ${data}`);
      return false // Android 쪽에 return 값 반환
    }
  }
}


export default andInterface;
