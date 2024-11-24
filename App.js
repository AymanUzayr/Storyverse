import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {TMDB_API_KEY, GOOGLE_BOOKS_API_KEY} from "@env";


const genreMap = {
  Action: 28,
  Romance: 10749,
  Comedy: 35,
  Horror: 27,
  "Sci-Fi": 878,
  Drama: 18,
  Adventure: 12,
  Fantasy: 14,
};

const genreToBooksSubject = {
  Action: "action",
  Romance: "romance",
  Comedy: "comedy",
  Horror: "horror",
  "Sci-Fi": "science fiction",
  Drama: "drama",
  Adventure: "adventure",
  Fantasy: "fantasy",
};

//create a stack navigation object
const Stack = createStackNavigator();

// this navigates to the home screen of the app
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>What are you looking for today?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.homeChoiceBox}
          onPress={() =>
            navigation.navigate("GenreSelection", { category: "Movies" })
          }
        >
          <Image
            source={require("./assets/popcorn.png")}
            style={styles.icon}
          />
          <Text style={styles.homeChoiceText}>Movies</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeChoiceBox}
          onPress={() =>
            navigation.navigate("GenreSelection", { category: "Books" })
          }
        >
          <Image source={require("./assets/books.png")} style={styles.icon} />
          <Text style={styles.homeChoiceText}>Books</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//handles the genre selection of user choice for the recommendation system
function GenreSelectionScreen({ route, navigation }) {
  const { category } = route.params;
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres((prev) => prev.filter((g) => g !== genre));
    } else {
      setSelectedGenres((prev) => [...prev, genre]);
    }
  };

  const handleSearch = () => {
    if (selectedGenres.length === 0) {
      Alert.alert("Error", "Please select at least one genre.");
      return;
    }
    navigation.navigate("Recommendations", { category, selectedGenres });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select genres for {category}</Text>
      <View style={styles.genreContainer}>
        {Object.keys(genreMap).map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreButton,
              selectedGenres.includes(genre) && styles.genreButtonSelected,
            ]}
            onPress={() => toggleGenre(genre)}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenres.includes(genre) && styles.genreTextSelected,
              ]}
            >
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
}

//Handles the recommendation logic according to user's preference
function RecommendationScreen({ route }) {
  const { category, selectedGenres } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);

      let url;
      if (category === "Movies") {
        const genreIds = selectedGenres.map((genre) => genreMap[genre]).join(",");
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds}`;
      } else if (category === "Books") {
        const genresQuery = selectedGenres
          .map((genre) => genreToBooksSubject[genre])
          .join("+");
        url = `https://www.googleapis.com/books/v1/volumes?q=subject:${genresQuery}&key=${GOOGLE_BOOKS_API_KEY}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (category === "Movies") {
          setResults(data.results || []);
        } else if (category === "Books") {
          setResults(data.items || []);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to fetch recommendations. Please try again later."
        );
      }

      setLoading(false);
    };

    fetchRecommendations();
  }, [category, selectedGenres]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommendations</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : results.length === 0 ? (
        <Text style={styles.noResults}>No results found. Try different genres.</Text>
      ) : (
        <FlatList
          numColumns={2}
          data={results}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {category === "Movies" && item.poster_path && (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                  }}
                  style={styles.coverImage}
                />
              )}
              {category === "Books" &&
                item.volumeInfo?.imageLinks?.thumbnail && (
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    style={styles.coverImage}
                  />
                )}
              <Text style={styles.title}>
                {item.title || item.volumeInfo?.title}
              </Text>
              <Text style={styles.rating}>
                Rating: {item.vote_average || item.volumeInfo?.averageRating || "N/A"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GenreSelection" component={GenreSelectionScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50", // Midnight blue background
    padding: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  homeChoiceBox: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f39c12", // Orange color
    borderRadius: 15,
  },
  homeChoiceText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    width: 50,
    height: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginVertical: 20,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  genreButton: {
    backgroundColor: "#34495e",
    padding: 10,
    margin: 8,
    borderRadius: 20,
  },
  genreButtonSelected: {
    backgroundColor: "#f39c12",
  },
  genreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  genreTextSelected: {
    color: "#fff",
  },
  searchButton: {
    backgroundColor: "#f39c12",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  rating: {
    fontSize: 12,
    color: "#fff",
  },
  noResults: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
