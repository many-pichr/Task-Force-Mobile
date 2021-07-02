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
    ImageBackground, TouchableOpacity, Modal,
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
import {Colors} from '../../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderPicker} from 'react-native-slider-picker';
import Lang from '../Lang'
const {width,height} = Dimensions.get('window')
const styles = StyleSheet.create({
    title:{
        textAlign:'justify',marginVertical:10,fontWeight:'bold',fontSize:RFPercentage(3),color:'#20354E'
    },
    textLan:{fontSize:RFPercentage(1.8),fontFamily:"OdorMeanChey",fontWeight:'bold'},
    img:{width:50,height:50,borderRadius:25,borderWidth:1,borderColor:'#117485'},
    subTitle:{textAlign:'center',color:'#959595',fontSize:RFPercentage(2)},
    bubble:{width:8,height:6,borderRadius:4,backgroundColor:'#b9b9b9'},
    bubbleContainer:{width:'33.33%',alignItems:'center'},
    exBubble:{width:16,backgroundColor: Colors.textColor}
});
const titles=['Get Started','Next', "Let's go"]
const texts=[
    {title:'Welcome to task force',subtitle:'Explore and complete a task \n' +
            'and get rewarded'},
    {title:'Organize a task',subtitle:'Post a task that you need someone \n' +
            'to assist on and reward the agent when \n' +
            'the task is completed\n'},
    {title:'Join and Start Your Work',subtitle:'Start working with your team in \n' +
            'your new workplace'}
]
const images=[{source:require('./img/start.png'),width:327.20,height:238.37},
    {source:require('./img/next.png'),width:327.20,height:238.37},
    {source:require('./img/go.png'),width:327.20,height:238.37},
]
const requestCameraPermission = async () => {
    try {
        requestMultiple([PERMISSIONS.IOS.CAMERA,PERMISSIONS.ANDROID.CAMERA]).then((statuses) => {
            console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        });
    } catch (err) {
        console.warn(err);
    }
};

function fontSizer (screenWidth) {
    if(screenWidth > 400){
        return 18;
    }else if(screenWidth > 250){
        return 23;
    }else {
        return 12;
    }
}
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
    }
    componentDidMount(): void {
        // OneSignal.init("93 01b7be-36f5-47ec-919b-9ce25be83e21",{kOSSettingsKeyAutoPrompt : true});
        this.fadeIn()
        this.fadeIn1()
                Keychain.getSupportedBiometryType({}).then((biometryType) => {

        });
        RNBootSplash.hide({ duration: 500,fade:true })
        // this.handleCheckSetting()
        this.handleGetAuth()
        requestCameraPermission()
        // AsyncStorage.removeItem('setting')
    }
    handleCheckSetting=async ()=>{
        try {
            const value = await AsyncStorage.getItem('setting');
            if (value !== null) {
                const {setting} = this.props;
                const values = JSON.parse(value)
                setting.lang=values.lang;
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
                    console.log('testings====>',setting,rs.data.userType)
                    this.props.setSetting(setting)
                    this.props.navigation.replace('RootBottomTab')
                }else{
                    // this.props.set(false)
                }
            })
        }else{
            this.props.navigation.navigate('Start',{profileType:'1'})
            // this.props.set(false)
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
        const {proModal} = this.state
        console.log(123,this.props.setting)
        return (
            <>
                <Swiper loop={false} ref='swiper'>
                    <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

                    <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
                        <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:width*0.8,height:width*0.8,justifyContent:'center',alignItems:'center',marginTop:0}}>
                                <Image source={assets.logo} style={{width:RFPercentage(50),height:RFPercentage(25)}}/>
                                <Image source={images[0].source} style={{width:images[0].width*0.7,height:images[0].height*0.7}}/>
                            </View>
                            <View style={{width:'80%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                                <Text style={styles.title}>{texts[0].title}  {this.props.setting.lang}</Text>
                                <Text style={styles.subTitle}>{texts[0].subtitle}</Text>
                            </View>
                        </View>
                        <View style={{width:width,height:height*0.3,alignItems:'center'}}>
                            <View style={{width:'20%',marginVertical:20,flexDirection:'row'}}>


                            </View>
                            <Button
                                title={titles[0]}
                                onPress={()=>this.handleNext(0,3)}
                                titleStyle={{fontSize:RFPercentage(3)}}
                                buttonStyle={{height:RFPercentage(8),width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
                            />
                        </View>

                    </ImageBackground>


                    <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

                    <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
                        <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:width*0.8,height:width*0.8,justifyContent:'center',alignItems:'center',marginTop:0}}>
                                <Image source={assets.logo} style={{width:RFPercentage(50),height:RFPercentage(25)}}/>
                                <Image source={images[1].source} style={{width:images[1].width*0.7,height:images[1].height*0.7}}/>
                            </View>
                            <View style={{width:'80%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                                <Text style={styles.title}>{texts[1].title}</Text>
                                <Text style={styles.subTitle}>{texts[1].subtitle}</Text>
                            </View>
                        </View>
                        <View style={{width:width,height:height*0.3,alignItems:'center'}}>
                            <View style={{width:'20%',marginVertical:20,flexDirection:'row'}}>

                            </View>
                            <Button
                                title={titles[1]}
                                onPress={()=>this.handleNext(1,3)}
                                titleStyle={{fontSize:RFPercentage(3)}}
                                buttonStyle={{height:RFPercentage(8),width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
                            />
                        </View>
                    </ImageBackground>
                    <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

                    <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
                        <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                            <View style={{width:width*0.8,height:width*0.8,justifyContent:'center',alignItems:'center',marginTop:0}}>
                                <Image source={assets.logo} style={{width:RFPercentage(50),height:RFPercentage(25)}}/>
                                <Image source={images[2].source} style={{width:images[2].width*0.7,height:images[2].height*0.7}}/>
                            </View>
                            <View style={{width:'80%',alignSelf:'center',alignItems:'center',marginTop:20}}>
                                <Text style={styles.title}>{texts[2].title}</Text>
                                <Text style={styles.subTitle}>{texts[2].subtitle}</Text>
                            </View>
                        </View>
                        <View style={{width:width,height:height*0.3,alignItems:'center'}}>
                            <View style={{width:'20%',marginVertical:20,flexDirection:'row'}}>

                            </View>
                            <Button
                                title={titles[2]}
                                onPress={()=>this.handleNext(2,3)}
                                titleStyle={{fontSize:RFPercentage(3)}}
                                buttonStyle={{height:RFPercentage(8),width:width*0.6,borderRadius:10,backgroundColor:Colors.textColor}}
                            />
                        </View>
                    </ImageBackground>
                </Swiper>

                {this.props.setting.lang==""&&proModal&&
                <Modal statusBarTranslucent={true} visible={true} animationType={'slide'} transparent={true}>
                    <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({proModal:true})} style={{width,height:height,backgroundColor:'rgba(0,0,0,0.25)',alignItems:'center',justifyContent:'center'}}>
                        <View style={{borderRadius:20,justifyContent:'center',backgroundColor:'rgb(255,255,255)',width:'80%',alignSelf:'center',height:200}}>
                            <Text style={{alignSelf:'center',fontSize:RFPercentage(2.5),marginBottom:20,color:'red'}}>
                                Choose Language
                            </Text>
                            <View style={{flexDirection:'row',alignSelf:'center',width:'70%'}}>
                                <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={()=>this.switchLang('kh')}>
                                <FastImage source={assets.kh} style={styles.img} resizeMode={FastImage.resizeMode.cover}/>
                                    <Text style={styles.textLan}>
                                        ភាសារខ្មែរ
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={()=>this.switchLang('en')}>
                                    <FastImage source={assets.en} style={styles.img} resizeMode={FastImage.resizeMode.cover}/>
                                    <Text style={styles.textLan}>
                                        English
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>}
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

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen)

// import React, { Component } from 'react';
// import {
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableHighlight,
//     View,
// } from 'react-native';
// import SegmentedControlTab from 'react-native-segmented-control-tab';
// import * as Keychain from 'react-native-keychain';
// import RNBootSplash from 'react-native-bootsplash';
//
// const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
// const ACCESS_CONTROL_OPTIONS_ANDROID = ['None'];
// const ACCESS_CONTROL_MAP = [
//     null,
//     Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
//     Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
//     Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
// ];
// const ACCESS_CONTROL_MAP_ANDROID = [
//     null,
//     Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
// ];
// const SECURITY_LEVEL_OPTIONS = ['Any', 'Software', 'Hardware'];
// const SECURITY_LEVEL_MAP = [
//     Keychain.SECURITY_LEVEL.ANY,
//     Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
//     Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
// ];
//
// const SECURITY_STORAGE_OPTIONS = ['Best', 'FB', 'AES', 'RSA'];
// const SECURITY_STORAGE_MAP = [
//     null,
//     Keychain.STORAGE_TYPE.FB,
//     Keychain.STORAGE_TYPE.AES,
//     Keychain.STORAGE_TYPE.RSA,
// ];
//
// export default class KeychainExample extends Component {
//     state = {
//         username: '',
//         password: '',
//         status: '',
//         biometryType: null,
//         accessControl: null,
//         securityLevel: null,
//         storage: null,
//     };
//
//     componentDidMount() {
//
//         Keychain.getSupportedBiometryType({}).then((biometryType) => {
//             this.setState({ biometryType });
//         });
//         RNBootSplash.hide({ duration: 500,fade:true })
//     }
//
//     async save() {
//         try {
//             let start = new Date();
//             console.log({
//                 accessControl: this.state.accessControl,
//                 securityLevel: this.state.securityLevel,
//                 storage: this.state.storageSelection,
//             })
//             await Keychain.setGenericPassword(
//                 this.state.username,
//                 this.state.password,
//                 {
//                     accessControl: null,
//                     securityLevel: null,
//                     storage: undefined
//                 }
//             );
//
//             let end = new Date();
//
//             this.setState({
//                 username: '',
//                 password: '',
//                 status: `Credentials saved! takes: ${
//                 end.getTime() - start.getTime()
//                     } millis`,
//             });
//         } catch (err) {
//             this.setState({ status: 'Could not save credentials, ' + err });
//         }
//     }
//
//     async load() {
//         try {
//             const options = {
//                 authenticationPrompt: {
//                     title: 'Authentication needed',
//                     subtitle: 'Subtitle',
//                     description: 'Some descriptive text',
//                     cancel: 'Cancel',
//                 },
//             };
//             const credentials = await Keychain.getGenericPassword(options);
//             if (credentials) {
//                 this.setState({ ...credentials, status: 'Credentials loaded!' });
//             } else {
//                 this.setState({ status: 'No credentials stored.' });
//             }
//         } catch (err) {
//             this.setState({ status: 'Could not load credentials. ' + err });
//         }
//     }
//
//     async reset() {
//         try {
//             await Keychain.resetGenericPassword();
//             this.setState({
//                 status: 'Credentials Reset!',
//                 username: '',
//                 password: '',
//             });
//         } catch (err) {
//             this.setState({ status: 'Could not reset credentials, ' + err });
//         }
//     }
//
//     async getAll() {
//         try {
//             const result = await Keychain.getAllGenericPasswordServices();
//             this.setState({
//                 status: `All keys successfully fetched! Found: ${result.length} keys.`,
//             });
//         } catch (err) {
//             this.setState({ status: 'Could not get all keys. ' + err });
//         }
//     }
//
//     async ios_specifics() {
//         try {
//             const reply = await Keychain.setSharedWebCredentials(
//                 'server',
//                 'username',
//                 'password'
//             );
//             console.log(`setSharedWebCredentials: ${JSON.stringify(reply)}`);
//         } catch (err) {
//             Alert.alert('setSharedWebCredentials error', err.message);
//         }
//
//         try {
//             const reply = await Keychain.requestSharedWebCredentials();
//             console.log(`requestSharedWebCredentials: ${JSON.stringify(reply)}`);
//         } catch (err) {
//             Alert.alert('requestSharedWebCredentials error', err.message);
//         }
//     }
//
//     render() {
//         const VALUES =
//             Platform.OS === 'ios'
//                 ? ACCESS_CONTROL_OPTIONS
//                 : ACCESS_CONTROL_OPTIONS_ANDROID;
//         const AC_MAP =
//             Platform.OS === 'ios' ? ACCESS_CONTROL_MAP : ACCESS_CONTROL_MAP_ANDROID;
//         const SL_MAP = Platform.OS === 'ios' ? [] : SECURITY_LEVEL_MAP;
//         const ST_MAP = Platform.OS === 'ios' ? [] : SECURITY_STORAGE_MAP;
//
//         return (
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 style={styles.container}
//             >
//                 <View style={styles.content}>
//                     <Text style={styles.title}>Keychain Example</Text>
//                     <View style={styles.field}>
//                         <Text style={styles.label}>Username</Text>
//                         <TextInput
//                             style={styles.input}
//                             autoCapitalize="none"
//                             value={this.state.username}
//                             onSubmitEditing={() => {
//                                 this.passwordTextInput.focus();
//                             }}
//                             onChange={(event) =>
//                                 this.setState({ username: event.nativeEvent.text })
//                             }
//                             underlineColorAndroid="transparent"
//                             blurOnSubmit={false}
//                             returnKeyType="next"
//                         />
//                     </View>
//                     <View style={styles.field}>
//                         <Text style={styles.label}>Password</Text>
//                         <TextInput
//                             style={styles.input}
//                             password={true}
//                             autoCapitalize="none"
//                             value={this.state.password}
//                             ref={(input) => {
//                                 this.passwordTextInput = input;
//                             }}
//                             onChange={(event) =>
//                                 this.setState({ password: event.nativeEvent.text })
//                             }
//                             underlineColorAndroid="transparent"
//                         />
//                     </View>
//                     <View style={styles.field}>
//                         <Text style={styles.label}>Access Control</Text>
//                         <SegmentedControlTab
//                             selectedIndex={this.state.selectedIndex}
//                             values={
//                                 this.state.biometryType
//                                     ? [...VALUES, this.state.biometryType]
//                                     : VALUES
//                             }
//                             onTabPress={(index) =>
//                                 this.setState({
//                                     ...this.state,
//                                     accessControl: AC_MAP[index],
//                                     selectedIndex: index,
//                                 })
//                             }
//                         />
//                     </View>
//                     {Platform.OS === 'android' && (
//                         <View style={styles.field}>
//                             <Text style={styles.label}>Security Level</Text>
//                             <SegmentedControlTab
//                                 selectedIndex={this.state.selectedSecurityIndex}
//                                 values={SECURITY_LEVEL_OPTIONS}
//                                 onTabPress={(index) =>
//                                     this.setState({
//                                         ...this.state,
//                                         securityLevel: SL_MAP[index],
//                                         selectedSecurityIndex: index,
//                                     })
//                                 }
//                             />
//
//                             <Text style={styles.label}>Storage</Text>
//                             <SegmentedControlTab
//                                 selectedIndex={this.state.selectedStorageIndex}
//                                 values={SECURITY_STORAGE_OPTIONS}
//                                 onTabPress={(index) =>
//                                     this.setState({
//                                         ...this.state,
//                                         storageSelection: ST_MAP[index],
//                                         selectedStorageIndex: index,
//                                     })
//                                 }
//                             />
//                         </View>
//                     )}
//                     {!!this.state.status && (
//                         <Text style={styles.status}>{this.state.status}</Text>
//                     )}
//
//                     <View style={styles.buttons}>
//                         <TouchableHighlight
//                             onPress={() => this.save()}
//                             style={styles.button}
//                         >
//                             <View style={styles.save}>
//                                 <Text style={styles.buttonText}>Save</Text>
//                             </View>
//                         </TouchableHighlight>
//
//                         <TouchableHighlight
//                             onPress={() => this.load()}
//                             style={styles.button}
//                         >
//                             <View style={styles.load}>
//                                 <Text style={styles.buttonText}>Load</Text>
//                             </View>
//                         </TouchableHighlight>
//
//                         <TouchableHighlight
//                             onPress={() => this.reset()}
//                             style={styles.button}
//                         >
//                             <View style={styles.reset}>
//                                 <Text style={styles.buttonText}>Reset</Text>
//                             </View>
//                         </TouchableHighlight>
//                     </View>
//
//                     <View style={[styles.buttons, styles.centerButtons]}>
//                         <TouchableHighlight
//                             onPress={() => this.getAll()}
//                             style={styles.button}
//                         >
//                             <View style={styles.load}>
//                                 <Text style={styles.buttonText}>Get Used Keys</Text>
//                             </View>
//                         </TouchableHighlight>
//                         {Platform.OS === 'android' && (
//                             <TouchableHighlight
//                                 onPress={async () => {
//                                     const level = await Keychain.getSecurityLevel();
//                                     Alert.alert('Security Level', level);
//                                 }}
//                                 style={styles.button}
//                             >
//                                 <View style={styles.load}>
//                                     <Text style={styles.buttonText}>Get security level</Text>
//                                 </View>
//                             </TouchableHighlight>
//                         )}
//                         {Platform.OS === 'ios' && (
//                             <TouchableHighlight
//                                 onPress={() => this.ios_specifics()}
//                                 style={styles.button}
//                             >
//                                 <View style={styles.load}>
//                                     <Text style={styles.buttonText}>Test Other APIs</Text>
//                                 </View>
//                             </TouchableHighlight>
//                         )}
//                     </View>
//                 </View>
//             </KeyboardAvoidingView>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     content: {
//         marginHorizontal: 20,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: '200',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     field: {
//         marginVertical: 5,
//     },
//     label: {
//         fontWeight: '500',
//         fontSize: 15,
//         marginBottom: 5,
//     },
//     input: {
//         color: '#000',
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: '#ccc',
//         backgroundColor: 'white',
//         height: 32,
//         fontSize: 14,
//         padding: 8,
//     },
//     status: {
//         color: '#333',
//         fontSize: 12,
//         marginTop: 15,
//     },
//     biometryType: {
//         color: '#333',
//         fontSize: 12,
//         marginTop: 15,
//     },
//     buttons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//     },
//     button: {
//         borderRadius: 3,
//         padding: 2,
//         overflow: 'hidden',
//     },
//     save: {
//         backgroundColor: '#0c0',
//     },
//     load: {
//         backgroundColor: '#333',
//     },
//     reset: {
//         backgroundColor: '#c00',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 14,
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//     },
// });
