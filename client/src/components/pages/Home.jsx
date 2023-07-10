import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Image } from "react-bootstrap";

const Home = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch(`/api/characters`)
      .then((r) => r.json())
      .then((data) => setCharacters(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const characterDisplay = characters.map((character) => {
    return (
      <div>
        <Link to={`/characters/${character.name}`} key={character.id}>
          <Image roundedCircle src={character.head_img} alt={character.name}/>
        </Link>
      </div>
    );
  });

  return (
    <div>
      <h1>Street Fighter 6 Lab Assistant</h1>
      <Container>
        <section>{characterDisplay}</section>
      </Container>
    </div>
  );
};

export default Home;
