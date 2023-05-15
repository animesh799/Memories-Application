import React from "react";
import Card from "../../Shared/Components/Utility/Card/Card";
import UserItem from "./UserItems";
import "./UsersList.css";

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <Card className="center">
        <h1>No user Found</h1>
      </Card>
    );
  }

  return (
    <ul className="users-list center">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          placesCount={user.places.length}
          image={user.image}
          creator={user.uid}
        />
      ))}
    </ul>
  );
};

export default UserList;
