import { useState } from "react";

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [errorStatus, setErrorStatus] = useState({ hasError: false, errorMsg: "" });
  //Form validation could go here? or make another hook
  //Errors here and Form validation in other file?
  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
    errorStatus,
    setErrorStatus: (value) => setErrorStatus(value),
  };
};
