import PropTypes from "prop-types";

// components/atoms/icons/ErrorIcon.jsx
const XIcon = ({color="text-red-600"}) => {
  return (
    <svg
      className={`w-6 h-6 ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

XIcon.propTypes = {
  color: PropTypes.string,
};


export default XIcon;
