import React  from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Dimensions, Modal, Switch, Keyboard,
} from 'react-native';
import CustomInput from '../../components/customInput'
import CustomPicker from '../../components/customPicker'
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors} from '../../utils/config'
import {Button} from 'react-native-elements';
import {RFPercentage} from 'react-native-responsive-fontsize';
import moment from 'moment';
import schama from '../MyPost/validator';
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH / 3;
const {width,height} = Dimensions.get('window')


const FormatDate = (date) => {
  return moment(date).format('DD/MM/YYYY')
};
export default class Filter extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      values:props.values,
      noExpiry:false,
      focus:{},
      error:[]
    }
  }
  handleInput=async (f,v)=>{
    const newState={... this.state}
    newState.values[f]=v;
    // const err = await validate(newState.values, schama);
    // newState.error=err
    this.setState(newState)

  }
  render(){
    const {choosedate,values,focus,error,noExpiry} = this.state
    const {categories,level} = this.props.data
    const data={error,focus,values}
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
          <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1} style={{width,height,flex:1,backgroundColor:'rgba(0,0,0,0.62)',justifyContent:'center',alignItems:'center'}}>
            <View style={{width:'90%',paddingBottom:0,backgroundColor:'#fff',borderRadius:10}}>
                <View style={{flexDirection:'row',width:'100%',height:50,backgroundColor:Colors.primary,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                  <TouchableOpacity onPress={this.props.handleClose} style={{width:'15%',justifyContent:'center',alignItems:'center'}}>
                    <Icon name={'close'} size={30} color={'#fff'}/>
                  </TouchableOpacity>
                  <View style={{width:'68%',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:20,color:'#fff'}}>Fiilters</Text>
                  </View>
                  <TouchableOpacity style={{width:'15%',justifyContent:'center',alignItems:'center'}}>
                    {/*<Text style={{fontSize:15,color:'#fff',marginTop:5}}>Clear</Text>*/}
                  </TouchableOpacity>
                </View>
                <View style={{width:'90%',alignSelf:'center'}}>
                  {/*<CustomPicker handleInput={this.handleInput} input label={'Location'} title={'Location'} name={'location'} value={data}/>*/}
                  <CustomPicker label={'Category'} handleInput={this.handleInput} name={'category'} items={categories} select title={'Category'} value={data}/>
                  <CustomPicker label={'Task Level'} handleInput={this.handleInput} name={'level'} items={level} select title={'Task Level'} value={data}/>
                  <CustomPicker noError required date disabled={noExpiry} onPress={()=>this.setState({choosedate:true})} label={'Deadline'} title={(values.start&&values.end)?(FormatDate(values.start)+' - '+FormatDate(values.end)):"Choose Date"} name={'deadline'} value={data}/>
                  <View style={{flexDirection:'row',marginTop:5}}>
                    <Text style={{fontSize: 18, color: Colors.textColor,width:'85%'}}>No Expiry</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#1884ff" }}
                        // thumbColor={isLocation ? "#f5dd4b" : "#f4f3f4"}
                        // ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>this.handleInput('noExpiry',!values.noExpiry)}
                        value={values.noExpiry}
                    />
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <View style={{width:'48%'}}>
                      <CustomPicker number input label={'Reward'} name={'min'} handleInput={this.handleInput} title={'Min'} half value={data}/>
                    </View>
                    <View style={{width:'4%'}}/>
                    <View style={{width:'48%'}}>
                      <CustomPicker number input label={'Deadline'} name={'max'} handleInput={this.handleInput} nolabel half title={'Max'} value={data}/>
                    </View>
                  </View>
                </View>
              <Button
                  onPress={()=>this.props.handleApply(values)}
                  title={"Apply"}
                  titleStyle={{fontSize:20}}
                  containerStyle={{alignSelf:'center',marginVertical:20}}
                  buttonStyle={{paddingVertical:13,width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
              />
            </View>
          </TouchableOpacity>
          {choosedate&&<Modal statusBarTranslucent={true} visible={choosedate} animationType={'fade'} transparent={true}>
            <View style={{width,height:height,backgroundColor:'rgba(0,0,0,0.43)',alignItems:'center',justifyContent:'center'}}>
              <View style={{width:RFPercentage(45),paddingBottom:10,backgroundColor:'#fff',borderRadius:20}}>
                <View style={{width:'100%',paddingVertical:10,borderBottomWidth:0.3,flexDirection:'row',alignItems:'center'}}>
                  <TouchableOpacity onPress={()=>this.setState({choosedate:false})} style={{width:'15%',alignItems:'center'}}>
                    <Icon name={'close'} size={30} color={'red'}/>
                  </TouchableOpacity>
                  <Text style={{fontSize:20,width:'70%',textAlign:'center'}}>Choose Deadline</Text>
                  <TouchableOpacity onPress={()=>this.setState({choosedate:false})} style={{width:'15%',alignItems:'center'}}>
                    <Icon name={'done'} size={30} color={'green'}/>
                  </TouchableOpacity>
                </View>
                <View style={{width:'90%',alignSelf:'center'}}>
                  <CustomPicker subDate date handleInput={this.handleInput} label={'Start Date'} title={'Choose Date'} name={'start'} value={data}/>
                  <View style={{}}/>
                  <CustomPicker subDate date handleInput={this.handleInput} label={'End Date'} title={'Choose Date'} name={'end'} value={data}/>
                </View>


              </View>
            </View>
          </Modal>}
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
