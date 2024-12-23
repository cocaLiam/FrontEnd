// components/molecules/ErrorModal.jsx
import PropTypes from "prop-types";
import ErrorIcon from "../atoms/icons/ErrorIcon";

/**
 * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
 * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
 */

const ErrorModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-10 overflow-y-auto" id="my-modal">
    <div className="fixed inset-0 z-50 w-full h-full bg-gray-600 bg-opacity-30">
    {/* 모달의 최상위 컨테이너. 전체 화면을 차지하며 스크롤 가능 */}

      {/* <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"> */}
      <div className="absolute p-6 space-y-2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-lg shadow-lg top-1/2 left-1/2">
      {/* 모달 컨텐츠를 세로/가로 중앙 정렬하기 위한 컨테이너 */}



        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* 실제 모달 컨텐츠 박스 */}

          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          {/* 아이콘 컨테이너 */}
            <ErrorIcon />
          </div>

          <div className="mt-3 text-center sm:mt-5">
          {/* 텍스트 컨텐츠 영역 */}

            <h3 className="text-lg font-medium leading-6 text-gray-900">
            {/* 모달 제목 */}
              Error
            </h3>

            <div className="mt-2">
            {/* 모달 내용 */}
              <p className="text-sm text-gray-500">{content}</p>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes 정의 추가
ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

export default ErrorModal;



/**
 * 사용법 [ 트리거 : Debug 버튼 ]
import ErrorModal from "../molecules/ErrorModal";

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  <button onClick={() => {
    setIsErrorModalOpen(true);
  }}
  >
    Debug
  </button>

  <ErrorModal
  isOpen={isErrorModalOpen}
  onClose={() => setIsErrorModalOpen(false)}
  content="에러 모달 테스트"
  />
 */