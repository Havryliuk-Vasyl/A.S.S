const API_URL = "https://localhost:7219/Admin/";

export const saveUser = async (user) => {
    var request = {
        userId: user.id,
        name: user.name,
        username: user.username,
    };
    console.log(request);
    try {
        const response = await fetch(`${API_URL}edituser`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

export const deleteUser = async (user) => {
    try {
        const response = await fetch(`${API_URL}deleteuser?userId=${user.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        }
    catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

export const getRequests = async () => {
    try {
        const response = await fetch(`${API_URL}requests`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
        return [];
    }
};

export const confirmRequest = async (request) => {
    try {
        const response = await fetch(`${API_URL}confirmBecomeArtist`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

export const cancelRequest = async (request) => {
    try {
        const response = await fetch(`${API_URL}cancleBecomeArtist`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};
