import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../../Shared/hooks/http-hook";
import PlaceList from "../Components/PlaceList";
import { useEffect } from "react";
import ErrorModal from "../../Shared/Components/Utility/ErrorModal";
import LoadingSpinner from "../../Shared/Components/Utility/LoadingSpinner";

const Users = () => {
  let userId = useParams().uid;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { error, isLoading, sendRequest, onCancelHandler } = useHttp();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
          `/places/users/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

  const onDeleteHandeler = (pID) => {
    setLoadedPlaces((previousPlaces) =>
      previousPlaces.filter((place) => place.id !== pID)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={onCancelHandler}></ErrorModal>
      {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
      {!error && !isLoading && loadedPlaces && (
        <PlaceList
          onDelete={onDeleteHandeler}
          items={loadedPlaces}
        ></PlaceList>
      )}
    </React.Fragment>
  );
};

export default Users;
