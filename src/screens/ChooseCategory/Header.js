import React from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
const { width, height } = Dimensions.get("window");
import {Colors} from '../../utils/config'
export const Header = ({onBack}) => {
  return (
    <View style={styles.headerWrapper}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity onPress={onBack}>
          <Icon name={'chevron-left'} color={Colors.textColor} size={30}/>
        </TouchableOpacity>
      <Text style={styles.titleText}>Choose Categories</Text>
      </View>
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
    height: 100,
    width:width*0.9,
    alignSelf:'center',
    justifyContent: "flex-end",
  },

  titleText: {
    marginLeft: 15,
    fontSize: 25,
    color: Colors.textColor,
    marginVertical: 10
  },
});
