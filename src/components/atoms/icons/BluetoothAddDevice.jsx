// components/atoms/icons/BluetoothAddDevice.jsx
const BluetoothAddDevice = () => {
  return (
    <div style={{ color: "white", width: "24px", height: "24px" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        style={{ enableBackground: "new 0 0 100 100" }}
        xmlSpace="preserve"
        fill="currentColor"
      >
        {/* 큰 원 */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />

        {/* 블루투스 마크 */}
        <path d="M66.4,63.6L52.8,50l13.6-13.6c0.8-0.8,0.8-2,0-2.8l-15-15c-0.6-0.6-1.4-0.7-2.2-0.4c-0.7,0.3-1.2,1-1.2,1.8v25.2L36.4,33.6  c-0.8-0.8-2-0.8-2.8,0c-0.8,0.8-0.8,2,0,2.8L47.2,50L33.6,63.6c-0.8,0.8-0.8,2,0,2.8c0.8,0.8,2,0.8,2.8,0L48,54.8V80  c0,0.8,0.5,1.5,1.2,1.8C49.5,82,49.7,82,50,82c0.5,0,1-0.2,1.4-0.6l15-15C67.2,65.6,67.2,64.4,66.4,63.6z M52,24.8L62.2,35L52,45.2  V24.8z M52,75.2V54.8L62.2,65L52,75.2z" />

        {/* Not Connected 알림 마커 */}
        <g transform="translate(70, 20)">
          {/* 오른쪽 위 원 */}
          <circle cx="9" cy="-3" r="18" fill="white" />
          {/* <rect
          x="0"
          y="-15"
          width="30"
          height="30"
          rx="4"
          ry="4"
          fill="white"
        /> */}
          {/* 원 안에 Text */}
          <text
            x="10"
            y="12"
            fill="black"
            fontSize="50"
            // fontWeight="bold"
            textAnchor="middle"
          >
            +
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BluetoothAddDevice;
