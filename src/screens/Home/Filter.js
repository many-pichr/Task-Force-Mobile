import React  from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Dimensions, Modal,
} from 'react-native';
import CustomInput from '../../components/customInput'
import CustomPicker from '../../components/customPicker'
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors} from '../../utils/config'
import {Button} from 'react-native-elements';
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH / 3;
const {width,height} = Dimensions.get('window')
export default class Filter extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      values:{

      }
    }
  }

  render(){
    const {values} = this.state
    return(
        <Modal
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
            visible={this.props.visible}
            onDismiss={this.props.handleClose}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
        >
          <View style={{width,height,flex:1,backgroundColor:'rgba(0,0,0,0.62)',justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'90%',paddingBottom:0,backgroundColor:'#fff',borderRadius:10}}>
                <View style={{flexDirection:'row',width:'100%',height:50,backgroundColor:Colors.primary,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                  <TouchableOpacity onPress={this.props.handleClose} style={{width:'15%',justifyContent:'center',alignItems:'center'}}>
                    <Icon name={'close'} size={30} color={'#fff'}/>
                  </TouchableOpacity>
                  <View style={{width:'68%',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20,color:'#fff'}}>Fiilters</Text>
                  </View>
                  <TouchableOpacity style={{width:'15%',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:15,color:'#fff',marginTop:5}}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width:'90%',alignSelf:'center'}} value={values}>
                  <CustomPicker label={'Location'} title={'Phnom Penh'} value={values}/>
                  <CustomPicker label={'Category'} title={'Mobile App UX/UI'} value={values}/>
                  <CustomPicker label={'Task Level'} title={'Medium'} value={values}/>
                  <CustomPicker label={'Deadline'} title={'No expiry'} value={values}/>
                  <View style={{flexDirection:'row'}}>
                    <View style={{width:'48%'}}>
                      <CustomPicker input label={'Reward'} title={'Min'} half value={values}/>
                    </View>
                    <View style={{width:'4%'}}/>
                    <View style={{width:'48%'}}>
                      <CustomPicker input label={'Deadline'} nolabel half title={'Max'} value={values}/>
                    </View>
                  </View>
                </View>
              <Button
                  onPress={this.props.handleClose}
                  title={"Apply"}
                  titleStyle={{fontSize:20}}
                  containerStyle={{alignSelf:'center',marginVertical:20}}
                  buttonStyle={{paddingVertical:13,width:width*0.6,borderRadius:10,backgroundColor:'#1582F4'}}
              />
            </View>
          </View>
        </Modal>
    )
  }
}
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
    color:'#7F838D'
  },
});
