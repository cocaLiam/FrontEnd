import React, { useState, useContext } from "react";
import {
  VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE
} from "../../shared/util/validators";

// eslint-disable-next-line
import axios from 'axios';

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { AuthContext } from "../../shared/context/auth-context";
import { checkProps } from "../../shared/util/codeHelperUtils";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false);

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,     // 기존의 값은 유지하며 
        name: undefined,         // name 필드만 undefined 함
        image: undefined,
      }, formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,    // 기존의 값은 유지하며 
          name: {                 // 다른 필드의 값만 Add 함.
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault(); // 폼 제출 시 기본 동작인 페이지 새로고침을 막고, 다른 작업을 수행할 수 있습니다.
    // console.log(formState.inputs);

    // fetch 함수를 쓰는 경우
    if (isLoginMode) {
      // 로그인 모드일 때의 로직
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BASE}${process.env.REACT_APP_USERS_ROUTE}${process.env.REACT_APP_LOGIN}`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { "Content-Type": "application/json" }
        );
        checkProps(responseData, [ 'userId', 'token' ]);
        auth.login(responseData.userId, responseData.token);
        // auth.login 함수를 씀으로 setToken, setUserId 값이 갱신됨 -> 리렌더링

      } catch (err) { }
      /** image data 가 없는 JSON 타입일떄 */
      // } else {
      //   // 회원가입 모드일 때의 로직
      //   try {
      //     const responseData = await sendRequest(
      //       `${API_BASE.home}${API_BASE.usersRoutes}${API_USERS.signup}`,
      //       'POST',
      //       JSON.stringify({
      //         name: formState.inputs.name.value,
      //         email: formState.inputs.email.value,
      //         password: formState.inputs.password.value
      //       }),
      //       { "Content-Type": "application/json" }
      //     );
      //     console.log(responseData);
      //     // auth.userId = responseData.user.id;
      //     auth.login(responseData.user.id); // useState를 쓰기위함

      //   } catch (err) { }


    } else {
      // 회원가입 모드일 때의 로직
      try {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(
          `${process.env.REACT_APP_BASE}${process.env.REACT_APP_USERS_ROUTE}${process.env.REACT_APP_SIGNUP}`,
          'POST',
          formData
        );
        checkProps(responseData, [ 'userId', 'token' ]);
        auth.login(responseData.userId, responseData.token);
      } catch (err) { }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal showError={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload center id="image"
              onInput={inputHandler}
              errorText="please provide a image"
            />
          )}
          <Input element="input"
            id="email"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid Email address."
            onInput={inputHandler}
          />
          <Input element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "확인" : "회원정보 작성 완료"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>{isLoginMode ? '회원 가입' : '로그인'}으로 가기</Button>
      </Card>
    </React.Fragment>);
};

export default Auth;