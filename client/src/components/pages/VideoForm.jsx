import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VideoForm() {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const { name } = useParams();
  const [fighter, setFighter] = useState(null);

  useEffect(() => {
    fetch(`/api/characters/${name}`)
      .then((r) => r.json())
      .then((data) => {
        setFighter(data);
      });
  }, [name]);

  const getYoutubeVideo = (videoLink) => {
    const url = new URL(videoLink);
    const getVideoID = url.searchParams.get("v");
    return getVideoID;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoID = getYoutubeVideo(youtubeLink);
    console.log(videoID)
    console.log(fighter.id)

    const data = {
        character_id: fighter.id,
        video_id: videoID
    }

    try {
        const response = await fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const video = await response.json();
            console.log('Video submitted:', video)

            const characterResponse = await fetch(`/api/characters/${name}`)
            const updatedFighter = await characterResponse.json()
            setFighter(updatedFighter)
            setYoutubeLink("")
        } else {
            console.error('Video submission failed', response.status)
        } 
    } catch (error) {
        console.error('Video submission failed:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Add video to fighter library:
          <input
            type="text"
            placeholder="Paste YouTube link..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default VideoForm;
