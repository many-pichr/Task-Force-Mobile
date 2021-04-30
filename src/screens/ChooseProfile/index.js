import React, { Component } from 'react';
import {Animated, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, StatusBar} from 'react-native';
import assets from '../../assets'
import { Button } from 'react-native-elements';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

const data=[
    {id:1,title:'I am an Organizer',source:require('./img/bag.png'),width:61.046875,height:52.78125},
    {id:2,title:'I am a Task Force Agent',source:require('./img/person.png'),width:53.78125,height:65},
    {id:3,title:'Both',source:require('./img/people.png'),width:77.0625,height:46.71875},
]
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            fadeAnimation: new Animated.Value(0),
            fadeAnimation1: new Animated.Value(0),
        }
    }
    componentDidMount(): void {
        this.fadeIn()
        this.fadeIn1()
    }

    handleNext=(id)=>{
            this.props.navigation.replace('Signin',{profileType:id})
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    fadeIn1 = async () => {
        Animated.timing(this.state.fadeAnimation1, {
            toValue: 1,
            duration: 600
        }).start();
    };
    render() {
        const {index} = this.state
    return (
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#f9f9f9' }}>
            <StatusBar  barStyle = "light-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <View style={{width:width,height:height*0.3,alignItems:'center',justifyContent:'center',backgroundColor:'#158aff'}}>
            <View style={{width:'90%',alignSelf:'center'}}>
                <Text style={{fontSize:RFPercentage(3),color:'#fff'}}>Welcome to Task Force</Text>
                <Text style={{fontSize:RFPercentage(2),color:'#fff',marginTop:10}}>Introduce  yourself. To make sure that we will find
                    a fitting furnished apartment</Text>
            </View>
          </View>
            <View style={{width:width,height:height*0.70,alignItems:'center'}}>
                <View style={{width:'100%',height:'80%',alignItems:'center',backgroundColor:'#f9f9f9',borderRadius:25,marginTop:-20,justifyContent:'center'}}>
                    <View style={{width:'100%',alignSelf:'center',alignItems:'center',height:height*0.4,justifyContent:'center'}}>
                        {data.map((item,index) => {
                        return (
                            <TouchableOpacity onPress={()=>this.handleNext(item.id)} style={styles.cardItem}>
                                <View style={{width:'30%',justifyContent:'center',alignItems:'center',height:'100%'}}>
                                    <Image source={item.source} style={{width:item.width*(RFPercentage(10)/100),height:item.height*(RFPercentage(10)/100)}}/>
                                </View>
                                <View style={{width:'70%',height:'100%',justifyContent:'center'}}>
                                    <Text style={{fontSize:20,color:'#20354E'}}>{item.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                    </View>
                </View>
            </View>
        </View>
    );
  }
}
const styles = StyleSheet.create({
    cardItem:{
        width:'90%',height:RFPercentage(13),backgroundColor:'#fff',borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection:'row',
        elevation: 5,
        marginVertical: 10,
    }
});
