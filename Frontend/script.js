document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('https://localhost:7219/api/user', {
            method: 'POST',
            body: formData
            });

            if (response.ok) {
            alert('User added successfully');
            } else {
            alert('Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        }
    });
});
