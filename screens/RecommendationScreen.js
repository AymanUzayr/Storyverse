import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import  RecommendationStyles from "../styles/RecommendationStyles";

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
    <TouchableOpacity style={RecommendationStyles.resultItem} onPress={() => handlePress(item)}>
      {item.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={RecommendationStyles.poster}
        />
      ) : (
        <View style={RecommendationStyles.noImage}>
          <Text style={RecommendationStyles.noImageText}>No Image</Text>
        </View>
      )}
      <Text style={RecommendationStyles.resultTitle}>{item.title || item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={RecommendationStyles.container}>
      <Text style={RecommendationStyles.header}>Recommendations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : results.length > 0 ? (
        <>
          <FlatList
            data={results}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={RecommendationStyles.row}
            renderItem={renderItem}
          />
          <View style={RecommendationStyles.pagination}>
            <TouchableOpacity
              style={[RecommendationStyles.pageButton, page === 1 && RecommendationStyles.disabledButton]}
              onPress={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              <Image
                source={require("../assets/back.png")}
                style={RecommendationStyles.buttonImage}
              />
            </TouchableOpacity>

            <Text style={RecommendationStyles.pageIndicator}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[RecommendationStyles.pageButton, page === totalPages && RecommendationStyles.disabledButton]}
              onPress={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
            >
              <Image
                source={require("../assets/next.png")}
                style={RecommendationStyles.buttonImage}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={RecommendationStyles.noResults}>No recommendations found.</Text>
      )}
    </View>
  );
};

export default RecommendationScreen;

