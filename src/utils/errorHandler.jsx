
import PropTypes from 'prop-types';

/**
 * 공통 에러 처리 함수
 * @param {Object} err - 에러 객체
 * @param {Function} setErrorMessage - 에러 메시지를 설정하는 상태 업데이트 함수
 * @param {Function} setIsErrorModalOpen - 에러 모달을 열거나 닫는 상태 업데이트 함수
 */
export const handleError = (err, setErrorMessage, setIsErrorModalOpen) => {
  let message = "알 수 없는 에러가 발생했습니다."; // 기본 에러 메시지

  switch (err.status) {
    case 204:
      message = "사용자를 찾을 수 없습니다."
      break;
    case 400:
      message = "필요한 프로퍼티 누락"
      break;
    case 401:
      message = "인증 토큰에러, 다시 로그인 해주세요 : "
      break;
    case 403:
      message = "비밀번호가 틀립니다. : "
      break;
    case 404:
      message = "DB에 해당 정보가 존재하지 않습니다. : "
      break;
    case 405:
      message = "그룹에 포함된 디바이스들을 다른 그룹으로 옮기거나 삭제 해 주세요. : "
      break;
    case 408:
      message = "없는 DeviceGroup에 기기를 생성 할 수 없습니다. : "
      break;
    case 409:
      message = "이미 존재하는 Data 입니다. : "
      break;
    case 421:
      message = "Email이 유효 하지 않습니다."
      break;
    case 422:
      message = "사용자 입력값 유효하지 않음\n 비밀번호 6글자 이상 : "
      break;
    case 423:
      message = "PinCode가 유효하지 않습니다.\n PinCode를 제대로 입력 해 주세요"
      break;
    case 500:
      message = "로그인 할 수 없습니다. [ 서버 에러 : 비밀번호 검증 오류, DB query ] : "
      break;
    case 133:
      message = "블루투스 연결 에러: ";
      break;
    default:
      if (err.message) {
        message = err.message; // 에러 객체에 메시지가 있으면 사용
      }
  }

  setErrorMessage(message); // 에러 메시지 설정
  setIsErrorModalOpen(true); // 에러 모달 열기
  console.error(`에러 발생: ${message} (상태 코드: ${err.status || "N/A"})`);
};

// PropTypes를 사용하여 handleError 함수의 매개변수 타입 정의
handleError.propTypes = {
  err: PropTypes.shape({
    status: PropTypes.number,
    message: PropTypes.string,
  }).isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setIsErrorModalOpen: PropTypes.func.isRequired,
};
