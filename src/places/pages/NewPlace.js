import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from "../../shared/util/validators";

import { AuthContext } from "../../shared/context/auth-context";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./PlaceForm.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  }, false);

  const history = useHistory();

  const placeSubmitHandler = async event => {
    // ADD PLACE 를 누르면 새로고침 되는게 Default 설정이므로 새로고침 안되게끔 방지하는 코드
    event.preventDefault();
    try {
      /** Image 가 아닌 경우 JSON */
      // await sendRequest(
      //   `${API_BASE.home}${API_BASE.placesRoutes}${API_PLACES.root}`,
      //   "POST",
      //   JSON.stringify({
      //     title: formState.inputs.title.value,
      //     description: formState.inputs.description.value,
      //     address: formState.inputs.address.value,
      //     creator: auth.userId
      //   }),
      //   { "Content-Type": "application/json" }
      // );
      // // Redirect the user to a different page
      // history.push('/');

      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      // formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);

      await sendRequest(
        `${process.env.REACT_APP_BASE}${process.env.REACT_APP_PLACES_ROUTE}${process.env.REACT_APP_ROOT}`,
        "POST",
        formData,
        { Authorization: `Bearer ${auth.token}` },
      );
      // await sendRequest('http://localhost:5000/api/places', 'POST', formData);
      history.push('/');
    } catch (err) { }
  }
  // console.log(`ADD PLACE 활성화 : ${formState.isValid}`);
  return (
    <React.Fragment>
      <ErrorModal showError={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a valid title"
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please Enter a valid description (at least 5 characters)"
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please Enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload center 
          id="image"
          onInput={inputHandler}
          errorText="please provide a image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace; //