import React from 'react';
import { useLocation } from "react-router-dom";
import { Outlet, Link } from 'react-router-dom';
import returnIcon from '../../../public/assets/icons/return.png';
import openAllPlaylistsIcon from '../../../public/assets/icons/openAllPlaylists.png';
import plusIcon from '../../../public/assets/icons/plus_img.png';
import '../../styles/artist.css';
import '../../styles/index.css';

const Artist = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const artistId = query.get("id");

    return (
        <div className="main">
            <div className="right-section">
                <div className="menu">
                    <nav>
                        <ul>
                            <li id="backBtn">
                                <Link to="/main_window">
                                    <img src={returnIcon} alt="Return" />
                                </Link>
                            </li>
                            <li id="usersAlbums">
                                <Link to={{ pathname: '/artist/user-albums', search: `?id=${artistId}` }}>
                                    <img src={openAllPlaylistsIcon} alt="Edit Albums" />
                                </Link>
                            </li>
                            <li id="requestProccessing">
                                <Link to={{ pathname: '/artist/upload-album', search: `?id=${artistId}` }}>
                                    <img src={plusIcon} alt="Upload Album" />
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
