import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OWEyZGIwMzdkY2IzMmE0Y2E4MDMyMzI1OGNkNmY3YiIsIm5iZiI6MTczMjY0NDMwMy4xMjA4NzMyLCJzdWIiOiI2NzNjYjI5MjRkNmRiMDBkOTNkNGRhYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.S7iq-o-yE2c1iOwEx1LEeX0HUiuT95-EITGH7NQArg0";

const RecommendationScreen = ({ route }) => {
  const { category, selectedGenres} = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();
  const [includeAdult] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const url =
        category === "Movies"
          ? `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenres.join(
              ","
            )}&include_adult=false&page=${page}`
          : `https://api.themoviedb.org/3/discover/tv?with_genres=${selectedGenres.join(
              ","
            )}&include_adult=false&page=${page}`;

      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });

      const data = await response.json();
      console.log("API Respone",data);
      
      if (data.results) {
        setResults(data.results);
        setTotalPages(data.total_pages || 1);
      } else {
        Alert.alert("Error", "Failed to load recommendations.");
      }
    } catch (error) {
      console.error("Error fetching recommendations: ", error);
      Alert.alert("Error", "An error occurred while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [category, selectedGenres, includeAdult, page]);

  const handlePress = (item) => {
    navigation.navigate("DetailScreen", {
      id: item.id,
      category,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handlePress(item)}>
      {item.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={styles.poster}
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={styles.resultTitle}>{item.title || item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recommendations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : results.length > 0 ? (
        <>
          <FlatList
            data={results}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={styles.row}
            renderItem={renderItem}
          />
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, page === 1 && styles.disabledButton]}
              onPress={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              <Image
                source={require("../assets/back.png")}
                style={styles.buttonImage}
              />
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.pageButton, page === totalPages && styles.disabledButton]}
              onPress={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
            >
              <Image
                source={require("../assets/next.png")}
                style={styles.buttonImage}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.noResults}>No recommendations found.</Text>
      )}
    </View>
  );
};

export default RecommendationScreen;

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
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  resultItem: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  noImage: {
    width: 150,
    height: 225,
    borderRadius: 8,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#fff",
    fontSize: 14,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageButton: {
    width: 50,
    height: 50,
    borderRadius: 75,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#555",
  },
  buttonImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  pageIndicator: {
    color: "#fff",
    fontSize: 16,
  },
  noResults: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
