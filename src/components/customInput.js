import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Image,TouchableOpacity,Dimensions } from 'react-native';
import { Button,Input } from 'react-native-elements';
import {Colors, Fonts} from '../utils/config';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { Icon } from 'react-native-vector-icons/Icon';
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
                                placeholderTextColor={Colors.textColor}
                                labelStyle={[focus&&{color:Colors.textColor,fontFamily:props.secure?"":Fonts.primary},{fontWeight:'normal'}]}
                                keyboardType={props.number?'numeric':'default'}
                                inputStyle={{fontSize:RFPercentage(2),marginLeft:10}}
                                errorMessage={(props.focus&&props.focus[props.name])&&(props.error&&props.error[props.name])?props.error[props.name][0]:''}
                                errorStyle={{marginTop:0}}
                                inputContainerStyle={[focus&&{borderColor:Colors.primary},{height:RFPercentage(7),borderWidth:1,borderRadius:5}]}
                                containerStyle={{height:RFPercentage(8),marginBottom:10,marginTop:10}}
                                onFocus={()=>this.handleActive(true,)}
                                onBlur={()=>this.handleActive(false)}
                                secureTextEntry={props.secure&&show}
                                rightIcon={props.secure?<TouchableOpacity onPress={()=>this.setState({show:!show})}>
                                    {/* <Text style={{color:Colors.textColor,marginRight:5}}>{show?props.show:props.hide}</Text> */}
                                    <Icons name={show?"visibility":"visibility-off"} size={RFPercentage(3)} color={Colors.textColor}/>
                                    </TouchableOpacity>:
                                <>{props.location&&<TouchableOpacity>
                                    <Icons name={'location-on'} color={Colors.textColor} size={RFPercentage(6)}/>
                                </TouchableOpacity>}</>}
                                onChangeText={value=>props.onChangeText(value,props.name)}
                                value={props.value}
                            />
        );
    }
}
