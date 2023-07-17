import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Figure from "react-bootstrap/Figure";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ReactPlayer from "react-player";
import VideoForm from "./VideoForm";
import Accordion from "react-bootstrap/Accordion";

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
  const [showMoves, setShowMoves] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [activeSection, setActiveSection] = useState("video library");
  const [videos, setVideos] = useState([]);
  const [vidSearch, setVidSearch] = useState("");
  const [userVidSearch, setUserVidSearch] = useState("");
  const [userCharacter, setUserCharacter] = useState(null)

  useEffect(() => {
    fetch(`/api/characters/${name}`)
      .then((r) => r.json())
      .then((data) => {
        setFighter(data);
        setVideos(data.videos);
      });
  }, [name, isInRoster, user]);

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
          setIsInRoster(isInRoster)

          const uc = userCharacters.find(
            (uc) => uc.character.id === fighter.id
          );
          // console.log(uc);
          if (uc) {
            setUserCharacter(uc)
            setUserCharacterNotes(uc.training_notes);
            setUserCharacterVids(uc.videos);
            console.log(userCharacter)
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
        setIsInRoster(true)
      } else {
        console.error("Failed to add character to roster", response.status);
      }
    } catch (error) {
      console.error("Failed to add character to roster", error);
    }
  };

  //**** ADD TO USER CHARACTER VIDEO LIBRARY ****/
  const addVideoToUserCharacter = async (videoID) => {
    // const userCharacter = user.user_characters.find(
    //   (uc) => uc.character.id === fighter.id
    // );
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
        setUserCharacterVids((prevVideos) => [...prevVideos, newVideo]);
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
    // const userCharacter = user.user_characters.find(
    //   (uc) => uc.character.id === fighter.id
    // );
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
        console.error(
          "Failed to delete video from user library",
          response.status
        );
      }
    } catch (error) {
      console.error("Failed to delete video from user library", error);
    }
  };

  // ***** SEARCH VIDEO LIBRARY *****
  function handleVidSearch(e) {
    setVidSearch(e.target.value);
  }

  const searchedVids = videos.filter((vid) => {
    const searchedTitleMatch = vid.title
      .toLowerCase()
      .includes(vidSearch.toLowerCase());
    const searchedDescriptionMatch = vid.title
      .toLowerCase()
      .includes(vidSearch.toLowerCase());

    return searchedTitleMatch || searchedDescriptionMatch;
  });
  // ***** SEARCH VIDEO LIBRARY *****

  // ***** SEARCH VIDEO LIBRARY *****
  function handleUserVidSearch(e) {
    setUserVidSearch(e.target.value);
  }

  const userSearchedVids = userCharacterVids.filter((vid) => {
    const searchedTitleMatch = vid.title
      .toLowerCase()
      .includes(userVidSearch.toLowerCase());
    const searchedDescriptionMatch = vid.title
      .toLowerCase()
      .includes(userVidSearch.toLowerCase());

    return searchedTitleMatch || searchedDescriptionMatch;
  });
  // ***** SEARCH VIDEO LIBRARY *****

  //***ADD TO USER CHARACTER TRAINING NOTES ****/
  const handleNoteChange = (e) => {
    setTrainingNote(e.target.value);
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    // const userCharacter = user.user_characters.find(
    //   (uc) => uc.character.id === fighter.id
    // );
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
        const newNote = await response.json()
        setUserCharacterNotes((prevNotes) => [...prevNotes, newNote])
        console.log("note added to user character's training notes");
        setTrainingNote("")
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
        setUpdateNote("")
      } else {
        console.error("Failed to update training note", response.status);
      }
    } catch (error) {
      console.error("Failed to update training note", error);
    }
  };

  const toggleMovesVisibility = () => {
    setShowMoves(!showMoves);
  };

  const toggleNotesVisibility = () => {
    setShowNotes(!showNotes);
  };

  const switchView = (section) => {
    setActiveSection(section);
  };

  const renderVideoLibrary = () => {
    return (
      <>
        <Row>
          {/* ADD VIDEO BAR */}
          <input
            type="text"
            placeholder="Search video library"
            onChange={(e) => handleVidSearch(e)}
          ></input>
          {user ? (
            <VideoForm />
          ) : (
            <h2>Login or signup to add to this fighter's video library.</h2>
          )}
          {/* ADD VIDEO BAR */}
          {searchedVids.map((video) => (
            <Row
              key={video.id}
              className="seperator"
              style={{
                border: "1px solid black",
              }}
            >
              <Col sm={6}>
                <div className="teddytest">
                  <ReactPlayer
                    className="react-player"
                    url={video.embed_html}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <h2>{video.title}</h2>
                <button onClick={() => addVideoToUserCharacter(video.video_id)}>
                  Add video to your video library
                </button>
              </Col>
            </Row>
          ))}
        </Row>
      </>
    );
  };

  const renderUserVideos = () => {
    return (
      <>
        <Row>
          <input
            type="text"
            placeholder="Search user video library"
            onChange={(e) => handleUserVidSearch(e)}
          ></input>
          {userSearchedVids.map((video) => (
            <Row
              key={video.id}
              className="seperator"
              style={{
                border: "1px solid black",
              }}
            >
              <Col sm={6}>
                <div className="teddytest">
                  <ReactPlayer
                    className="react-player"
                    url={video.embed_html}
                  />
                </div>
              </Col>
              <Col sm={6}>
                <h2>{video.title}</h2>
                <button onClick={() => handleDeleteVideo(video.id)}>
                  Delete From Your Library
                </button>
              </Col>
            </Row>
          ))}
        </Row>
      </>
    );
  };

  //   <button onClick={() => handleDeleteVideo(video.id)}>
  //   Delete From Your Library
  // </button>

  return (
    <Container>
      <Row>
        <Figure className="col-sm-6">
          <Figure.Image
            src={fighter.main_img}
            alt={fighter.name}
            style={{ width: "100%" }}
          />
        </Figure>
        <Col sm={4} style={{
          marginTop: "10%"
        }}>
          <h1>{fighter.name}</h1>
          <p>{fighter.bio}</p>
          {user ? (
            isInRoster ? (
              <button disabled>In Roster</button>
            ) : (
              <button onClick={addToRoster}>Add to Roster</button>
            )
          ) : (
            <h2>Login or signup to add this fighter to your roster</h2>
          )}
        </Col>
      </Row>
      <hr />
      <Row
        style={{
          padding: "25px",
        }}
      >
        <Col sm={6}>
          <Accordion
            classname="commands-list"
            style={{
              width: "flex",
            }}
          >
            <Accordion.Item eventKey="0" onClick={toggleMovesVisibility}>
              <Accordion.Header>COMMAND LIST</Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Table striped border style={{}}>
                    <thead>
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
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col sm={6}>
          <Accordion
            // style={{
            //   width: "50%",
            // }}
          >
            <Accordion.Item eventKey="0" onClick={toggleNotesVisibility}>
              <Accordion.Header>TRAINING NOTES</Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Table striped border style={{}}>
                    <tbody>
                      {userCharacterNotes.map((note) => (
                        <tr key={note.id}>
                          <td className='note-cell'>
                            {note.note}
                          </td>
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
                                      className="form-control"
                                      value={updatedNote}
                                      onChange={(e) =>
                                        setUpdateNote(e.target.value)
                                      }
                                    />
                                    <button type="submit">
                                      Update Training Note
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNote(note.id)}
                                    >
                                      Delete
                                    </button>
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
                        </tr>
                      ))}
                      <tr>
                        {" "}
                        <td>
                          <h3>Add Training Note</h3>
                          <form onSubmit={handleSubmitNote}>
                            <textarea
                              className="form-control"
                              value={trainingNote}
                              onChange={handleNoteChange}
                            />
                            <button type="submit">Submit</button>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      {/* <Row xs={1} md={2} className="g-4">
        {user && (
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <h3>Add Training Note</h3>
              <form onSubmit={handleSubmitNote}>
                <textarea value={trainingNote} onChange={handleNoteChange} />
                <button type="submit">Submit</button>
              </form>
            </Card.Body>
          </Card>
        )}
      </Row> */}

      {/* {userCharacterNotes.map((note) => (
          <Card key={note.id} style={{ width: "18rem" }}>
            <Card.Body>
              <h3>{note.note}</h3>
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
        ))} */}
      <hr />
      <Row>
        <Col md={2}>
          <h2
            onClick={() => switchView("video library")}
            className={
              activeSection === "video library"
                ? "video-library-section active"
                : "video-library-section"
            }
          >
            Fighter Video Library
          </h2>
        </Col>
        <Col md={2}>
          <h2
            onClick={() => switchView("user video library")}
            className={
              activeSection === "user video library"
                ? "video-library-section active"
                : "video-library-section"
            }
          >
            User Video Library
          </h2>
        </Col>
      </Row>
      <hr />
      <div>
        {activeSection === "video library"
          ? renderVideoLibrary()
          : renderUserVideos()}
      </div>
    </Container>
  );
}

export default Fighter;
