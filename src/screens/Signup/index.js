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
    ScrollView, Alert, ImageBackground,
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
import {Waring} from '../../components/Dialog';
const validate = require("validate.js");
const {width,height} = Dimensions.get('window')
const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0
const styles = StyleSheet.create({
    title:{
        textAlign:'justify',marginVertical:10,fontWeight:'bold',fontSize:fontSizer(width),color:'#20354E'
    },
    subTitle:{textAlign:'center',color:'#959595',fontSize:16},
    bubble:{width:8,height:6,borderRadius:4,backgroundColor:'#b9b9b9'},
    bubbleContainer:{width:'33.33%',alignItems:'center'},
    exBubble:{width:16,backgroundColor: '#1582F4'}
});

function fontSizer (screenWidth) {
    if(screenWidth > 400){
        return 18;
    }else if(screenWidth > 250){
        return 23;
    }else {
        return 12;
    }
}
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
        this.props.set(true)
        await Api.Signup(values,params.profileType).then(({status}) => {
            if(status){
                Request.GetToken(values.phone,values.password).then((rs) => {
                    if(rs.status)
                    {
                        this.props.setUser(rs.data)
                        Keychain.setGenericPassword(JSON.stringify(rs.data), rs.data.token)
                        this.props.set(false)
                        this.props.navigation.navigate('Otp',{userType:rs.data.userType})
                    }
                })
            }
        })

    }
    hancleCheckPhone=async ()=>{
        const { params } = this.props.route;
        const {values} = this.state

              await Api.GetList("/api/User/check-exist-phone?phone=0969489714").then((rs) => {
                    alert(JSON.stringify(rs))
                    if(rs.status)
                    {

                    }
                })


    }
    render() {
        const {focus,values,error,loading,confirm} = this.state
    return (

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
                          // disabled={error!=undefined}
                          loading={loading}
                          onPress={this.hancleCheckPhone}
                          titleStyle={{fontSize:RFPercentage(3)}}
                          buttonStyle={{height:RFPercentage(7),width:width*0.8,borderRadius:10,marginTop:20
                              ,backgroundColor:'#1582F4',alignSelf:'center'}}
                      />
                      <View style={{width:'100%',flexDirection:'row',marginTop:30,justifyContent:'center'}}>
                          <Text style={{color:'#7F838D',fontSize:RFPercentage(2)}}>Already onboard? </Text>
                          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signin')}>
                              <Text style={{color:'#1582F4',fontSize:RFPercentage(2)}}>Sign in</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

          </View>

    {/*<TouchableOpacity onPress={()=>this.props.navigation.navigate('RootBottomTab')}>*/}
          {/*  <Text>Get Start</Text>*/}
          {/*</TouchableOpacity>*/}
            </ScrollView>
            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={0}/>
            {confirm&&<Waring handleClose={()=>this.setState({confirm:false})} handleConfirm={this.handleConfirm} title={'Warning!'} subtitle={'Are you sure to submit?'} visible={confirm}/>}
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
