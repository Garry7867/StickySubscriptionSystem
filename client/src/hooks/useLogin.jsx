import { useState } from "react";
import { StudentContext } from "../../../LoginContext/StudentContext";
import { useStudentContext } from "./useStudentContext";

export const useLogIn = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useStudentContext();
  const logIn = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch("http://localhost:8080/api/loginStudent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("studentUser", JSON.stringify(data));

      // update the auth context
      dispatch({ type: "LOGIN", payload: data });

      // update loading state
      setIsLoading(false);
    }
  };

  return { logIn, error, isLoading };
};
