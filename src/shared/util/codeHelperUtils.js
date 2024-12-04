// function checkProps(obj, props) {
//   props.forEach(prop => {
//     if (obj?.[prop] === undefined) {
//       console.log(
//         `Props Error : %c${prop}%c is missing in `,
//         'color: red; font-weight: bold;', // 첫 번째 스타일: 빨간색
//         'color: white; font-weight: normal;', // 두 번째 스타일: 기본 색상
//         obj
//       );
//     }
//   });
// }
// module.exports = { checkProps };


function checkProps(obj, props) {
  let value = undefined;
  
  props.forEach(prop => {
    value = obj?.[prop];
    if (value === undefined || value === null || value === "") {
      console.log(
        `Props Error : %c${prop}%c is missing or empty in `,
        'color: red; font-weight: bold;', // 첫 번째 스타일: 빨간색
        'color: white; font-weight: normal;', // 두 번째 스타일: 기본 색상
        obj
      );
    }
  });

  for ( let prop of props ) {
    value = obj?.[prop];
    if (value === undefined || value === null || value === "") {
      console.log(
        `Props Error : %c${prop}%c is missing or empty in `,
        'color: red; font-weight: bold;', // 첫 번째 스타일: 빨간색
        'color: white; font-weight: normal;', // 두 번째 스타일: 기본 색상
        obj
      );
    }
  }

  if (value === undefined || value === null || value === ""){ return false; }
  return true;
}
module.exports = { checkProps };


// import { checkProps } from "../../shared/util/codeHelperUtils";
// checkProps(responseData, [ 'userId', 'token' ]);
