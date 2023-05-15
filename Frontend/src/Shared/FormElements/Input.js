import React from "react";
import "./Input.css";
import { useReducer } from "react";
import { validate } from "../Components/utils/validators";
import { useEffect } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        isValid: validate(action.val, action.validators),
        value: action.val,
      };
    case "BLUR":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [currentState, dispatch] = useReducer(inputReducer, {
    value: props.initialvalue||"",
    isValid: props.initialvalid||false,
    isTouched: false,
  });

  const { onInput, id } = props;
  const { value, isValid } = currentState;
  
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };
  const onBlurHandler = () => {
    dispatch({ type: "BLUR" });
  };

  let element =
    props.element === "input" ? (
      <input
        htmlFor={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={currentState.value}
        onBlur={onBlurHandler}
      ></input>
    ) : (
      <textarea
        htmlFor={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        value={currentState.value}
        onBlur={onBlurHandler}
      ></textarea>
    );

  return (
    <div
      className={`form-control ${
        !currentState.isValid &&
        currentState.isTouched &&
        "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!currentState.isValid && currentState.isTouched && (
        <p>{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;
