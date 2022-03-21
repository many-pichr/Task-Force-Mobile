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
    ScrollView, ImageBackground, ActivityIndicator,
} from 'react-native';
import assets from '../../assets'
import { Button,Input } from 'react-native-elements';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import schama from './validator';
import Api from '../../api/User';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
import {setSetting} from '../../redux/actions/setting';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../utils/config';
import CustomInput from '../../components/customInput';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {FullIndicator} from '../../components/customIndicator';
const validate = require("validate.js");
const {width,height} = Dimensions.get('window')

function fontSizer (screenWidth) {
    if(screenWidth > 400){
        return 18;
    }else if(screenWidth > 250){
        return 23;
    }else {
        return 12;
    }
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            code:'',
            status:'',
            loading:false,
            error:null,
            values:{
                password:'',
                cpassword:''
            },
            focus:{
                password:false,
                cpassword:false
            }

        }
    }
    componentDidMount(){
        const { params } = this.props.route;
    }
    handleVerify=async ()=>{
        const {user,values} = this.state;
        const { params } = this.props.route;
        this.setState({loading:true})
        const body={
            "phone":params.phone,
            "otp":params.code,
            "password":values.password
        }
        await Api.PostGuest("/api/User/reset-password",body).then((rs) => {
            if(rs.status&&rs.data){
                this.props.navigation.goBack();
            }else{
                Alert.alert("Error","Reset Password Failed!")
            }
        })
        this.setState({loading:false})
    }

    handleNext=(index,value)=>{
            this.props.navigation.navigate('ChooseCategory')
    }
    handleInput=async (v,f)=>{
        const newState={... this.state}
        newState.values[f] = v;
        newState.focus[f] = true;
        const err = await validate(newState.values, schama);
        newState.error=err
        this.setState(newState)
    }
    handleInputFull=(code)=>{
        this.setState({status:true,code:code})
    }
    handleBtnValidate(){
        // const {focus,loading,values,error} = this.state;
        // let status=false;
        // if((focus.password&&values.password!="")&&(focus.cpassword&&values.cpassword!="")&&values.password==values.cpassword){
        //     status=true;
        // }else{
        //     status=false;
        // }
        return true;
    }
    render() {
        const {focus,loading,values,error} = this.state;
        const { params } = this.props.route;
    return (
        <>
        <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <ScrollView style={{flex:1}}>

            <View style={{width:width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                {params.forgot&&
                <View style={{width:'80%'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                                      style={{width:50,height:50,marginVertical:50,backgroundColor:Colors.primary,justifyContent:'center',alignItems:'center',borderRadius:25}}>
                        <Icons name={'arrow-back'} size={30} color={'#fff'}/>
                    </TouchableOpacity>
                </View>}
                <View style={{width:width*0.8,marginTop:20,alignSelf:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:25,color:'#202326',marginTop:0}}>New Password</Text>
                      <Text style={{fontSize:15,color:'#7F838D',marginVertical:10}}>Please enter the new password</Text>
                  </View>

                <View style={{width:width*0.85,alignSelf:'center',marginVertical:20}}>
                    <CustomInput
                        label={'Password'}
                        placeholder='New Password'
                        onChangeText={this.handleInput}
                        name={'password'}
                        error={error}
                        focus={focus}
                        secure
                        value={values.password}
                    />
                    <CustomInput
                        label={'Confirm Password'}
                        placeholder='Confirm New Password'
                        onChangeText={this.handleInput}
                        name={'cpassword'}
                        error={error}
                        focus={focus}
                        secure
                        value={values.cpassword}
                    />
                      <Button
                          title={'Update Password'}
                          disabled={!(error&&!error.password&&!error.cpassword)}
                          onPress={this.handleVerify}
                          titleStyle={{fontSize:RFPercentage(2)}}
                          buttonStyle={{paddingVertical:12,width:width*0.8,borderRadius:10,marginTop:20
                              ,backgroundColor:Colors.textColor,alignSelf:'center'}}
                      />

                  </View>

          </View>

    {/*<TouchableOpacity onPress={()=>this.props.navigation.navigate('RootBottomTab')}>*/}
          {/*  <Text>Get Start</Text>*/}
          {/*</TouchableOpacity>*/}
            </ScrollView>
        </ImageBackground>
            {loading&&<FullIndicator/>}
        </>
    );
  }
}
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        setting: state.setting.setting,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setSetting: (data) => {
            dispatch(setSetting(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
