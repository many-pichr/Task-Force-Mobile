import React, { Component } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import Swiper from 'react-native-swiper'
import { Input,Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import {Colors} from '../utils/config'
import FastImage from 'react-native-fast-image';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

const SlideShow=(props)=>{

        return (
            <View style={{width:width,alignItems:'center'}}>
                <Swiper autoplayTimeout={3}
                    containerStyle={styles.wrapper} showsButtons={false} width={width} autoplay={true}>
                <View style={styles.slide1}>
                    {/*<FastImage*/}
                    {/*           source={require('../assets/images/banner1.png')}*/}
                    {/*           resizeMode={FastImage.resizeMode.contain}*/}
                    {/*           style={{width,height:}}/>*/}
                    <Text style={styles.text}>Welcome to Task Force</Text>
                </View>
                <View style={styles.slide2}>
                    <Text style={styles.text}>Post a job</Text>
                </View>
                <View style={styles.slide3}>
                    <Text style={styles.text}>Organize your task</Text>
                </View>
            </Swiper>
            </View>
        );
}
const HeaderText=(props)=>{

    return (<Header
            containerStyle={{width,borderBottomWidth:0}}
            backgroundColor={'transparent'}
            leftComponent={{ icon: 'chevron-left', color: '#fff',size:30,onPress:props.handleBack }}
            centerComponent={{ text: props.title, style: { color: '#fff',fontSize:20 } }}
            rightComponent={{ icon: props.rightIcon, color: '#fff',size:30,onPress:props.handleRight }}
        />

    );
}
const styles = StyleSheet.create({
    wrapper: {
        height:height*0.2,
        borderRadius:10,
    },
    slide1: {
        flex: 1,
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(16,189,206,0.54)'
    },
    slide2: {
        flex: 1,
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        width:'95%',
        alignSelf:'center',
        borderRadius:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
})
export {SlideShow,HeaderText}
