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
    ScrollView,
    Dimensions,
    FlatList,
    ActivityIndicator, Alert, TextInput, Keyboard, KeyboardAvoidingView,
} from 'react-native';
import {Colors} from '../../utils/config'
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import { CheckBox } from 'react-native-elements'

import {connect} from 'react-redux';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {HeaderText} from '../../components/Header';
import User from '../../api/User';
import * as Keychain from "react-native-keychain";
import CustomPicker from '../../components/customPicker';
import schama from './validator';
import {Confirm} from '../../components/Dialog';
const {width,height} = Dimensions.get('window')
const validate = require("validate.js");
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading:false,
            text:props.user.about,
            confirm:false,
            values:{
                id:0,
                userId:props.user.id,
                jobTitle:'',
                startDate:new Date(),
                endDate:new Date(),
                isTillNow:false,
                description:'',
                companyName:''
            },
            focus:{
                startDate:false,
                endDate:false,
                isTillNow:false,
                description:false,
                companyName:false
            },
            error:[]
        }
    }
    async componentDidMount(): void {
        const {params} = this.props.route;
        if(!params.add){
            const newState={... this.state}
            newState.values=params.item;
            delete newState.values.user;
            const err = await validate(newState.values, schama);
            newState.error=err
            this.setState(newState)
        }
    }
    handleDelete=async ()=>{
        this.setState({confirm:false,loading:true})
        const {values} = this.state;
        const url="/api/Experience/"+values.id;
        await User.Delete(url)
        this.props.navigation.goBack();
        this.setState({loading:false})
    }
    handleUpdate=async ()=>{
        const {params} = this.props.route;
        const {values} = this.state;
        this.setState({showPin:false,loading:true})
        const url=params.add?"/api/Experience":"/api/Experience/"+values.id;
        await User[params.add?"Post":"Put"](url, JSON.stringify(values))
        this.props.navigation.goBack();
        this.setState({loading:false})
    }
    handleInput=async (f,v)=>{
        const newState={... this.state}
        newState.values[f]=v;
        newState.focus[f]=true;
        const err = await validate(newState.values, schama);
        newState.error=err
        this.setState(newState)

    }
    render() {
        const {loading,confirm} = this.state
        const {user} = this.props;
        const {error,focus,values} = this.state
        const data={error,focus,values}
        const {params } = this.props.route
        console.log(data)
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#edeff2' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={params.add?"Add Experience":"Edit Experience"} handleBack={()=>this.props.navigation.goBack()} rightIcon={''} handleRight={()=>console.log('true')}/>
                    <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>

                    <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1} style={{width:width*0.95,marginTop:20,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>
                        <View style={{width:'90%',alignSelf:'center',marginTop:20}}>
                            <CustomPicker required handleInput={this.handleInput} input label={'Job Title'} title={'Job Title'} name={'jobTitle'} value={data}/>
                            <CustomPicker required handleInput={this.handleInput} input label={'Company Name'} title={'Company Name'} name={'companyName'} value={data}/>
                            <CheckBox
                                title='I am working in current company'
                                textStyle={{right:10,fontWeight:'normal'}}
                                onPress={()=>this.handleInput('isTillNow',!values.isTillNow)}
                                containerStyle={{padding:0,right:RFPercentage(1.5),backgroundColor:'none',borderWidth:0}}
                                checked={values.isTillNow}
                            />
                            <CustomPicker required subDate date handleInput={this.handleInput} label={'Start Date'} title={'Choose Date'} name={'startDate'} value={data}/>
                            {!values.isTillNow&&<CustomPicker required subDate date handleInput={this.handleInput} label={'End Date'} title={'Choose Date'} name={'endDate'} value={data}/>}
                            <CustomPicker handleInput={this.handleInput} input label={'Description'} title={'Description'} name={'description'} textarea value={data}/>

                        </View>

                        <View style={{width:width,alignSelf:'center',alignItems:'center',marginTop:20}}>
                            <TouchableOpacity onPress={this.handleUpdate} disabled={error!=undefined}
                                style={{justifyContent:'center',alignItems:'center',width:'70%',height:RFPercentage(7),backgroundColor:error===undefined?Colors.textColor:'rgba(14,154,169,0.33)',borderRadius:10}}>

                                <Text style={{color:'#fff',fontSize:RFPercentage(2.5)}}>{params.add?"Add":"Update"}</Text>

                            </TouchableOpacity>
                        </View>
                            {!params.add&&<View style={{width:width,alignSelf:'center',alignItems:'center',marginTop:20}}>
                                <TouchableOpacity onPress={()=>this.setState({confirm:true})}
                                                  style={{justifyContent:'center',alignItems:'center',width:'70%',height:RFPercentage(7),backgroundColor:'rgba(255,52,69,0.88)',borderRadius:10}}>

                                    <Text style={{color:'#fff',fontSize:RFPercentage(2.5)}}>Delete</Text>

                                </TouchableOpacity>
                            </View>}


                    </TouchableOpacity>
                </ScrollView>
                <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={RFPercentage(0)}/>
                </View>
                <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
            </View>
        {loading&&<View style={{width,height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor}/>
        </View>}
                {confirm&&<Confirm handleClose={()=>this.setState({confirm:false})} handleConfirm={this.handleDelete} title={'Warning'} subtitle={'Are you sure to delete?'} visible={confirm}/>}

            </>
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
    },
    textAreaContainer: {
        borderColor: Colors.textColor,
        borderWidth: 0.5,
        marginTop:10,
        padding: 5,
        width:'100%',
        alignSelf:'center'
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
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
