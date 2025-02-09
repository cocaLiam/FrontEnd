// components/atoms/RadioButton.jsx
import PropTypes from "prop-types";

/**
 * Radio Button 컴포넌트
 * @param {Object} props
 * @param {ReactNode} props.icon - 아이콘 컴포넌트 (ReactNode로 전달)
 * @param {string} props.context - 버튼에 표시될 텍스트
 * @param {string} props.color - 텍스트 색상 클래스 (Tailwind CSS 적용)
 * @param {string} props.id - 라벨과 input의 고유 ID
 * @param {string} props.name - 라디오 버튼 그룹 이름
 * @param {boolean} props.checked - 초기 선택 여부
 * @param {Function} props.onChange - 라디오 버튼 변경 이벤트 핸들러
 */
function RadioButton({
  icon = null,
  context = "",
  color = "text-black",
  id = "",
  name = "status",
  checked = false,
  onChange // 새로운 프롭 추가
}) {
  return (
    <label
      htmlFor={id}
      className={`font-medium h-10 relative hover:bg-zinc-100 flex items-center px-3 gap-2 rounded-lg 
      peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:ring peer-checked:ring-blue-300 select-none ${color}`}
    >
      {icon && <div className="w-5">{icon}</div>}
      {context && <span>{context}</span>}
      <input
        type="radio"
        name={name}
        id={id}
        defaultChecked={checked}
      onChange={onChange} // 변경 이벤트 핸들러 등록
        className="absolute right-3"
      />
    </label>
  );
}

RadioButton.propTypes = {
  icon: PropTypes.node, // ReactNode로 아이콘 컴포넌트 받기
  context: PropTypes.string, // 버튼 텍스트
  color: PropTypes.string, // Tailwind 색상 클래스
  id: PropTypes.string.isRequired, // 필수: id는 유일해야 함
  name: PropTypes.string, // 라디오 버튼 그룹 이름
  checked: PropTypes.bool, // 체크 상태
  onChange: PropTypes.func.isRequired,
};

export default RadioButton;


// // components/atoms/RadioButton.jsx
// import PropTypes from "prop-types";
// import XIcon from "@/components/atoms/icons/XIcon";

// /**
//  * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
//  * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
//  */
// // defaultProps 대신 함수 매개변수에 기본값을 직접 지정
// function RadioButton({ icon = "", context, color = "text-black" }) {
//   // icon: Icon -> props로 받은 icon을 Icon이라는 이름으로 구조분해할당
//   // = DefaultIcon -> 기본값 설정
//   return (
//     <label
//       htmlFor="html"
//       name="status"
//       className="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-blue-300 has-[:checked]:ring-1 select-none"
//     >
//       <div className="w-5 fill-blue-500">{icon}</div>
//       {context}
//       <input
//         checked=""
//         type="radio"
//         name="status"
//         className="absolute w-4 h-4 peer/html accent-current right-3"
//         id="html"
//       />
//     </label>
//   );
// }

// RadioButton.propTypes = {
//   icon: PropTypes.func.isRequired,
//   context: PropTypes.string,
//   color: PropTypes.string
// };

// export default RadioButton;
