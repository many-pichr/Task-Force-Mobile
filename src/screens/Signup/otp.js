import React, { Component } from 'react';
import {
    Alert,
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
import {FullIndicator} from '../../components/customIndicator';
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
    exBubble:{width:16,backgroundColor: '#1582F4'},
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#1582F4",
    },
    underlineStyleBase: {
        justifyContent:'center',
        textAlignVertical:'center',
        width: 45,
        height: 45,
        color:Colors.textColor,
        borderWidth: 0,
        borderBottomWidth: 1,
        backgroundColor:'rgb(255,255,255)',
        fontSize:20,borderRadius:5,
        borderColor: "transparent",
    },

    underlineStyleHighLighted: {
        borderColor: Colors.primary,
    },
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
class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            code:'',
            status:'',
            loading:false,
            countDown:60,
            user:{id:0}
        }
    }
    componentDidMount(){
        const { params } = this.props.route;
        this.startTimer();
        if(params.forgot){
            Api.GetGuest("/api/User/forgot-password/"+params.phone).then((rs) => {
                if(rs.status){
                    this.setState({user:rs.data})
                }
            })
        }

    }
    handleVerify=async ()=>{
        const {user,code} = this.state;
        const { params } = this.props.route;
        this.setState({loading:true})
        await Api.PostGuest("/api/User/verified-otp-after-reset",{
            "phone":params.phone,
            "otp":code,
            "password":"str"
        }).then((rs) => {
            if(rs.status&&rs.data){
                this.props.navigation.replace('ResetPassword',{forgot:true,phone:params.phone,code})
            }else{
                Alert.alert("Warning","Invalid OTP")
            }
        })
        this.setState({loading:false})
    }
    handleVerifyAccount=async ()=>{
        const {user,code} = this.state;
        const { params } = this.props.route;
        this.setState({loading:true})
        const body={
            "otp": code,
        }

        await Api.Post('/api/User/confirm-otp',body).then((rs) => {
            if(rs.status&&rs.data){
                this.props.navigation.navigate('RootBottomTab')
            }else{
                Alert.alert("Warning","Invalid OTP")
            }
        })
        this.setState({loading:false})
    }
    TimeCounter () {
        if(this.state.countDown>0){
            this.setState({countDown: (this.state.countDown - 1)})
        }else{
            clearInterval(this.timer)
        }
    }
    startTimer () {
        clearInterval(this.timer)
        this.timer = setInterval(this.TimeCounter.bind(this), 1000)
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    handleNext=(index,value)=>{
            this.props.navigation.navigate('ChooseCategory')
    }
    handleResend=()=>{
        this.setState({countDown:60});
        this.startTimer();
        const { params } = this.props.route;
        this.startTimer();
        Api.GetGuest("/api/User/forgot-password/"+params.phone)
    }
    handleGoHome=async ()=>{
        const { params } = this.props.route;
        this.setState({loading:true})
        await setTimeout(()=>{
            this.setState({loading:false})
            const {setting}=this.props;
            setting.isAgent=params.userType=='1'?false:true;
            this.props.setSetting(setting)
            this.props.navigation.navigate('RootBottomTab')
        }, 1000);
    }
    handleInputFull=(code)=>{
        this.setState({status:true,code:code})
    }
    render() {
        const {focus,loading,countDown} = this.state;
        const { params } = this.props.route;
    return (
        <>
        <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <ScrollView style={{flex:1}}>

            <View style={{width:width,height:height*0.8,alignItems:'center',justifyContent:'center'}}>
                {params.forgot&&
                <View style={{width:'80%'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                                      style={{width:50,height:50,marginVertical:50,backgroundColor:Colors.primary,justifyContent:'center',alignItems:'center',borderRadius:25}}>
                        <Icons name={'arrow-back'} size={30} color={'#fff'}/>
                    </TouchableOpacity>
                </View>}
                <View style={{width:width*0.8,marginTop:20,alignSelf:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:25,color:'#202326',marginTop:0}}>Verify OTP</Text>
                      <Text style={{fontSize:15,color:'#7F838D',marginVertical:10}}>We have sent the opt to your sms</Text>
                  </View>

                <View style={{width:width*0.85,alignSelf:'center',marginVertical:20}}>
                    <OTPInputView
                        style={{width: '100%', height: 50,marginTop: 30}}
                        pinCount={6}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged = {code => { this.setState({code})}}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled = {(code => {this.handleInputFull(code)})}
                    />
                      <Button
                          title={'Verify'}
                          disabled={!(this.state.status&&this.state.code.length==6)}
                          onPress={params.forgot?this.handleVerify:this.handleVerifyAccount}
                          titleStyle={{fontSize:20}}
                          buttonStyle={{paddingVertical:10,width:width*0.8,borderRadius:10,marginTop:20
                              ,backgroundColor:Colors.textColor,alignSelf:'center'}}
                      />
                    <Text style={{color:'#7F838D',marginTop:30,alignSelf:'center'}}>We have sent OTP to {params.phone}</Text>
                      <View style={{width:'100%',flexDirection:'row',marginTop:10,justifyContent:'center'}}>
                          <Text style={{color:'#7F838D'}}>Not receive otp?</Text>
                          <TouchableOpacity disabled={countDown>0} onPress={this.handleResend}>
                              <Text style={{color:'#1582F4'}}> {countDown>0?countDown:"Resend"}</Text>
                          </TouchableOpacity>
                      </View>
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
