import React, { useState } from "react";
import Input from "../../Shared/FormElements/Input";
import { useForm } from "../../Shared/hooks/form-hook";
import "./Auth.css";
import { useContext } from "react";
import { AuthContext } from "../../Shared/Components/Context/Auth-context";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/Components/utils/validators";
import Button from "../../Shared/FormElements/Button";
import Card from "../../Shared/Components/Utility/Card/Card";
import ErrorModal from "../../Shared/Components/Utility/ErrorModal";
import LoadingSpinner from "../../Shared/Components/Utility/LoadingSpinner";
import useHttp from "../../Shared/hooks/http-hook";
import ImageUpload from "../../Shared/FormElements/ImageUpload";
const Auth = () => {
  const authCtx = useContext(AuthContext);

  const [showSignupMode, setSignupMode] = useState(false);
  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const { sendRequest, isLoading, error, onCancelHandler } = useHttp();
  const authStateChangeHandler = () => {
    if (!showSignupMode) {
      setFormData(
        {
          ...formState.input,
          username: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    } else {
      setFormData(
        {
          ...formState.input,
          username: undefined,
          image: undefined,
        },
        formState.input.email.isValid && formState.input.password.isValid
      );
    }
    setSignupMode((prevState) => !prevState);
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.input);

    if (!showSignupMode) {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
          "/users/login",
          "POST",
          JSON.stringify({
            email: formState.input.email.value,
            password: formState.input.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formdata = new FormData();
        formdata.append("username", formState.input.username.value);
        formdata.append("email", formState.input.email.value);
        formdata.append("password", formState.input.password.value);
        formdata.append("image", formState.input.image.value);
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
          "/users/signup",
          "POST",
          formdata
        );
        authCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={onCancelHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{showSignupMode ? "SIGN-UP " : "Login Required"}</h2>
        <hr></hr>
        <form onSubmit={submitHandler}>
          {showSignupMode && (
            <Input
              validators={[VALIDATOR_REQUIRE()]}
              type="text"
              placeholder="username"
              id="username"
              element="input"
              onInput={inputChangeHandler}
              errorText="Please enter valid Username"
              label="Username"
            ></Input>
          )}
          {showSignupMode && (
            <ImageUpload
              errorText="Please pick valid image file"
              id="image"
              center
              onInput={inputChangeHandler}
            />
          )}
          <Input
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
            type="email"
            placeholder="your email"
            id="email"
            element="input"
            onInput={inputChangeHandler}
            errorText="Please enter valid email"
            label="E-mail"
          ></Input>
          <Input
            validators={[VALIDATOR_MINLENGTH(6), VALIDATOR_REQUIRE()]}
            type="password"
            placeholder="your password"
            id="password"
            element="input"
            onInput={inputChangeHandler}
            errorText="Please enter valid Password,min 6 character"
            label="Password"
          ></Input>
          <Button type="submit" disabled={!formState.formIsValid}>
            {showSignupMode ? "SIGN-UP" : "LOGIN"}
          </Button>
          <Button inverse onClick={authStateChangeHandler} type="button">
            SWITCH TO {!showSignupMode ? "SIGN-UP" : "LOGIN"}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
