import React, { useState } from 'react';
import { Animated, StyleSheet, View, Text, TextInput,TouchableOpacity,Dimensions } from 'react-native';
import { Input,Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../utils/config'
import Icon from 'react-native-vector-icons/Feather';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
const list=[
    {title:'C.N Vidyavihar',subTitle:'Singapore Training Course'},
    {title:'Somlalit institute of Management',subTitle:'Bachelor of Business Administration'},
]
const skill=[
    'UX/UI Designer','Mobile app development','Software Engineer','Graphic Design'
]
const FormAbout=(props)=>{

    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#f1f1f1',height:'100%',position:'absolute'}}>
            <View style={{width:'90%',alignSelf:'center',alignItems:'center'}}>
                <View style={styles.textAreaContainer} >
                    <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Type something"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                    />
                </View>
            </View>
        </View>
    );
}
const Education=(props)=>{
    const [more,setMore] = useState(false);
    return (
        <View style={{alignSelf:'center',width:'100%',backgroundColor:'#fff',paddingVertical:10,marginTop:10}}>
            <View style={{width:'95%',alignSelf:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:20,width:'80%'}}>
                        Education
                    </Text>
                    <TouchableOpacity style={{width:'20%',alignItems:'flex-end'}}>
                        <Icon name={'plus'} color={Colors.textColor} size={30}/>
                    </TouchableOpacity>
                </View>
                {
                    props.data.map((l, i) => (
                        i<3 || more?<TouchableOpacity style={{width:'100%',marginTop:20}}>
                            <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                <View style={{width:'20%',justifyContent:'center'}}>
                                    <View style={{width:60,borderRadius:10,height:60,backgroundColor:'rgba(13,139,153,0.1)',justifyContent:'center',alignItems:'center'}}>
                                        <Icons name={'work-outline'} size={30} color={Colors.textColor}/>
                                    </View>
                                </View>
                                <View style={{width:'75%'}}>
                                    <View style={{width:'100%',justifyContent:'center'}}>
                                        <Text style={{fontSize:RFPercentage(2.3),color:'#414141'}}>{l.title}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{fontSize:RFPercentage(1.8)}}>{l.subTitle}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{marginTop:5,color:Colors.textColor,fontSize:RFPercentage(1.5)}}>Jun 2017 - Jan 2020</Text>
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
                <Text style={{fontSize:20,width:'80%'}}>
                    Experience
                </Text>
                    <TouchableOpacity style={{width:'20%',alignItems:'flex-end'}}>
                        <Icon name={'plus'} color={Colors.textColor} size={30}/>
                    </TouchableOpacity>
                </View>
                {
                    props.data.map((l, i) => (
                        i<3 || more?<View style={{width:'100%',marginTop:20}}>
                            <TouchableOpacity style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                <View style={{width:'20%',justifyContent:'center'}}>
                                    <View style={{width:60,borderRadius:10,height:60,backgroundColor:'rgba(13,139,153,0.1)',justifyContent:'center',alignItems:'center'}}>
                                        <Icons name={'work-outline'} size={30} color={Colors.textColor}/>
                                    </View>
                                </View>
                                <View style={{width:'75%'}}>
                                    <View style={{width:'100%',justifyContent:'center'}}>
                                        <Text style={{fontSize:RFPercentage(2.3),color:'#414141'}}>{l.title}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{fontSize:RFPercentage(1.8)}}>{l.subTitle}</Text>
                                    </View>
                                    <View style={{width:'100%'}}>
                                        <Text style={{marginTop:5,color:Colors.textColor,fontSize:RFPercentage(1.5)}}>Jun 2017 - Jan 2020</Text>
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
                    <Text style={{fontSize:20,width:'80%'}}>
                        Skill
                    </Text>
                    <TouchableOpacity style={{width:'20%',alignItems:'flex-end'}}>
                        <Icon name={'plus'} color={Colors.textColor} size={30}/>
                    </TouchableOpacity>
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
                                        <Text style={{fontSize:18}}>{l}</Text>
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

const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: Colors.textColor,
        borderWidth: 1,
        padding: 5,
        width:'100%'
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
    }
});
export {FormAbout,Education,Skill,Experience}
