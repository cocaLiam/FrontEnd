// andInterface.js
import PropTypes from 'prop-types';

export const andInterface = {

/**
====================================================================================================
 * Web(client) --reqXXX--> APP(server) API 호출
 * Request Type
 * Web에서 App으로 Data를 요청하는 Request Interface
 */
  reqScanStart: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqScanStart) {
        console.log("reqScanStart ON.");
        window.AndroidInterface.reqScanStart();
      } else {
        console.log("reqScanStart is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqScanStop: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqScanStop) {
        console.log("reqScanStop ON.");
        window.AndroidInterface.reqScanStop();
      } else {
        console.log("reqScanStop is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqConnect: (macAddress, deviceType) => {
    const deviceInfo = {
      macAddress: macAddress,
      deviceType: deviceType,
    };
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqConnect) {
        console.log("reqConnect ON.");
        window.AndroidInterface.reqConnect(JSON.stringify(deviceInfo));
      } else {
        console.log("reqConnect is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqDisconnect: (macAddress, deviceType) => {
    const deviceInfo = {
      macAddress: macAddress,
      deviceType: deviceType,
    };
    
    if (window.AndroidInterface) {
      if (window.AndroidInterface.reqDisconnect) {
        window.AndroidInterface.reqDisconnect(JSON.stringify(deviceInfo));
      } else {
        console.log("reqDisconnect is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

  reqRemoveParing: (macAddress, deviceType) => {
    // 사용법
    // : andInterface.reqRemoveParing("9C:95:6E:40:0F:75", "ccb_v1")
    const deviceInfo = {
      macAddress: macAddress,
      deviceType: deviceType,
    };
    console.log(
      "reqRemoveParing 보내는 DATA : ",
      JSON.stringify(deviceInfo,null, 2)
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

  reqReadData: (macAddress, deviceType) => {
    const deviceInfo = {
      macAddress: macAddress,
      deviceType: deviceType,
    };
    console.log(
      "reqReadData 보내는 DATA : ",
      JSON.stringify(deviceInfo,null, 2)
    );
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

/**
====================================================================================================
 * Web(client) --pubXXX--> APP(server) API 호출
 * Publisher Type
 * Web에서 App으로 Data를 보내는 publisher Interface
 */
  pubReloadWebView: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.pubReloadWebView) {
        window.AndroidInterface.pubReloadWebView();
      } else {
        console.log("pubReloadWebView is not available.");
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

  pubSendData: (macAddress, deviceType, msg) => {
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
        deviceType: deviceType,
      },
      msg: msg,
    };
    console.log(JSON.stringify(WriteData,null, 2));
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
 * Web(server) --getXXX--> APP(client) 데이터 전달
 *   ↑                      ↓
 *   └--------return--------┘
 * Getter Type
 * Web 이 요청한 Data 를 Reutrn 시켜주는 Getter Interface
 */
  getLocalStorageToken: () => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.getLocalStorageToken) {
        return window.AndroidInterface.getLocalStorageToken();
      } else {
        console.log("getLocalStorageToken is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

/**
====================================================================================================
 * Web(server) --setXXX--> APP(client) 데이터 전달
 * setter Type
 * Web 이 지정한 Data 를 저장하는 Setter Interface
 */
  setLocalStorageToken: (jsonString) => {
    if (window.AndroidInterface) {
      if (window.AndroidInterface.setLocalStorageToken) {
        return window.AndroidInterface.setLocalStorageToken(jsonString);
      } else {
        console.log("setLocalStorageToken is not available.");
      }
    } else {
      console.log("AndroidInterface is not available.");
    }
  },

/**
====================================================================================================
 * APP(client) --resXXX--> Web(server) 데이터 전달
 * Response Type
 * APP 이 Web의 Request에 맞춰 답변하는 Response Interface
 */
  resScanStart: (data) => {
    try {
      console.log("resScanStart 받은 DATA : ",JSON.stringify(data,null, 2));
      
      if (!validateDeviceList(data).isValid) return false; // Paring Device 가 0 개 인 경우
      if (validateDeviceList(data).isValid) {
        console.log(`1 : ${JSON.stringify(data, null, 2)}`);
        console.log(`2 : ${Object.prototype.toString.call(data)}`);
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resScanStop: (data) => {
    try {
      console.log("resScanStop 받은 DATA : ", JSON.stringify(data,null, 2));
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resConnect: (data) => {
    try {
      console.log("resConnect 받은 DATA : ", JSON.stringify(data,null, 2));
      if (validateDeviceInfo(data).isValid) {
        console.log(typeof data); // object
        console.log(data.deviceType);
        console.log(data.macAddress);
        console.log(data.resResult);
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resAutoConnect: (data) => {
    try {
      console.log("resConnect 받은 DATA : ", JSON.stringify(data,null, 2));
      if (validateDeviceInfo(data).isValid) {
        console.log(typeof data); // object
        console.log(data.deviceType);
        console.log(data.macAddress);
        console.log(data.resResult);
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resDisconnect: (data) => {
    try {
      console.log("resDisconnect 받은 DATA : ", JSON.stringify(data,null, 2));
      if (validateDeviceInfo(data).isValid) {
        console.log(typeof data); // object
        console.log(data.deviceType);
        console.log(data.macAddress);
        console.log(data.resResult);
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resRemoveParing: (data) => {
    try {
      console.log("resRemoveParing 받은 DATA : ",JSON.stringify(data,null, 2));
      if (validateDeviceInfo(data).isValid) {
        console.log(typeof data); // object
        console.log(`${data.macAddress} : ${data.deviceType} 기기 페어링 삭제 성공`)
      } else{
        console.log(`${data.macAddress} : ${data.deviceType} 기기 페어링 삭제 실패`)
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resParingInfo: (data) => {
    try {
      console.log("resParingInfo 받은 DATA : ",JSON.stringify(data,null, 2));
      
      if (!validateDeviceList(data).isValid) return false; // Paring Device 가 0 개 인 경우
      if (validateDeviceList(data).isValid) {
        console.log(typeof data); // object
        console.dir(data.deviceList);
        console.log(data.deviceList[0].deviceType);
        console.log(data.deviceList[0].macAddress);
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resConnectedDevices: (data) => {
    try {
      console.log("resConnectedDevices 받은 DATA : ",JSON.stringify(data,null, 2));
      if (!validateDeviceList(data).isValid) return false; // Conneted Device 가 0 개 인 경우
      if (validateDeviceList(data).isValid) {
        console.log(typeof data); // object
        console.dir(data.deviceList);
        console.log(data.deviceList[0].deviceType);
        console.log(data.deviceList[0].macAddress);
      }
      return true; // Android로 반환
    } catch (error) {
      console.error(`에러 발생 1: ${error.message}`);
      return false; // Android로 반환
    }
  },

  resReadData: (data) => {
    try {
      console.log("resReadData 받은 DATA : ", JSON.stringify(data,null, 2));
      if (validateReadOrWriteData(data).isValid) {
        console.log(typeof data); // object
        console.log(data.deviceInfo.deviceType);
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
====================================================================================================
 * APP(client) --subXXX--> Web(server) 데이터 전달
 * Subscriber Type
 * APP이 구독된 Data 를 보내는 Subscriber Interface
 */
  subObserveData: (data) => {
    try {
      console.log("subObserveData 받은 DATA : ", JSON.stringify(data,null, 2));
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
// Validation 함수들
export const validateDeviceInfo = (data={}, withoutResult = false) => {
  const missingKeys = [];
  const emptyValueKeys = [];
  if (!(Object.prototype.hasOwnProperty.call(data, "macAddress"))) {
    missingKeys.push("macAddress");
  } else if (!data.macAddress || data.macAddress.trim() === "") {
    emptyValueKeys.push("macAddress");
  }
  if (!(Object.prototype.hasOwnProperty.call(data, "deviceType"))) {
    missingKeys.push("deviceType");
  } else if (!data.deviceType || data.deviceType.trim() === "") {
    emptyValueKeys.push("deviceType");
  }
  if (!(withoutResult)) {
    if (!(Object.prototype.hasOwnProperty.call(data, "resResult"))) {
      missingKeys.push("resResult");
    } else if (data.resResult == false) {
      emptyValueKeys.push("resResult");
    }
  }
  return {
    isValid: missingKeys.length === 0 && emptyValueKeys.length === 0,
    missingKeys,
    emptyValueKeys,
  };
}

export const validateDeviceList = (data) => {
  const missingKeys = [];
  const invalidItems = [];
  // if (!data.hasOwnProperty("deviceList")) {
  if (!(Object.prototype.hasOwnProperty.call(data, "deviceList"))) {
    missingKeys.push("deviceList");
  } else if (!Array.isArray(data.deviceList)) {
    return {
      isValid: false,
      error: "deviceList가 배열이 아닙니다.",
    };
  } else {
    data.deviceList.forEach((item, index) => {
      const deviceInfoValidation = validateDeviceInfo(item, true);
      if (!deviceInfoValidation.isValid) {
        invalidItems.push({
          index,
          missingKeys: deviceInfoValidation.missingKeys,
          emptyValueKeys: deviceInfoValidation.emptyValueKeys,
        });
      }
    });
  }

  if(missingKeys.length > 0) console.log(`missingKeys : ${missingKeys}`);
  if(invalidItems.length > 0) console.log(`invalidItems : ${JSON.stringify(invalidItems,null,2)}`);

  return {
    isValid: missingKeys.length === 0 && invalidItems.length === 0,
    missingKeys,
    invalidItems,
  };
}

export const validateReadOrWriteData = (data) => {
  const missingKeys = [];
  const emptyValueKeys = [];
  if (!(Object.prototype.hasOwnProperty.call(data, "deviceInfo"))) {
    missingKeys.push("deviceInfo");
  } else {
    const deviceInfoValidation = validateDeviceInfo(data.deviceInfo, true);
    if (!deviceInfoValidation.isValid) {
      return {
        isValid: false,
        missingKeys: deviceInfoValidation.missingKeys,
        emptyValueKeys: deviceInfoValidation.emptyValueKeys,
      };
    }
  }
  if (!(Object.prototype.hasOwnProperty.call(data, "msg"))) {
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

// PropTypes 정의
andInterface.reqRemoveParing.propTypes = {
  macAddress: PropTypes.string.isRequired,
  deviceType: PropTypes.string.isRequired,
};

andInterface.reqDisconnect.propTypes = {
  macAddress: PropTypes.string.isRequired,
  deviceType: PropTypes.string.isRequired,
};

andInterface.reqReadData.propTypes = {
  macAddress: PropTypes.string.isRequired,
  deviceType: PropTypes.string.isRequired,
};

andInterface.pubToasting.propTypes = {
  msg: PropTypes.string.isRequired,
};

andInterface.pubSendData.propTypes = {
  macAddress: PropTypes.string.isRequired,
  deviceType: PropTypes.string.isRequired,
  msg: PropTypes.object.isRequired,
};

andInterface.resConnect.propTypes = {
  data: PropTypes.object.isRequired,
};

andInterface.resAutoConnect.propTypes = {
  data: PropTypes.object.isRequired,
};

andInterface.resRemoveParing.propTypes = {
  data: PropTypes.object.isRequired,
};

andInterface.resParingInfo.propTypes = {
  data: PropTypes.object.isRequired,
};

andInterface.resConnectedDevices.propTypes = {
  data: PropTypes.object.isRequired,
};

andInterface.resReadData.propTypes = {
  data: PropTypes.object.isRequired,
};

andInterface.subObserveData.propTypes = {
  data: PropTypes.object.isRequired,
};

