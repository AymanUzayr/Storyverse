import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmFkZWE5YjM5ZDZhNjRkMjQwZTAyNWQ3NmFjYmUzMyIsIm5iZiI6MTczMTkxODc3OC41NDgsInN1YiI6IjY3M2FmYmJhZjBlOTc0YzI2OTg1ZjQzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LRWW6LteuD2LxQIonJouzZmCucKVkW2dkIS3X8LFCY";

const DetailScreen = ({ route }) => {
  const { id, category } = route.params;
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Fetch details
        const url =
          category === "Movies"
            ? `https://api.themoviedb.org/3/movie/${id}?language=en-US`
            : `https://api.themoviedb.org/3/tv/${id}?language=en-US`;

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${BEARER_TOKEN}`,
          },
        });

        const data = await response.json();
        setDetails(data);

        // Fetch cast
        const castResponse = await fetch(
          category === "Movies"
            ? `https://api.themoviedb.org/3/movie/${id}/credits`
            : `https://api.themoviedb.org/3/tv/${id}/credits`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${BEARER_TOKEN}`,
            },
          }
        );
        const castData = await castResponse.json();
        setCast(castData.cast);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch details or cast information.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, category]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "#fff" }}>Details not found.</Text>
      </View>
    );
  }

  const {
    title,
    name,
    poster_path,
    backdrop_path,
    overview,
    genres,
    release_date,
    first_air_date,
    vote_average,
  } = details;

  return (
    <ScrollView style={styles.container}>
      {/* Backdrop Image */}
      {backdrop_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${backdrop_path}` }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
      )}

      {/* Title */}
      <Text style={styles.title}>{title || name}</Text>

      {/* Rating */}
      <Text style={styles.rating}>
        Rating: {vote_average ? vote_average.toFixed(1) : "N/A"} / 10
      </Text>

      {/* Release Date */}
      <Text style={styles.subTitle}>
        Release Date: {release_date || first_air_date || "Unknown"}
      </Text>

      {/* Genres */}
      <Text style={styles.subTitle}>
        Genres: {genres?.map((genre) => genre.name).join(", ") || "N/A"}
      </Text>

      {/* Overview */}
      <Text style={styles.sectionHeader}>Overview</Text>
      <Text style={styles.overview}>{overview || "No overview available."}</Text>

      {/* Cast Section */}
      <Text style={styles.sectionHeader}>Cast</Text>
      <FlatList
        horizontal
        data={cast}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.castItem}>
            {item.profile_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                }}
                style={styles.castImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.castPlaceholder}>
                <Text style={styles.castPlaceholderText}>No Image</Text>
              </View>
            )}
            <Text style={styles.castName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.castRole} numberOfLines={1}>
              {item.character || "N/A"}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  backdropImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  rating: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  overview: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "justify",
    lineHeight: 20,
  },
  castItem: {
    width: 100,
    marginRight: 10,
    alignItems: "center",
  },
  castImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  castPlaceholder: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  castPlaceholderText: {
    color: "#777",
    fontSize: 12,
  },
  castName: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  castRole: {
    color: "#ccc",
    fontSize: 10,
    textAlign: "center",
  },
});
