import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ScrollView, Alert, ImageBackground, ActivityIndicator,
} from 'react-native';
import assets from '../../assets'
import { Button,Input } from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import CustomInput from '../../components/customInput';
import schama from './validator';
import Api from '../../api/User';
import {connect} from 'react-redux';
import {setLoading} from '../../redux/actions/loading';
import * as Keychain from "react-native-keychain";
import {setUser} from '../../redux/actions/user';
import Request from '../../utils/Request';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Warning} from '../../components/Dialog';
import {setSetting} from '../../redux/actions/setting';
import {Colors} from '../../utils/config';
import {FullIndicator} from '../../components/customIndicator';
const validate = require("validate.js");
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            fadeAnimation: new Animated.Value(0),
            fadeAnimation1: new Animated.Value(0),
            loading:false,
            confirm:false,
            values:{
                firstname:'',
                lastname:'',
                email:'',
                location:'',
                phone:'',
                password:'',
                cpassword:'',
            },
            focus:{
                firstname:false,
                lastname:false,
                email:false,
                location:false,
                phone:false,
                password:false,
                cpassword:false,
            },
            error:[],
        }
    }
    componentDidMount(): void {
        this.fadeIn()
        this.fadeIn1()
        // this.props.navigation.navigate('Otp')
        // this.handleTest()
    }
    handleTest=()=>{
        Request.GetToken('086999580','11111111').then((rs) => {
            if(rs.status)
            {
                Keychain.setGenericPassword(JSON.stringify(rs.data), rs.data.token)
                Api.CheckUser().then((r) => {
                    if(r.status){
                        Keychain.setGenericPassword(JSON.stringify(r.data), rs.data.token)
                        this.props.setUser(r.data)
                        const {setting}=this.props;
                        setting.isAgent=r.data.userType=='1'?false:true;
                        this.props.setSetting(setting)
                        this.props.navigation.replace('Otp',{signin:true,phone:'',userId:r.data.id})
                    }else{
                        this.setState({loading:false})
                    }
                })
            }else{
                Alert.alert('Warning',"Login Failed")
                this.setState({loading:false})
            }
        })
    }
    handleNext=(index,value)=>{
            this.props.navigation.navigate('ChooseCategory')
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

    handleSignup=async ()=>{
        const { params } = this.props.route;
        const {values} = this.state
        this.setState({loading:true})
        await Api.Signup(values,params.profileType).then((rs) => {
            if(rs.status){
                Request.GetToken(values.phone,values.password).then((rs) => {
                    if(rs.status)
                    {
                        Keychain.setGenericPassword(JSON.stringify(rs.data), rs.data.token)
                        Api.CheckUser().then((r) => {
                            if(r.status){
                                Keychain.setGenericPassword(JSON.stringify(r.data), rs.data.token)
                                this.props.setUser(r.data)
                                const {setting}=this.props;
                                setting.isAgent=r.data.userType=='1'?false:true;
                                this.props.setSetting(setting)
                                this.props.navigation.replace('Otp',{signin:true,phone:values.phone,userId:r.data.id})
                            }else{
                                this.setState({loading:false})
                            }
                        })
                    }else{
                        Alert.alert('Warning',"Login Failed")
                        this.setState({loading:false})
                    }
                })
            }
        })
        this.setState({loading:false})
    }
    hancleCheckPhone=async ()=>{
        const { params } = this.props.route;
        const {values} = this.state

              await Api.GetList("/api/User/check-exist-phone?phone="+values.phone).then((rs) => {

                    if(rs.status)
                    {
                        if(rs.data){
                            this.setState({confirm:true})
                        }else{
                            this.handleSignup()
                        }
                    }
                })
    }
    render() {
        const {focus,values,error,loading,confirm} = this.state
    return (
        <>
        <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>

        <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <ScrollView style={{flex:1}}>

            <View style={{width:width,height:height,alignItems:'center',justifyContent:'center'}}>
                <View style={{width:width*0.8,marginTop:20,alignSelf:'center',justifyContent:'center'}}>

                          <Text style={{fontSize:RFPercentage(3.5),color:'#202326'}}>Sign Up</Text>
                      <Text style={{fontSize:RFPercentage(2),color:'#7F838D',marginVertical:10}}>Please Signup to create new account</Text>
                  </View>

                <View style={{width:width*0.85,alignSelf:'center',marginVertical:20}}>
                      <CustomInput
                          label={'First Name'}
                          placeholder='First Name'
                          onChangeText={this.handleInput}
                          name={'firstname'}
                          error={error}
                          focus={focus}
                          value={values.firstname}
                      />
                    <CustomInput
                        label={'Last Name'}
                        placeholder='Last Name'
                        onChangeText={this.handleInput}
                        name={'lastname'}
                        error={error}
                        focus={focus}
                        value={values.lastname}
                    />
                      <CustomInput
                          label={'Phone Number'}
                          placeholder='Phone Number'
                          onChangeText={this.handleInput}
                          name={'phone'}
                          error={error}
                          focus={focus}
                          value={values.phone}
                      />
                      <CustomInput
                          label={'Email'}
                          placeholder='Email'
                          onChangeText={this.handleInput}
                          name={'email'}
                          error={error}
                          focus={focus}
                          value={values.email}
                      />

                      <CustomInput
                          label={'Password'}
                          placeholder='Password'
                          onChangeText={this.handleInput}
                          name={'password'}
                          error={error}
                          focus={focus}
                          secure
                          value={values.password}
                      />
                      <CustomInput
                          label={'Confirm Password'}
                          placeholder='Confirm Password'
                          onChangeText={this.handleInput}
                          name={'cpassword'}
                          error={error}
                          focus={focus}
                          secure
                          value={values.cpassword}
                      />
                      {/*<CustomInput*/}
                      {/*    label={'Location'}*/}
                      {/*    placeholder='Confirm Password'*/}
                      {/*    onChangeText={this.handleInput}*/}
                      {/*    name={'location'}*/}
                      {/*    location*/}
                      {/*    value={values.location}*/}
                      {/*/>*/}
                      <Button
                          title={'Sign up'}
                          disabled={error!=undefined}
                          loading={loading}
                          onPress={this.hancleCheckPhone}
                          titleStyle={{fontSize:RFPercentage(3)}}
                          buttonStyle={{height:RFPercentage(7),width:width*0.8,borderRadius:10,marginTop:20
                              ,backgroundColor:Colors.textColor,alignSelf:'center'}}
                      />
                      <View style={{width:'100%',flexDirection:'row',marginTop:30,justifyContent:'center'}}>
                          <Text style={{color:'#7F838D',fontSize:RFPercentage(2)}}>Already onboard? </Text>
                          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signin')}>
                              <Text style={{color:'#1582F4',fontSize:RFPercentage(2)}}>Sign in</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

          </View>
            </ScrollView>
            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={0}/>
            {confirm&&<Warning handleClose={()=>this.setState({confirm:false})} btn={'Close'} handleConfirm={this.handleConfirm} title={'Warning!'} subtitle={'This phone number already existing'} visible={confirm}/>}
        </ImageBackground>
            {loading&&<FullIndicator/>}
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

export default connect(mapStateToProps, mapDispatchToProps)(Index)
