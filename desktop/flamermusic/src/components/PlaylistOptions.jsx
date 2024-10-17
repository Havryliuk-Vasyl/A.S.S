import React, { useState, useEffect, useRef } from 'react';
import AppButton from './AppButton.jsx';
import { deletePlaylist } from '../services/playlistService.jsx';
import '../styles/playlistOptions.css';
import EditPlaylistModal from "../components/modals/EditPlaylistModal.jsx";
import { useNavigate } from 'react-router-dom';

const PlaylistOptions = ({ playlist }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDeletePlaylist = () => {
        deletePlaylist(playlist.playlistId);
        setIsMenuOpen(false);
        navigate(-1);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (isModalOpen) {
            setIsMenuOpen(false);
        }
    }, [isModalOpen]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="menu-container">
            <AppButton
                id="playlist-optionsBtn"
                defaultIcon={require('../../public/assets/icons/Options.svg')}
                hoverIcon={require('../../public/assets/icons/Options_Hover.svg')}
                altText={'Options'}
                onClick={toggleMenu}
            />
            {isMenuOpen && (
                <div ref={menuRef} className="dropdown-menu">
                    <button>Add to queue</button>
                    <button onClick={openModal}>Change details</button>
                    <button onClick={handleDeletePlaylist}>Delete</button>
                </div>
            )}
            
            <EditPlaylistModal playlist={playlist} isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
};

export default PlaylistOptions;
