// components/atoms/icons/LogoutIcon.jsx
const LogoutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 사용자 아이콘 */}
      <circle cx="9" cy="12" r="3" />
      <path d="M4 16v1a2 2 0 0 0 2 2h3" />
      <path d="M4 8v-1a2 2 0 0 1 2-2h3" />

      {/* 로그아웃 화살표 */}
      <line x1="15" y1="12" x2="21" y2="12" />
      <polyline points="18 9 21 12 18 15" />
    </svg>
  );
};

export default LogoutIcon;
