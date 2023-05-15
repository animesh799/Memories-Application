import React, { useContext } from "react";
import "./PlaceForm.css";
import Input from "../../Shared/FormElements/Input";

import Button from "../../Shared/FormElements/Button";
import { useForm } from "../../Shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/Components/utils/validators";
import useHttp from "../../Shared/hooks/http-hook";
import LoadingSpinner from "../../Shared/Components/Utility/LoadingSpinner";
import { AuthContext } from "../../Shared/Components/Context/Auth-context";
import { useHistory } from "react-router-dom";
import ErrorModal from "../../Shared/Components/Utility/ErrorModal";
import ImageUpload from "../../Shared/FormElements/ImageUpload";

const NewPlace = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const { isLoading, error, onCancelHandler, sendRequest } = useHttp();
  const [formState, inputChangeHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image:{
        value: null,
        isValid: false,
      },
    },
    false
  );
  // const [formState, dispatch] = useReducer(inputReducer, {
  //   input: {
  //     title: {
  //       value: "",
  //       isValid: false,
  //     },
  //     description: {
  //       value: "",
  //       isValid: false,
  //     },
  //   },
  //   formIsValid: false,
  // });

  const inputSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formdata = new FormData();
      formdata.append("title", formState.input.title.value);
      formdata.append("description", formState.input.description.value);
      formdata.append("address", formState.input.address.value);
      formdata.append("image", formState.input.image.value);
      await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
        "/places",
        "POST",
        formdata,{
          Authorization:"bearer "+authCtx.token
        }
      );
      history.push("/");
    } catch (err) {}
  };

  // const inputStateHandler = useCallback((id, value, isValid) => {
  //   dispatch({
  //     type: "INPUT_CHANGE",
  //     inputId: id,
  //     value: value,
  //     isValid: isValid,
  //   });
  // }, []);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={onCancelHandler}></ErrorModal>
      <form className="place-form" onSubmit={inputSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <Input
          id="title"
          element="input"
          label="Title"
          errorText="Please enter the valid text"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputChangeHandler}
        ></Input>

        <Input
          id="description"
          element="textarea"
          label="Description"
          errorText="Please enter the valid description maybe 5 char long"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={inputChangeHandler}
        ></Input>
        <ImageUpload
        errorText="Please pick valid image file"
        center
        onInput={inputChangeHandler}
        id="image">

        </ImageUpload>

        <Input
          id="address"
          element="input"
          label="Address"
          errorText="Please enter the valid Address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputChangeHandler}
        ></Input>
        <Button disabled={!formState.formIsValid} type="submit">
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
