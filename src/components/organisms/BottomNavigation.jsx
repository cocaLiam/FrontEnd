// components/organisms/BottomNavigation.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MenuIcon from '../atoms/icons/MenuIcon';
import HomeIcon from '../atoms/icons/HomeIcon';
import RoutineIcon from '../atoms/icons/RoutineIcon';
import MyIcon from '../atoms/icons/MyIcon';

const BottomNavigation = ({ onDrawerOpen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-between h-16 px-4 bg-white border-t">
      <button onClick={onDrawerOpen} className="p-2">
        <MenuIcon />
      </button>
      <Link to="/" className="p-2">
        <HomeIcon />
      </Link>
      <Link to="/routine" className="p-2">
        <RoutineIcon />
      </Link>
      <Link to="/my" className="p-2">
        <MyIcon />
      </Link>
    </nav>
  );
};

BottomNavigation.propTypes = {
  onDrawerOpen: PropTypes.func.isRequired
};

export default BottomNavigation;