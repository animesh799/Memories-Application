import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Card from "../../Shared/Components/Utility/Card/Card";
import "./PlaceForm.css";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../Shared/Components/utils/validators";
import Button from "../../Shared/FormElements/Button";
import Input from "../../Shared/FormElements/Input";
import { useForm } from "../../Shared/hooks/form-hook";
import { useEffect } from "react";
import useHttp from "../../Shared/hooks/http-hook";
import ErrorModal from "../../Shared/Components/Utility/ErrorModal";
import LoadingSpinner from "../../Shared/Components/Utility/LoadingSpinner";
import { AuthContext } from "../../Shared/Components/Context/Auth-context";

const UpdatePlaces = () => {
  const authCtx = useContext(AuthContext);
  const { sendRequest, error, isLoading, onCancelHandler } = useHttp();
  const placeId = useParams().uid;
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const foundPlace = await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
          `/places/${placeId}`
        );
        setLoadedPlace(foundPlace.place);
        if (foundPlace) {
          setFormData(
            {
              title: {
                value: foundPlace.place.title,
                isValid: true,
              },
              description: {
                value: foundPlace.place.description,
                isValid: true,
              },
            },
            true
          );
        }
      } catch (err) {}
    };

    fetchPlace();
  }, [placeId, sendRequest, setFormData]);

  // const foundPlace = Dummy_Places.find((place) => place.id === placeId);
  // useEffect(() => {
  //   if (foundPlace) {
  //     setFormData(
  //       {
  //         title: {
  //           value: foundPlace.title,
  //           isValid: true,
  //         },
  //         description: {
  //           value: foundPlace.description,
  //           isValid: true,
  //         },
  //       },
  //       true
  //     );
  //   }

  //   setIsLoading(false);
  // }, [foundPlace, setFormData]);

  const inputSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
        `/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.input.title.value,
          description: formState.input.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "bearer " + authCtx.token,
        }
      );
    } catch (err) {}

    history.push("/" + authCtx.userId + "/places");
    console.log(formState.input);
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay></LoadingSpinner>
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h1>Could not find place!</h1>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={onCancelHandler}></ErrorModal>
      {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}

      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={inputSubmitHandler}>
          <Input
            element="input"
            type="text"
            id="title"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter valid title"
            onInput={inputChangeHandler}
            initialvalid={true}
            initialvalue={loadedPlace.title}
          ></Input>
          <Input
            element="textarea"
            id="description"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter valid description,min 5 character"
            onInput={inputChangeHandler}
            initialvalid={true}
            initialvalue={loadedPlace.description}
          ></Input>
          <Button type="submit" disabled={!formState.formIsValid}>
            Update Place
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlaces;
