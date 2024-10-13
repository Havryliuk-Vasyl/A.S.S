import React from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
    return (
    <div className="right-section">
        <div className="menu" id="menu">
          <nav>
            <ul id="navigation-on-menu">
              <li id="profileBtnInMenu">
                <a href="#" id="profile">
                    <img src={require('../../public/assets/icons/noimageuser.png')} alt="users-image" id="userImage"/>
                </a>
              </li>
              <li id="settingsBtnInMenu">
                <a href="#">
                    <img src={require('../../public/assets/icons/settings-icon.png')} alt="settings"/>
                </a>
              </li>
              <li id="catalogBtnInMenu">
                <a href="#">
                    <img src={require('../../public/assets/icons/openAllPlaylists.png')} alt="catalog"/>
                </a>
              </li>
              <li id="searchBtnInMenu">
                <a href="#">
                    <img src={require('../../public/assets/icons/search-icon.png')} alt="Search"/>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="playlists" id="playlistsInMain"></div>
    </div>
    );
}

export default Sidebar;