import React, { Component } from 'react';
import {Animated, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Modal, ScrollView} from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Icon  from 'react-native-vector-icons/MaterialIcons'
import {RFPercentage} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import {Colors, Fonts} from '../utils/config';
const {width,height} = Dimensions.get('window')

const Confirm=(props)=>{

        return (
            <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
                <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity activeOpacity={1} style={{width:width*0.8,height:width*0.7,backgroundColor:'#fff',borderRadius:20}}>
                            <Icon name={'warning'} color={'#ffae00'} size={RFPercentage(12)} style={{alignSelf:'center',marginTop:10}}/>
                        <View style={{width:'100%',height:'42%',alignItems:'center'}}>
                            <Text style={{marginTop:RFPercentage(1),fontSize:RFPercentage(3.5)}}>
                                {props.title}
                            </Text>
                            <Text style={{marginTop:RFPercentage(2),fontSize:RFPercentage(2.5)}}>
                                {props.subtitle}
                            </Text>
                        </View>
                        <View style={{width:'100%',height:'20%',flexDirection:'row',alignSelf:'center',borderTopWidth:0.3}}>
                            <TouchableOpacity onPress={props.handleClose} style={{justifyContent:'center',alignItems:'center',width:'47.5%',height:'100%'}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:'#ff003e'}}>NO</Text>
                            </TouchableOpacity>
                            <View style={{width:'5%'}}/>
                            <TouchableOpacity onPress={props.handleConfirm} style={{justifyContent:'center',alignItems:'center',width:'47.5%',height:'100%',borderLeftWidth:0.3}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:'#0096ff'}}>YES</Text>
                            </TouchableOpacity>
                        </View>
                        {/*<View style={{alignItems:'center',justifyContent:'center',marginTop:-RFPercentage(7.5),position:'absolute',alignSelf:'center',backgroundColor:'#ffae00',width:RFPercentage(15),height:RFPercentage(15),borderRadius:RFPercentage(7.5)}}>*/}
                        {/*    <Icon name={'warning'} color={'#fff'} size={RFPercentage(8)}/>*/}
                        {/*</View>*/}
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
const TermCondition=(props)=>{

    return (
        <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
            <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity activeOpacity={1} style={{width:width*0.9,height:height*0.7,backgroundColor:'#fff',borderRadius:20}}>
                    <View style={{width:'100%',height:'10%',borderBottomWidth:0.2,alignItems:'center',justifyContent:'center',borderColor:Colors.primary}}>
                        <Text style={{fontSize:RFPercentage(2.5),color:Colors.textColor}}>
                            Term and Condition
                        </Text>
                    </View>
                    <View style={{width:'100%',height:'80%',borderBottomWidth:0.2,borderColor:Colors.primary}}>
                        <ScrollView>
                        <Text style={{fontSize:RFPercentage(2),color:Colors.textColor,margin:5}}>
                            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and [business entity name] (“we,” “us” or “our”), concerning your access to and use of the [website name.com] website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).

                            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.

                            Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason.

                            We will alert you about any changes by updating the “Last updated” date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.

                            It is your responsibility to periodically review these Terms and Conditions to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the Site after the date such revised Terms and Conditions are posted.

                            The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.

                            Accordingly, those persons who choose to access the Site from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.

                            These terms and conditions were generated by Termly’s Terms and Conditions Generator.

                            Option 1: The Site is intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to register for the Site.

                            Option 2: [The Site is intended for users who are at least 13 years of age.] All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Site. If you are a minor, you must have your parent or guardian read and agree to these Terms and Conditions prior to you using the Site.

                            INTELLECTUAL PROPERTY RIGHTS

                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions.
                        </Text>
                        </ScrollView>
                    </View>
                    <View style={{width:'100%',height:'10%',alignItems:'center',flexDirection:'row'}}>
                        <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={props.handleClose}>
                            <Text style={{fontSize:RFPercentage(2.5),color:Colors.textColor}}>
                                Disagree
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.handleConfirm} style={{borderColor:Colors.primary,width:'50%',alignItems:'center',borderLeftWidth:1}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:Colors.textColor}}>
                                Agree
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

            </TouchableOpacity>
        </Modal>

    );
}
const Warning=(props)=>{

    return (
        <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
            <TouchableOpacity activeOpacity={0.5} onPress={props.handleClose} style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.11)',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity activeOpacity={1} style={{width:width*0.8,height:width*0.7,backgroundColor:'#fff',borderRadius:20}}>
                    <Icon name={'warning'} color={'#ffae00'} size={RFPercentage(12)} style={{alignSelf:'center',marginTop:10}}/>
                    <View style={{width:'100%',height:'42%',alignItems:'center'}}>
                        <Text style={{marginTop:RFPercentage(1),fontSize:RFPercentage(3.5),fontFamily:Fonts.primary}}>
                            {props.title}
                        </Text>
                        <Text style={{marginTop:RFPercentage(1),fontSize:RFPercentage(2.5),fontFamily:Fonts.primary}}>
                            {props.subtitle}
                        </Text>
                    </View>
                    <View style={{width:'100%',height:'20%',flexDirection:'row',alignSelf:'center',borderTopWidth:0.3,borderColor:'red'}}>
                        <TouchableOpacity onPress={props.handleClose} style={{justifyContent:'center',alignItems:'center',width:'100%',height:'100%'}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:'#ff003e',fontFamily:Fonts.primary}}>{props.btn}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<View style={{alignItems:'center',justifyContent:'center',marginTop:-RFPercentage(7.5),position:'absolute',alignSelf:'center',backgroundColor:'#ffae00',width:RFPercentage(15),height:RFPercentage(15),borderRadius:RFPercentage(7.5)}}>*/}
                    {/*    <Icon name={'warning'} color={'#fff'} size={RFPercentage(8)}/>*/}
                    {/*</View>*/}
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
                            <TouchableOpacity onPress={props.handleConfirm} style={{justifyContent:'center',alignItems:'center',width:'80%',height:'100%',borderRadius:10,backgroundColor:Colors.textColor}}>
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
export {Confirm,TermCondition,Warning,Success,MoneyWarning}
