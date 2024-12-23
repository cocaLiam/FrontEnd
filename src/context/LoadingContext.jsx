// context/LoadingContext.jsx
import { createContext, useContext, useState } from 'react';
import LoadingSpinner from '../components/atoms/LoadingSpinner';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  // setIsLoading이 호출되면 isLoading 상태가 변경되고
  // isLoading && <LoadingSpinner /> 부분이 재렌더링되어
  // 스피너가 보이거나 사라집니다

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};


// context/LoadingContext.jsx
import PropTypes from 'prop-types';

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired
};


/**
 * 사용법
import { useLoading } from '../../context/LoadingContext';
  const { setIsLoading } = useLoading();
  const handleDrawerOpen = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDrawerOpen(true);
    }, 1000);
  };
 */