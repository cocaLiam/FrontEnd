// components/atoms/CloseButton.jsx
import PropTypes from "prop-types";
import XIcon from "@/components/atoms/icons/XIcon";

/**
 * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
 * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
 */
// defaultProps 대신 함수 매개변수에 기본값을 직접 지정
function CloseButton({ onClose, color = "text-black" }) {
  // icon: Icon -> props로 받은 icon을 Icon이라는 이름으로 구조분해할당
  // = DefaultIcon -> 기본값 설정
  return (
    <div className="flex justify-end p-2">
      <button
        onClick={onClose}
        type="button"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
      >
        <XIcon color={color} />
      </button>
    </div>
  );
}

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default CloseButton;
