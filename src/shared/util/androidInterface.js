/**
 * @typedef {Object} DeviceInfo
 * @property {string} macAddress - MAC 주소
 * @property {string} deviceName - 장치 이름
 */

/**
 * @typedef {Object} ReadData
 * @property {DeviceInfo} deviceInfo - DeviceInfo
 * @property {Object} msg - JSON 형식의 메세지
 */

/**
 * @typedef {Object} WriteData
 * @property {DeviceInfo} deviceInfo - DeviceInfo
 * @property {JSON} msg - JSON 형식의 메세지
 */

/**
 * @typedef {Object} DeviceList
 * @property {DeviceInfo[]} deviceList - 디바이스들 주소 배열
 */

export const andInterface = {
  /**
====================================================================================================
     * Web(client) -> APP(server) API 호출
     * Web에서 App으로 데이터를 전달받는 인터페이스
     */
  pubToasting: (msg) => {
    console.log(window.AndroidInterface); // AndroidInterface 객체 확인
    console.log(window.AndroidInterface.pubSendData); // pubSendData 메서드 확인
    if (window.AndroidInterface) {
      if (window.AndroidInterface.pubToasting) {
        window.AndroidInterface.pubToasting(msg);
      } else {
        console.log("pubToasting is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  pubSendData: (macAddress, deviceName, msg) => {
    const WriteData = {
      deviceInfo: {
        macAddress: macAddress,
        deviceName: deviceName,
      },
      msg: msg,
    };
    console.log(JSON.stringify(WriteData, null, 2));
    console.log(window.AndroidInterface); // AndroidInterface 객체 확인
    console.log(window.AndroidInterface.pubSendData); // pubSendData 메서드 확인
    if (window.AndroidInterface) {
      if (window.AndroidInterface.pubSendData) {
        window.AndroidInterface.pubSendData(JSON.stringify(WriteData));
      } else {
        console.log("pubSendData is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  /**
====================================================================================================
     * APP(client) -> Web(server) 데이터 전달
     * 1. Response 타입 , 2. Subscribe 타입
     * 1. Response 타입 : Web(req) --> App(res) --> Web
     * 2. Subscribe 타입 : App(publish) --> Web
     */
  /**
   * @param {string|DeviceInfo} data - DeviceInfo 객체
   * @returns {boolean} - 처리 결과
   */
  resConnect: (data) => {
    try {
      if (validateDeviceInfo(data).isValid) {
        console.log("resConnect 받은 DATA : ", JSON.stringify(data, null, 2));
        console.log(typeof data); // object
        console.log(data.deviceName);
        console.log(data.macAddress);
      }

      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  /**
   * @param {string|DeviceList} data - DeviceList 객체
   * @returns {boolean} - 처리 결과
   */
  resParingInfo: (data) => {
    try {
      if (validateDeviceList(data).isValid) {
        console.log(
          "resParingInfo 받은 DATA : ",
          JSON.stringify(data, null, 2)
        );
        console.log(typeof data); // object
        console.dir(data.deviceList);
        console.log(data.deviceList[0].deviceName);
        console.log(data.deviceList[0].macAddress);
      }

      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  /**
   * @param {string|ReadData} data - ReadData 객체
   * @returns {boolean} - 처리 결과
   */
  resReadData: (data) => {
    try {
      if (validateReadOrWriteData(data).isValid) {
        console.log("resReadData 받은 DATA : ", JSON.stringify(data, null, 2));
        console.log(typeof data); // object
        console.log(data.deviceInfo.deviceName);
        console.log(data.deviceInfo.macAddress);
        for (const [key, value] of Object.entries(data.msg)) {
          console.log(`키: ${key}, 값: ${value}`);
        }
      }

      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  /**
   * @param {string|jsonObject} data - JSON 문자열
   * @returns {boolean} - 처리 결과
   */
  subObserveData: (data) => {
    try {
      console.log("subObserveData 받은 DATA : ", JSON.stringify(data, null, 2));
      console.log(typeof data); // object
      for (const [key, value] of Object.entries(data)) {
        console.log(`키: ${key}, 값: ${value}`);
      }

      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },
};

// ---------------------------------- Util성 Validation 함수들 --------------------------------------
/**
 * DeviceInfo 타입 검사
 * @param {Object} data - 검사할 데이터
 * @returns {Object} 검사 결과
 */
export function validateDeviceInfo(data) {
  const missingKeys = [];
  const emptyValueKeys = [];

  if (!data.hasOwnProperty("macAddress")) {
    missingKeys.push("macAddress");
  } else if (!data.macAddress || data.macAddress.trim() === "") {
    emptyValueKeys.push("macAddress");
  }

  if (!data.hasOwnProperty("deviceName")) {
    missingKeys.push("deviceName");
  } else if (!data.deviceName || data.deviceName.trim() === "") {
    emptyValueKeys.push("deviceName");
  }

  return {
    isValid: missingKeys.length === 0 && emptyValueKeys.length === 0,
    missingKeys,
    emptyValueKeys,
  };
}

/**
 * DeviceList 타입 검사
 * @param {Object} data - 검사할 데이터
 * @returns {Object} 검사 결과
 */
export function validateDeviceList(data) {
  const missingKeys = [];
  const invalidItems = [];

  // deviceList 검사
  if (!data.hasOwnProperty("deviceList")) {
    missingKeys.push("deviceList");
  } else if (!Array.isArray(data.deviceList)) {
    return {
      isValid: false,
      error: "deviceList가 배열이 아닙니다.",
    };
  } else {
    // 배열 내부의 각 DeviceInfo 검사
    data.deviceList.forEach((item, index) => {
      const deviceInfoValidation = validateDeviceInfo(item);
      if (!deviceInfoValidation.isValid) {
        invalidItems.push({
          index,
          missingKeys: deviceInfoValidation.missingKeys,
          emptyValueKeys: deviceInfoValidation.emptyValueKeys,
        });
      }
    });
  }

  return {
    isValid: missingKeys.length === 0 && invalidItems.length === 0,
    missingKeys,
    invalidItems,
  };
}

/**
 * ReadData/WriteData 타입 검사
 * @param {Object} data - 검사할 데이터
 * @returns {Object} 검사 결과
 */
function validateReadOrWriteData(data) {
  const missingKeys = [];
  const emptyValueKeys = [];

  // DeviceInfo 검사
  if (!data.hasOwnProperty("deviceInfo")) {
    missingKeys.push("deviceInfo");
  } else {
    const deviceInfoValidation = validateDeviceInfo(data.deviceInfo);
    if (!deviceInfoValidation.isValid) {
      return {
        isValid: false,
        missingKeys: deviceInfoValidation.missingKeys,
        emptyValueKeys: deviceInfoValidation.emptyValueKeys,
      };
    }
  }

  // msg 검사
  if (!data.hasOwnProperty("msg")) {
    missingKeys.push("msg");
  } else if (typeof data.msg !== "object" || data.msg === null) {
    emptyValueKeys.push("msg");
  }

  return {
    isValid: missingKeys.length === 0 && emptyValueKeys.length === 0,
    missingKeys,
    emptyValueKeys,
  };
}
