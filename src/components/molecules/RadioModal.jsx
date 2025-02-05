// components/molecules/RadioModal.jsx
import PropTypes from "prop-types";

import RadioButton from "@/components/atoms/RadioButton";
import DebugIcon from "@/components/atoms/icons/DebugIcon";
import CloseButton from "@/components/atoms/CloseButton";

const RadioModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "",
  contents,
  setSelectedContent,
  confirmButtonContent = "변경"
}) => {
  if (!isOpen) return null;

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
      {/* <div className="fixed z-50 inline-block w-10/12 p-2 mx-auto overflow-y-auto transform -translate-x-1/2 bg-orange-100 rounded-md shadow-xl -translate-y-1/3 top-1/2 left-1/2"> */}
      <div className="fixed z-50 inline-block w-10/12 p-2 mx-auto transform -translate-x-1/2 bg-orange-100 rounded-md shadow-xl -translate-y-1/3 top-1/3 left-1/2">
      {/* <div className="fixed z-50 inline-block w-10/12 p-2 mx-auto transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-md shadow-xl top-1/2 left-1/2 max-h-[80vh] overflow-y-auto"> */}

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
        <legend className="mb-4 text-xl font-bold text-center text-black select-none">
          {title}
        </legend>
        <div className="flex flex-col gap-1 font-semibold">
          {contents.map((content) => (
            <RadioButton
              key={content} // React에서 key는 필수!
              icon={<DebugIcon />}
              context={content}
              color="text-blue-500"
              id={content}
              name="status"
              checked={false}
              onChange={() => {
                setSelectedContent(content);
              }}
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
            onClick={onConfirm}
          >
            {confirmButtonContent}
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

RadioModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  contents: PropTypes.array.isRequired,
  setSelectedContent: PropTypes.func.isRequired,
  confirmButtonContent: PropTypes.string,
};

export default RadioModal;
