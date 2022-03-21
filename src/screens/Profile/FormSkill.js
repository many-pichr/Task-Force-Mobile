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
    ActivityIndicator, Alert, TextInput, Keyboard, KeyboardAvoidingView, RefreshControl,
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
import schama from './validatorEducation';
import {Confirm} from '../../components/Dialog';
import Icon from 'react-native-vector-icons/Feather';
import {ItemComplete} from '../../components/Items';
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
                subject:'',
                startDate:new Date(),
                endDate:new Date(),
                isTillNow:false,
                description:'',
                schoolName:''
            },
            focus:{
                subject:false,
                startDate:false,
                endDate:false,
                isTillNow:false,
                description:false,
                schoolName:false
            },
            error:[],
            skills:[]
        }
    }
    async componentDidMount(): void {
        const {params} = this.props.route;
        if(!params.add){
            const newState={... this.state}
            newState.values=params.item;
            const err = await validate(newState.values, schama);
            newState.error=err
            this.setState(newState)
        }
        this.handleGetPost()
    }
    handleGetPost=async (refreshing)=>{
        const {params} = this.props.route;
        await User.GetList('/api/Skill/Mobile').then((rs) => {
            if(rs.status){
                const items=[];
                for(var i=0;i<rs.data.length;i++){
                    const item=rs.data[i];
                    if(params.item.some(ite => ite.skillId === item.id)){
                        item.checked=true;
                        items.push(item)
                    }else{
                        item.checked=false;
                        items.push(item)
                    }
                }
                this.setState({skills:items})
            }
        })

    }
    handleDelete=async ()=>{
        this.setState({confirm:false,loading:true})
        const {values} = this.state;
        const url="/api/UserSkill/"+values.id;
        await User.Delete(url)
        this.props.navigation.goBack();
        this.setState({loading:false})
    }
    handleUpdate=async ()=>{
        const {user} = this.props;
        const {params} = this.props.route;
        const {skills} = this.state
        this.setState({loading:true})
        for(var i=0;i<skills.length;i++){
            const item=skills[i]
            if(params.item.some(ite => ite.skillId === item.id)){
                await Object.keys(params.item).forEach(function(key) {
                    if (params.item[key].skillId ==item.id) {
                        if(!item.checked){
                            const url="/api/UserSkill/"+params.item[key].id;
                            User.Delete(url)
                        }
                    }
                });
            }else{
                if(item.checked){
                    const url="/api/UserSkill";
                    const body={
                        "id": 0,
                        "userId": user.id,
                        "skillId": item.id,
                    }
                    User.Post(url, JSON.stringify(body))
                }
            }

        }
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
    handleCheck=(i,v)=>{
        const {loading,confirm,skills} = this.state
        skills[i].checked=!v;
        this.setState({skills})
    }
    render() {
        const {loading,confirm,skills} = this.state
        const {error,focus,values} = this.state
        const data={error,focus,values}
        const {params } = this.props.route
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#edeff2' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={"Select your Skill"} handleBack={()=>this.props.navigation.goBack()} rightIcon={''} handleRight={()=>console.log('true')}/>
                    <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1} style={{width:width*0.95,marginTop:20,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>
                        <View style={{width:'90%',alignSelf:'center',marginTop:0,maxHeight:'70%'}}>
                            <FlatList
                                contentContainerStyle={{marginTop:10}}
                                data={skills}
                                renderItem={({item,index}) =><TouchableOpacity style={{width:'100%',marginTop:0}} onPress={()=>this.handleCheck(index,item.checked)}>
                                    <View style={{flexDirection:'row',width:'100%',alignSelf:'center'}}>
                                        <View style={{width:'15%',height:40,justifyContent:'center'}}>
                                            <View style={{width:40,borderRadius:20,height:40,justifyContent:'center',alignItems:'center'}}>
                                                <CheckBox
                                                    textStyle={{fontWeight:'normal'}}
                                                    onPress={()=>this.handleCheck(index,item.checked)}
                                                    containerStyle={{padding:0,backgroundColor:'none',borderWidth:0}}
                                                    checked={item.checked}
                                                />
                                            </View>
                                        </View>
                                        <View style={{width:'80%',height:40,justifyContent:'center'}}>
                                            <Text style={{fontSize:RFPercentage(2)}}>{item.name}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />

                        </View>
                        <View style={{width:width,alignSelf:'center',alignItems:'center',marginTop:20}}>
                            <TouchableOpacity onPress={this.handleUpdate}
                                              style={{justifyContent:'center',alignItems:'center',width:'70%',height:RFPercentage(7),backgroundColor:Colors.textColor,borderRadius:10}}>

                                <Text style={{color:'#fff',fontSize:RFPercentage(2.5)}}>{"Update"}</Text>

                            </TouchableOpacity>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={RFPercentage(3)}/>

                    </TouchableOpacity>

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
