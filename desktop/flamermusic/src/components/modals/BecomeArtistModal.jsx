import React, { useState } from 'react';
import Modal from 'react-modal';
import { createPlaylist } from '../../services/playlistService.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { becomeArtist } from '../../services/userService.jsx';

import '../../styles/modal.css';

Modal.setAppElement('#root');

const BecomeArtist = ({ isOpen, closeModal }) => {
  const [description, setDescription] = useState('');
  const { user } = useUser();
  const handleBecomeArtist = () => {
    if (user && user.id) {
      becomeArtist(user.id, description);
      closeModal();
    } else {
      console.error("User ID не знайдено!");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
      <h2>Become Artist</h2>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleBecomeArtist} className='confirmBtn'>Send</button>
      <button onClick={closeModal} className='cancelBtn'>Cancel</button>
    </Modal>
  );
};

export default BecomeArtist;
