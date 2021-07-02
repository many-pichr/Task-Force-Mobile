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
import {Colors} from '../../utils/config'
import {Button} from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import moment from 'moment';
import BottomSheet from 'reanimated-bottom-sheet';
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
    await User.Post("/api/Chat",body).then((rs) => {
      if(rs.status){
        console.log(rs.data,222)
        props.navigation.navigate('Chat',{item:rs.data,user:props.user})
      }
    })
  }
  const renderHeader = () => (
        <View style={styles.header}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
        </View>

  )
  function handleClose() {
    setApply(false)
    props.handleClose()
  }
  const renderContent = () => {
    var string = props.item&&props.item.description?props.item.description:'';
    var length = 100;
    var trimmedString = string.length > length ?
        string.substring(0, length - 3) + "..." : string;
      return(
        <>
          <View>
          {props.item&&<View style={{width,backgroundColor:'#f1f1f1',height:'100%'}}>
            <View style={{width:'95%',alignSelf:'center',flexDirection:'row'}}>
              <View style={{width:'100%'}}>

                <Text style={{fontSize:RFPercentage(3)}}>
                  {props.item.title}
                </Text>
                <View style={{flexDirection:'row',width:'100%'}}>
                <Text style={[styles.textStyle,{width:'70%'}]}>
                  {props.item.jobCategory.name}
                </Text>
                  <View style={{width:'30%',flexDirection:'row',justifyContent:'center'}}>
                    {props.item.jobPriorityId==2? <View/>:
                        <View style={{marginLeft:5,width:RFPercentage(8),height:25,backgroundColor:'rgba(255,75,111,0.17)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                          <Text style={{color:'#ff4b6f',fontSize:RFPercentage(1.8)}}>Urgent</Text>
                        </View>}

                  </View>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'map-pin'} color={Colors.textColor}/>
                  <Text style={[styles.textStyle,{fontSize:12}]}> {props.item.address==''?'No Address':props.item.address}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'user'} color={Colors.textColor}/>
                  <Text style={[styles.textStyle,{fontSize:12}]}>{props.item.user.lastName} {props.item.user.firstName}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'phone'} color={Colors.textColor}/>
                  <Text style={[styles.textStyle,{fontSize:12}]}> {props.item.user.phone}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Icons name={'mail'} color={Colors.textColor}/>
                  <Text style={[styles.textStyle,{fontSize:12,color:Colors.textColor}]}> {props.item.user.email}</Text>
                </View>
              </View>

              {/*{props.item.jobPostPhotos&&props.item.jobPostPhotos[0]&&<View style={{width:'26%'}}>*/}
              {/*  <Image source={{uri:props.item.jobPostPhotos[0].url}} style={{width:80,height:80,borderRadius:10}}/>*/}
              {/*</View>}*/}
            </View>
            <View style={{width:'95%',alignSelf:'center',marginTop:10}}>
              <Text style={[styles.textStyle,{fontSize:18,color:'#000'}]}>Description</Text>
              <Text style={[styles.textStyle,{fontSize:RFPercentage(1.8)}]}>
                {trimmedString}
              </Text>
              <Text style={[styles.textStyle,{fontSize:18,marginTop:10,color:'#000'}]}>Deadline</Text>
              <Text style={[styles.textStyle,{fontSize:15}]}>{moment(props.item.expireDate).format('DD/MM/YYYY')}</Text>
            </View>
            <View style={{width:'95%',alignSelf:'center',flexDirection:'row'}}>
              <View style={{width:'25%',justifyContent:'center'}}>
                <Text style={[styles.textStyle,{fontSize:18,marginTop:10,color:'#000'}]}>Reward</Text>
                <Text style={[styles.textStyle,{fontSize:16,color:Colors.textColor}]}>${props.item.reward}.00</Text>
              </View>
              <View style={{width:'25%',justifyContent:'center'}}>
                <Text style={[styles.textStyle,{fontSize:18,marginTop:10,color:'#000'}]}>Extra</Text>
                <Text style={[styles.textStyle,{fontSize:16,color:Colors.textColor}]}>${props.item.extraCharge}.00</Text>
              </View>
              {props.user.userType == '2' &&
              <View style={{width: '50%', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row'}}>
                <Button
                    title={'Message'}
                    titleStyle={{fontSize: 12}}
                    onPress={handleMessage}
                    icon={<Icons name={'message-square'} color={'#fff'} size={15} style={{marginTop: 3}}/>}
                    buttonStyle={{
                      paddingVertical: 5, borderRadius: 10, marginTop: 20, justifyContent: 'center'
                      , backgroundColor: Colors.primary, alignSelf: 'center'
                    }}
                />

                <Button
                    onPress={props.onInterested}
                    title={' Interested'}
                    titleStyle={{fontSize: 12}}
                    icon={<Icons name={'heart'} color={'#fff'} size={15} style={{marginTop: 3}}/>}
                    buttonStyle={{
                      paddingVertical: 5, borderRadius: 10, marginTop: 20, justifyContent: 'center'
                      , backgroundColor: Colors.primary, alignSelf: 'center', marginLeft: 10
                    }}
                />
              </View>
              }
            </View>
            {apply?
                <>
                <Text style={{fontSize:RFPercentage(3),marginTop:10,alignSelf:'center'}}>
                  Are you sure to apply?
                </Text>
                <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:10,justifyContent:'center'}}>

              <TouchableOpacity onPress={()=>setApply(false)} style={{width:props.user.userType=='2'?'35%':'60%',borderColor:'#f43a16',borderRadius:30,height:40,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'#f43a16'}}>NO</Text>
              </TouchableOpacity>
              {props.user.userType=='2'&&<>
              <View style={{width:'10%'}}/>
              <TouchableOpacity onPress={()=>handleApply(props.item.id)} style={{width:'35%',borderColor:Colors.textColor,borderRadius:30,height:40,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:Colors.textColor}}>YES</Text>
              </TouchableOpacity>
              </>}
            </View></>:
                <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:20,justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=>props.handleDetail(props.item.id)} style={{width:props.user.userType=='2'?'45%':'60%',borderColor:Colors.primary,borderRadius:30,height:60,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:Colors.textColor}}>View Detail</Text>
                  </TouchableOpacity>
                  {props.user.userType=='2'&&<>
                    <View style={{width:'10%'}}/>
                    <TouchableOpacity onPress={()=>setApply(true)} style={{width:'45%',borderColor:Colors.primary,borderRadius:30,height:60,borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:Colors.textColor}}>Apply Now</Text>
                    </TouchableOpacity>
                  </>}
                </View>}
          </View>}
          {props.loading&&<View style={{width:'100%',alignItems:'center',justifyContent:'center',height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.25)'}}>
          <ActivityIndicator size={'large'} color={'#fff'}/>
          </View>}
        </View>
        {/*{apply&&<Confirm handleClose={()=>setApply(false)} handleConfirm={()=>handleApply(props.item.id)} title={'Confirm'} subtitle={'Are you sure to submit?'} visible={apply}/>}*/}

  </>
)}
  return (
      <>
        <BottomSheet
            ref={props.myRef}
            onCloseEnd={()=>handleClose()}
            onOpenStart={props.handleStart}
            snapPoints={[470, 0, 0]}
            // borderRadius={10}
            initialSnap={2}
            renderContent={renderContent}
            renderHeader={renderHeader}
        />
      </>
  );
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
  },
  header: {
    backgroundColor: '#f1f1f1',
    shadowColor: '#000000',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
});

