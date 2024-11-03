const API_URL = "https://localhost:7219/";

export const createPlaylist = async (title, userId) => {
  const playlistData = {
    title: title,
    userId: userId
  };

  console.log(playlistData);

  try {
    const response = await fetch(`${API_URL}Playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playlistData)
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create playlist:", error);
    return null;
  }
};

export const deletePlaylist = async (id) => {
  try {
    const response = await fetch(`${API_URL}Playlist/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete playlist');
    }
  } catch (error) {
    console.error("Failed to delete playlist:", error);
  }
}

export const editTitle = async (newTitle) => {
  console.log(newTitle);
  try {
    const response = await fetch(`${API_URL}Playlist/editplaylist?playlistId=${newTitle.playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTitle.playlistTitle)
    });

    if (!response.ok) {
      throw new Error('Failed to edit playlist');
    }
  } catch (error) {
    console.error("Failed to edit playlist:", error);
  }
}

export const changePhoto = async (playlist) => {
  const formData = new FormData();
  formData.append("photo", playlist.photo);
  formData.append("playlistId", playlist.playlistId);

  try {
      const response = await fetch(`${API_URL}Playlist/editplaylistphoto`, {
          method: 'PUT',
          body: formData
      });

      if (!response.ok) {
          throw new Error('Failed to change playlist photo');
      }
  } catch (error) {
      console.error("Failed to change playlist photo:", error);
  }
};

export const addSongToPlaylist = async (playlistId, songId) => {
  try {
    const response = await fetch(`${API_URL}Playlist/${playlistId}/Addsong`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(songId)
    });

    if (!response.ok) {
      throw new Error('Failed to add song to playlist');
    }
  } catch (error) {
    console.error("Failed to add song to playlist:", error);
  }
}

export const deleteSongFromPlaylist = async (playlistId, songId) => {
  try {
    const response = await fetch(`${API_URL}Playlist/${playlistId}/Removesong/${songId}`, {
      method: 'DELETE',
    });

    console.log("Song deleted successfully");
    if (!response.ok) {
      throw new Error('Failed to delete song from playlist');
    }
  } catch (error) {
    console.error("Failed to delete song from playlist:", error);
  }
}