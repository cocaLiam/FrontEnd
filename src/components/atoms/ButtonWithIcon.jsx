// components/atoms/ButtonWithIcon.jsx
import PropTypes from 'prop-types';

/**
 * icon 으로 받는 이유 : 1. 프로퍼티(인자) 로 받을 때는 소문자로 받아야함 2. props 검사 할때 소문자(icon)여야 검사가능
 * Icon 으로 변수명을 변환하는 이유 : 소문자(icon)는 html으로 변환되지만, 대문자(Icon)은 커스텀컴포넌트로 인식됨
 */
// defaultProps 대신 함수 매개변수에 기본값을 직접 지정
function ButtonWithIcon({ 
  icon: Icon, 
  content = '', 
  classStyle = "",
  onClick = () => {} 
}) {
  // icon: Icon -> props로 받은 icon을 Icon이라는 이름으로 구조분해할당
  // = DefaultIcon -> 기본값 설정
  return (
    <button 
    className={`
      inline-flex        // display: inline-flex; - 인라인 요소처럼 배치되면서 flex 속성 가짐
      items-center       // align-items: center; - flex 아이템들을 수직 중앙 정렬
      space-x-2          // space-x-2: flex 아이템 사이의 간격을 설정
      px-2               // padding-left, padding-right: 1rem; - 좌우 패딩 16px
      py-2               // padding-top, padding-bottom: 0.5rem; - 상하 패딩 8px
      font-bold          // font-weight: 700; - 글꼴 굵기를 굵게
      rounded-lg         // border-radius: 0.25rem; - 모서리를 4px 둥글게
      bg-gray-800      // background-color: #색상코드; - 밝은 회색 배경
      hover:bg-grey      // hover 시 background-color 변경 - 마우스 오버시 회색으로 변경
      text-white       // 글자색을 하얀색으로
      ${classStyle}
    `}
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {content && <span className='text-nowrap'>{content}</span>}  {/* content가 있을 때만 span 렌더링 */}
    </button>
  );
}

ButtonWithIcon.propTypes = {
  icon: PropTypes.elementType,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  classStyle: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default ButtonWithIcon;

