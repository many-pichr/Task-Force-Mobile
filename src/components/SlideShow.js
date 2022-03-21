import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper'
import { Input,Header } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
const {width,height} = Dimensions.get('window')

const SlideShow=({top,items})=>{

        return (
            <View style={{width:width,alignItems:'center',marginTop:top&&top}}>
                {items&&items.length>0&&
                <Swiper autoplayTimeout={5} autoplay
                        loop
                        removeClippedSubviews={false}
                    containerStyle={styles.wrapper} showsButtons={false} width={width}>
                    {items.map((item,index) => {
                        return (
                            item.url&&<View style={styles.slide1}>
                                <FastImage
                                    source={{uri:item.url}}
                                    resizeMode={FastImage.resizeMode.cover}
                                    style={[styles.slide1, {width: width * 0.95, height: '100%'}]}/>
                            </View>)
                    })}
            </Swiper>}
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
        height:width*0.4,
        borderRadius:10,
    },
    slide1: {
        flex: 1,
        width:width*0.95,
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
