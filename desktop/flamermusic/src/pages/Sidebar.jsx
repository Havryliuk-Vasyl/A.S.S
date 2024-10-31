import React from "react";
import { Link } from "react-router-dom";
import { useUser } from '../context/UserContext.jsx';
import "../styles/sidebar.css";

const Sidebar = ({ openModal }) => {
  const { user } = useUser();

  return (
    <div className="right-section">
      <div className="menu" id="menu">
        <nav>
          <ul id="navigation-on-menu">
            <li id="profileBtnInMenu">
              <Link to="/profile" id="profile">
                <img src={require('../../public/assets/icons/noimageuser.png')} alt="users-image" id="userImage"/>
              </Link>
            </li>
            <li id="settingsBtnInMenu">
              <Link to="/settings" id="settings">
                <img src={require('../../public/assets/icons/settings-icon.png')} alt="settings"/>
              </Link>
            </li>
            <li id="catalogBtnInMenu">
              <Link to="/main_window">
                <img src={require('../../public/assets/icons/openAllPlaylists.png')} alt="catalog"/>
              </Link>
            </li>
            <li id="searchBtnInMenu">
              <a href="#">
                <img src={require('../../public/assets/icons/search-icon.png')} alt="Search"/>
              </a>
            </li>
            {user?.status === 'administrator' && (
              <li id="adminBtnInMenu">
                <Link to="/admin">
                  <img src={require('../../public/assets/icons/Admin-icon.png')} alt="admin" />
                </Link>
              </li>
            )}
            {user?.status === 'artist' && (
              <li id="artistBtnInMenu">
                <Link to="/artist">
                  <img src={require('../../public/assets/icons/artist-panel.png')} alt="artist" />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="controls" id="controls">
        <nav>
          <ul>
            <li>
              <a href="#" onClick={openModal}>
                <img src={require('../../public/assets/icons/plus_img.png')} alt="Create Playlist"/>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
