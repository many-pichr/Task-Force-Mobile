import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import Icon  from 'react-native-vector-icons/MaterialIcons'
import {RFPercentage} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import {Colors, Fonts} from '../utils/config';
const {width,height} = Dimensions.get('window')

const FullIndicator=(props)=>{

        return (

            <View style={{width,height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.21)',alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size={'large'} color={Colors.textColor}/>
            </View>
    );
}
export {FullIndicator}
