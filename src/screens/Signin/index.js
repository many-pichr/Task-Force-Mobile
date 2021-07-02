import React, { Component } from 'react';
import {
    Animated,
    Alert,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ImageBackground, Keyboard,
} from 'react-native';
import assets from '../../assets'
import { Button,Input } from 'react-native-elements';
// import auth from '@react-native-firebase/auth';
// import { LoginManager, AccessToken } from 'react-native-fbsdk';
import {Colors} from '../../utils/config'
import Icons from 'react-native-vector-icons/FontAwesome';
const {width,height} = Dimensions.get('window')
// import { GoogleSignin } from '@react-native-community/google-signin';
import CustomInput from '../../components/customInput';
import * as Keychain from 'react-native-keychain';
import Request from '../../utils/Request'
import schama from './validator'
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {connect} from 'react-redux';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {setSetting} from '../../redux/actions/setting';
import {ActivityIndicator} from 'react-native-paper';
import Api from '../../api/User';
const validate = require("validate.js");
// GoogleSignin.configure({
//     webClientId: '618872630642-3c60odplefupqgp2lie32qsl790d76q4.apps.googleusercontent.com',
// });

function fontSizer (screenWidth) {
    if(screenWidth > 400){
        return 18;
    }else if(screenWidth > 250){
        return 23;
    }else {
        return 12;
    }
}
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            fadeAnimation: new Animated.Value(0),
            fadeAnimation1: new Animated.Value(0),
            focus:{
                phone:false,
                password:false
            },
            error:[],
            values:{
                phone:'',
                password:''
            }
        }
    }
    componentDidMount(): void {
        this.fadeIn()
        this.fadeIn1()
    }
    onGoogleButtonPress=async ()=> {
        // Get the users ID token
        // const { idToken } = await GoogleSignin.signIn();
        //
        // // Create a Google credential with the token
        // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        //
        // // Sign-in the user with the credential
        // return auth().signInWithCredential(googleCredential);
    }
     onFacebookButtonPress=async ()=> {
        // Attempt login with permissions
        // const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
        // if (result.isCancelled) {
        //     throw 'User cancelled the login process';
        // }
        //
        // // Once signed in, get the users AccesToken
        // const data = await AccessToken.getCurrentAccessToken();
        //
        // if (!data) {
        //     throw 'Something went wrong obtaining access token';
        // }
        //
        // // Create a Firebase credential with the AccessToken
        // const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        //
        // // Sign-in the user with the credential
        //  await auth().signInWithCredential(facebookCredential).then((rs) => {
        //      console.log(JSON.stringify(rs))
        //  }).catch((e) => {
        //     alert(e)
        //  })

    }
    handleNext=(index,value)=>{
        const { params } = this.props.route;

        this.props.navigation.navigate('RootBottomTab')
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
    handleInput=async (v,f)=>{
        const newState={... this.state}
        newState.values[f] = v;
        newState.focus[f] = true;
        const err = await validate(newState.values, schama);
        newState.error=err
        this.setState(newState)
    }
    handleLogin=async ()=>{
        const {values} = this.state
        this.props.set(true)
        Keyboard.dismiss();
        await Request.GetToken(values.phone,values.password).then((rs) => {
           if(rs.status)
           {
               Keychain.setGenericPassword(JSON.stringify(rs.data), rs.data.token)
               Api.CheckUser().then((r) => {
                   if(r.status){
                       Keychain.setGenericPassword(JSON.stringify(r.data), rs.data.token)
                       this.props.setUser(r.data)
                       this.props.setSetting({isAgent:r.data.userType=='1'?false:true})
                       this.props.navigation.replace('RootBottomTab',{signin:true})
                   }else{
                       this.props.set(false)
                   }
               })
           }else{
               Alert.alert('Warning',"Login Failed")
               this.props.set(false)
           }
        })


    }
    render() {
        const {focus,error,values} = this.state
        const { params } = this.props.route;
        return (
            <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
              <Animated.View
                  style={[
                      {
                          opacity: this.state.fadeAnimation
                      }
                  ]}
              >
                  <View style={{width:width*0.8,height:height*0.4,alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
                      <Image source={assets.logo1} style={{width:RFPercentage(50),height:RFPercentage(20)}}/>
                      <Text style={{fontSize:RFPercentage(4),color:'#202326'}}>Welcome</Text>
                      <Text style={{fontSize:RFPercentage(2),color:'#7F838D',marginVertical:10}}>Please sign in to identify your account</Text>
                  </View>
                  <View style={{width:width*0.85,alignSelf:'center',marginVertical:0}}>
                      <CustomInput
                          label={'Phone Number'}
                          placeholder='Phone Number'
                          onChangeText={this.handleInput}
                          keyboardType={'email-address'}
                          error={error}
                          focus={focus}
                          name={'phone'}
                          value={values.phone}
                      />
                      <CustomInput
                          label={'Password'}
                          placeholder='Password'
                          onChangeText={this.handleInput}
                          name={'password'}
                          keyboardType={'default'}
                          secure
                          error={error}
                          focus={focus}
                          value={values.cpassword}
                      />
                      <View style={{width:'95%',marginTop:0,alignSelf:'center',flexDirection:'row'}}>
                          <View style={{width:'50%',flexDirection:'row'}}>
                              {/*<Text style={{color:'#7F838D'}}>Sign up later? </Text>*/}
                              {/*<TouchableOpacity onPress={()=>this.handleNext()}>*/}
                              {/*<Text style={{color:Colors.textColor}}>Skip</Text>*/}
                              {/*</TouchableOpacity>*/}
                          </View>
                          <View style={{width:'50%',alignItems:'flex-end'}}>
                              <TouchableOpacity>
                              <Text style={{color:Colors.textColor}}>Forgot Password?</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                      <Button
                          title={'Sign In'}
                          disabled={error!=undefined}
                          onPress={this.handleLogin}
                          titleStyle={{fontSize:RFPercentage(3)}}
                          buttonStyle={{width:width*0.8,borderRadius:5,marginTop:20,height:RFPercentage(7)
                              ,backgroundColor:Colors.textColor,alignSelf:'center'}}
                      />
                  </View>
              </Animated.View>
          </TouchableOpacity>
            <View style={{width:width,height:height*0.25,alignItems:'center',justifyContent:'flex-end'}}>
                <Animated.View
                    style={[
                        {  alignItems:'center',
                            opacity: this.state.fadeAnimation1
                        }
                    ]}
                >
                    <View style={{width:width*0.8,alignSelf:'center',marginVertical:0}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('./img/left.png')}/>
                            <Text style={{color:'#7F838D',paddingHorizontal:15}}>Sign In With</Text>
                            <Image source={require('./img/right.png')}/>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Button
                                title={'FACEBOOK'}
                                onPress={this.onFacebookButtonPress}
                                titleStyle={{fontSize:15,marginRight:20}}
                                icon={<View style={{alignItems:'center',width:'20%',marginRight:5,borderRightWidth:1,borderRightColor:'rgba(255,255,255,0.62)'}}>
                                    <Icons name={'facebook'} color={'#fff'} size={18}/>
                                </View>}
                                buttonStyle={{paddingVertical:13,width:(width*0.8)*0.48,borderRadius:10,marginTop:20
                                    ,backgroundColor:'#3A5897',alignSelf:'center'}}
                            />
                            <View style={{width:(width*0.8)*0.04}}/>
                            <Button
                                title={'GOOGLE'}
                                onPress={this.onGoogleButtonPress}
                                titleStyle={{fontSize:15,marginRight:20}}
                                icon={<View style={{alignItems:'center',width:'20%',marginRight:5,borderRightWidth:1,borderRightColor:'rgba(255,255,255,0.62)'}}>
                                    <Icons name={'google'} color={'#fff'} size={18}/>
                                </View>}
                                buttonStyle={{paddingVertical:13,width:(width*0.8)*0.48,borderRadius:10,marginTop:20
                                    ,backgroundColor:'#C4372C',alignSelf:'center'}}
                            />

                        </View>

                        <View style={{width:'100%',flexDirection:'row',marginTop:30,justifyContent:'center'}}>
                            <Text style={{color:'#7F838D'}}>Don't have an account? </Text>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signup',{profileType:params&&params.profileType?params.profileType:'1'})}>
                                <Text style={{color:'#1582F4'}}>Sign up now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Animated.View>
            </View>
          {/*<TouchableOpacity onPress={()=>this.props.navigation.navigate('RootBottomTab')}>*/}
          {/*  <Text>Get Start</Text>*/}
          {/*</TouchableOpacity>*/}
            </ImageBackground>
    );
  }
}
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        user: state.user.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
