import React, { useState,useRef } from 'react';
import {Animated, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Modal} from 'react-native';

import {RFPercentage} from 'react-native-responsive-fontsize';
import {CropView} from 'react-native-image-crop-tools';
const {width,height} = Dimensions.get('window')
const ImageCroper=(props)=>{
    const cropViewRef = useRef();
    return (<>
            {props.visible&&<Modal statusBarTranslucent={true} visible={true} animationType={'fade'} transparent={true}>
            <View style={{width,height:height+(height*0.1),position:'absolute',backgroundColor:'#000'}}>
                <View style={{height:'10%',justifyContent:'flex-end'}}>
                    <Text style={{fontSize:20,color:'#fff',alignSelf:'center'}}>Image Cropper</Text>
                </View>
                <View style={{height:'70%'}}>
                    <CropView
                        sourceUrl={props.uri}
                        style={{flex:1}}
                        ref={cropViewRef}
                        onImageCrop={(res) => props.handleCrop(res)}
                        keepAspectRatio
                        aspectRatio={{width: 16, height: 16}}
                    />
                </View>
                <View style={{height:'10%',alignSelf:'center',flexDirection:'row',width:'90%'}}>
                    <TouchableOpacity
                        onPress={props.handleClose}
                        style={{backgroundColor:'#f43212',justifyContent:'center',alignItems:'center',borderRadius:20,width:'45%',height:RFPercentage(7)}}>
                        <Text style={{fontSize:20,color:'#fff'}}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={{width:'10%'}}/>
                    <TouchableOpacity
                        onPress={() => {
                            cropViewRef.current.saveImage(true,90);
                        }}
                        style={{backgroundColor:'#1582F4',justifyContent:'center',alignItems:'center',borderRadius:20,width:'45%',height:RFPercentage(7)}}>
                        <Text style={{fontSize:20,color:'#fff'}}>Save</Text>
                    </TouchableOpacity>
                </View>


            </View>
                </Modal>}
                </>
        );
}

export {ImageCroper}
