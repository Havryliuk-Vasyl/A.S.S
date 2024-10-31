import React, { useState } from 'react';
import '../../styles/artist.css';

const UploadAlbum = ({ artistId }) => {
    const [title, setTitle] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [audioFiles, setAudioFiles] = useState([]);
    const [songTitles, setSongTitles] = useState([]);

    const handlePhotoChange = (event) => {
        setPhotoFile(event.target.files[0]);
    };

    const handleAudioChange = (event) => {
        const files = Array.from(event.target.files);
        setAudioFiles((prevFiles) => [...prevFiles, ...files]);

        const newSongTitles = files.map(() => '');
        setSongTitles((prevTitles) => [...prevTitles, ...newSongTitles]);
    };

    const handleTitleChange = (index, value) => {
        const updatedTitles = [...songTitles];
        updatedTitles[index] = value;
        setSongTitles(updatedTitles);
    };

    const handleRemoveAudioFile = (index) => {
        const updatedAudioFiles = audioFiles.filter((_, i) => i !== index);
        const updatedSongTitles = songTitles.filter((_, i) => i !== index);
        setAudioFiles(updatedAudioFiles);
        setSongTitles(updatedSongTitles);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('ArtistId', artistId);
        formData.append('AlbumTitle', title);
        formData.append('PhotoFile', photoFile);

        audioFiles.forEach((file, index) => {
            formData.append('AudioFiles', file);
            formData.append('SongTitles[]', songTitles[index]);
        });

        try {
            const response = await fetch('https://localhost:7219/Upload/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Audio uploaded successfully.');
                setTitle('');
                setPhotoFile(null);
                setAudioFiles([]);
                setSongTitles([]);
            } else {
                console.error('Error uploading audio:', await response.text());
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    // Додавання функцій для перетягування
    const handleDragStart = (index) => {
        const data = JSON.stringify(index);
        event.dataTransfer.setData('text/plain', data);
    };

    const handleDrop = (index) => {
        const draggedIndex = JSON.parse(event.dataTransfer.getData('text/plain'));
        if (draggedIndex !== index) {
            const updatedAudioFiles = [...audioFiles];
            const updatedSongTitles = [...songTitles];

            // Переміщення елементів
            const [movedFile] = updatedAudioFiles.splice(draggedIndex, 1);
            const [movedTitle] = updatedSongTitles.splice(draggedIndex, 1);

            updatedAudioFiles.splice(index, 0, movedFile);
            updatedSongTitles.splice(index, 0, movedTitle);

            setAudioFiles(updatedAudioFiles);
            setSongTitles(updatedSongTitles);
        }
    };

    return (
        <div className="upload">
            <div className="section-1">
                <p>Назва релізу</p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Назва релізу"
                    required
                />

                <p>Зображення</p>
                <img
                    id="selectedPhotoPreview"
                    src={photoFile ? URL.createObjectURL(photoFile) : ''}
                    alt="Preview"
                    style={{ display: photoFile ? 'block' : 'none' }}
                />
                <input
                    type="file"
                    onChange={handlePhotoChange}
                    className="albumPhoto"
                    accept=".png, .jpg"
                    required
                />
            </div>
            <div className="section-2">
                <p>Виберіть музичні файли</p>
                <input
                    type="file"
                    onChange={handleAudioChange}
                    accept=".wav, .mp3"
                    multiple
                    style={{ marginBottom: '1em' }}
                    required
                />
                {audioFiles.map((file, index) => (
                    <div 
                        key={index} 
                        className="choosen-song-file" 
                        draggable 
                        onDragStart={() => handleDragStart(index)}
                        onDrop={() => handleDrop(index)}
                        onDragOver={(event) => event.preventDefault()}
                    >
                        <p>Вибраний трек: {file.name}</p>
                        <input
                            type="text"
                            value={songTitles[index]}
                            onChange={(e) => handleTitleChange(index, e.target.value)}
                            placeholder="Назва пісні"
                            required
                        />
                        <button onClick={() => handleRemoveAudioFile(index)}>Видалити</button>
                    </div>
                ))}
            </div>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadAlbum;
