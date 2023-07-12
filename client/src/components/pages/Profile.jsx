import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { Row, Col, Container, Image, Card } from "react-bootstrap";

function Profile() {
  const { user, setUser } = useContext(UserContext);


  return (
    user ? (
    <Container>
      <Col>
        <h2>User Profile</h2>
        <h2>{user.username}</h2>
        <h2>{user.email}</h2>
        <p>Member since: {user.created_at}</p>
          <h2>Roster:</h2>
          {user.user_characters.map((uc) => (
            <h3>{uc.character.name}</h3>
          ))}
      </Col>
    </Container>
    )
    : (
        <h2>Please login or signup to view your profile</h2>
    )
  );
}

export default Profile;
