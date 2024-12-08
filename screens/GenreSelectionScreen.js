import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Switch } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.header}>Select Genres for {category}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.genreContainer}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              style={[
                styles.genreButton,
                selectedGenres.includes(genre.id) && styles.genreButtonSelected,
              ]}
              onPress={() => toggleGenre(genre.id)}
            >
              <Text
                style={[
                  styles.genreText,
                  selectedGenres.includes(genre.id) && styles.genreTextSelected,
                ]}
              >
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Include Adult Content</Text>
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
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenreSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  genreContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  genreButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  genreButtonSelected: {
    backgroundColor: "#6200ea",
  },
  genreText: {
    color: "#fff",
  },
  genreTextSelected: {
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  switchLabel: {
    color: "#fff",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#03dac5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  searchButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
