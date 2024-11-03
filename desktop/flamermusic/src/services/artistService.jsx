const API_URL = "https://localhost:7219/Album/";
const API_URL_UPLOAD = "https://localhost:7219/Upload/upload";
const API_URL_GENRES = "https://localhost:7219/Genre/get-genres";

export const saveAlbum = async (album) => {
    try {
        console.log(album);
        const response = await fetch(`${API_URL}edit?albumId=${album.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(album.title)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

export const deleteAlbum = async (album) => {
    console.log("Deleting: " + album);
    try {
        const response = await fetch(`${API_URL}delete?userId=${album.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Deleting was successful!");
    }
    catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

export const uploadAlbum = async (album) => {
    try {
        const response = await fetch(API_URL_UPLOAD, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: album
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) { 
        console.error('An error occurred while uploading:', error);
    }
};

export const getGenres = async () => {
    try {
        const response = await fetch(API_URL_GENRES, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.data.$values;
    } catch (error) {
        console.error('An error occurred while fetching genres:', error);
        return [];
    }
};