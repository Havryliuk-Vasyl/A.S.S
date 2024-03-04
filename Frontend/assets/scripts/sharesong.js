function uploadMedia(){

    const fileInput = document.getElementById('file');
    const titleInput = document.getElementById('title');

    const file = fileInput.files[0];
    const title = titleInput.value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const apiUrl = 'https://localhost:7219/api/Media';
    axios.post(apiUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('File uploaded successfully:', response.data);
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
}
