import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // PropTypes import 추가

const SideDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}
      
      {/* 사이드 드로어 */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-4">
          <Link to="/settings" className="py-3">설정</Link>
          <Link to="/profile" className="py-3">개인설정</Link>
          <Link to="/debug" className="py-3">Debug</Link>
        </div>
      </div>
    </>
  );
};

// PropTypes 정의 추가
SideDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default SideDrawer;