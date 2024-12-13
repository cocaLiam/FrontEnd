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

const andInterface = {
  /**
====================================================================================================
     * Web(client) -> APP(server) API 호출
     * Web에서 App으로 데이터를 전달받는 인터페이스
     */

  reqConnect: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqConnect) {
        window.AndroidInterface.reqConnect();
      } else {
        console.log("reqConnect is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqRemoveParing: (macAddress, deviceName) => {
    const deviceInfo = {
      macAddress: macAddress,
      deviceName: deviceName,
    };
    console.log(
      "reqRemoveParing 보내는 DATA : ",
      JSON.stringify(deviceInfo, null, 2)
    );
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqRemoveParing) {
        window.AndroidInterface.reqRemoveParing(JSON.stringify(deviceInfo));
      } else {
        console.log("reqRemoveParing is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqParingInfo: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqParingInfo) {
        window.AndroidInterface.reqParingInfo();
      } else {
        console.log("reqParingInfo is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqConnectedDevices: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqConnectedDevices) {
        console.log("reqConnectedDevices ON.");
        window.AndroidInterface.reqConnectedDevices();
      } else {
        console.log("reqConnectedDevices is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqReadData: (macAddress, deviceName) => {
    const deviceInfo = {
      macAddress: macAddress,
      deviceName: deviceName,
    };
    console.log(
      "reqReadData 보내는 DATA : ",
      JSON.stringify(deviceInfo, null, 2)
    );
    console.log(window.AndroidInterface); // AndroidInterface 객체 확인
    console.log(window.AndroidInterface.reqReadData); // pubSendData 메서드 확인
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqReadData) {
        window.AndroidInterface.reqReadData(JSON.stringify(deviceInfo));
      } else {
        console.log("reqReadData is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  pubToasting: (msg) => {
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

  pubDisconnectAllDevice: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.pubDisconnectAllDevice) {
        window.AndroidInterface.pubDisconnectAllDevice();
      } else {
        console.log("pubDisconnectAllDevice is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  pubSendData: (macAddress, deviceName, msg) => {
    /**     사용법
     *      andInterface.pubSendData(
              "55:55:55:55",
              "Device_1",
              { "key_web": "val_Web" }
            )
     */
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
   * @param {string|DeviceInfo} data - DeviceInfo 객체
   * @returns {boolean} - 처리 결과
   */
  resRemoveParing: (data) => {
    try {
      if (validateDeviceInfo(data).isValid) {
        console.log(
          "resRemoveParing 받은 DATA : ",
          JSON.stringify(data, null, 2)
        );
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
      if (!validateDeviceList(data).isValid) return false; // Paring Device 가 0 개 인 경우
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
   * @param {string|DeviceList} data - DeviceList 객체
   * @returns {boolean} - 처리 결과
   */
  resConnectedDevices: (data) => {
    try {
      if (!validateDeviceList(data).isValid) return false; // Conneted Device 가 0 개 인 경우
      if (validateDeviceList(data).isValid) {
        console.log(
          "resConnectedDevices 받은 DATA : ",
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
function validateDeviceInfo(data) {
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
function validateDeviceList(data) {
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

export default andInterface;
