import { useCallback, useEffect, useState, useRef } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState(null);
  const activeHttpRequest = useRef([]); //http requst sendd across rerenders cycles

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      try {
        setIsLoading(true);
        const httpabortController = new AbortController(); //to abort the ongoing request
        activeHttpRequest.current.push(httpabortController); //adding abort controler to our request arry which is linked with every send request
        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: body,
          signal: httpabortController.signal, //link bw abort ctrl and request
        });

        const userdata = await response.json();
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (httpreqctrl) => httpabortController !== httpreqctrl
        );
        if (!response.ok) {
          throw new Error(userdata.message);//both the part contains message keep in mind
        }
        setIsLoading(false);
        return userdata;
      } catch (err) {
        setIsError(err.message);
        setIsLoading(false);

        throw err;
      }
    },
    []
  );

  const onCancelHandler = () => {
    setIsError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abrtctrl) => abrtctrl.abort());
    };
  }, []); //cleanup function runs after the componenet unmount

  return { isLoading, error, sendRequest, onCancelHandler };
};

export default useHttp;
