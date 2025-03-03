// components/atoms/CheckBox.jsx
import PropTypes from "prop-types";

const CheckBox = ({ id, name, context, checked, onChange, color = "text-gray-700" }) => {
  return (
    <label
      htmlFor={id}
      // className={`flex items-center px-4 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-100 ${checked ? "border-blue-500" : "border-gray-300"}`}
      className={`flex items-center px-4 py-2 bg-white border rounded-md  ${checked ? "border-blue-500" : "border-white"}`}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="hidden" // 기본 체크박스 스타일 숨김
      />
      <div className={`flex items-center justify-center w-5 h-5 border rounded ${checked ? "bg-blue-500" : "bg-white"} ${color}`}>
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-gray-400 select-none ">{context}</span>
    </label>
  );
};

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  icon: PropTypes.node,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default CheckBox;
