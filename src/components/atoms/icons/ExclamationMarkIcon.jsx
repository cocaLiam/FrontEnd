import PropTypes from "prop-types";

// components/atoms/icons/ExclamationMarkIcon.jsx
const ExclamationMarkIcon = ({ color = "text-yellow-300" }) => {
  return (
    <svg
      // className="w-20 h-20 mx-auto text-yellow-300"
      // className="w-20 h-20 mx-auto text-red-500"
      className={`w-20 h-20 max-auto ${color}`}
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
  );
};

ExclamationMarkIcon.propTypes = {
  color: PropTypes.string,
};

export default ExclamationMarkIcon;
