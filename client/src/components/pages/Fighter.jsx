import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Figure from "react-bootstrap/Figure";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import CardGroup  from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row"


function Fighter() {
  const { name } = useParams();
  const [fighter, setFighter] = useState(null);

  useEffect(() => {
    fetch(`/api/characters/${name}`)
      .then((r) => r.json())
      .then((data) => {
        setFighter(data);
      });
  }, [name]);

  if (!fighter) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div>
        <Figure>
          <Figure.Image src={fighter.main_img} alt={fighter.name} />
        </Figure>
        <Table striped border>
          <thead>
            <tr>
              <th>{fighter.name}</th>
            </tr>
            <tr>
              <th>Move Name</th>
              <th>Command</th>
            </tr>
          </thead>
          <tbody>
            {fighter.moves.map((move) => (
              <tr key={move.id}>
                <td>{move.name}</td>
                <td>{move.command}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
        <CardGroup>
        <Row xs={1} md={2} className="g-4">
          {fighter.videos.map((video) => (
              <Card key={video.id} style={{ width: '18rem' }}>
                <Card.Body>
                  <div
                    dangerouslySetInnerHTML={{ __html: video.embed_html }}
                    className="embed-resposne embed-responsive-16by9"
                  />
                  <Card.Title>{video.title}</Card.Title>
                </Card.Body>
              </Card>
          ))}
          </Row>
          </CardGroup>
        </div>
      </div>
    </Container>
  );
}

export default Fighter;
