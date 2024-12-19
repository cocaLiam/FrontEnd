// components/molecules/Modal.jsx
"use client";

import PropTypes from "prop-types"; // PropTypes import 추가

import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const TextModal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 박스 */}
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6"> 
        {/* 컨텐츠 영역 */}
        <div className="mb-6 text-lg text-gray-500"> 
          {content}
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-gray-500"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  content 
}) => {
  return (
    // Flowbite Modal 컴포넌트
    // show: 모달 표시 여부
    // size: 모달 크기 (sm, md, lg, xl)
    // popup: 팝업 스타일 적용
    <Modal show={isOpen} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        {/* 모달 내용을 중앙 정렬하는 컨테이너 */}
        {/* <div className="text-center"> */}
        <div className="inset-0 items-center justify-center text-center">
          {/* 경고 아이콘 
              mx-auto: 가운데 정렬
              mb-4: 하단 여백
              text-gray-400: 아이콘 색상
              h-14 w-14: 아이콘 크기
              dark:text-gray-200: 다크모드에서의 색상 */}
          <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-100" />
          
          {/* 모달 제목
              mb-5: 하단 여백
              text-lg: 글자 크기
              font-normal: 글자 두께
              text-gray-500: 글자 색상
              dark:text-gray-400: 다크모드에서의 색상 */}
          <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
            {title}
          </h3>

          {/* 모달 내용 텍스트
              mb-5: 하단 여백
              text-gray-500: 글자 색상
              dark:text-gray-400: 다크모드에서의 색상 */}
          <p className="mb-5 text-gray-800 dark:text-gray-400">
            {content}
          </p>

          {/* 버튼 컨테이너
              flex: 플렉스 박스 레이아웃
              justify-center: 가운데 정렬
              gap-4: 버튼 사이 간격 */}
          <div className="flex justify-center gap-4">
            {/* 확인 버튼 - Flowbite Button 컴포넌트 
                color="failure": 빨간색 계열 버튼 */}
            <Button color="failure" onClick={onConfirm}>
              확인
            </Button>
            
            {/* 취소 버튼 - Flowbite Button 컴포넌트
                color="gray": 회색 계열 버튼 */}
            <Button color="gray" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

// PropTypes 정의 추가
TextModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

// 1. 한꺼번에 export
export { TextModal, ConfirmModal };
// 2. 개별적으로 export
// export const TextModal = TextModal;
// export const ConfirmModal = ConfirmModal;


/**
 * Modal 컴포넌트 사용법

1. TextModal 사용 예시
- 단순 텍스트 표시와 닫기 버튼만 있는 기본 모달

import { TextModal } from '../components/molecules/Modal';

const [isTextModalOpen, setIsTextModalOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsTextModalOpen(true)}>
      텍스트 모달 열기
    </button>
    
    <TextModal
      isOpen={isTextModalOpen}
      onClose={() => setIsTextModalOpen(false)}
      content="안내 메시지를 여기에 입력하세요."
    />
  </>
);

2. ConfirmModal 사용 예시
- 확인/취소 버튼이 있는 선택 모달

import { ConfirmModal } from '../components/molecules/Modal';

const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

const handleConfirm = () => {
  // 확인 버튼 클릭 시 실행할 로직
  console.log("확인 버튼 클릭됨");
  setIsConfirmModalOpen(false);
};

return (
  <>
    <button onClick={() => setIsConfirmModalOpen(true)}>
      확인 모달 열기
    </button>
    
    <ConfirmModal
      isOpen={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      onConfirm={handleConfirm}
      title="작업 확인"
      content="정말 이 작업을 진행하시겠습니까?"
    />
  </>
);

필수 Props:

TextModal
- isOpen: boolean - 모달 표시 여부
- onClose: function - 모달 닫기 함수
- content: string - 표시할 내용

ConfirmModal
- isOpen: boolean - 모달 표시 여부
- onClose: function - 모달 닫기 함수
- onConfirm: function - 확인 버튼 클릭 시 실행할 함수
- title: string - 모달 제목
- content: string - 모달 내용
 */











// 이전 코드 --------- 기본 양식 -----------------

// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types'; // PropTypes import 추가

// const SideBar = ({ isOpen, onClose }) => {
//   return (
//     <>
//       {/* 오버레이 */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-50"
//           onClick={onClose}
//         />
//       )}

//       {/* 사이드 드로어 */}
//       <div className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         <div className="flex flex-col h-full p-4">
//           <Link to="/settings" onClick={onClose} className="py-3">설정</Link>
//           <Link to="/profile" onClick={onClose} className="py-3">개인설정</Link>
//           <Link to="/debug" onClick={onClose} className="py-3">Debug</Link>
//         </div>
//       </div>
//     </>
//   );
// };

// // PropTypes 정의 추가
// SideBar.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired
// };

// export default SideBar;


