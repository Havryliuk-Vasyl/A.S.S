import React, { useState } from 'react';
import Modal from 'react-modal';
import { createPlaylist } from '../../services/playlistService.jsx';
import { useUser } from '../../context/UserContext.jsx';
import '../../styles/modal.css';

Modal.setAppElement('#root');

const CreatePlaylistModal = ({ isOpen, closeModal }) => {
  const [playlistName, setPlaylistName] = useState('');
  const { user } = useUser();
  const handleCreatePlaylist = () => {
    if (user && user.id) {
      createPlaylist(playlistName, user.id);
      closeModal();
    } else {
      console.error("User ID не знайдено!");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
      <h2>Create Playlist</h2>
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <button onClick={handleCreatePlaylist} className='confirmBtn'>Create</button>
      <button onClick={closeModal} className='cancelBtn'>Cancel</button>
    </Modal>
  );
};

export default CreatePlaylistModal;
