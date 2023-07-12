import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Figure from "react-bootstrap/Figure";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import ReactPlayer from "react-player";
import VideoForm from "./VideoForm";

function Fighter() {
  const { user, setUser } = useContext(UserContext);
  const { name } = useParams();
  const [fighter, setFighter] = useState(null);
  const [isInRoster, setIsInRoster] = useState(false);
  const [userCharacterVids, setUserCharacterVids] = useState([])

  useEffect(() => {
    fetch(`/api/characters/${name}`)
      .then((r) => r.json())
      .then((data) => {
        setFighter(data);
      });
  }, [name]);

  // useEffect(() => {
  //   if (user && fighter) {
  //     const checkRoster = async () => {
  //       const response = await fetch('/api/usercharacters', {
  //         method: "POST",
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ name })
  //       });
  //       if (response.ok) {
  //         const userCharacter = await response.json()
  //         setIsInRoster(userCharacter !== null)
  //       } else {
  //         console.error('Failed to check user roster', response.status)
  //       }
  //     };
  //     checkRoster()
  //   }
  // }, [user])

  // useEffect(() => {
  //   if (user && fighter) {
  //     const checkRoster = async () => {
  //       const response = await fetch("/users", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       if (response.ok) {
  //         const userData = await response.json();
  //         const userCharacters = userData.user_characters;
  //         const isInRoster = userCharacters.some(uc => uc.character.name === name);
  //         setIsInRoster(isInRoster)
  //       } else {
  //         console.error('Failed to check user roster', response.status)
  //       }
  //     };
  //     checkRoster();
  //   }
  // }, [user, fighter]);

  // useEffect(() => {
  //   if (user && fighter) {
  //     fetch("/api/users", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((response) => {
  //         console.log(response)
  //         // if (response.ok) {
  //           return response.json();
  //         // } else {
  //         //   throw new Error("Failed to check user roster");
  //         // }
  //       })
  //       .then((userData) => {
  //         console.log(userData); // Add this line
  //         const userCharacters = userData.user_characters;
  //         const isInRoster = userCharacters.some(
  //           (uc) => uc.character.name === name
  //         );
  //         console.log(isInRoster)
  //         const uc = user.user_characters.find((uc) => uc.character.id === fighter.id)
  //         // setUserCharacterVids()
  //         setIsInRoster(isInRoster);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }, [user, name]);

  useEffect(() => {
    if (user && fighter) {
      fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          console.log(userData)
          const userCharacters = userData.user_characters;
          const isInRoster = userCharacters.some(
            (uc) => uc.character.name === name
          );
          setIsInRoster(isInRoster);
  
          const uc = userCharacters.find(
            (uc) => uc.character.id === fighter.id
          );
          console.log(uc)
          if (uc) {
            console.log(uc.videos)
            setUserCharacterVids(uc.videos)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user, name, fighter]);

//**** ADD TO USER ROSTER ****/
  const addToRoster = async () => {
    try {
      const response = await fetch('/api/usercharacters', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        setIsInRoster(true);
      } else {
        console.error('Failed to add character to roster', response.status)
      }
    } catch (error) {
      console.error('Failed to add character to roster', error)
    }
  }

  //**** ADD TO USER CHARACTER VIDEO LIBRARY ****/
  const addVideoToUserCharacter = async (videoID) => {
    const userCharacter = user.user_characters.find((uc) => uc.character.id === fighter.id)
    const vidDetails = fighter.videos.find((vid) => vid.video_id === videoID)
    try {
      const response = await fetch(`/api/usercharacters/${userCharacter.id}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           'title' : vidDetails.title,
           'description': vidDetails.description,
           'video_id': videoID,
           'embed_html': vidDetails.embed_html
        }),
      });
      if (response.ok) {
        console.log("Video added to user character's library")
      } else {
        console.error("Failed to add video to user character's library", response.status);
      }
    } catch (error) {
      console.error("Failed to add video to user character's library", error);
    }
  }


  if (!fighter) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div>
        <Figure>
          <Figure.Image src={fighter.main_img} alt={fighter.name} />
        </Figure>
          {user ? (
            isInRoster ? (
              <button disabled>
                In Roster
              </button>
            ) : (
              <button onClick={addToRoster}>
                Add to Roster
              </button>
            )
          ) : <h2>Login or signup to add this fighter to your roster</h2>}
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
              {user ? (
                <VideoForm />
              ) : (
                <h2>Login or signup to add to this fighter's video library.</h2>
              )}
              <h2>Fighter Video Library</h2>
              {fighter.videos.map((video) => (
                <Card key={video.id} style={{ width: "18rem" }}>
                  <Card.Body>
                    <ReactPlayer
                      url={video.embed_html}
                      style={{ borderRadius: "10px" }} //Not sure what this is doing?
                    />
                    <Card.Title>{video.title}</Card.Title>
                    <button onClick={() => addVideoToUserCharacter(video.video_id)}>Add video to your video library</button>
                  </Card.Body>
                </Card>
              ))}
            </Row>
            <Row xs={1} md={2} className="g-4">
            <h2>User Video Library</h2>
            {userCharacterVids.map((video) => (
                <Card key={video.id} style={{ width: "18rem" }}>
                  <Card.Body>
                    <ReactPlayer
                      url={video.embed_html}
                      style={{ borderRadius: "10px" }} //Not sure what this is doing?
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
