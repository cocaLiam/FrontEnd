// components/molecules/ConfirmModal.jsx
import PropTypes from "prop-types";

import CloseButton from "@/components/atoms/CloseButton";
import ExclamationMarkIcon from "@/components/atoms/icons/ExclamationMarkIcon.jsx";
/**
 * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
 * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
 */

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "", content }) => {
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
      <div className="fixed z-50 inline-block w-10/12 p-2 mx-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl top-1/3 left-1/2">
        {/* fixed: 화면에 고정 */}
        {/* inline-block: 컨텐츠 크기에 맞는 블록 */}
        {/* w-10/12: 화면 너비의 10/12 차지 */}
        {/* mx-auto: 좌우 중앙 정렬 */}
        {/* transform -translate-x-1/2 -translate-y-1/2: 가장 왼쪽 위 기준 위치를 컨테이너의 정중앙으로 이동 */}
        {/* bg-white: 배경 흰색 */}
        {/* rounded-md: 모서리 둥글게 */}
        {/* shadow-xl: 그림자 효과 */}
        {/* top-1/3: 화면 위에서 1/3 지점 */}
        {/* left-1/2: 화면 왼쪽에서 1/2 지점 */}

        <CloseButton onClose={onClose} />

        {/* <div className="p-6 pt-0 text-center"> */}
        <div className="flex flex-col items-center justify-center p-6 pt-0">
          {/* <ExclamationMarkIcon color="text-red-200"/> */}
          <ExclamationMarkIcon />
          {title && (
            <h5 className="mt-5 mb-6 text-xl font-normal text-gray-500">
              {title}
            </h5>
          )}
          <h1 className="mt-5 mb-6 text-xl font-normal text-gray-500">
            {content}
          </h1>

          <div className="flex flex-row">
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
    </>
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
