import { useState, useEffect, useCallback } from "react";

let timeOut;
const useAuth = () => {
  const [expirationDate, setExpirationDate] = useState();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const loginHandler = useCallback((userId, token, expirationDate) => {
    console.log("logged in");
    setUserId(userId);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        exipration: tokenExpirationDate.toISOString(),
      })
    );
    setToken(token);
  }, []);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.exipration) > new Date()
    ) {
      loginHandler(
        storedData.userId,
        storedData.token,
        new Date(storedData.exipration)
      );
    }
  }, [loginHandler]);

  const logoutHandler = useCallback(() => {
    setUserId(null);
    setToken(null);
    setExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      let remainingTime = expirationDate.getTime() - new Date().getTime(); //milisecond conversion
      timeOut = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(timeOut);
    }
  }, [token, logoutHandler, expirationDate]);

  return {
    token,
    userId,
    loginHandler,
    logoutHandler,
  };
};

export default useAuth;
