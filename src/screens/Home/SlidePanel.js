import React,{useState}  from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Dimensions, Modal, SafeAreaView, ActivityIndicator,
} from 'react-native';
import CustomInput from '../../components/customInput'
import CustomPicker from '../../components/customPicker'
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors} from '../../utils/config'
import {Button} from 'react-native-elements';
import ActionSheet from 'react-native-actions-sheet';
import Icons from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {Confirm} from '../../components/Dialog';
import {RFPercentage} from 'react-native-responsive-fontsize';
import User from '../../api/User';
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SCREEN_WIDTH / 3;
const {width,height} = Dimensions.get('window')
export const SlidePanel = (props) => {
  const [apply,setApply] = useState(false);

  function handleApply(id) {
    setApply(false);
    props.handleApply(id);
  }
  async function handleMessage() {
    const {user} = props.item
    const body={
      "id": 0,
      "fromUserId": props.userId,
      "toUserId": user.id,
      "avalta": "",
      "date": new Date(),
      "lastAccess": new Date()
    }
    console.log(body)
    await User.Post("/api/Chat",body).then((rs) => {
      if(rs.status){
        console.log(rs.data,222)
      }
    })
  }
    return(
        <>
        <ActionSheet ref={props.myRef} gestureEnabled={true}>
          {props.item&&<View style={{width,height:500,backgroundColor:'white'}}>
            <View style={{width:'95%',alignSelf:'center',flexDirection:'row'}}>
              <View style={{width:'70%'}}>
                <Text style={{fontSize:RFPercentage(3)}}>
                  {props.item.title}
                </Text>
                <Text style={styles.textStyle}>
                  {props.item.jobCategory.name}
                </Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'map-pin'} color={'#1582F4'}/>
                  <Text style={[styles.textStyle,{fontSize:12}]}> {props.item.address==''?'No Address':props.item.address}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'user'} color={'#1582F4'}/>
                  <Text style={[styles.textStyle,{fontSize:12}]}>{props.item.user.lastName} {props.item.user.firstName}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'phone'} color={'#1582F4'}/>
                  <Text style={[styles.textStyle,{fontSize:12}]}> {props.item.user.phone}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'mail'} color={'#1582F4'}/>
                  <Text style={[styles.textStyle,{fontSize:12,color:'#1582F4'}]}> {props.item.user.email}</Text>
                </View>
              </View>

              {/*{props.item.jobPostPhotos&&props.item.jobPostPhotos[0]&&<View style={{width:'26%'}}>*/}
              {/*  <Image source={{uri:props.item.jobPostPhotos[0].url}} style={{width:80,height:80,borderRadius:10}}/>*/}
              {/*</View>}*/}
            </View>
            <View style={{width:'95%',alignSelf:'center',marginTop:20}}>
              <Text style={[styles.textStyle,{fontSize:18,color:'#000'}]}>Description</Text>
              <Text style={[styles.textStyle,{fontSize:15}]}>
                {props.item.description}
              </Text>
              <Text style={[styles.textStyle,{fontSize:18,marginTop:10,color:'#000'}]}>Deadline</Text>
              <Text style={[styles.textStyle,{fontSize:15}]}>{moment(props.item.expireDate).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={{width:'95%',alignSelf:'center',flexDirection:'row'}}>
              <View style={{width:'25%',justifyContent:'center'}}>
                <Text style={[styles.textStyle,{fontSize:18,marginTop:10,color:'#000'}]}>Reward</Text>
                <Text style={[styles.textStyle,{fontSize:16,color:'#1582F4'}]}>${props.item.reward}.00</Text>
              </View>
              <View style={{width:'25%',justifyContent:'center'}}>
                <Text style={[styles.textStyle,{fontSize:18,marginTop:10,color:'#000'}]}>Extra</Text>
                <Text style={[styles.textStyle,{fontSize:16,color:'#1582F4'}]}>${props.item.extraCharge}.00</Text>
              </View>
              <View style={{width:'50%',justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                <Button
                    title={'Message'}
                    titleStyle={{fontSize:12}}
                    onPress={handleMessage}
                    icon={<Icons name={'message-square'} color={'#fff'} size={15} style={{marginTop:3}}/>}
                    buttonStyle={{paddingVertical:5,borderRadius:10,marginTop:20,justifyContent:'center'
                      ,backgroundColor:'#1582F4',alignSelf:'center'}}
                />

                <Button
                    onPress={props.onInterested}
                    title={' Interested'}
                    titleStyle={{fontSize:12}}
                    icon={<Icons name={'heart'} color={'#fff'} size={15} style={{marginTop:3}}/>}
                    buttonStyle={{paddingVertical:5,borderRadius:10,marginTop:20,justifyContent:'center'
                      ,backgroundColor:'#1582F4',alignSelf:'center',marginLeft:10}}
                />
              </View>
            </View>
            <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:50}}>
              <TouchableOpacity onPress={()=>props.handleDetail(props.item.id)} style={{width:'45%',borderColor:'#1582F4',borderRadius:30,height:60,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'#1582F4'}}>View Detail</Text>
              </TouchableOpacity>
              <View style={{width:'10%'}}/>
              <TouchableOpacity onPress={()=>setApply(true)} style={{width:'45%',borderColor:'#1582F4',borderRadius:30,height:60,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'#1582F4'}}>Apply Now</Text>
              </TouchableOpacity>
            </View>
          </View>}
          {props.loading&&<View style={{width:'100%',alignItems:'center',justifyContent:'center',height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.25)'}}>
          <ActivityIndicator size={'large'} color={'#fff'}/>
          </View>}
        </ActionSheet>
        {apply&&<Confirm handleClose={()=>setApply(false)} handleConfirm={()=>handleApply(props.item.id)} title={'Confirm'} subtitle={'Are you sure to submit?'} visible={apply}/>}

  </>
)
  }
const styles = StyleSheet.create({
  textStyle:{
    color:'#5e5e5e',
    fontSize:RFPercentage(2),
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

