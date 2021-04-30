import React, { Component } from 'react';
import {Animated, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Modal} from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Icon  from 'react-native-vector-icons/MaterialIcons'
import {RFPercentage} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
const {width,height} = Dimensions.get('window')

const Confirm=(props)=>{

        return (
            <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
                <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>

                    <TouchableOpacity activeOpacity={1} style={{width:width*0.8,height:width*0.7,backgroundColor:'#fff',borderRadius:10}}>
                        <View style={{width:'100%',height:'75%',alignItems:'center'}}>
                            <Text style={{marginTop:RFPercentage(10),fontSize:RFPercentage(3.5)}}>
                                {props.title}
                            </Text>
                            <Text style={{marginTop:RFPercentage(4),fontSize:RFPercentage(2.5)}}>
                                {props.subtitle}
                            </Text>
                        </View>
                        <View style={{width:'90%',height:'18%',flexDirection:'row',alignSelf:'center'}}>
                            <TouchableOpacity onPress={props.handleClose} style={{justifyContent:'center',alignItems:'center',width:'47.5%',height:'100%',borderRadius:100,backgroundColor:'red'}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:'#fff'}}>NO</Text>
                            </TouchableOpacity>
                            <View style={{width:'5%'}}/>
                            <TouchableOpacity onPress={props.handleConfirm} style={{justifyContent:'center',alignItems:'center',width:'47.5%',height:'100%',borderRadius:100,backgroundColor:'#1477ff'}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:'#fff'}}>YES</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{alignItems:'center',justifyContent:'center',marginTop:-RFPercentage(7.5),position:'absolute',alignSelf:'center',backgroundColor:'#64c400',width:RFPercentage(15),height:RFPercentage(15),borderRadius:RFPercentage(7.5)}}>
                            <Icon name={'done'} color={'#fff'} size={RFPercentage(8)}/>
                        </View>
                    </TouchableOpacity>


                    {/*<ConfirmDialog*/}
                    {/*    translucent={true}*/}
                    {/*    animationType={'fade'}*/}
                    {/*    title={props.title}*/}
                    {/*    message={props.subtitle}*/}
                    {/*    visible={props.visible}*/}
                    {/*    onTouchOutside={props.handleClose}*/}
                    {/*    positiveButton={{*/}
                    {/*        title: "YES",*/}
                    {/*        onPress: () => props.handleConfirm()*/}
                    {/*    }}*/}
                    {/*    negativeButton={{*/}
                    {/*        title: "NO",*/}
                    {/*        onPress: () =>props.handleClose()*/}
                    {/*    }}*/}
                    {/*/>*/}
                </TouchableOpacity>
            </Modal>

        );
}
const Waring=(props)=>{

    return (
        <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
            <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>

                <TouchableOpacity activeOpacity={1} style={{width:width*0.8,height:width*0.7,backgroundColor:'#fff',borderRadius:10}}>
                    <View style={{width:'100%',height:'75%',alignItems:'center'}}>
                        <Text style={{marginTop:RFPercentage(10),fontSize:RFPercentage(3.5)}}>
                            {props.title}
                        </Text>
                        <Text style={{marginTop:RFPercentage(4),fontSize:RFPercentage(2.5)}}>
                            {props.subtitle}
                        </Text>
                    </View>
                    <View style={{width:'90%',height:'18%',flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={props.handleClose} style={{justifyContent:'center',alignItems:'center',width:'80%',height:'100%',borderRadius:10,backgroundColor:'#1477ff'}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:'#fff'}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center',justifyContent:'center',marginTop:-RFPercentage(7.5),position:'absolute',alignSelf:'center',backgroundColor:'#ffae00',width:RFPercentage(15),height:RFPercentage(15),borderRadius:RFPercentage(7.5)}}>
                        <Icon name={'warning'} color={'#fff'} size={RFPercentage(8)}/>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>

    );
}
const Success=(props)=>{

        return (
            <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
                <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>

                    <TouchableOpacity activeOpacity={1} style={{width:width*0.8,height:width*0.8,backgroundColor:'#fff',borderRadius:10}}>
                        <View style={{width:'100%',height:'75%',alignItems:'center'}}>

                            <FastImage
                                       source={require('../assets/images/success.png')}
                                       resizeMode={FastImage.resizeMode.contain}
                                       style={{width:RFPercentage(20),height:RFPercentage(20),
                                           borderWidth:3,borderColor:'#fff',borderRadius:RFPercentage(12)/2}}/>
                            <Text style={{fontSize:RFPercentage(3.5),fontWeight:'bold'}}>
                                {props.title}
                            </Text>
                            <Text style={{marginTop:RFPercentage(2),fontSize:RFPercentage(2.5)}}>
                                {props.subtitle}
                            </Text>
                        </View>
                        <View style={{width:'90%',height:'18%',flexDirection:'row',alignSelf:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={props.handleConfirm} style={{justifyContent:'center',alignItems:'center',width:'80%',height:'100%',borderRadius:10,backgroundColor:'#1477ff'}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:'#fff'}}>Back to Wallet</Text>
                            </TouchableOpacity>
                        </View>

                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

        );
}
const MoneyWarning=(props)=>{

    return (
        <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
            <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>

                <TouchableOpacity activeOpacity={1} style={{width:width*0.8,height:width*0.7,backgroundColor:'#fff',borderRadius:10}}>
                    <View style={{width:'100%',height:'75%',alignItems:'center'}}>
                        <Text style={{marginTop:RFPercentage(10),fontSize:RFPercentage(4)}}>
                            {props.title}
                        </Text>
                        <Text style={{marginTop:RFPercentage(4),fontSize:RFPercentage(3)}}>
                            {props.subtitle}
                        </Text>
                    </View>
                    <View style={{width:'90%',height:'18%',flexDirection:'row',alignSelf:'center'}}>
                        <TouchableOpacity onPress={props.handleClose} style={{justifyContent:'center',alignItems:'center',width:'47.5%',height:'100%',borderRadius:100,backgroundColor:'red'}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:'#fff'}}>CANCEL</Text>
                        </TouchableOpacity>
                        <View style={{width:'5%'}}/>
                        <TouchableOpacity onPress={props.handleConfirm} style={{justifyContent:'center',alignItems:'center',width:'47.5%',height:'100%',borderRadius:100,backgroundColor:'#1477ff'}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:'#fff'}}>TOP UP</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center',justifyContent:'center',marginTop:-RFPercentage(7.5),position:'absolute',alignSelf:'center',backgroundColor:'#ffb92b',width:RFPercentage(15),height:RFPercentage(15),borderRadius:RFPercentage(7.5)}}>
                        <Icon name={'money-off'} color={'#fff'} size={RFPercentage(8)}/>
                    </View>
                </TouchableOpacity>


                {/*<ConfirmDialog*/}
                {/*    translucent={true}*/}
                {/*    animationType={'fade'}*/}
                {/*    title={props.title}*/}
                {/*    message={props.subtitle}*/}
                {/*    visible={props.visible}*/}
                {/*    onTouchOutside={props.handleClose}*/}
                {/*    positiveButton={{*/}
                {/*        title: "YES",*/}
                {/*        onPress: () => props.handleConfirm()*/}
                {/*    }}*/}
                {/*    negativeButton={{*/}
                {/*        title: "NO",*/}
                {/*        onPress: () =>props.handleClose()*/}
                {/*    }}*/}
                {/*/>*/}
            </TouchableOpacity>
        </Modal>

    );
}
export {Confirm,Waring,Success,MoneyWarning}
