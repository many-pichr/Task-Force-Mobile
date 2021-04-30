import React, { Component } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import { Input,Header } from 'react-native-elements';
import assets from '../assets/index'
import Icons from 'react-native-vector-icons/Feather';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

const HeaderOrganizer=(props)=>{

        return (<View>
                <View style={{width:'90%',height:50,alignItems:'center',flexDirection:'row',alignSelf:'center'}}>
                        <View style={{width:"10%"}}>
                            <TouchableOpacity onPress={props.switchView}>
                                <Icons name={!props.map?'map':'list'} size={25} color={'#7F838D'}/>
                            </TouchableOpacity>
                        </View>
                    <View style={{alignItems:'center',width:'80%'}}>
                        <Image source={assets.taskforce} style={{width:RFPercentage(17),height:RFPercentage(3)}}/>
                    {/*    <View style={{width:'10%',justifyContent:'center',alignItems:'flex-end'}}>*/}
                    {/*        <Icons name={'search'} size={20} color={'#7F838D'}/>*/}
                    {/*    </View>*/}
                    {/*    <View style={{width:'80%',justifyContent:'center'}}>*/}
                    {/*        <TextInput*/}
                    {/*            autoFocus={false}*/}
                    {/*            style={{height:45,marginLeft:10}}*/}
                    {/*            placeholder={'Find jobs, tasks, etc...'}*/}
                    {/*        />*/}
                    {/*    </View>*/}
                    {/*    <TouchableOpacity onPress={props.handleFilter} style={{flex:1,width:'10%',justifyContent:'center'}}>*/}
                    {/*            <Icons name={'filter'} size={20} color={'#7F838D'}/>*/}
                    {/*    </TouchableOpacity>*/}

                    </View>
                        <View style={{width:"10%",alignItems:'center'}}>
                            <Icons name={'bell'} size={25} color={'#7F838D'}/>
                        </View>
                    </View>
            </View>

        );
}
const HeaderText=(props)=>{

    return (<Header
            containerStyle={{width,borderBottomWidth:0}}
            backgroundColor={'transparent'}
            leftComponent={{ icon: 'chevron-left', color: '#fff',size:40,onPress:props.handleBack }}
            centerComponent={{ text: props.title, style: { color: '#fff',fontSize:20 } }}
            rightComponent={{ icon: props.rightIcon, color: '#fff',size:30,onPress:props.handleRight }}
        />

    );
}
export {HeaderOrganizer,HeaderText}
