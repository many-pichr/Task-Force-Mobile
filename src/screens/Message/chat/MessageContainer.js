import {StyleSheet, Text, View,Dimensions, Animated, TouchableOpacity, ActivityIndicator} from 'react-native';
import React,{Component} from 'react';
import FastImage from 'react-native-fast-image'
import Material from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Feather'
import moment from 'moment'
import { ProgressBar, Colors } from 'react-native-paper';
import * as Progress from "react-native-progress";
import AutoHeightImage from 'react-native-auto-height-image';
const {width,height} = Dimensions.get('window')
const ANIMATION_DURATION = 200;
const ROW_HEIGHT = 70;
const getVoiceSize = (val) => (val>0&&val<=5)?width*0.1:(val>5&&val<=10)?width*0.2:(val>10&&val<=20)?width*0.3:(val>20&&val<=30)?width*0.4:width*0.5;

function RenderAvatar(data) {
    return (
        <>
            {/*{data.chatInfo.id==data.targetId&&*/}
            {/*    <FastImage*/}
            {/*        style={{ width: 40, height: 40,borderRadius:20 }}*/}
            {/*        source={{*/}
            {/*            uri: 'https://unsplash.it/400/400?image=1',*/}
            {/*            priority: FastImage.priority.normal,*/}
            {/*        }}*/}
            {/*        resizeMode={FastImage.resizeMode.contain}*/}
            {/*    />}*/}
                </>
    )
}
function RenderImage(data) {
    const {message} = data;
    return (
        <>
            <TouchableOpacity style={{marginBottom: 20,}}>
                <FastImage resizeMode={FastImage.resizeMode.cover}
                     source={{uri:message.content.uri,priority: FastImage.priority.normal}} style={{borderRadius:10,width:width*0.45,height:width*0.35}}/>
                    <View style={{width:'100%',height:'100%',position:'absolute',justifyContent:'flex-end'}}>
                        <View style={{flexDirection:'row',padding:5,borderRadius:5,marginBottom:5,marginRight:5,alignSelf:'flex-end',backgroundColor:'rgba(0,0,0,0.36)'}}>
                            <Text style={{ fontSize: 10, color: "#eaeaea", }}>{message.time}</Text>
                            <Material name={'done'} color={'#fff'}/>
                        </View>
                    </View>
            </TouchableOpacity>
        </>
    )
}
function RenderTextMessage(data,index) {
    const {message} = data;

    return(
        <>{message.chatInfo.id==message.targetId?
            <View style={{
                backgroundColor: "#dedede",
                padding:10,
                marginBottom: 20,
                marginLeft: "5%",
                alignSelf: 'flex-start',
                //maxWidth: 500,
                //padding: 14,

                //alignItems:"center",
                borderRadius: 15,
            }} key={index}>



                <Text style={{ fontSize: 16, color: "#000",justifyContent:"center" }} key={index}>
                    {message.content}
                </Text>
                <View style={{flexDirection:'row',marginTop:5,alignSelf:'flex-end'}}>
                    <Text style={{ fontSize: 10, color: "#6b6b6b", }}>{message.time}</Text>
                    <Material name={'done'} color={'#6b6b6b'}/>
                </View>
                <View style={styles.leftArrow}>

                </View>
                <View style={styles.leftArrowOverlap}></View>



            </View>
            :


            <View style={{
                backgroundColor: "#0078fe",
                padding:10,
                marginBottom: 20,
                marginRight: "5%",
                alignSelf: 'flex-end',
                borderRadius: 15,
            }} key={index}>

                <Text style={{ fontSize: 16, color: "#fff", }} key={index}>{message.content}</Text>
                <View style={{flexDirection:'row',marginTop:5,alignSelf:'flex-end'}}>
                    <Text style={{ fontSize: 10, color: "#eaeaea", }}>{message.time}</Text>
                    <Material name={'done'} color={'#fff'}/>
                </View>
                <View style={styles.rightArrow}>

                </View>
                <View style={styles.rightArrowOverlap}></View>

            </View>}
        </>
    )
}
function RenderVoiceMessage(data,index,playing,play) {
    const {message} = data;
    const progress=playing.progress>0?(playing.progress*100)/playing.total:0
    var formatted = moment().startOf('day')
        .seconds(message.content.length)
        .format('mm:ss');
    return(
        <>{message.chatInfo.id==message.targetId?
            <View style={{
                backgroundColor: "#dedede",
                padding:10,
                marginBottom: 20,
                marginLeft: "5%",
                alignSelf: 'flex-start',
                //maxWidth: 500,
                //padding: 14,

                //alignItems:"center",
                borderRadius: 15,
            }} key={index}>



                <TouchableOpacity onPress={()=>play('voice',data.index,message.content)} style={{flexDirection:'row',alignItems:'center'}}>
                    {playing.loading&&index==data.index?
                        <View style={{width:20,height:20}}>
                            <ActivityIndicator color={'#fff'}/>
                        </View>:
                        <View style={{width:20,height:20}}>
                            <Icon name={index!=data.index?'play':playing.play?'pause':'play'} color={'#0078fe'} size={20}/>
                        </View>}
                    <View style={{width:getVoiceSize(message.content.length)}}>
                        <Progress.Bar progress={index==data.index?progress/100:0} width={null} height={5}
                                      animated={true}
                                      borderRadius={0}
                                      borderWidth={0}
                                      useNativeDriver={true} style={{backgroundColor:'rgba(0,120,254,0.21)'}} color={'#0078fe'}/>
                    </View>
                    <Text style={{ fontSize: 10, }}> {formatted}</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',marginTop:5,alignSelf:'flex-end'}}>
                    <Text style={{ fontSize: 10, color: "#6b6b6b", }}>{message.time}</Text>
                    <Material name={'done'} color={'#6b6b6b'}/>
                </View>
                <View style={styles.leftArrow}>

                </View>
                <View style={styles.leftArrowOverlap}></View>



            </View>
            :


            <View style={{
                backgroundColor: "#0078fe",
                padding:10,
                marginRight: "5%",
                marginBottom: 20,
                alignSelf: 'flex-end',
                borderRadius: 15,
            }} key={index}>

                <TouchableOpacity onPress={()=>play('voice',data.index,message.content)}  style={{flexDirection:'row',alignItems:'center'}}>
                    {playing.loading&&index==data.index?
                        <View style={{width:20,height:20}}>
                            <ActivityIndicator color={'#fff'}/>
                        </View>:
                        <View onPress={()=>play('voice',data.index,message.content)} style={{width:20,height:20}}>
                            <Icon name={index!=data.index?'play':playing.play?'pause':'play'} color={'#fff'} size={20}/>
                        </View>}
                    <View style={{width:getVoiceSize(message.content.length)}}>
                        <Progress.Bar progress={index==data.index?progress/100:0} width={null} height={5}
                                      animated={true}
                                      borderRadius={0}
                                      borderWidth={0}
                                      useNativeDriver={true} style={{backgroundColor:'rgba(238,238,238,0.71)'}} color={'#fff'}/>
                    </View>
                    <Text style={{ fontSize: 10, color: "#eaeaea", }}> {formatted}</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',marginTop:0,alignSelf:'flex-end'}}>
                    <Text style={{ fontSize: 10, color: "#eaeaea", }}>{message.time}</Text>
                    <Material name={'done'} color={'#fff'}/>
                </View>
                <View style={styles.rightArrow}>

                </View>
                <View style={styles.rightArrowOverlap}></View>

            </View>}
        </>
    )
}
class Message extends Component{
    constructor(props) {
        super(props);

        this._animated = new Animated.Value(0);
    }
    componentDidMount() {
        const {message,index} = this.props;
        if(message.animated) {
            console.log('========>')
            Animated.timing(this._animated, {
                toValue: 1,
                // useNativeDriver:true,
                duration: ANIMATION_DURATION,
            }).start();
        }
    }
    renderItem=(message,index)=>{

        return(<>{message.chatInfo.id==message.targetId?
                <View style={{
                    backgroundColor: "#dedede",
                    padding:10,
                    marginBottom: message.animated?0:20,
                    marginLeft: "5%",
                    alignSelf: 'flex-start',
                    //maxWidth: 500,
                    //padding: 14,

                    //alignItems:"center",
                    borderRadius: 15,
                }} key={index}>



                    <Text style={{ fontSize: 16, color: "#000",justifyContent:"center" }} key={index}>
                        {message.content}
                    </Text>
                    <View style={styles.leftArrow}>

                    </View>
                    <View style={styles.leftArrowOverlap}></View>



                </View>
            :


                <View style={{
                    backgroundColor: "#0078fe",
                    padding:10,
                    marginBottom: message.animated?0:20,
                    marginRight: "5%",
                    alignSelf: 'flex-end',
                    borderRadius: 15,
                }} key={index}>

                    <Text style={{ fontSize: 16, color: "#fff", }} key={index}>{message.content}</Text>

                    <View style={styles.rightArrow}>

                    </View>
                    <View style={styles.rightArrowOverlap}></View>

                </View>}
            </>)
    }
    render(){
        const {message,index} = this.props;
        const rowStyles = message.animated?[
            {
                marginBottom: this._animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 30],
                    extrapolate: 'clamp',
                }),
            },
            // { opacity: this._animated },
            {
                transform: [
                    // { scale: this._animated },
                    {
                        rotate: this._animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['35deg', '0deg'],
                            extrapolate: 'clamp',
                        })
                    }
                ],
            },
        ]:[];
        return(
            <>
                {message.animated ?
                    <Animated.View style={rowStyles}>
                        {this.renderItem(message, index)}
                    </Animated.View> :
                    this.renderItem(message, index)
                }

            </>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    rightArrow: {
        position: "absolute",
        backgroundColor: "#0078fe",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10
    },

    rightArrowOverlap: {
        position: "absolute",
        backgroundColor: "#fff",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20

    },

    /*Arrow head for recevied messages*/
    leftArrow: {
        position: "absolute",
        backgroundColor: "#dedede",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left: -10
    },

    leftArrowOverlap: {
        position: "absolute",
        backgroundColor: "#fff",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -20

    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        height: ROW_HEIGHT,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: '500',
    },
    email: {
        fontSize: 14,
    },
})

export {RenderTextMessage,RenderVoiceMessage,RenderAvatar,RenderImage}
