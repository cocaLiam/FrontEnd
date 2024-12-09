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
  // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
  // registerAndroidInterface: (callback) => {
  //   window.receiveDataFromApp = (data) => {
  //     try {
  //       const parsedData = JSON.parse(data); // JSON 데이터 파싱
  //       callback(parsedData);
  //     } catch (error) {
  //       console.error(`Json String Type 이 아닙니다. : ${data}`);
  //     }
  //   };
  // }
    // 실제 receiveDataFromApp 함수 정의
    receiveDataFromApp: (data) => {
      try {
        const parsedData = JSON.parse(data); // JSON 데이터 파싱
        console.log("Parsed Data from Android: ", parsedData);
        // 필요한 추가 로직 작성
      } catch (error) {
        console.error(`Json String Type 이 아닙니다. : ${data}`);
      }
    }
}
  

export default andInterface;
