import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Image,TouchableOpacity,Dimensions } from 'react-native';
import { Input,Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

const TextHorizontal=(props)=>{

        return (
            <View style={{flexDirection:'row',alignItems:'center',width:'90%',marginTop:20}}>
                <View style={{width:'80%',justifyContent:'center'}}>
                    <Text style={{fontSize:RFPercentage(2.5),color:'#333333'}}>
                        {props.title}
                    </Text>
                </View>
                {props.viewall &&
                <TouchableOpacity onPress={props.onPress}
                                  style={{width: '20%', alignItems: 'flex-end', flexDirection: 'row'}}>
                    <Text style={{fontSize: RFPercentage(1.5), color: '#7F838D'}}>
                        View All
                    </Text>
                    <Icons name={'chevron-right'} size={20} color={'#7F838D'}/>
                </TouchableOpacity>
                }
            </View>
        );
}

export {TextHorizontal}
