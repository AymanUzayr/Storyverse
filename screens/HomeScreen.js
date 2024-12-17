import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import  HomeScreenStyles from "../styles/HomeScreenStyles";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={HomeScreenStyles.container}>
      <Text style={HomeScreenStyles.header}>
        Welcome to Recommendations for Movies, TV Shows, and Books
      </Text>
      <TouchableOpacity
        style={HomeScreenStyles.categoryButton}
        onPress={() =>
          navigation.navigate("GenreSelection", { category: "Movies" })
        }
      >
        <Text style={HomeScreenStyles.categoryButtonText}>Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={HomeScreenStyles.categoryButton}
        onPress={() =>
          navigation.navigate("GenreSelection", { category: "TV Shows" })
        }
      >
        <Text style={HomeScreenStyles.categoryButtonText}>TV Shows</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={HomeScreenStyles.categoryButton}
        onPress={() =>
          navigation.navigate("GenreSelection", { category: "Books" })
        }
      >
        <Text style={HomeScreenStyles.categoryButtonText}>Books</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

  