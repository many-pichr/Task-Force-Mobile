import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
import Icons from 'react-native-vector-icons/Feather';
export const Header = (props) => {
  return (
    <View style={styles.headerWrapper}>
      {/*<Text style={styles.titleText}>Welcome</Text>*/}
      <TouchableOpacity onPress={props.handleBack}>
        <Icons name={'arrow-left'} size={30} color={'#158aff'}/>
      </TouchableOpacity>
      <Text style={styles.titleText}>Categories</Text>
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
    height: 150,
    width:'90%',
    flexDirection:'row',
    alignSelf:'center',
    alignItems: "center",
  },

  titleText: {
    marginLeft: 15,
    fontSize: 25,
    color: "#158aff",
    marginVertical: 10
  },
});
