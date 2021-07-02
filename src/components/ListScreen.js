import React, { useState } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    SafeAreaView, FlatList, ScrollView,
} from 'react-native';
import { Input,Header,Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import {barHight, Colors} from '../utils/config';
import {CustomItem} from './Items';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

const ListScreen=(props)=>{
    const [check, setCheck] = useState(false);
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                        {props.back&&<View style={{width:'10%',justifyContent:'flex-end'}}>
                        <TouchableOpacity onPress={props.goBack} >
                            <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                        </TouchableOpacity>
                        </View>}
                        <View style={{width:props.back?'80%':'90%',alignSelf:'center'}}>
                            <Text style={{color:'#fff',fontSize:25}}>{props.title}</Text>
                        </View>
                    </View>

                    <View style={{width:'90%',alignSelf:'center'}}>
                        {props.renderItem}
                    </View>
                </View>
                <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
            </View>
        );
}

const MyPostList=(props)=>{
    const [check, setCheck] = useState(false);
    return (
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
            <View style={{zIndex:1}}>
                <View style={[styles.borderCorner,{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}]}>
                    <View style={{width:'80%',alignSelf:'center'}}>
                        <Text style={{color:'#fff',fontSize:25}}>{props.title}</Text>
                    </View>
                    <View style={{width:'10%',alignItems:'flex-end'}}>
                        {props.add&&<TouchableOpacity onPress={props.onAdd} >
                            <Icons name={'plus'} color={'#fff'} size={30}/>
                        </TouchableOpacity>}
                    </View>
                </View>

                <View style={{width:'90%',alignSelf:'center',marginTop:30}}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>props.onSwitch(0)} activeOpacity={0.9}
                            style={[styles.borderCorner,{backgroundColor:props.active==0?'#F5F7FA':'#fff',height:50,width:(width*0.9)/3,justifyContent:'center',alignItems:'center'}]}>
                            <Text style={{color:Colors.textColor,fontSize:RFPercentage(2)}}>{props.titles[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>props.onSwitch(1)} activeOpacity={0.9}
                            style={[styles.borderCorner,{backgroundColor:props.active==1?'#F5F7FA':'#fcfcfc',height:50,width:(width*0.9)/3,justifyContent:'center',alignItems:'center'}]}>
                            <Text style={{color:Colors.textColor,fontSize:RFPercentage(2)}}>{props.titles[1]}</Text>
                            {props.notify&&props.notify.isProgress&&<Badge value=" " status="error" containerStyle={{position:'absolute',top:-5,right:0}} />}
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>props.onSwitch(2)} activeOpacity={0.9}
                                           style={[styles.borderCorner,{backgroundColor:props.active==2?'#F5F7FA':'#fff',height:50,width:(width*0.9)/3,justifyContent:'center',alignItems:'center'}]}>
                            <Text style={{color:Colors.textColor,fontSize:RFPercentage(2)}}>{props.titles[2]}</Text>
                            {props.notify&&props.notify.isComplete&&<Badge value=" " status="error" containerStyle={{position:'absolute',top:-5,right:0}} />}
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:100,backgroundColor:'#F5F7FA'}}>
                    {props.renderItem}
                    </View>
                </View>
            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    cardItem:{
        width:'100%',height:120,backgroundColor:'#fff',borderRadius:10,
        marginTop: 10,
    },
    borderCorner:{
        borderTopStartRadius:20,
        borderTopEndRadius:20,
    }
});
export {ListScreen,MyPostList}
