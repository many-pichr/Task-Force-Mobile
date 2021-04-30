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
import {barHight} from '../utils/config'
import {CustomItem} from './Items';
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
                <View style={{position:'absolute',width,height:180,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

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
                <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                    <View style={{width:'80%',alignSelf:'center'}}>
                        <Text style={{color:'#fff',fontSize:25}}>{props.title}</Text>
                    </View>
                    <View style={{width:'10%',alignItems:'flex-end'}}>
                        {props.add&&<TouchableOpacity onPress={props.onAdd} >
                            <Icons name={'plus'} color={'#fff'} size={30}/>
                        </TouchableOpacity>}
                    </View>
                </View>

                <View style={{width:'90%',alignSelf:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>props.onSwitch(0)}
                            style={{borderBottomWidth:props.active==0?2:0,borderBottomColor:'#fff',height:50,width:'33.33%',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:18}}>{props.titles[0]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>props.onSwitch(1)}
                            style={{borderBottomWidth:props.active==1?2:0,borderBottomColor:'#fff',height:50,width:'33.33%',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:18}}>{props.titles[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>props.onSwitch(2)}
                                           style={{borderBottomWidth:props.active==2?2:0,borderBottomColor:'#fff',height:50,width:'33.33%',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:18}}>{props.titles[2]}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:100}}>
                    {props.renderItem}
                    </View>
                </View>
            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    cardItem:{
        width:'100%',height:120,backgroundColor:'#fff',borderRadius:10,
        marginTop: 10,
    }
});
export {ListScreen,MyPostList}
