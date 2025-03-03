// components/molecules/MultiSelectModal.jsx
import PropTypes from "prop-types";

import CloseButton from "@/components/atoms/CloseButton";
import CheckBox from "@/components/atoms/CheckBox"; // 체크박스 컴포넌트를 사용할 것을 가정

import { useState } from "react";

const MultiSelectModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "",
  contents,
  confirmButtonContent = "완료",
}) => {
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 값들을 배열로 관리

  if (!isOpen) return;

  // 체크박스 상태를 업데이트하는 함수
  const toggleSelection = (item) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(item)) {
        // 이미 선택되어 있으면 제거
        return prevSelected.filter((selectedItem) => selectedItem !== item);
      } else {
        // 선택되어 있지 않으면 추가
        return [...prevSelected, item];
      }
    });
  };

  return (
    <>
      {/* 모달 컨테이너 배경화면 (오버레이) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 w-full h-full bg-black bg-opacity-30"
          onClick={(e) => {
            onClose();
            e.stopPropagation();
          }}
        />
      )}

      {/* 모달 컨테이너 */}
      <div className="fixed z-50 inline-block w-10/12 p-2 mx-auto transform -translate-x-1/2 bg-orange-100 rounded-md shadow-xl -translate-y-1/3 top-1/3 left-1/2">
        <CloseButton onClose={onClose} />
        <legend className="mb-4 text-xl font-bold text-center text-black select-none">
          {title}
        </legend>
        <div className="flex flex-col gap-1 font-semibold">
          {contents.map((content) => (
            <CheckBox
              key={content} // React에서 key는 필수!
              id={content}
              name="multi-select"
              context={content}
              checked={selectedItems.includes(content)} // 선택 상태 관리
              onChange={() => toggleSelection(content)}
              color="text-blue-500"
            />
          ))}
          <div className="grid grid-cols-2 gap-2 px-1 py-2">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={() => onConfirm(selectedItems)} // 선택된 값들 전달
            >
              {confirmButtonContent}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

MultiSelectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  contents: PropTypes.array.isRequired,
  confirmButtonContent: PropTypes.string,
};

export default MultiSelectModal;
