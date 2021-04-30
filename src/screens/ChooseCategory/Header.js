import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Header = () => {
  return (
    <View style={styles.headerWrapper}>
      <Text style={styles.titleText}>Welcome</Text>
      <Text style={styles.titleText}>Choose the Categories</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    transform: [{ scaleX: 1.1 }],
    top: -100,
    position: "absolute",
  },

  headerWrapper: {
    height: 200,
    width:'90%',
    alignSelf:'center',
    justifyContent: "center",
  },

  titleText: {
    marginLeft: 15,
    fontSize: 25,
    color: "#158aff",
    marginVertical: 10
  },
});
