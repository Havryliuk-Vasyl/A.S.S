import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SongList from "../components/SongList.jsx";

const API_URL = "https://localhost:7219/";

const Catalog = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(`${API_URL}Song`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSongs(data.data.$values);
        setLoading(false);
      } catch (error) {
        //setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();

    const handleKeyDown = (e) => {
      switch (e.button) {
        case 4:
          navigate(-1);
          break;
        case 5:
          navigate(1);
          break;
      }
    }
  }, []);

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className="catalog">
      <SongList songs={songs} showAlbum={true} showArtist={true} isPlayable={true} menuType={"song"}/>
    </div>
  );
};

export default Catalog;
