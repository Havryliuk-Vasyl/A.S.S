import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SongList from "../components/SongList.jsx";

const Catalog = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
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

  return (
    <div className="catalog">
      <SongList />
    </div>
  );
};

export default Catalog;
