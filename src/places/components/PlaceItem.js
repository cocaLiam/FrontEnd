import React, { useState, useContext } from 'react';

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from '../../shared/context/auth-context';

import './PlaceItem.css';
// import { useHistory } from "react-router-dom";

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // const history = useHistory();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BASE}${process.env.REACT_APP_PLACES_ROUTE}/${props.id}`,
        "DELETE",
        null,
        { Authorization : `Bearer: ${auth.token}`}
      );
      props.onDelete(props.id);
      // props.onDeletePlace(props.id);
    } catch (err) {}
  };

  //
  // if (isLoading) {
//   return (
  //     <div className="center">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }
  //

  return (
    <React.Fragment>
      <ErrorModal showError={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
          {/* <h2>The Map!</h2> */}
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are u sure?"
        footerClass="place-item__modal-actions" footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }>
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      {/* <Modal header="Are u sure?" footerClass="place-item__modal-actions" footer={
          <button>CANCEL</button>
      }>
        <p>
          Do u want to proceed and delete this place? please note.
        </p>
      </Modal> */}

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_BASE}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p> {props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP </Button>
            {/* {auth.isLoggedIn &&  <- 이렇게 하면 A 사용자가 B 사용자의 장소까지 Update 및 Delete 할 수 있게 되므로 */}
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {/* {auth.isLoggedIn && ( */}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;

