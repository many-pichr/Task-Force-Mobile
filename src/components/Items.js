import React, { useState } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Input,Header,Button } from 'react-native-elements';
import moment from 'moment'
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import OptionsMenu from "react-native-option-menu";
import * as Progress from "react-native-progress";
import User from '../api/User'
import {Confirm} from './Dialog';
import { Avatar, Badge, withBadge } from 'react-native-elements'
import {Colors} from '../utils/config'
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
const CustomItem=(props)=>{
    const [check, setCheck] = useState(false);
    const [applied, setApply] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    async function handleCheck (status,id) {
        setLoading(true)
        await User.AddInterested({userId:props.userId,jobId:id})
        setCheck(status)
        setLoading(false)
    }

    return (
            <TouchableOpacity onPress={props.onPress} style={[styles.cardItem1,{marginBottom:props.bottom}]}>

                    <View style={{width:'95%',alignSelf:'center',justifyContent:'center'}}>
                       <View style={{width:'100%'}}>
                            <Text style={{fontSize:RFPercentage(2),color:'#333333'}}>
                                {props.item.title}
                            </Text>
                           <Text style={{fontSize:RFPercentage(1.5),color:Colors.textColor,marginTop:3}}>
                               {props.item.jobCategory.name}
                           </Text>
                           <View style={{marginTop:3,flexDirection:'row'}}>
                           <Text style={{fontSize:RFPercentage(1.5),color:Colors.textColor}}>
                               {props.item.user.lastName} {props.item.user.firstName}
                           </Text>
                           </View>
                           <Text style={{fontSize:RFPercentage(1.5),color:'#333333',marginTop:3}}>
                               {props.item.address!=""?props.item.address:'No Address'}
                           </Text>
                       </View>
                        <View style={{flexDirection:'row',marginTop:5}}>
                    <View style={{width:'45%',height:30,justifyContent:'center'}}>
                        <Text style={{color:Colors.textColor,fontSize:RFPercentage(2.5)}}>${props.item.reward+props.item.extraCharge}</Text>
                    </View>
                    <View style={{width:'55%',height:30,alignItems:'center',flexDirection:'row'}}>
                        <View style={{width:'40%',flexDirection:'row'}}>
                            {props.item.jobPriorityId==2? <View/>:
                            <View style={{marginLeft:5,width:RFPercentage(8),height:25,backgroundColor:'rgba(255,75,111,0.17)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#ff4b6f',fontSize:RFPercentage(1.8)}}>Urgent</Text>
                            </View>}

                        </View>
                        <View style={{width:'55%',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text style={{color:'#333333',fontSize:RFPercentage(1.5)}}>{moment(props.item.createDate).fromNow()}</Text>
                        </View>
                    </View>
                        </View>
                </View>
                <View style={{flexDirection:'row',width:'100%',position:'absolute'}}>
                    <View style={{width:'100%',height:90,justifyContent:'center',alignSelf:'center',alignItems:'center'}}>
                        <View style={{width:'95%',height:60,alignItems:'flex-end'}}>

                            {props.userType=='2'&&<TouchableOpacity  disabled={loading} onPress={()=>handleCheck(!check,props.item.id)}  style={{justifyContent:'center',alignItems:'center',borderRadius:15,flexDirection:'row'}}>
                                    {loading?<ActivityIndicator color={'rgba(16,189,206,0.58)'}/>:
                                        <Icons name={check?'favorite':'favorite-border'} color={'#10bdce'} size={30}/>}
                                </TouchableOpacity>}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
}
const ItemFavorite=(props)=>{
    const [remove, setRemove] = useState(false);
    const [confirm, setConfirm] = useState(false);
    function handleConfirm() {
        setConfirm(false)
        props.handleRequest()
    }
    function handleConfirmRemove() {
        setRemove(false)
        props.handleRemove()
    }
    const {jobPost} = props.item
    return (<>
            <TouchableOpacity onPress={props.onPress} style={[styles.cardItem1,{marginBottom:props.bottom}]}>

                <View style={{width:'95%',alignSelf:'center',justifyContent:'center'}}>
                    <View style={{width:'100%'}}>
                        <Text style={{fontSize:16,color:'#333333'}}>
                            {jobPost.title}
                        </Text>
                        <Text style={{fontSize:16,color:Colors.textColor,marginTop:3}}>
                            {jobPost.jobCategory.name}
                        </Text>
                        <View style={{marginTop:3,flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:Colors.textColor}}>
                                {jobPost.user.lastName} {jobPost.user.firstName}
                            </Text>
                        </View>
                        <Text style={{fontSize:13,color:'#333333',marginTop:3}}>
                            {jobPost.adddress?jobPost.adddress:'No Address'}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:5}}>
                        <View style={{width:'25%',height:30,justifyContent:'center'}}>
                            <Text style={{color:Colors.textColor,fontSize:RFPercentage(2.5)}}>${jobPost.reward+jobPost.extraCharge}</Text>
                        </View>
                        <View style={{width:'75%',height:30,alignItems:'center',flexDirection:'row'}}>
                            <View style={{width:'40%',flexDirection:'row'}}>
                                {jobPost.jobPriorityId!=2&&
                                <View style={{marginLeft:5,width:60,height:25,backgroundColor:'rgba(255,75,111,0.17)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#ff4b6f'}}>Urgent</Text>
                                </View>}
                                {props.item.status=='Pending'&&
                                <View style={{marginLeft:5,width:60,height:25,backgroundColor:'rgba(38,244,10,0.18)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#15920a'}}>Applied</Text>
                                </View>}
                            </View>
                            <View style={{width:'55%',flexDirection:'row',justifyContent:'flex-end'}}>
                                <Text style={{color:'#333333'}}>{moment(props.item.date).fromNow()}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
            <View style={{alignSelf:'flex-end',position:'absolute',width:50,height:80,justifyContent:'center',alignItems:'center',borderRadius:15,flexDirection:'row'}}>
                <OptionsMenu
                    customButton={<Icons name={'more-vert'} color={Colors.textColor} size={30}/>}
                    buttonStyle={{marginRight:10, resizeMode: "contain" }}
                    destructiveIndex={2}
                    options={["Apply","View", "Delete","Cancel"]}
                    actions={[
                        ()=>setConfirm(true),
                        props.onPress,
                        ()=>setRemove(true)]}/>
            </View>
            {confirm&&<Confirm handleClose={()=>setConfirm(false)} handleConfirm={handleConfirm} title={'Confirm'} subtitle={'Are you sure to Submit?'} visible={confirm}/>}
            {remove&&<Confirm handleClose={()=>setRemove(false)} handleConfirm={handleConfirmRemove} title={'Confirm'} subtitle={'Are you sure to Delete?'} visible={remove}/>}
        </>
    );
}
const ItemCandidate=(props)=>{
    const [check, setCheck] = useState(false);
    const [confirm, setConfirm] = useState(false);
    function handleConfirm(){
        setConfirm(false)
        props.handleSelect()
    }
    return (<>
        <TouchableOpacity onPress={props.viewUser} style={[styles.cardItem1,{marginBottom:props.bottom,backgroundColor:'#F5F7FA'}]}>
            <View style={{flexDirection:'row',width:'100%'}}>
                <View style={{width:'25%',alignItems:'center',justifyContent:'center'}}>
                    <Image source={props.item.userProfileURL?{uri:props.item.userProfileURL}:require('../assets/images/avatar.png')}
                           style={{width:60,height:60,borderRadius:10}}/>
                </View>
                <View style={{width:'75%',justifyContent:'center',height:60,flexDirection:'row'}}>
                    <View style={{width:'60%',height:'100%',justifyContent:'center'}}>
                        <Text style={{fontSize:16,color:'#333333'}}>
                            {props.item.userLastName} {props.item.userFirstName}
                        </Text>
                        <Text style={{fontSize:RFPercentage(1.7),color:Colors.textColor,paddingTop:10}}>
                            {moment(new Date(props.item.date)).format('DD/MM/YYYY HH:MM')}
                        </Text>
                        {/*<Text style={{fontSize:13,color:'#333333'}}>*/}
                        {/*    Sensok, Phnom Penh, Cambodia*/}
                        {/*</Text>*/}
                    </View>
                    <View style={{width:'40%',height:60,justifyContent:'center'}}>
                        <TouchableOpacity disabled={props.status==='selected'||props.status==='rejected'} onPress={()=>setConfirm(true)} style={{backgroundColor:props.status==='selected'?'rgba(21,130,244,0.46)':props.status==='rejected'?'rgba(244,50,18,0.74)':Colors.textColor,width:'85%',height:25,justifyContent:'center',alignItems:'center',borderRadius:5}}>
                            <Text style={{fontSize:13,color:'#fff'}}>{props.status=='selected'?"Accepted":props.status=='rejected'?"Rejected":"Accept"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/*<View style={{flexDirection:'row',width:'100%'}}>*/}
            {/*    <View style={{width:'70%',height:30,justifyContent:'center'}}>*/}
            {/*        <Text style={{color:Colors.textColor,marginLeft:20,fontSize:RFPercentage(1.7)}}>{moment(new Date(props.item.date)).format('DD/MM/YYYY HH:MM')}</Text>*/}
            {/*    </View>*/}
            {/*    <View style={{width:'30%',height:30,alignItems:'center',flexDirection:'row'}}>*/}

            {/*        <View style={{width:'100%'}}>*/}
            {/*            <TouchableOpacity disabled={props.status==='selected'} onPress={()=>setConfirm(true)} style={{backgroundColor:props.status==='selected'?'rgba(21,130,244,0.46)':props.status==='rejected'?'rgba(244,50,18,0.74)':Colors.textColor,width:'85%',height:25,justifyContent:'center',alignItems:'center',borderRadius:5}}>*/}
            {/*                <Text style={{fontSize:13,color:'#fff'}}>{props.status=='selected'?"Accepted":props.status=='rejected'?"Rejected":"Accept"}</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</View>*/}
        </TouchableOpacity>
        {confirm&&<Confirm handleClose={()=>setConfirm(false)} handleConfirm={handleConfirm} title={'Warning'} subtitle={'Are you sure to select?'} visible={confirm}/>}
        </>
        );
}
const ItemPost=(props)=>{
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.cardItem,{marginBottom:props.bottom}]}>
                <View style={{width:'95%',alignSelf:'center',height:90,justifyContent:'center'}}>
                    <View style={{width:'100%'}}>
                        <Text style={{fontSize:16,color:'#333333'}}>
                            {props.item.title}
                        </Text>
                        <Text style={{fontSize:15,color:Colors.textColor,marginVertical:0}}>
                            {props.item.jobCategory.name}
                        </Text>
                        <Text style={{fontSize:13,color:'#333333'}}>
                            {/*{props.item.address}*/}
                            Cambodia, Phnnom Penh
                        </Text>
                    </View>
                </View>
            <View style={{flexDirection:'row',width:'95%',alignSelf:'center',height:30,marginTop:-10}}>
                <View style={{width:'40%',justifyContent:'center'}}>
                    <Text style={{color:Colors.textColor,fontSize:18}}>${props.item.reward+props.item.extraCharge}</Text>
                </View>
                <View style={{width:'60%',height:30,alignItems:'center',flexDirection:'row'}}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'60%',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:Colors.textColor,fontSize:12}}>{moment(props.item.createDate).format('DD/MM/YYYY')}</Text>
                        </View>
                        {/*<View style={{width:'15%',flexDirection:'row',height:25,borderRadius:10,justifyContent:'center',alignItems:'center'}}>*/}
                        {/*    {props.isPost&&<>*/}
                        {/*    <Icon name={'user'} color={Colors.textColor}/>*/}
                        {/*    <Text style={{color:Colors.textColor}}>{props.item.jobCandidates.length}</Text>*/}
                        {/*    </>}*/}
                        {/*</View>*/}
                        <View style={{width:'40%',padding:5,backgroundColor:props.item.status=='cancel'?'rgba(244,128,0,0.31)':'rgba(63,244,23,0.17)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:12,color:props.item.status=='cancel'?'#d66e00':'#13ad1a'}}>{capitalizeFirstLetter(props.item.status=='selected'?"Accepted":props.item.status)}</Text>
                        </View>
                        {/*<View style={{marginLeft:5,width:60,height:25,backgroundColor:'rgba(255,75,111,0.17)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>*/}
                        {/*    <Text style={{color:'#ff4b6f'}}>CSS</Text>*/}
                        {/*</View>*/}

                    </View>
                </View>

            </View>
            <View style={{width:50,height:50,position:'absolute',alignSelf:'flex-end',justifyContent:'center',alignItems:'center'}}>
            <OptionsMenu
                customButton={<Icons name={'more-vert'} color={Colors.textColor} size={30}/>}
                buttonStyle={{marginRight:10, resizeMode: "contain" }}
                destructiveIndex={2}
                options={props.agent?["View","Cancel Task","Close"]:["View","Edit", "Delete","Close"]}
                actions={props.agent?[
                    ()=>props.handleAction(1,props.item),
                    ()=>props.handleAction(7,props.item),
                ]:[()=>props.handleAction(1,props.item),
                    ()=>props.handleAction(2,props.item),
                    ()=>props.handleAction(3,props.item)]}/>
            </View>
            {props.item.status=='Pending'&&props.item.jobCandidates.length>0&&<Badge
                status="error"
                value={<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Icon name={'user'} color={"#fff"} size={11}/>
                        <Text style={{color:'#fff',fontSize:11}}>{props.item.jobCandidates.length}</Text>
                </View>}
                badgeStyle={{paddingHorizontal:5,justifyContent:'center'}}
                containerStyle={{ position: 'absolute', top: -6, right: 0 }}
            />}
        </TouchableOpacity>
    );
}
const renderStar=(rate)=>{
    const rates=rate&&rate!=""?parseInt(rate):0
    const items=[];
    for(var i=0;i<rates;i++){
        items.push(i)
    }
    console.log('123456789===>',items)
    return (<>
        {items.map((l, i) => (<Icons name={'star'} color={'#ce8c00'} size={RFPercentage(2)}/>))}
    </>)}
        const ItemProgress=(props)=>{
    const [check, setCheck] = useState(false);
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.cardItem,{marginBottom:props.bottom,height:130}]}>
                <View style={{width:'95%',alignSelf:'center',height:100,justifyContent:'center'}}>
                    <View style={{width:'100%',height:60}}>
                        <Text style={{fontSize:16,color:'#333333',height:20}}>
                            {props.item.title}
                        </Text>
                        <Text style={{fontSize:16,color:Colors.textColor,height:20,marginVertical:3}}>
                            {props.item.jobCategory.name}
                        </Text>
                        <Text style={{color:'#333333',height:20}}>
                            Agent: {props.item.agent.lastName} {props.item.agent.firstName}
                        </Text>
                    </View>
                </View>
            <View style={{flexDirection:'row',width:'100%',height:30,marginTop:-10}}>
                <View style={{width:'95%',height:30,justifyContent:'center',marginLeft:10}}>
                    <Text style={{color:'#1FC68C',marginTop:0,fontSize:12}}>{props.item.completedStatus}% complete</Text>
                    <Progress.Bar progress={props.item.completedStatus/100} width={width*0.86} height={5}
                                  animated={true}
                                  useNativeDriver={true} style={{}} color={'#1FC68C'}/>
                </View>

            </View>
            <View style={{position:'absolute',width:50,height:50,justifyContent:'center',alignItems:'center',alignSelf:'flex-end'}}>
                <OptionsMenu
                    customButton={<Icons name={'more-vert'} color={Colors.textColor} size={30}/>}
                    buttonStyle={{marginRight:10, resizeMode: "contain",width:100 }}
                    destructiveIndex={2}
                    options={props.agent?["Update Progress","View Post","Comment", "Cancel Task","Close"]:["View Post","Comment", "Cancel Task","Close"]}
                    actions={props.agent?[
                        ()=>props.handleAction(6,props.item),
                        ()=>props.handleAction(1,props.item),
                        ()=>props.handleAction(4,props.item),
                            ()=>props.handleAction(7,props.item),
                        ]:
                        [()=>props.handleAction(1,props.item),
                        ()=>props.handleAction(4,props.item),
                            ()=>props.handleAction(7,props.item),]}/>
            </View>
        </TouchableOpacity>
    );
}
const ItemComplete=(props)=>{
    const [check, setCheck] = useState(false);
    const isCompleted=props.item.isCompleted&&props.item.isPaid;
    return (
        <TouchableOpacity disabled={props.item.status==='completed'} onPress={props.isPost&&props.onPress} style={[styles.cardItem1,{marginBottom:props.bottom,}]}>
            <View style={{width:'95%',alignSelf:'center',justifyContent:'center'}}>
                <View style={{width:'100%'}}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:16,color:'#333333',width:'80%'}}>
                        {props.item.title}
                    </Text>

                    </View>
                    <Text style={{fontSize:16,color:Colors.textColor,marginVertical:3}}>
                        {props.item.jobCategory.name}
                    </Text>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#333333',width:'70%'}}>
                        Agent: {props.item.agent.lastName} {props.item.agent.firstName}
                    </Text>
                        <View style={{width:'30%',alignItems:'flex-end'}}>
                        <View style={{paddingVertical:5,paddingHorizontal:10,backgroundColor:isCompleted?'rgba(31,198,140,0.2)':'rgba(255,174,0,0.26)',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:isCompleted?'#1FC68C':'#ce8c00',fontSize:RFPercentage(1.5)}}>{isCompleted?"Completed":"Pending"}</Text>
                        </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:'row',width:'100%',marginTop:0}}>
                <View style={{width:'95%',height:30,justifyContent:'center',marginLeft:10}}>
                    <View style={{flexDirection:'row'}}>
                    <Text style={{color:'#1FC68C',marginTop:0,fontSize:RFPercentage(1.8),width:'40%'}}>{props.item.completedStatus}% complete</Text>
                    <View style={{width:'60%',justifyContent:'flex-end',flexDirection:'row'}}>
                        {renderStar(props.item.rate)}
                    </View>
                    </View>
                    <Progress.Bar progress={props.item.completedStatus/100} width={width*0.86} height={5}
                                  animated={true}
                                  useNativeDriver={true} style={{}} color={'#1FC68C'}/>
                </View>

            </View>
            <View style={{position:'absolute',width:50,height:50,justifyContent:'center',alignItems:'center',alignSelf:'flex-end'}}>
                <OptionsMenu
                    customButton={<Icons name={'more-vert'} color={Colors.textColor} size={30}/>}
                    buttonStyle={{marginRight:10, resizeMode: "contain",width:100 }}
                    destructiveIndex={2}
                    options={props.agent?["View Post","Comment", "Cancel Task","Close"]:props.item.status==='completed'?["Comment", "Cancel Task","Close"]:["Review","Comment", "Cancel Task","Close"]}
                    actions={props.agent?[

                            ()=>props.handleAction(1,props.item),
                            ()=>props.handleAction(4,props.item),
                            ()=>props.handleAction(7,props.item),
                        ]:props.item.status==='completed'?[
                        ()=>props.handleAction(4,props.item),
                        ()=>props.handleAction(7,props.item),]:
                        [()=>props.onPress(),
                            ()=>props.handleAction(4,props.item),
                            ()=>props.handleAction(7,props.item),]}/>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    cardItem:{
        width:'100%',height:120,backgroundColor:'#fff',borderRadius:10,
        marginTop: 10,
    },
    cardItem1:{
        width:'100%',backgroundColor:'#fff',borderRadius:10,
        marginTop: 10,paddingVertical:10
    }
});
export {ItemComplete,CustomItem,ItemCandidate,ItemProgress,ItemFavorite,ItemPost}
