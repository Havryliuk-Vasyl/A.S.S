const API_URL = "https://localhost:7219/User/";

export const getAtrist = async (userId) => {
  try {
    const response = await fetch(`${API_URL}id/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to get artist:", error);
    return null;
  }
};

export const becomeArtist = async (userId, description) =>{
  try {
    const request = {
      id: 0,
      userId: userId,
      description: description
    }
    const response = await fetch(`${API_URL}becomeArtist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to become artist');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed:", error);
    return null;
  }
}

export const editUserProfile = async (userId, newNickname) => {
  try {
    const response = await fetch(`${API_URL}edituser?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNickname)
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    
  } catch (error) {
    console.error("Failed:", error);
    return null;
  }
}
