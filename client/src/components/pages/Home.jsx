import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Image, Row, Col } from "react-bootstrap";

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
      <Col md={2}>
        <Link to={`/characters/${character.name}`} key={character.id}>
          <Image
            className="rosterIcon"
            roundedCircle
            src={character.head_img}
            alt={character.name}
          />
        </Link>
      </Col>
    );
  });

  return (
    <div>
      <div className='jumbotron jumbotron-fluid'>
        <Container>
          <Row>{characterDisplay}</Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
