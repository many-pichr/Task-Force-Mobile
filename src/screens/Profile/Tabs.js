import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Image,TouchableOpacity,Dimensions } from 'react-native';
import { Input,Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
const {width,height} = Dimensions.get('window')
const list=[
    {title:'C.N Vidyavihar',subTitle:'Singapore Training Course'},
    {title:'Somlalit institute of Management',subTitle:'Bachelor of Business Administration'},
]
const skill=[
    'UX/UI Designer','Mobile app development','Software Engineer','Graphic Design'
]
const About=(props)=>{

    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff',paddingTop:20,paddingBottom:300}}>
            <Text style={{fontSize:16,textAlign:'justify',width:'90%',alignSelf:'center',paddingVertical:20}}>
                I’m a product designer and startup advisor helping companies launch delightful new products. I work across user testing, high-level UX design, gorgeous UI design, and interactive & motion prototyping to design products that are incredibly easy and delightful to use. But more than desirable products, I help design successful and
            </Text>
        </View>
    );
}
const Education=(props)=>{

    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff'}}>
            <View style={{width:'90%',alignSelf:'center',paddingBottom:300}}>
                {
                    list.map((l, i) => (
                <View style={{width:'100%',marginTop:20}}>
                    <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                       <View style={{width:'25%',height:80,justifyContent:'center'}}>
                           <View style={{width:80,borderRadius:20,height:80,backgroundColor:'rgba(21,130,244,0.23)',justifyContent:'center',alignItems:'center'}}>
                            <Icons name={'school'} size={50} color={'#1582F4'}/>
                           </View>
                       </View>
                        <View style={{width:'70%',height:80}}>
                        <View style={{width:'100%',height:'50%',justifyContent:'center'}}>
                            <Text style={{fontSize:18,color:'#414141'}}>{l.title}</Text>
                        </View>
                            <View style={{width:'100%',height:'50%'}}>
                                <Text style={{fontSize:15}}>{l.subTitle}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                    ))
                }
            </View>
        </View>
    );
}
const Experience=(props)=>{

    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff'}}>
            <View style={{width:'90%',alignSelf:'center'}}>
                {
                    list.map((l, i) => (
                        <View style={{width:'100%',marginTop:20}}>
                            <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                <View style={{width:'25%',height:80,justifyContent:'center'}}>
                                    <View style={{width:80,borderRadius:20,height:80,backgroundColor:'rgba(21,130,244,0.23)',justifyContent:'center',alignItems:'center'}}>
                                        <Icons name={'work-outline'} size={50} color={'#1582F4'}/>
                                    </View>
                                </View>
                                <View style={{width:'70%',height:80}}>
                                    <View style={{width:'100%',height:'50%',justifyContent:'center'}}>
                                        <Text style={{fontSize:18,color:'#414141'}}>{l.title}</Text>
                                    </View>
                                    <View style={{width:'100%',height:'50%'}}>
                                        <Text style={{fontSize:15}}>{l.subTitle}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    ))
                }
            </View>
        </View>
    );
}
const Skill=(props)=>{

    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff'}}>
            <View style={{width:'90%',alignSelf:'center',paddingBottom:300}}>
                {
                    skill.map((l, i) => (
                        <View style={{width:'100%',marginTop:20}}>
                            <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                <View style={{width:'15%',height:40,justifyContent:'center'}}>
                                    <View style={{width:40,borderRadius:20,height:40,justifyContent:'center',alignItems:'center'}}>
                                        <Icon name={'check-circle'} size={40} color={'#1582F4'}/>
                                    </View>
                                </View>
                                <View style={{width:'80%',height:40,justifyContent:'center'}}>
                                        <Text style={{fontSize:18}}>{l}</Text>
                                </View>
                            </View>
                        </View>

                    ))
                }
            </View>
        </View>
    );
}
export {About,Education,Skill,Experience}
