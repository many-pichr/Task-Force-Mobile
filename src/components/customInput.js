import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Image,TouchableOpacity,Dimensions } from 'react-native';
import { Button,Input } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

export default class customInput extends Component {
    constructor(props) {
        super(props);
        this.state={
            focus:false,
            show:true
        }
    }

    handleActive=(v)=>{
        const newState={... this.state}
        newState.focus = v;
        this.setState(newState)
    }
    render() {
        const {focus,show} = this.state
        const props=this.props
        return (
                            <Input
                                // label={props.label}
                                placeholder={props.placeholder}
                                placeholderTextColor={'rgba(0,0,0,0.33)'}
                                labelStyle={[focus&&{color:'#1582F4'},{fontWeight:'normal'}]}
                                keyboardType={'default'}
                                inputStyle={{fontSize:RFPercentage(2),marginLeft:10}}
                                errorMessage={(props.focus&&props.focus[props.name])&&(props.error&&props.error[props.name])?props.error[props.name][0]:''}
                                errorStyle={{marginTop:0}}
                                inputContainerStyle={[focus&&{borderColor:'#1582F4'},{height:RFPercentage(7),borderWidth:1,borderRadius:5}]}
                                containerStyle={{height:RFPercentage(8),marginBottom:10,marginTop:10}}
                                onFocus={()=>this.handleActive(true,)}
                                onBlur={()=>this.handleActive(false)}
                                secureTextEntry={props.secure&&show}
                                rightIcon={props.secure?<TouchableOpacity onPress={()=>this.setState({show:!show})}>
                                    <Text style={{color:'#459CF5',marginRight:5}}>{show?"show":"hide"}</Text></TouchableOpacity>:
                                <>{props.location&&<TouchableOpacity>
                                    <Icons name={'location-on'} color={'#459CF5'} size={RFPercentage(6)}/>
                                </TouchableOpacity>}</>}
                                onChangeText={value=>props.onChangeText(value,props.name)}
                                value={props.value}
                            />
        );
    }
}
