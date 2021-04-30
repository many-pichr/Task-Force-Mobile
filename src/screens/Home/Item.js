import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH / 3;

export const Item = ({ source, title,key,index }) => {
  const [checked, setChecked] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.imageContainer,index==0&&{marginLeft:SCREEN_WIDTH*0.04}]}
      onPress={() => setChecked((prevState) => !prevState)}
    >
      <View style={styles.imageWrapper}>
        <Image source={{uri:source}} style={styles.image} />
        <Text style={styles.imageLabel}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: 120,
    width: 110,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    top: 5,
    borderRadius: 50,
    position: "absolute",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(21,138,255,0.25)",
    zIndex: 10,
  },

  imageWrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width:100,
    height:100,
    backgroundColor:'#fff',
    shadowOpacity: 0.22,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    shadowRadius: 2.22,
  },

  image: {
    width: 50,
    height: 50,
    zIndex: -1,
  },

  imageLabel: {
    fontSize: 13,
    width:'100%',
    textAlign:'center',
    color:'#7F838D'
  },
});
