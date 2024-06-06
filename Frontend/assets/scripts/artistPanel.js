document.addEventListener("DOMContentLoaded", function () {
    let artistId = 0;

    // Функція для отримання ID артиста
    function getArtistId() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: "https://localhost:7219/User/validateToken",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (response) {
                    console.log("User profile:", response);
                    resolve(response.id);
                },
                error: function (error) {
                    console.log(error);
                    alert("Error, you are unauthorized!");
                    reject(error);
                }
            });
        });
    }

    // Функція для отримання альбомів артиста
    function getArtistAlbums(artistId) {
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

    // Функція для відображення альбомів артиста
    function renderArtistAlbums(albumsObj) {
        const displayField = document.getElementById("displayField");
        displayField.innerHTML = '';

        console.log("Albums Object:", albumsObj);

        const albums = albumsObj && albumsObj.$values ? albumsObj.$values : [];

        if (!Array.isArray(albums) || albums.length === 0) {
            displayField.textContent = 'Немає доступних альбомів';
            return;
        }

        const albumsContainer = document.createElement('div');
        albumsContainer.classList.add('albums-container');

        albums.forEach(album => {
            console.log(album);
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('album');

            const photoDiv = document.createElement('div');
            photoDiv.classList.add('album-photo');
            const image = document.createElement('img');
            image.src = "https://localhost:7219/Album/photo/" + album.id;
            photoDiv.appendChild(image);
            albumDiv.appendChild(photoDiv);

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('album-title');
            titleDiv.textContent = album.title;
            albumDiv.appendChild(titleDiv);

            albumDiv.addEventListener("click", function () {
                renderArtistAlbum(album.id);
            });

            albumsContainer.appendChild(albumDiv);
        });

        displayField.appendChild(albumsContainer);
    }


    // Функція для отримання окремого альбому
    async function getArtistAlbum(albumID) {
        try {
            const response = await fetch(`https://localhost:7219/Album/album/` + albumID);
            if (!response.ok) {
                throw new Error("Помилка при отриманні списку плейлистів користувача");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Функція для відображення окремого альбому
    async function renderArtistAlbum(albumID) {
        const displayField = document.getElementById("displayField");
        displayField.innerHTML = '';
    
        try {
            const albumDiv = document.createElement("div");
            albumDiv.classList.add("album-in-display-field");
    
            const albumResponse = await getArtistAlbum(albumID);
            const album = albumResponse.album;
            console.log("Album object:", album);
    
            const albumInfo = document.createElement("div");
            albumInfo.classList.add("albumInfo");

            const albumPhoto = document.createElement('img');
            albumPhoto.src = "https://localhost:7219/Album/photo/" + album.id;
            albumInfo.appendChild(albumPhoto);

            const albumTitle = document.createElement('h2');
            albumTitle.textContent = album.title;
            albumInfo.appendChild(albumTitle);

            const songsList = document.createElement('div');
            const albumSongs = album.albumSongs && album.albumSongs.$values ? album.albumSongs.$values : [];
    
            if (!Array.isArray(albumSongs) || albumSongs.length === 0) {
                songsList.textContent = 'Немає доступних пісень';
            } else {
                albumSongs.forEach(item => {
                    const songDiv = document.createElement("div");
                    songDiv.classList.add("album-song");
    
                    const songInformationDiv = document.createElement("div");
                    songInformationDiv.classList.add("album-song-information");
    
                    const songPhotoDiv = document.createElement("div");
                    songPhotoDiv.classList.add("album-song-photo");
                    const songPhotoImg = document.createElement("img");
                    songPhotoImg.src = "https://localhost:7219/Song/photo/" + item.song.id;
                    songPhotoImg.alt = "Photo";
                    songPhotoImg.style.maxWidth = "50px";
                    songPhotoImg.style.maxHeight = "50px";
                    songPhotoImg.style.width = "100%";
                    songPhotoImg.style.height = "100%";
                    songPhotoDiv.appendChild(songPhotoImg);
    
                    const songNameDiv = document.createElement("div");
                    songNameDiv.classList.add("catalog-song-name");
                    songNameDiv.textContent = item.song.title;
    
                    songInformationDiv.appendChild(songPhotoDiv);
                    songInformationDiv.appendChild(songNameDiv);
                    songDiv.appendChild(songInformationDiv);
    
                    songsList.appendChild(songDiv);
                });
            }
    
            const albumControlDiv = document.createElement("div");
            albumControlDiv.classList.add("album-control");
    
            const deleteButton = document.createElement("div");
            deleteButton.classList.add("delete-album");
            deleteButton.textContent = "Видалити альбом";
            deleteButton.addEventListener("click", function () {
                deleteAlbum(album.id);
            });
            albumControlDiv.appendChild(deleteButton);
    
            albumDiv.appendChild(albumInfo);
            albumDiv.appendChild(songsList);
            albumDiv.appendChild(albumControlDiv);
    
            displayField.appendChild(albumDiv);
        } catch (error) {
            console.error(error);
            alert("Error while rendering artist album!");
        }
    }
    


    // Функція для видалення альбому
    function deleteAlbum(albumId) {
        $.ajax({
            type: "DELETE",
            url: "https://localhost:7219/Album/" + albumId,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (response) {
                alert("Album deleted successfully.");
                getArtistAlbums(artistId).then(renderArtistAlbums);
            },
            error: function (error) {
                console.log(error);
                alert("Error deleting the album.");
            }
        });
    }

    // Кнопка для показу всіх альбомів
    document.getElementById("showAllDiscography").addEventListener("click", async function () {
        try {
            artistId = await getArtistId();
            const albums = await getArtistAlbums(artistId);
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

        hiddenInputs.forEach(function (input, index) {
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
});
