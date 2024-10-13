import React, { createContext, useContext, useState } from "react";

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
    const [queue, setQeue] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    const addSongToQueue = (song) => {
        setQeue([...prevQueue, song]);
    };

    const removeSongFromQueue = (index) => {
        setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index));
    };

    const nextSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % queue.length);
    };

    return (
        <QueueContext.Provider value={{ queue, addSongToQueue, removeSongFromQueue, currentSongIndex, nextSong }}>
            {children}
        </QueueContext.Provider>
    )
}