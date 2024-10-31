const API_URL = "https://localhost:7219/Album/";

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

export const deleteAlbum = async (user) => {
    try {
        // const response = await fetch(`${API_URL}deleteuser?userId=${user.id}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     }
        // });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        }
    catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};