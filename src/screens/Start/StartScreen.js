import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    Image,
    PermissionsAndroid,
    Permission,
    Dimensions,
    StatusBar,
    ImageBackground, TouchableOpacity, Modal, Platform,
} from 'react-native';
import assets from '../../assets'
import FastImage from 'react-native-fast-image'
import RNBootSplash from "react-native-bootsplash";
import { Button } from 'react-native-elements';
import * as Keychain from "react-native-keychain";
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import Swiper from 'react-native-swiper'
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Api from '../../api/User';
import {checkMultiple,requestMultiple, PERMISSIONS} from 'react-native-permissions';
import OneSignal from '../../../App';
import {Colors,Fonts} from '../../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderPicker} from 'react-native-slider-picker';
import {checkForPermissions} from '../../components/Permission'
import Lang from '../../Language'
const {width,height} = Dimensions.get('window')
const images=[{source:require('./img/start.png'),width:RFPercentage(50),height:RFPercentage(30)},
    {source:require('./img/next.png'),width:RFPercentage(50),height:RFPercentage(30)},
    {source:require('./img/go.png'),width:RFPercentage(50),height:RFPercentage(30)},
]

class StartScreen extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            proModal:false,
            fadeAnimation: new Animated.Value(0),
            fadeAnimation1: new Animated.Value(0),
        }
        this.props.set(true)
        checkForPermissions(false)
        this.handleCheckSetting();
    }
    componentDidMount(): void {
        // OneSignal.init("93 01b7be-36f5-47ec-919b-9ce25be83e21",{kOSSettingsKeyAutoPrompt : true});
        this.fadeIn()
        this.fadeIn1()

        RNBootSplash.hide({ duration: 500,fade:true })
        this.handleGetAuth()
        AsyncStorage.removeItem('setting')
    }
    handleCheckSetting=async ()=>{
        try {
            const value = await AsyncStorage.getItem('setting');
            if (value !== null) {
                const {setting} = this.props;
                const values = JSON.parse(value)
                setting.lang=values.lang?values.lang:"en";
                this.props.setSetting(setting)
                this.setState({proModal:values.lang===""})
            }else{
                this.setState({proModal:true})
            }
        } catch (error) {
            // Error retrieving data
        }
    }
    switchLang=async (lan)=>{
                const {setting} = this.props;
                setting.lang=lan;
                this.props.setSetting(setting)
                AsyncStorage.setItem('setting',JSON.stringify(setting))
                // AsyncStorage.removeItem('setting')
                this.setState({proModal:false})
    }
    handleGetAuth=async ()=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            // TODO: Validate user, and password (can be token) against server
            const auth = credentials.password
            await Api.CheckUser(auth).then((rs) => {
                if(rs.status){
                    this.handleCheckSetting()
                    const {setting} = this.props;
                    Keychain.setGenericPassword(JSON.stringify(rs.data), auth)
                    this.props.setUser(rs.data)
                    setting.isAgent=rs.data.userType=='1'?false:true;
                    this.props.setSetting(setting)
                    this.props.navigation.replace('RootBottomTab')
                }else{
                    this.props.set(false)
                }
            })
        }else{
            this.props.navigation.navigate('Start',{profileType:'1'})
            this.props.set(false)
        }
    }
    handleNext=(index,value)=>{
        if(index==2&&value==3){
            this.props.navigation.replace('Choose')
        }else {
            this.refs.swiper.scrollBy(+1)

            if(value==3){
                this.setState({index: index+1})
            }else{
                this.setState({index: value})
            }

        }

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
        const {lang} = this.props.setting;
        return (
            <>
                <Swiper loop={false} ref='swiper'>
                    <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

                    <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
                        <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:width*0.8,height:width*0.8,justifyContent:'center',alignItems:'center',marginTop:0}}>
                                <Image source={assets.logo} style={{width:RFPercentage(50),height:RFPercentage(15)}}/>
                                <Image source={images[0].source} style={{width:images[0].width,height:images[0].height}}/>
                            </View>
                            <View style={{width:'80%',alignSelf:'center',alignItems:'center',marginTop:30}}>
                                <Text style={styles.title}>{Lang[lang].intro1}</Text>
                                <Text style={styles.subTitle}>{Lang[lang].subIntro1}</Text>
                            </View>
                        </View>
                        <View style={{width:width,height:height*0.3,alignItems:'center'}}>
                            <View style={{borderRadius:20,justifyContent:'center',width:'80%',alignSelf:'center',paddingBottom:20}}>

                                <View style={{flexDirection:'row',alignSelf:'center',width:'70%'}}>
                                    <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={()=>this.switchLang('kh')}>
                                        <FastImage source={assets.kh} style={styles.img} resizeMode={FastImage.resizeMode.cover}/>
                                        <Text style={styles.textLan}>
                                            ភាសារខ្មែរ
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={()=>this.switchLang('en')}>
                                        <FastImage source={assets.en} style={styles.img} resizeMode={FastImage.resizeMode.cover}/>
                                        <Text style={[styles.textLan,{marginTop:5}]}>
                                            English
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Button
                                title={Lang[lang].getStart}
                                onPress={()=>this.handleNext(0,3)}
                                titleStyle={{fontSize:RFPercentage(3),fontFamily:Fonts.primary}}
                                buttonStyle={{height:RFPercentage(8),width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
                            />
                        </View>

                    </ImageBackground>


                    <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

                    <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
                        <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:width*0.8,height:width*0.8,justifyContent:'center',alignItems:'center',marginTop:0}}>
                                <Image source={assets.logo} style={{width:RFPercentage(50),height:RFPercentage(15)}}/>
                                <Image source={images[1].source} style={{width:images[1].width,height:images[1].height}}/>
                            </View>
                            <View style={{width:'80%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                                <Text style={styles.title}>{Lang[lang].intro2}</Text>
                                <Text style={styles.subTitle}>{Lang[lang].subIntro2}</Text>
                            </View>
                        </View>
                        <View style={{width:width,height:height*0.3,alignItems:'center'}}>
                            <View style={{width:'20%',marginVertical:20,flexDirection:'row'}}>

                            </View>
                            <Button
                                title={Lang[lang].next}
                                onPress={()=>this.handleNext(1,3)}
                                titleStyle={{fontSize:RFPercentage(3),fontFamily:Fonts.primary}}
                                buttonStyle={{height:RFPercentage(8),width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
                            />
                        </View>
                    </ImageBackground>
                    <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

                    <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
                        <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:width*0.8,height:width*0.8,justifyContent:'center',alignItems:'center',marginTop:0}}>
                                <Image source={assets.logo} style={{width:RFPercentage(50),height:RFPercentage(15)}}/>
                                <Image source={images[2].source} style={{width:images[2].width,height:images[2].height}}/>
                            </View>
                            <View style={{width:'80%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                                <Text style={styles.title}>{Lang[lang].intro3}</Text>
                                <Text style={styles.subTitle}>{Lang[lang].subIntro3}</Text>
                            </View>
                        </View>
                        <View style={{width:width,height:height*0.3,alignItems:'center'}}>
                            <View style={{width:'20%',marginVertical:20,flexDirection:'row'}}>

                            </View>
                            <Button
                                title={Lang[lang].go}
                                onPress={()=>this.handleNext(2,3)}
                                titleStyle={{fontSize:RFPercentage(3),fontFamily:Fonts.primary}}
                                buttonStyle={{height:RFPercentage(8),width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
                            />
                        </View>
                    </ImageBackground>
                </Swiper>

            </>
        );
    }
}
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        user: state.user.user,
        setting: state.setting.setting,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setUser: (user) => {
            dispatch(setUser(user))
        },
        setSetting: (data) => {
            dispatch(setSetting(data))
        }
    }
}
const styles = StyleSheet.create({
    title:{
        textAlign:'justify',marginVertical:10,fontWeight:'bold',fontSize:RFPercentage(3),color:'#20354E',fontFamily:Fonts.primary
    },
    textLan:{fontSize:RFPercentage(1.8),fontFamily:Fonts.primary,fontWeight:'bold'},
    img:{width:50,height:50,borderRadius:25,borderWidth:1,borderColor:'#117485'},
    subTitle:{textAlign:'center',color:'#959595',fontSize:RFPercentage(2),fontFamily:Fonts.primary},
    bubble:{width:8,height:6,borderRadius:4,backgroundColor:'#b9b9b9'},
    bubbleContainer:{width:'33.33%',alignItems:'center'},
    exBubble:{width:16,backgroundColor: Colors.textColor}
});
export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)
