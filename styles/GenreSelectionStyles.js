import { StyleSheet } from "react-native";

const GenreSelectionStyles = StyleSheet.create({
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
    backgroundColor: "#d44f02",
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
    backgroundColor: "#d44f02",
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

export default GenreSelectionStyles;
