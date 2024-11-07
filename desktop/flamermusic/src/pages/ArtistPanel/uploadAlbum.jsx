import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/artist.css';

import { uploadAlbum, getGenres } from '../../services/artistService.jsx';

const API_URL = "https://localhost:7219/";

const UploadAlbum = () => {
    const [title, setTitle] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [audioFiles, setAudioFiles] = useState([]);
    const [songTitles, setSongTitles] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const userId = query.get("id");

    useEffect(() => {
        const fetchGenres = async () => {
            const data = await getGenres();
            setGenres(data);
        };
        fetchGenres();
    }, []);

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

    const handleGenreSelect = (event) => {
        const genreId = Number(event.target.value);
        if (!selectedGenres.includes(genreId)) {
            setSelectedGenres((prevGenres) => [...prevGenres, genreId]);
        }
    };

    const VerifyData = () => {
        console.log(selectedGenres);
    };

    const handleGenreRemove = (genreId) => {
        const updatedSelectedGenres = selectedGenres.filter((id) => id !== genreId);
        setSelectedGenres(updatedSelectedGenres);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('ArtistId', userId);
        formData.append('AlbumTitle', title);
        formData.append('PhotoFile', photoFile);
        selectedGenres.forEach((genreId) => {
            formData.append('GenreIds', genreId);
        });
        audioFiles.forEach((file, index) => {
            formData.append('AudioFiles', file);
            formData.append('SongTitles[]', songTitles[index]);
        });

        try {
            const response = await uploadAlbum(formData);
            if (response.ok) {
                alert('Альбом успішно завантажений');
                setTitle('');
                setPhotoFile(null);
                setAudioFiles([]);
                setSongTitles([]);
                setSelectedGenres([]);
                if (photoFile) URL.revokeObjectURL(photoFile);
            } else {
                const errorMsg = await response.text();
                console.error('Помилка завантаження:', errorMsg);
                alert(`Помилка завантаження: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Мережева помилка:', error);
            alert('Мережева помилка. Спробуйте знову.');
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
                <div className="genres">
                    <p>Genres</p>
                    <select onChange={handleGenreSelect} className="genre-select" required>
                        <option value="">Choose Genres</option>
                        {genres.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    <div className="selected-genres">
                        {selectedGenres.map((genreId) => {
                            const genre = genres.find((g) => g.id === genreId);
                            return (
                                <div className="selected-genre" id="genre" key={genreId}>
                                    <p>{genre ? genre.name : "Unknown Genre"}</p>
                                    <button onClick={() => handleGenreRemove(genreId)}>Delete</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
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
            <button onClick={VerifyData}>Verify</button>
        </div>
    );
};

export default UploadAlbum;
