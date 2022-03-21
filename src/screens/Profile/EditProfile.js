import React, { Component } from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Text,
    Modal,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions,
    FlatList,
    ActivityIndicator, Alert, Keyboard, Switch,
} from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts} from '../../utils/config';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import * as Keychain from "react-native-keychain";
import User from '../../api/User';
import Api from '../../api/User';
import {RFPercentage} from 'react-native-responsive-fontsize';
import schama from './validatorEdit';
import {Button,CheckBox} from 'react-native-elements';
import CustomPicker from '../../components/customPicker';
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
                dob:new Date(),
                gender:'F'
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
            enableScroll:false
        }
    }
    async componentDidMount(): void {
        this.fadeIn()
        this.fadeIn1()
        const {user} = this.props.route.params;
        const ns = this.state
        ns.values.firstName=user.firstName;
        ns.values.lastName=user.lastName;
        ns.values.email=user.email;
        ns.values.dob=user.dob?new Date(user.dob):new Date();
        ns.values.gender=user.gender;
        ns.values.address=user.address;
        await this.setState(ns);
        this.checkValidate();
    }
    checkValidate=async ()=>{
        const newState={... this.state}
        const err = await validate(newState.values, schama);
        newState.error=err
        this.setState(newState)

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
    handleInput=async (f,v)=>{
        const newState={... this.state}
        newState.values[f]=v;
        newState.focus[f]=true;
        const err = await validate(newState.values, schama);
        newState.error=err
        this.setState(newState)

    }
    handleFocus=(val)=>{
        this.setState({enableScroll:val})
    }
    handleUpdate=async ()=>{
        const {values} = this.state;
        const {user} = this.props.route.params;
        this.setState({showPin:false,loading:true})
        const body={
            "firstName": values.firstName,
            "lastName": values.lastName,
            "email": values.email,
            "address": values.address,
            "dob": values.dob,
            "phone": user.phone,
            "username": user.username,
            "password": '123456',
            "gender": values.gender}
        await User.Post("/api/User/change-user", JSON.stringify(body)).then((rs) => {
        }).catch((e) => {
            console.log(e)
        })
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        await User.CheckUser().then((rs) => {
            if(rs.status){
                this.props.setUser(rs.data)
                Keychain.setGenericPassword(JSON.stringify(rs.data), token)
                this.props.navigation.goBack();
            }
        })
        this.setState({loading:false})
    }
    render() {
        const {focus,values,error,loading,enableScroll} = this.state
        const data={error,focus,values}
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                        style={{width:'95%',marginTop:RFPercentage(5),alignItems:'center',flexDirection:'row'}}>
                        <Icons name={'chevron-left'} size={30} color={'#fff'}/>
                        <Text style={{fontSize:RFPercentage(3),color:'#fff',fontFamily:Fonts.primary}}>Edit Profile</Text>

                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{width:width*0.95,marginTop:20,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>
                        <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={10} enabled={enableScroll}>
                            <View style={{width:'100%',borderRadius:20,backgroundColor:'#fff'}}>
                        <View style={{width:width*0.85,alignSelf:'center',marginVertical:10,}}>
                            <CustomPicker required handleInput={this.handleInput} input label={'First name'} title={"First Name"} name={'firstName'} value={data}/>
                            <CustomPicker required handleInput={this.handleInput} input label={'Last name'} title={"Last Name"} name={'lastName'} value={data}/>
                            <CustomPicker required handleInput={this.handleInput} input label={'Email'} title={"Email"} name={'email'} value={data}/>
                            <Text style={{fontSize: RFPercentage(2.2), color: Colors.textColor,width:'85%',fontFamily:Fonts.primary}}>Gender</Text>
                            <View style={{flexDirection:'row',marginTop:5}}>
                                <CheckBox
                                    center
                                    title={'Female'}
                                    onPress={()=>this.handleInput('gender','F')}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    containerStyle={{backgroundColor:'transparent',borderWidth:0,padding:1}}
                                    checked={values.gender==='F'}
                                />
                                <CheckBox
                                    center
                                    title='Male'
                                    onPress={()=>this.handleInput('gender','M')}
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    containerStyle={{backgroundColor:'transparent',borderWidth:0,padding:1}}
                                    checked={values.gender==='M'}
                                />
                            </View>
                            <CustomPicker subDate choosedate date handleInput={this.handleInput} label={"Date of birth"} title={"Pick up date"} name={'dob'} value={data}/>
                            <CustomPicker onFocus={this.handleFocus} textarea={false} handleInput={this.handleInput} input label={'Address'} title={'Address'} name={'address'} value={data}/>

                            <Button
                                title={'Update'}
                                disabled={error!=undefined}
                                loading={loading}
                                onPress={this.handleUpdate}
                                titleStyle={{fontSize:RFPercentage(3)}}
                                buttonStyle={{height:RFPercentage(7),width:width*0.8,borderRadius:10,marginTop:20
                                    ,backgroundColor:Colors.textColor,alignSelf:'center'}}
                            />

                        </View>
                            </View>
                        </KeyboardAvoidingView>

                        </TouchableOpacity>
                </View>
                <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    textStyle:{
        color:'#5e5e5e',
        fontSize:13,
        marginTop:2
    },
    cardItem:{
        width:'90%',height:height*0.1,backgroundColor:'#fff',borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection:'row',
        elevation: 5,
        marginVertical: 10,
    }
});
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
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
