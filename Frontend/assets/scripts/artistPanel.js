document.addEventListener("DOMContentLoaded", function () {
    let artistId = 0;
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function (response) {
            console.log("User profile:", response);

            artistId = response.id;
        },
        error: function (error) {
            console.log(error);
            alert("Error, you are unathorized!");
        }
    });

    function getArtistAlbums() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: "https://localhost:7219/Album/artist/" + artistId,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (response) {
                    console.log("Artist albums:", response);
                    resolve(response);
                },
                error: function (error) {
                    console.log(error);
                    reject(error);
                }
            });
        });
    }

    function renderArtistAlbums(albumsObj) {
        const displayField = document.getElementById("displayField");

        displayField.innerHTML = '';

        const albums = albumsObj.$values;

        if (!Array.isArray(albums) || albums.length === 0) {
            displayField.textContent = 'Немає доступних альбомів';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('albums-table');

        const headerRow = document.createElement('tr');
        const idHeader = document.createElement('th');
        idHeader.textContent = 'ID';
        headerRow.appendChild(idHeader);
        const titleHeader = document.createElement('th');
        titleHeader.textContent = 'Назва';
        headerRow.appendChild(titleHeader);
        table.appendChild(headerRow);

        albums.forEach(album => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            idCell.textContent = album.id;
            row.appendChild(idCell);
            const titleCell = document.createElement('td');
            titleCell.textContent = album.title;
            row.appendChild(titleCell);
            table.appendChild(row);
        });

        displayField.appendChild(table);
    }


    document.getElementById("showAllDiscography").addEventListener("click", async function () {
        try {
            const albums = await getArtistAlbums();
            renderArtistAlbums(albums);
        } catch (error) {
            console.error(error);
            alert("Error while fetching artist albums!");
        }
    });


    document.getElementById("uploadNewSongs").addEventListener("click", function () {
        renderUpload();
    });

    function renderUpload() {
        document.getElementById("displayField").innerHTML = ``;
        document.getElementById("displayField").innerHTML = `
        <div class="upload-single">
                <div class="section-1">
                    <p>Назва релізу</p>
                    <input type="text" id="title" placeholder="Назва релізу" required>

                    <p>Зображення</p>
                    <img id="selectedPhotoPreview" src="" alt="Preview" style="display: none;">
                    <input type="file" id="photoFile" class="albumPhoto" accept=".png, .jpg" required>
                </div>
                <div class="senction-2">
                    <p>Виберіть музичні файли</p>
                    <input type="file" id="audioFile" accept=".wav, .mp3" required>
                </div>
                <button id="uploadButton">Upload</button>
            </div>
        `;

        var photoFileInput = document.getElementById('photoFile');
        var selectedPhotoPreview = document.getElementById('selectedPhotoPreview');

        photoFileInput.addEventListener('change', function (event) {
            var selectedFile = event.target.files[0];
            if (selectedFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    selectedPhotoPreview.src = e.target.result;
                    selectedPhotoPreview.style.display = 'block';
                }
                reader.readAsDataURL(selectedFile);
            } else {
                // Якщо файл не був обраний, сховати зображення
                selectedPhotoPreview.src = '';
                selectedPhotoPreview.style.display = 'none';
            }
        });

        var section2Container = document.querySelector('.senction-2');
        var choosenSongs = 0;

        section2Container.addEventListener('input', function (event) {
            var targetInput = event.target;
            if (targetInput.tagName.toLowerCase() === 'input' && targetInput.type === 'file') {
                if (targetInput.files.length > 0) {
                    choosenSongs += 1;

                    var choosenSongFileContainer = document.createElement('div');
                    choosenSongFileContainer.classList.add('choosen-song-file');

                    var audioFileLabel = document.createElement('p');
                    audioFileLabel.textContent = 'Вибраний трек';

                    // Створення текстового поля для відображення назви вибраного файлу
                    var selectedFileNameInput = document.createElement('input');
                    selectedFileNameInput.type = 'text';
                    selectedFileNameInput.value = targetInput.files[0].name;
                    selectedFileNameInput.disabled = true;

                    // Створення прихованого поля для збереження вибраного файлу
                    var selectedAudioFileInput = document.createElement('input');
                    selectedAudioFileInput.type = 'file';
                    selectedAudioFileInput.style.display = 'none';
                    selectedAudioFileInput.name = 'selectedAudioFile';
                    selectedAudioFileInput.files = targetInput.files; 


                    console.log(selectedAudioFileInput);

                    // Створення текстового поля для введення назви пісні
                    var songTitleInput = document.createElement('input');
                    songTitleInput.type = 'text';
                    songTitleInput.placeholder = 'Назва пісні';
                    songTitleInput.id = 'songTitle' + choosenSongs; // Змінено ідентифікатор для відповідності лічильнику
                    songTitleInput.required = true;

                    // Створення кнопки видалення
                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Видалити';
                    deleteButton.addEventListener('click', function () {
                        choosenSongFileContainer.remove();
                        targetInput.value = '';
                        targetInput.disabled = false;
                        choosenSongs--;
                    });

                    choosenSongFileContainer.appendChild(audioFileLabel);
                    choosenSongFileContainer.appendChild(selectedFileNameInput);
                    choosenSongFileContainer.appendChild(selectedAudioFileInput);
                    choosenSongFileContainer.appendChild(songTitleInput);
                    choosenSongFileContainer.appendChild(deleteButton);

                    section2Container.appendChild(choosenSongFileContainer, section2Container.nextSibling);
                }
            }
        });

        document.getElementById('uploadButton').addEventListener('click', function () {
            uploadAudio();
        });
    }

    function uploadAudio() {
        var title = document.getElementById('title').value;
        var photoFile = document.getElementById('photoFile').files[0];
        var hiddenInputs = document.querySelectorAll('input[type="file"][name="selectedAudioFile"]');
    
        var formData = new FormData();
        formData.append('ArtistId', artistId);
        formData.append('AlbumTitle', title);
        formData.append('PhotoFile', photoFile, photoFile.name);
    
        hiddenInputs.forEach(function(input, index) {
            var audioFile = input.files[0];
            var songTitle = document.getElementById('songTitle' + (index + 1)).value; 
    
            formData.append('AudioFiles', audioFile);
            formData.append('SongTitles[]', songTitle);
        });
    
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://localhost:7219/Upload/upload', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('Audio uploaded successfully.');
            } else {
                console.log('Error uploading audio: ' + xhr.responseText);
            }
        };
        xhr.send(formData);
    }
    

    function getArtistSongs() {

    }

    function renderArtistSongs() {

    }

    function renderUploadFunctionality() {
        const displayField = document.getElementById("displayField");


    }
});
