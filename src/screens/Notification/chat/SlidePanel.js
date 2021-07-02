import React  from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Dimensions, Modal, SafeAreaView,
} from 'react-native';
import CustomInput from '../../../components/customInput'
import CustomPicker from '../../../components/customPicker'
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors} from '../../../utils/config'
import {Button} from 'react-native-elements';
import ActionSheet from 'react-native-actions-sheet';
import Icons from 'react-native-vector-icons/Feather';
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH / 3;
const {width,height} = Dimensions.get('window')
export const SlidePanel = (props) => {
    return(
        <ActionSheet ref={props.myRef} gestureEnabled={true}>
          <View style={{width,height:400,backgroundColor:'white'}}>

          </View>
        </ActionSheet>
    )
  }
const styles = StyleSheet.create({
  textStyle:{
    color:'#5e5e5e',
    fontSize:13,
    marginTop:2
  },
  cardItem:{
    width:'90%',height:height*0.1,backgroundColor:'#fff',borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection:'row',
    elevation: 5,
    marginVertical: 10,
  }
});

