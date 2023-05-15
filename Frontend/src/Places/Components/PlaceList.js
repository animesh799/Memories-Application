import React from "react";
import Card from "../../Shared/Components/Utility/Card/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";
import Button from "../../Shared/FormElements/Button";

const PlaceList = (props) => {
  
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places Found</h2>

          <Button to="/places/new">Share Places</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((item) => (
        <PlaceItem onDelete={props.onDelete}
          key={item.id}
          id={item.id}
          address={item.address}
          coordinate={item.location}
          image={item.image}
          title={item.title}
          description={item.description}
          creatorId={item.creator}
        ></PlaceItem>
      ))}
    </ul>
  );
};

export default PlaceList;
