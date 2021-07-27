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
    ScrollView, ImageBackground,
} from 'react-native';
import assets from '../../assets'
import { Button,Input } from 'react-native-elements';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import schama from './validator';
import Api from '../../api/User';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
import {setSetting} from '../../redux/actions/setting';
import {Colors} from '../../utils/config';
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
        }
    }
    componentDidMount(): void {
        this.props.set(false)
    }

    handleNext=(index,value)=>{
            this.props.navigation.navigate('ChooseCategory')
    }

    handleSignup=()=>{
        const { params } = this.props.route;
        Api.Signup(this.state.values,params.profileType).then((rs) => {
            console.log(rs)
        })
    }
    handleVerify=async ()=>{
        const { params } = this.props.route;
        this.props.set(true)
        await setTimeout(()=>{
            this.props.set(false)
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
        const {focus,values,error} = this.state
        console.log(error)
    return (

        <ImageBackground source={assets.background} style={{flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <ScrollView style={{flex:1}}>

            <View style={{width:width,height:height*0.8,alignItems:'center',justifyContent:'center'}}>
                <View style={{width:width*0.8,marginTop:20,alignSelf:'center',justifyContent:'center'}}>

                          <Text style={{fontSize:25,color:'#202326'}}>Verify OTP</Text>
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
                          onPress={this.handleVerify}
                          titleStyle={{fontSize:20}}
                          buttonStyle={{paddingVertical:10,width:width*0.8,borderRadius:10,marginTop:20
                              ,backgroundColor:Colors.textColor,alignSelf:'center'}}
                      />
                      <View style={{width:'100%',flexDirection:'row',marginTop:30,justifyContent:'center'}}>
                          <Text style={{color:'#7F838D'}}>Not receive otp? </Text>
                          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signin')}>
                              <Text style={{color:'#1582F4'}}>Resend</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

          </View>

    {/*<TouchableOpacity onPress={()=>this.props.navigation.navigate('RootBottomTab')}>*/}
          {/*  <Text>Get Start</Text>*/}
          {/*</TouchableOpacity>*/}
            </ScrollView>
        </ImageBackground>

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
