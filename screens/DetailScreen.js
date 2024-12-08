import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import  DetailScreenStyles from "../styles/DetailScreenStyles";

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
      <View DetailScreenStyles={DetailScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={DetailScreenStyles.errorContainer}>
        <Text style={{ color: "#fff" }}>Details not found.</Text>
      </View>
    );
  }

  const {
    title,
    name,
    backdrop_path,
    overview,
    genres,
    release_date,
    first_air_date,
    vote_average,
  } = details;

  return (
    <ScrollView style={DetailScreenStyles.container}>
      {/* Backdrop Image */}
      {backdrop_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${backdrop_path}` }}
          style={DetailScreenStyles.backdropImage}
          resizeMode="cover"
        />
      )}

      {/* Title */}
      <Text style={DetailScreenStyles.title}>{title || name}</Text>

      {/* Rating */}
      <Text style={DetailScreenStyles.rating}>
        Rating: {vote_average ? vote_average.toFixed(1) : "N/A"} / 10
      </Text>

      {/* Release Date */}
      <Text style={DetailScreenStyles.subTitle}>
        Release Date: {release_date || first_air_date || "Unknown"}
      </Text>

      {/* Genres */}
      <Text style={DetailScreenStyles.subTitle}>
        Genres: {genres?.map((genre) => genre.name).join(", ") || "N/A"}
      </Text>

      {/* Overview */}
      <Text style={DetailScreenStyles.sectionHeader}>Overview</Text>
      <Text style={DetailScreenStyles.overview}>{overview || "No overview available."}</Text>

      {/* Cast Section */}
      <Text style={DetailScreenStyles.sectionHeader}>Cast</Text>
      <FlatList
        horizontal
        data={cast}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={DetailScreenStyles.castItem}>
            {item.profile_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                }}
                style={DetailScreenStyles.castImage}
                resizeMode="cover"
              />
            ) : (
              <View style={DetailScreenStyles.castPlaceholder}>
                <Text style={DetailScreenStyles.castPlaceholderText}>No Image</Text>
              </View>
            )}
            <Text style={DetailScreenStyles.castName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={DetailScreenStyles.castRole} numberOfLines={1}>
              {item.character || "N/A"}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

  export default DetailScreen;

  