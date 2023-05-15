import { useReducer } from "react";
import { useCallback } from "react";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.input) {
        if (!state.input[inputId]) continue;
        if (action.inputId === inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.input[inputId].isValid;
        }
      }
      return {
        ...state,
        input: {
          ...state.input,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        formIsValid: formIsValid,
      };
    case "SET_DATA":
      return {
        input: action.input,
        formIsValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInput, initialFormValidity) => {
  const [formState, dispatch] = useReducer(inputReducer, {
    input: initialInput,
    formIsValid: initialFormValidity,
  });

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({ type: "SET_DATA", input: inputData, formIsValid: formValidity });
  }, []);

  const inputChangeHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  return [formState, inputChangeHandler, setFormData];
};

// export default useForm;
