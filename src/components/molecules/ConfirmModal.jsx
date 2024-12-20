// components/molecules/ConfirmModal.jsx
import PropTypes from "prop-types";

/**
 * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
 * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
 */

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "", content }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modelConfirm"
      className="fixed inset-0 z-50 w-full h-full px-4 overflow-y-auto bg-gray-900 bg-opacity-60 "
    >
      <div className="relative max-w-md mx-auto bg-white rounded-md shadow-xl top-40">
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <svg
            className="w-20 h-20 mx-auto text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          {title && (
            <h5 className="mt-5 mb-6 text-xl font-normal text-gray-500">
              {title}
            </h5>
          )}
          <h1 className="mt-5 mb-6 text-xl font-normal text-gray-500">
            {content}
          </h1>
          <button
            onClick={onConfirm}
            type="button"
            className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
          >
            확인
          </button>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
            data-modal-toggle="delete-user-modal"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
};

export default ConfirmModal;

/**
 * 사용법 [ 트리거 : Debug 버튼 ]
import ConfirmModal from "../molecules/ConfirmModal";

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const handleConfirm = () => {
    // 확인 버튼 클릭 시 실행할 로직
    console.log("확인 버튼 클릭됨");
    setIsConfirmModalOpen(false);
  };

  return (
    // 트리거
    <button onClick={() => {
        setIsConfirmModalOpen(true);
      }}
    >
      Debug
    </button>

    <ConfirmModal
    isOpen={isConfirmModalOpen}
    onClose={() => setIsConfirmModalOpen(false)}
    onConfirm={handleConfirm}
    title="작업 확인"
    content="정말 이 작업을 진행하시겠습니까?"
    />

  )
 */