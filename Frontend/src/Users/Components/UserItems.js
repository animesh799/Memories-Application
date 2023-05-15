import React from "react";
import "./UserItem.css";
import Avatar from "../../Shared/Components/Utility/Avatar/Avatar";
import Card from "../../Shared/Components/Utility/Card/Card";
import { Link } from "react-router-dom";
const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={props.image}
              alt={props.alt}
            ></Avatar>
          </div>

          <div className="user-item__info">
            <h1>{props.name}</h1>
            <h3>
              {props.placesCount} {props.placesCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
