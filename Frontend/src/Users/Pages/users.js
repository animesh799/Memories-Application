import React, { useState } from "react";
import UserList from "../Components/UserList";
import { useEffect } from "react";
import LoadingSpinner from "../../Shared/Components/Utility/LoadingSpinner";
import ErrorModal from "../../Shared/Components/Utility/ErrorModal";
import useHttp from "../../Shared/hooks/http-hook";

const Users = () => {
  const [loadedUsers, setUser] = useState();
  const { sendRequest, isLoading, error, onCancelHandler } = useHttp();
  
  useEffect(() => {
    
    const fetchUser = async () => {
      
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+"/users")
        console.log(responseData)
        setUser(responseData);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {error && (
        <ErrorModal error={error} onClear={onCancelHandler}></ErrorModal>
      )}
      {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
      {!isLoading && loadedUsers && (
        <UserList items={loadedUsers.users}></UserList>
      )}
      ;
    </React.Fragment>
  );
};

export default Users;
