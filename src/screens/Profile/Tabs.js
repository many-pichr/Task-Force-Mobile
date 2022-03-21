import React, { useState } from 'react';
import { Animated, StyleSheet, View, Text, Image,TouchableOpacity,Dimensions } from 'react-native';
import { Input,Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts} from '../../utils/config';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment'
import {RFPercentage} from 'react-native-responsive-fontsize';
import Lang from '../../Language';
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
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff',paddingVertical:10}}>
            <View style={{flexDirection:'row',alignItems:'center',width:'95%',alignSelf:'center'}}>
                <Text style={{fontSize:RFPercentage(2.5),width:'80%',fontFamily:Fonts.primary}}>
                    {Lang[props.lang].about}
                </Text>
                {!props.view&&<TouchableOpacity style={{width:'20%',alignItems:'flex-end'}} onPress={props.onAdd}>
                    <Icons name={'edit'} color={Colors.textColor} size={25}/>
                </TouchableOpacity>}
            </View>
            {props.about&&props.about!=""&&<Text style={{fontSize:RFPercentage(1.8),textAlign:'justify',width:'90%',alignSelf:'center',paddingVertical:10}}>
                {props.about}
            </Text>}
        </View>
    );
}
const Education=(props)=>{
    const [more,setMore] = useState(false);
    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff',paddingVertical:10,marginTop:10}}>
            <View style={{width:'95%',alignSelf:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:RFPercentage(2.5),width:'80%',fontFamily:Fonts.primary}}>
                        {Lang[props.lang].edu}
                    </Text>
                    {!props.view&&<TouchableOpacity style={{width:'20%',alignItems:'flex-end'}} onPress={()=>props.onPress(3,true)}>
                        <Icon name={'plus'} color={Colors.textColor} size={30}/>
                    </TouchableOpacity>}
                </View>
                {props.data.map((l, i) => (
                        i<3 || more?<TouchableOpacity style={{width:'100%',marginTop:10}} onPress={()=>props.onPress(3,false,l)}>
                            <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                <View style={{width:'20%',justifyContent:'center'}}>
                                    <View style={{width:60,borderRadius:10,height:60,backgroundColor:'rgba(13,139,153,0.1)',justifyContent:'center',alignItems:'center'}}>
                                        <Icons name={'school'} size={30} color={Colors.textColor}/>
                                    </View>
                                </View>
                                <View style={{width:'75%'}}>
                                    <View style={{width:'100%',justifyContent:'center'}}>
                                        <Text style={{fontSize:RFPercentage(2.3),color:'#414141'}}>{l.schoolName}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{fontSize:RFPercentage(1.8)}}>{l.subject}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{marginTop:5,color:Colors.textColor,fontSize:RFPercentage(1.5)}}>
                                            {moment(l.startDate).format('MMM YYYY')} - {l.isTillNow?"Present":moment(l.endDate).format('MMM YYYY')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>:<></>

                    ))
                }
            </View>
            {props.data.length>3&&<TouchableOpacity style={{marginTop:20,alignSelf:'center'}} onPress={()=>setMore(!more)}>
                <Text style={{color:Colors.textColor}}>
                    {more?'Show Less':"Show More"}
                </Text>
            </TouchableOpacity>}
        </View>
    );
}
const Experience=(props)=>{
const [more,setMore] = useState(false);
    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff',paddingVertical:10,marginTop:10}}>
            <View style={{width:'95%',alignSelf:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:RFPercentage(2.5),width:'80%',fontFamily:Fonts.primary}}>
                        {Lang[props.lang].exp}
                    </Text>
                    {!props.view&&<TouchableOpacity style={{width:'20%',alignItems:'flex-end'}} onPress={()=>props.onPress(2,true)}>
                        <Icon name={'plus'} color={Colors.textColor} size={30}/>
                    </TouchableOpacity>}
                </View>
                {
                    props.data.map((l, i) => (
                        i<3 || more?<View style={{width:'100%',marginTop:10}}>
                            <TouchableOpacity style={{flexDirection:'row',width:'100%',alignSelf:'center'}}
                                              onPress={()=>props.onPress(2,false,l)}>
                                <View style={{width:'20%',justifyContent:'center'}}>
                                    <View style={{width:60,borderRadius:10,height:60,backgroundColor:'rgba(13,139,153,0.1)',justifyContent:'center',alignItems:'center'}}>
                                        <Icons name={'work-outline'} size={30} color={Colors.textColor}/>
                                    </View>
                                </View>
                                <View style={{width:'75%'}}>
                                    <View style={{width:'100%',justifyContent:'center'}}>
                                        <Text style={{fontSize:RFPercentage(2.3),color:'#414141'}}>{l.jobTitle}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{fontSize:RFPercentage(1.8)}}>{l.companyName}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{marginTop:5,color:Colors.textColor,fontSize:RFPercentage(1.5)}}>
                                            {moment(l.startDate).format('MMM YYYY')} - {l.isTillNow?"Present":moment(l.endDate).format('MMM YYYY')}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>:
                            <></>

                    ))
                }
            </View>
            {props.data.length>3&&<TouchableOpacity style={{marginTop:20,alignSelf:'center'}} onPress={()=>setMore(!more)}>
                <Text style={{color:Colors.textColor}}>
                    {more?'Show Less':"Show More"}
                </Text>
            </TouchableOpacity>}
        </View>
    );
}
const Skill=(props)=>{
    const [more,setMore] = useState(false);

    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff',marginTop:10,paddingVertical:10}}>
            <View style={{width:'95%',alignSelf:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:RFPercentage(2.5),width:'80%',fontFamily:Fonts.primary}}>
                        {Lang[props.lang].skill}
                    </Text>
                    {!props.view&&<TouchableOpacity style={{width:'20%',alignItems:'flex-end'}} onPress={()=>props.onPress(4,true,props.data)}>
                        <Icons name={'edit'} color={Colors.textColor} size={30}/>
                    </TouchableOpacity>}
                </View>
                {
                    props.data.map((l, i) => (
                        i<3 || more?<TouchableOpacity style={{width:'100%',marginTop:20}}>
                            <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                <View style={{width:'15%',height:40,justifyContent:'center'}}>
                                    <View style={{width:40,borderRadius:20,height:40,justifyContent:'center',alignItems:'center'}}>
                                        <Icon name={'check-circle'} size={40} color={Colors.textColor}/>
                                    </View>
                                </View>
                                <View style={{width:'80%',height:40,justifyContent:'center'}}>
                                        <Text style={{fontSize:18}}>{l.skill.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>:<></>

                    ))
                }
            </View>
            {props.data.length>3&&<TouchableOpacity style={{marginTop:20,alignSelf:'center'}} onPress={()=>setMore(!more)}>
                <Text style={{color:Colors.textColor,fontFamily:Fonts.primary}}>
                    {more?Lang[props.lang].showless:Lang[props.lang].showmore}
                </Text>
            </TouchableOpacity>}
        </View>
    );
}
export {About,Education,Skill,Experience}
