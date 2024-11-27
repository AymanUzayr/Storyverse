import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import  {TMDB_API_KEY,BEARER_TOKEN,GOOGLE_BOOKS_API_KEY} from '@env';

const Stack = createStackNavigator();

// Home Screen Component
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Movie & TV Recommendations</Text>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => navigation.navigate("GenreSelection", { category: "Movies" })}
      >
        <Text style={styles.categoryButtonText}>Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => navigation.navigate("GenreSelection", { category: "TV Shows" })}
      >
        <Text style={styles.categoryButtonText}>TV Shows</Text>
      </TouchableOpacity>
    </View>
  );
};

// Genre Selection Screen Component
const GenreSelectionScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const url = category === "Movies"
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
    navigation.navigate("Recommendations", { category, selectedGenres });
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
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Get Recommendations</Text>
      </TouchableOpacity>
    </View>
  );
};

// Recommendation Screen Component
const RecommendationScreen = ({ route }) => {
  const { category, selectedGenres } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const url = category === "Movies"
          ? `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenres.join(
              ","
            )}`
          : `https://api.themoviedb.org/3/discover/tv?with_genres=${selectedGenres.join(
              ","
            )}`;

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });

        const data = await response.json();
        if (data.results) {
          setResults(data.results);
        } else {
          Alert.alert("Error", "Failed to load recommendations.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [category, selectedGenres]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommendations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              {item.poster_path && (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                  }}
                  style={styles.poster}
                />
              )}
              <Text style={styles.resultTitle}>{item.title || item.name}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ color: "#fff" }}>No recommendations found.</Text>
      )}
    </View>
  );
};

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
  categoryButton: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  categoryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  resultItem: {
    marginBottom: 20,
    alignItems: "center",
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});