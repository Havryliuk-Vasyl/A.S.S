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