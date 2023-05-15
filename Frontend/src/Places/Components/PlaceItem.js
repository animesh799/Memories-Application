import React from "react";
import Card from "../../Shared/Components/Utility/Card/Card";
import "./PlaceItem.css";
import Button from "../../Shared/FormElements/Button";
import Modal from "../../Shared/Components/Utility/Modal/Modal";
import { useState } from "react";
import Map from "../../Shared/Components/Utility/Maps/Maps";
import { useContext } from "react";
import { AuthContext } from "../../Shared/Components/Context/Auth-context";
import useHttp from "../../Shared/hooks/http-hook";
import ErrorModal from "../../Shared/Components/Utility/ErrorModal";
import LoadingSpinner from "../../Shared/Components/Utility/LoadingSpinner";
import { useHistory } from "react-router-dom";

const PlaceItem = (props) => {
  const authCtx = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setConfirmModal] = useState(false);
  const { error, sendRequest, isLoading, onCancelHandler } = useHttp();
  const history = useHistory();

  const showConfirmModalHandler = () => {
    setConfirmModal(true);
  };

  const cancelConfirmModalHandler = () => {
    setConfirmModal(false);
  };

  const deletePlaceHandler = async () => {
    setConfirmModal(false);
    try {
      await sendRequest(process.env.REACT_APP_BACKEND_ADDRESS+
        `/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "bearer " + authCtx.token }
      );
      props.onDelete(props.id);
      history.push(`/${authCtx.userId}/places`);
    } catch (err) {}
  };

  const openModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={onCancelHandler}></ErrorModal>
      <Modal
        show={showModal}
        onCancel={closeModalHandler}
        header={props.address}
        footer={<Button onClick={closeModalHandler}>CLOSE</Button>}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
      >
        <div className="map-container">
          <Map center={props.coordinate} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelConfirmModalHandler}
        header="Are you Sure?"
        footer={
          <React.Fragment>
            <Button onClick={cancelConfirmModalHandler} inverse>
              CANCEL
            </Button>
            <Button onClick={deletePlaceHandler} danger>
              DELETE
            </Button>
          </React.Fragment>
        }
        footerClass="place-item__modal-actions"
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be done thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className="place-item__image">
            <img
              // src={process.env.REACT_APP_BACKEND_ASSET+`/${props.image}`}
              src={props.image}
              alt={props.title}
            ></img>
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openModalHandler}>
              View on Map
            </Button>

            {authCtx.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {authCtx.userId === props.creatorId && (
              <Button danger onClick={showConfirmModalHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
