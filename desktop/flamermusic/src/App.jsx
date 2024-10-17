// App.jsx (оновлений)
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Player from './components/Player.jsx';
import Sidebar from './pages/Sidebar.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import CreatePlaylistModal from './components/modals/CreatePlaylistModal.jsx';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <PlayerProvider>
        <div className="main">
          <Sidebar openModal={openModal} />
          <div className="displayField">
            <Outlet />
          </div>
        </div>
        <Player />
      </PlayerProvider>
      <CreatePlaylistModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default App;
