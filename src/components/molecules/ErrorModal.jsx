// components/molecules/ErrorModal.jsx
import PropTypes from "prop-types";
import XIcon from "@/components/atoms/icons/XIcon";

/**
 * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
 * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
 */

const ErrorModal = ({ isOpen, onClose, content="" }) => {
  if (!isOpen) return null;

  return (
    <>
    {/* 모달 컨테이너 배경화면 (오버레이) */}
    {isOpen && (
      <div 
        className="fixed inset-0 z-30 w-full h-full bg-black bg-opacity-30" 
        onClick={onClose}
      />
    )}
      
      {/* 모달 컨테이너 */}
      <div className="fixed z-50 inline-block p-2 mx-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl top-1/3 left-1/2">

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* 실제 모달 컨텐츠 박스 */}

          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          {/* 아이콘 컨테이너 */}
            <XIcon />
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
    </>
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