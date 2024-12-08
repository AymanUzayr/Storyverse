import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Movie & TV Recommendations</Text>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() =>
          navigation.navigate("GenreSelection", { category: "Movies" })
        }
      >
        <Text style={styles.categoryButtonText}>Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() =>
          navigation.navigate("GenreSelection", { category: "TV Shows" })
        }
      >
        <Text style={styles.categoryButtonText}>TV Shows</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

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
});
