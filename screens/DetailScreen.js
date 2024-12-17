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
import DetailScreenStyles from "../styles/DetailScreenStyles";

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmFkZWE5YjM5ZDZhNjRkMjQwZTAyNWQ3NmFjYmUzMyIsIm5iZiI6MTczMTkxODc3OC41NDgsInN1YiI6IjY3M2FmYmJhZjBlOTc0YzI2OTg1ZjQzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LRWW6LteuD2LxQIonJouzZmCucKVkW2dkIS3X8LFCY";
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

const DetailScreen = ({ route }) => {
  const { id, category } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        let url = "";
        if (category === "Books") {
          url = `${GOOGLE_BOOKS_API_URL}/${id}`;
        } else {
          url =
            category === "Movies"
              ? `https://api.themoviedb.org/3/movie/${id}?language=en-US`
              : `https://api.themoviedb.org/3/tv/${id}?language=en-US`;
        }

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            ...(category !== "Books" && { Authorization: `Bearer ${BEARER_TOKEN}` }),
          },
        });

        const data = await response.json();
        setDetails(data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, category]);

  if (loading) {
    return (
      <View style={DetailScreenStyles.loadingContainer}>
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

  const renderBookDetails = () => {
    const {
      title,
      authors,
      imageLinks,
      description,
      averageRating,
      ratingsCount,
      publishedDate,
      categories,
    } = details.volumeInfo;

    return (
      <>
        {/* Book Cover */}
        {imageLinks?.thumbnail && (
          <Image
            source={{ uri: imageLinks.thumbnail }}
            style={DetailScreenStyles.backdropImage}
            resizeMode="cover"
          />
        )}

        {/* Title */}
        <Text style={DetailScreenStyles.title}>{title}</Text>

        {/* Authors */}
        {authors && (
          <Text style={DetailScreenStyles.subTitle}>
            Author(s): {authors.join(", ")}
          </Text>
        )}

        {/* Average Rating */}
        {averageRating && (
          <Text style={DetailScreenStyles.rating}>
            Rating: {averageRating} ★ ({ratingsCount || 0} ratings)
          </Text>
        )}

        {/* Published Date */}
        {publishedDate && (
          <Text style={DetailScreenStyles.subTitle}>
            Published Date: {publishedDate}
          </Text>
        )}

        {/* Categories */}
        {categories && (
          <Text style={DetailScreenStyles.subTitle}>
            Genres: {categories.join(", ")}
          </Text>
        )}

        {/* Description */}
        <Text style={DetailScreenStyles.sectionHeader}>Description</Text>
        <Text style={DetailScreenStyles.overview}>
          {description || "No description available."}
        </Text>
      </>
    );
  };

  const renderMovieOrTvDetails = () => {
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
      <>
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
        <Text style={DetailScreenStyles.overview}>
          {overview || "No overview available."}
        </Text>
      </>
    );
  };

  return (
    <ScrollView style={DetailScreenStyles.container}>
      {category === "Books" ? renderBookDetails() : renderMovieOrTvDetails()}
    </ScrollView>
  );
};

export default DetailScreen;
