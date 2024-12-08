import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Switch } from "react-native";
import  GenreSelectionStyles from "../styles/GenreSelectionStyles";

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OWEyZGIwMzdkY2IzMmE0Y2E4MDMyMzI1OGNkNmY3YiIsIm5iZiI6MTczMjY0NDMwMy4xMjA4NzMyLCJzdWIiOiI2NzNjYjI5MjRkNmRiMDBkOTNkNGRhYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.S7iq-o-yE2c1iOwEx1LEeX0HUiuT95-EITGH7NQArg0";

const GenreSelectionScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [includeAdult, setIncludeAdult] = useState(false); // Ensuring initial state is a boolean

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const url =
          category === "Movies"
            ? "https://api.themoviedb.org/3/genre/movie/list?language=en"
            : "https://api.themoviedb.org/3/genre/tv/list?language=en";

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });

        const data = await response.json();
        if (data.genres) {
          setGenres(data.genres);
        } else {
          Alert.alert("Error", "Failed to load genres.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching genres.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [category]);

  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres((prev) => prev.filter((id) => id !== genreId));
    } else {
      setSelectedGenres((prev) => [...prev, genreId]);
    }
  };

  const handleSearch = () => {
    if (selectedGenres.length === 0) {
      Alert.alert("Error", "Please select at least one genre.");
      return;
    }
    navigation.navigate("Recommendations", { category, selectedGenres, includeAdult });
  };

  return (
    <View style={GenreSelectionStyles.container}>
      <Text style={GenreSelectionStyles.header}>Select Genres for {category}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={GenreSelectionStyles.genreContainer}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={[
                GenreSelectionStyles.genreButton,
                selectedGenres.includes(genre.id) && GenreSelectionStyles.genreButtonSelected,
              ]}
              onPress={() => toggleGenre(genre.id)}
            >
              <Text
                style={[
                  GenreSelectionStyles.genreText,
                  selectedGenres.includes(genre.id) && GenreSelectionStyles.genreTextSelected,
                ]}
              >
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={GenreSelectionStyles.switchContainer}>
        <Text style={GenreSelectionStyles.switchLabel}>Include Adult Content</Text>
        <Switch
          value={includeAdult} // This should always be a boolean
          onValueChange={(value) => {
            console.log("Toggled to:", value); // Debugging: Log the toggle value
            setIncludeAdult(value); // Ensuring only true/false is set
          }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={includeAdult ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
      <TouchableOpacity style={GenreSelectionStyles.searchButton} onPress={handleSearch}>
        <Text style={GenreSelectionStyles.searchButtonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenreSelectionScreen;


