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
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Colors} from '../utils/config';
import {setNotify} from '../redux/actions/notification';
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window')

const Headers=(props)=>{

        return (<View>
                <View style={{width:'90%',height:50,alignItems:'center',flexDirection:'row',alignSelf:'center'}}>
                        <View style={{width:"10%"}}>
                            <TouchableOpacity onPress={props.switchView}>
                                <Icons name={!props.map?'map':'list'} size={25} color={Colors.textColor}/>
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
                        <TouchableOpacity onPress={props.notiScreen} style={{width:"10%",alignItems:'center'}}>
                            <Icons name={'bell'} size={25} color={Colors.textColor}/>
                            {props.notify.count>0&&<Badge
                                status="error"
                                value={props.notify.count}
                                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                />}
                        </TouchableOpacity>
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
const mapStateToProps = state => {
    return {
        notify: state.notify.notify,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNotify: (notify) => {
            dispatch(setNotify(notify))
        }
    }
}
const HeaderOrganizer =  connect(mapStateToProps, mapDispatchToProps)(Headers)
export {HeaderOrganizer,HeaderText}
