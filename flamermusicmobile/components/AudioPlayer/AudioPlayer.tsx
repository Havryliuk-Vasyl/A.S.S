import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Slider from "@react-native-community/slider";
import { usePlayer } from "./PlayerContext";

const AudioPlayer = () => {
  const { isPlaying, currentTrack, playTrack, togglePlay } = usePlayer();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const imageUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.jpg";
  const songUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    if (currentTrack) {
      setPosition(0);
      setDuration(0);
    }
  }, [currentTrack]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          disabled={true}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#fff"
          thumbTintColor="transparent"
        />
      </View>
      <View style={styles.container}>
        <View style={styles.songInformationContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Text style={styles.title}>{currentTrack? currentTrack : "No name"}</Text>
        </View>
        <TouchableOpacity
          onPress={() => ( togglePlay() )}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{isPlaying ? "||" : ">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    backgroundColor: "#121212",
    padding: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  songInformationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginLeft: 5,
    color: "#1DB954",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#1DB954",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  sliderContainer: {
    flex: 1,
    height: 1,
  },
  slider: {
    width: "100%",
  },
});

export default AudioPlayer;