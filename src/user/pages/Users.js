import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from "../../shared/hooks/http-hook";

import './Users.css'; // CSS 파일 추가

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BASE}${process.env.REACT_APP_USERS_ROUTE}${process.env.REACT_APP_ROOT}`
        );
        setLoadedUsers(responseData.users);
      } catch (err) { }
    };
    fetchUsers();

    // Android WebView에서 호출할 수 있도록 window 객체에 함수 등록
    window.receiveDataFromApp = (data) => {
      console.log("Received data from app:", data);
      addDeviceHandler(`APP to Web : ${data}`)
    };
  }, [sendRequest]);

  // Android WebView의 showToast 호출
  const addDeviceHandler = (msg) => {
    if (window.AndroidInterface && window.AndroidInterface.showToast) {
      window.AndroidInterface.showToast(msg);
    } else {
      console.log("AndroidInterface is not available.");
    }
  };

  return (
    <React.Fragment>
      <ErrorModal showError={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <button className="add-device-button" onClick={() => addDeviceHandler("APP API : Web to APP")}>
          Add Device
        </button>
      </div>
    </React.Fragment>
  );
};

export default Users;
