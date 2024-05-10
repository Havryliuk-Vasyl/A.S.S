document.addEventListener("DOMContentLoaded", function(){
    let artistId = 0;
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            console.log("User profile:", response);

            artistId = response.id;
        },
        error: function(error) {
            console.log(error);
        }
    });

    var photoFileInput = document.getElementById('photoFile');
    var selectedPhotoPreview = document.getElementById('selectedPhotoPreview');

    photoFileInput.addEventListener('change', function(event) {
        var selectedFile = event.target.files[0];
        if (selectedFile) {
            var reader = new FileReader();
            reader.onload = function(e) {
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

    section2Container.addEventListener('input', function(event) {
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
                selectedAudioFileInput.type = 'hidden';
                selectedAudioFileInput.name = 'selectedAudioFile';
                selectedAudioFileInput.value = targetInput.files[0].name;

                // Створення текстового поля для введення назви пісні
                var songTitleInput = document.createElement('input');
                songTitleInput.type = 'text';
                songTitleInput.placeholder = 'Назва пісні';
                songTitleInput.id = 'songTitle' + choosenSongs; // Змінено ідентифікатор для відповідності лічильнику
                songTitleInput.required = true;

                // Створення кнопки видалення
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Видалити';
                deleteButton.addEventListener('click', function() {
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

                section2Container.parentNode.insertBefore(choosenSongFileContainer, section2Container.nextSibling);
            }
        }
    });

    function uploadAudio() {
        var title = document.getElementById('title').value; // Отримання назви релізу
        var photoFile = document.getElementById('photoFile').files[0];
        var audioFiles = document.getElementById('audioFile').files; // Отримання аудіофайлів
    
        var formData = new FormData();
        formData.append('ArtistId', artistId);
        formData.append('AlbumTitle', title); // Додавання назви релізу до formData
        formData.append('PhotoFile', photoFile, photoFile.name);
    
        // Додавання типу альбому залежно від кількості аудіофайлів
        // if (audioFiles.length === 1) {
        //     formData.append('AlbumType', 'single');
        // } else if (audioFiles.length >= 2 && audioFiles.length <= 5) {
        //     formData.append('AlbumType', 'minialbum');
        // } else {
        //     formData.append('AlbumType', 'album');
        // }
    
        // Додавання аудіофайлів та їх назв до formData
        for (var i = 0; i < audioFiles.length; i++) {
            var audioFile = audioFiles[i];
            var songTitle = document.getElementById('songTitle' + (i + 1)).value; // Отримання назви пісні
            formData.append('AudioFiles[]', audioFile, audioFile.name);
            formData.append('Titles[]', songTitle);
        }
    
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
    
    
    function getArtistSongs(){

    }

    function renderArtistSongs(){

    }

    function renderUploadFunctionality(){
        const displayField = document.getElementById("displayField");


    }

    document.getElementById('uploadButton').addEventListener('click', function(){
        uploadAudio();
    });
});
