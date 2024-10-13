import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Player from './components/Player.jsx';
import Sidebar from './pages/Sidebar.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';

const App = () => {
  return (
    <div className="app">
      <PlayerProvider>
        <div className="main">
          <Sidebar/>
          <div className="displayField">
            <Outlet />
          </div>
        </div>
        <Player/>
      </PlayerProvider>
    </div>
  );
};

export default App;