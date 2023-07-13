import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { Row, Col, Container, Image, Card } from "react-bootstrap";

function Profile() {
  const { user, setUser } = useContext(UserContext);

  const handleDeleteCharacter = async (userCharacterId) => {
    try {
      const response = await fetch(`/api/usercharacters/${userCharacterId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          user_characters: prevUser.user_characters.filter(
            (uc) => uc.id !== userCharacterId
          ),
        }));
        console.log("Character deleted from user roster")
      } else {
        console.error(
          'Failed to delete character from user roster',
          response.status
        )
      }
    } catch (error) {
      console.error("Failed to delete character from user roster", error);
    }
  }

  return user ? (
    <Container>
      <Col>
        <h2>User Profile</h2>
        <h2>{user.username}</h2>
        <h2>{user.email}</h2>
        <p>Member since: {user.created_at}</p>
        <h2>Roster:</h2>
        {user.user_characters.map((uc) => (
          <div key={uc.id}>
            <Link to={`/characters/${uc.character.name}`}>
              {uc.character.name}
            </Link>
            <button onClick={() => handleDeleteCharacter(uc.id)}>Delete From Roster</button>
          </div>
        ))}
      </Col>
    </Container>
  ) : (
    <h2>Please login or signup to view your profile</h2>
  );
}

export default Profile;
