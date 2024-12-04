function getLogDetails() {
  const stack = new Error().stack.split("\n")[3];
  const match = stack.match(/\((.*):(\d+):\d+\)/);
  if (match) {
    const filePath = match[1].split("\\");
    const directoryName = filePath[filePath.length - 2];
    const fileName = filePath[filePath.length - 1];
    return { file: directoryName + '/' + fileName, line: match[2] };
  }
  return { file: "unknown", line: "unknown" };
}

function createCustomLogger(level, color) {
  return function (message) {
    const { file, line } = getLogDetails();
    const formattedMessage = `[${file}][${line}][${level}]> ${message}`;
    console.log(`%c${formattedMessage}`, `color: ${color}`);
  };
}

// 각 로그 레벨에 맞는 색상 적용
const log = {
  debug: createCustomLogger("debug ", "gray"),
  info: createCustomLogger("info  ", "white"),
  notice: createCustomLogger("notice", "green"),
  warn: createCustomLogger("warn  ", "yellow"),
  error: createCustomLogger("error ", "red"),
};

// 사용 예시
const a = 1;
log.error(`a : ${a}`);
log.debug("디버그 메시지");
log.info("정보 메시지");
log.notice("공지 메시지");
log.warn("경고 메시지");
log.error("에러 메시지");

export default log;


// // --3  // react
// const log = require("console-log-level")({ level: "debug" });

// function getLogDetails() {
//   const stack = new Error().stack.split("\n")[3];
//   const match = stack.match(/\((.*):(\d+):\d+\)/);
//   if (match) {
//     const filePath = match[1].split("\\");
//     const directoryName = filePath[filePath.length - 2]; // 파일명만 추출
//     const fileName = filePath[filePath.length - 1]; // 파일명만 추출
//     return { file: directoryName+'/'+fileName, line: match[2] };
//   }
//   return { file: "unknown", line: "unknown" };
// }

// const colors = {
//   reset: "\x1b[0m",
//   gray: "\x1b[90m",
//   white: "\x1b[37m",
//   green: "\x1b[32m",
//   yellow: "\x1b[33m",
//   red: "\x1b[31m",
// };

// function createCustomLogger(level, color) {
//   return function (message) {
//     const { file, line } = getLogDetails();
//     const formattedMessage = `[${file}][${line}][${level}]> ${message}`;
//     console.log(color + formattedMessage + colors.reset);
//   };
// }

// // 각 로그 레벨에 맞는 색상 적용
// log.debug = createCustomLogger ("debug ", colors.gray);
// log.info = createCustomLogger  ("info  ", colors.white);
// log.notice = createCustomLogger("notice", colors.green);
// log.warn = createCustomLogger  ("warn  ", colors.yellow);
// log.error = createCustomLogger ("error ", colors.red);

// // 사용 예시
// const a = 1;
// log.error(`a : ${a}`);
// log.debug("디버그 메시지");
// log.info("정보 메시지");
// log.notice("공지 메시지");
// log.warn("경고 메시지");
// log.error("에러 메시지");

// module.exports = log;