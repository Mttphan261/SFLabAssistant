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
  const [userCharacterVids, setUserCharacterVids] = useState([]);
  const [userCharacterNotes, setUserCharacterNotes] = useState([]);
  const [trainingNote, setTrainingNote] = useState("");
  const [updatedNote, setUpdateNote] = useState("");
  const [updateNoteToggle, setUpdateNoteToggle] = useState({});

  useEffect(() => {
    fetch(`/api/characters/${name}`)
      .then((r) => r.json())
      .then((data) => {
        setFighter(data);
      });
  }, [name, isInRoster]);

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
          console.log(userData);
          const userCharacters = userData.user_characters;
          const isInRoster = userCharacters.some(
            (uc) => uc.character.name === name
          );
          setIsInRoster(isInRoster);

          const uc = userCharacters.find(
            (uc) => uc.character.id === fighter.id
          );
          console.log(uc);
          if (uc) {
            console.log(uc.videos);
            setUserCharacterNotes(uc.training_notes);
            setUserCharacterVids(uc.videos);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user, name, fighter, isInRoster]);

  //**** ADD TO USER ROSTER ****/
  const addToRoster = async () => {
    try {
      const response = await fetch("/api/usercharacters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        setIsInRoster(true);
      } else {
        console.error("Failed to add character to roster", response.status);
      }
    } catch (error) {
      console.error("Failed to add character to roster", error);
    }
  };

  //**** ADD TO USER CHARACTER VIDEO LIBRARY ****/
  const addVideoToUserCharacter = async (videoID) => {
    const userCharacter = user.user_characters.find(
      (uc) => uc.character.id === fighter.id
    );
    const vidDetails = fighter.videos.find((vid) => vid.video_id === videoID);
    try {
      const response = await fetch(
        `/api/usercharacters/${userCharacter.id}/videos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: vidDetails.title,
            description: vidDetails.description,
            video_id: videoID,
            embed_html: vidDetails.embed_html,
          }),
        }
      );
      if (response.ok) {
        const newVideo = await response.json();
        setUserCharacterVids((prevVideos) => [...prevVideos, newVideo])
        console.log("Video added to user character's library");
      } else {
        console.error(
          "Failed to add video to user character's library",
          response.status
        );
      }
    } catch (error) {
      console.error("Failed to add video to user character's library", error);
    }
  };

  //**** DELETE FROM USER CHARACTER VIDEO LIBRARY ****/

  const handleDeleteVideo = async (videoId) => {
    const userCharacter = user.user_characters.find(
      (uc) => uc.character.id === fighter.id
    );
    try {
      const response = await fetch(
        `/api/usercharacters/${userCharacter.id}/videos`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoId: videoId,
          }),
        }
      );
      if (response.ok) {
        setUserCharacterVids(
          userCharacterVids.filter((video) => video.id !== videoId)
        );
        console.log("video deleted from user library");
      } else {
        console.error("Failed to delete video from user library", response.status);
      }
    } catch (error) {
      console.error("Failed to delete video from user library", error);
    }
  };

  //***ADD TO USER CHARACTER TRAINING NOTES ****/
  const handleNoteChange = (e) => {
    setTrainingNote(e.target.value);
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    const userCharacter = user.user_characters.find(
      (uc) => uc.character.id === fighter.id
    );
    try {
      const response = await fetch(
        `/api/usercharacters/${userCharacter.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: trainingNote,
            user_character_id: userCharacter.id,
          }),
        }
      );
      if (response.ok) {
        console.log("note added to user character's training notes");
      } else {
        console.error(
          "failed to add note to user character's training notes",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "Failed to add note to user character's training notes",
        error
      );
    }
  };

  //***DELETE FROM USER CHARACTER TRAINING NOTES ****/

  const handleDeleteNote = async (noteId) => {
    const userCharacter = user.user_characters.find(
      (uc) => uc.character.id === fighter.id
    );
    try {
      const response = await fetch(
        `/api/usercharacters/${userCharacter.id}/notes`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note_id: noteId,
          }),
        }
      );
      if (response.ok) {
        setUserCharacterNotes(
          userCharacterNotes.filter((note) => note.id !== noteId)
        );
        console.log("training note deleted");
      } else {
        console.error("Failed to delete training note", response.status);
      }
    } catch (error) {
      console.error("Failed to delete training note", error);
    }
  };

  if (!fighter) {
    return <div>Loading...</div>;
  }

  //***UPDATE USER CHARACTER TRAINING NOTES ****/
  const handleUpdateNote = async (noteId) => {
    const userCharacter = user.user_characters.find(
      (uc) => uc.character.id === fighter.id
    );
    try {
      const response = await fetch(
        `/api/usercharacters/${userCharacter.id}/notes`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note_id: noteId,
            note: updatedNote,
          }),
        }
      );
      if (response.ok) {
        const updatedNotes = userCharacterNotes.map((note) => {
          if (note.id === noteId) {
            return { ...note, note: updatedNote };
          }
          return note;
        });
        setUserCharacterNotes(updatedNotes);
        console.log("training note updated");
      } else {
        console.error("Failed to update training note", response.status);
      }
    } catch (error) {
      console.error("Failed to update training note", error);
    }
  };

  return (
    <Container>
      <div>
        <Figure>
          <Figure.Image src={fighter.main_img} alt={fighter.name} />
        </Figure>
        {user ? (
          isInRoster ? (
            <button disabled>In Roster</button>
          ) : (
            <button onClick={addToRoster}>Add to Roster</button>
          )
        ) : (
          <h2>Login or signup to add this fighter to your roster</h2>
        )}
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
                    <button
                      onClick={() => addVideoToUserCharacter(video.video_id)}
                    >
                      Add video to your video library
                    </button>
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
                    <button onClick={() => handleDeleteVideo(video.id)}>
                              Delete From Your Library
                            </button>
                  </Card.Body>
                </Card>
              ))}
            </Row>
            <Row xs={1} md={2} className="g-4">
              {user && (
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <h3>Add Training Note</h3>
                    <form onSubmit={handleSubmitNote}>
                      <textarea
                        value={trainingNote}
                        onChange={handleNoteChange}
                      />
                      <button type="submit">Submit</button>
                    </form>
                  </Card.Body>
                </Card>
              )}
              <h2>Training Notes</h2>
              {userCharacterNotes.map((note) => (
                <Card key={note.id} style={{ width: "18rem" }}>
                  <Card.Body>
                    <h3>{note.note}</h3>
                    {/* {user && (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        handleUpdateNote(note.id)
                      }}>
                        <input 
                        type="text" 
                        value={updatedNote}
                        onChange={(e) => setUpdateNote(e.target.value)}
                         />
                        <button type="submit">Update Training Note</button>
                        <button onClick={() => handleDeleteNote(note.id)}>
                          Delete
                        </button>
                      </form>
                    )} */}
                    {user && (
                      <div>
                        {updateNoteToggle[note.id] ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdateNote(note.id);
                              setUpdateNoteToggle((prevToggle) => ({
                                ...prevToggle,
                                [note.id]: false,
                              }));
                            }}
                          >
                            <input
                              type="text"
                              value={updatedNote}
                              onChange={(e) => setUpdateNote(e.target.value)}
                            />
                            <button onClick={() => handleDeleteNote(note.id)}>
                              Delete
                            </button>
                            <button type="submit">Update Training Note</button>
                            <button
                              onClick={() =>
                                setUpdateNoteToggle((prevToggle) => ({
                                  ...prevToggle,
                                  [note.id]: false,
                                }))
                              }
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <button
                            onClick={() =>
                              setUpdateNoteToggle((prevToggle) => ({
                                ...prevToggle,
                                [note.id]: true,
                              }))
                            }
                          >
                            Update/Delete Training Note
                          </button>
                        )}
                      </div>
                    )}
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
