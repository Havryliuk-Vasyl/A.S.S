import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../../styles/artist.css';
import '../../styles/index.css';

const Artist = () => {
    return (
        <div className="main">
            <div className="right-section">
                <div className="menu">
                    <nav>
                        <ul>
                            <li id="backBtn">
                                <Link to="/main_window">
                                    <img src={require("../../../public/assets/icons/return.png")} alt="Return" />
                                </Link>
                            </li>
                            <li id="usersAlbums">
                                <Link to="/artist/user-albums?id=3">
                                    <img src={require("../../../public/assets/icons/openAllPlaylists.png")} alt="Edit Accounts" />
                                </Link>
                            </li>
                            <li id="requestProccessing">
                                <Link to="/artist/upload-album">
                                    <img src={require("../../../public/assets/icons/plus_img.png")} alt="Review requests" />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div id="artist-displayField" className="displayField">
                <Outlet />
            </div>
        </div>
    );
};

export default Artist;
