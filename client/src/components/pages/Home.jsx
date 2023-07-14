import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Image, Row, Col } from "react-bootstrap";
import { FaDatabase, FaClipboardList } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";

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
        <Link
          to={`/characters/${character.name}`}
          key={character.id}
        >
          <div className="circle">
          {/* <Image class="splatter" src="http://static.indigoimages.ca/2015/shop/orange-paint-splatter.png" /> */}
            <Image
              // className="circle"
              className="rosterIcon"
              roundedCircle
              src={character.head_img}
              alt={character.name}
            />
          {/* <Image class="splatter" src="http://static.indigoimages.ca/2015/shop/orange-paint-splatter.png"/> */}
          </div>
        </Link>
      </Col>
    );
  });

  return (
    <div>
      <div className="jumbotron jumbotron-fluid">
        <Container>
          <h2
            style={{
              color: "#fff",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              fontWeight: "700",
            }}
          >
            Welcome to the SF6 Lab Assistant
          </h2>
          <h3
            style={{
              color: "#fff",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              fontWeight: "500",
            }}
          >
            Take your training to the next level{" "}
          </h3>
        </Container>
      </div>
      <Container className="featureBanner">
        <Row>
          <Col md={4}>
            <div className="feature-box text-center">
              <FaDatabase className="feature-icon" />
              <h3>Explore Fighter Data</h3>
              <p>
                Dive into each fighter's page, complete with move lists and
                video libraries.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box text-center">
              <GiWeightLiftingUp className="feature-icon" />
              <h3>Build Your Personal Roster</h3>
              <p>
                Curate your own individualized roster to keep track of your
                favorite fighters.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box text-center">
              <FaClipboardList className="feature-icon" />
              <h3>Create Training Journals </h3>
              <p>
                Maintain training notes for each character, making it easy to
                reference your progress.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>{characterDisplay}</Row>
      </Container>
    </div>
  );
};

export default Home;
