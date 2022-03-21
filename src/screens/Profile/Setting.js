import React, { Component } from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    Picker,
    View,
    Text,
    Modal,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    Switch,
} from 'react-native';

import {Confirm} from '../../components/Dialog'
import Icon from 'react-native-vector-icons/Feather';
import * as Keychain from "react-native-keychain";
import {BottomSheet,ListItem} from 'react-native-elements'
import Api from '../../api/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, Fonts} from '../../utils/config';
import Icons from 'react-native-vector-icons/MaterialIcons';
import OptionsMenu from 'react-native-option-menu';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {setLoading} from '../../redux/actions/loading';
import {setNotify} from '../../redux/actions/notification';
import {connect} from 'react-redux';
import {setSetting} from '../../redux/actions/setting';
import {setUser} from '../../redux/actions/user';
import Lang from '../../Language';
import DeviceInfo from 'react-native-device-info';
import {checkForPermissions} from '../../components/Permission';
const {width,height} = Dimensions.get('window')
const profileType = [
    { title: 'Task ForceOrganizer' },
    { title: 'Task Force Agent' }
];
const list = [
    {
        title: 'profileType',
        right:'Organizer',
        choose:true,
        icon: 'user',
        subtitle: 'Vice President'
    },
    {
        title: 'notification',
        right:'',
        icon: 'bell',
        switch:true,
        subtitle: 'Vice Chairman'
    },
    {
        title: 'wallet',
        right:'',
        icon: 'dollar-sign',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'language',
        right:'English',
        choose:true,
        icon: 'globe',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'face',
        right:'',
        switch:true,
        icons:true,
        icon: 'fingerprint',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'cpin',
        right:'',
        icon: 'lock',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'mycategory',
        right:'',
        icon: 'box',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'scontact',
        right:'',
        switch:true,
        icon: 'shield',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'contact',
        right:'',
        icon: 'phone',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'tc',
        right:'',
        icon: 'file-text',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'logout',
        red:true,
        right:'',
        icon: 'log-out',
        subtitle: 'Vice Chairman'
    },
]
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            switches:{
                1:true,
                4:props.setting.touchId,
                7:props.user.isShowPrivacy
            },
            logout:false,
            notification:false,
            data:list,
            isVisible:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        if(Platform.OS=='ios') this.handleCheckPermission();
        setTimeout(()=>{
            // this.fadeIn();
            this.setState({loading: false})
        }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }

    handleNext=()=>{
        this.props.navigation.navigate('Signin')
    }
    handleSelect=(i)=>{
        switch(i) {
            case 10:
                this.setState({logout:true})
                break;
            case 6:
                this.props.NextScreen("ChooseCategory",{userId:this.props.user.id});
                break;
            case 9:
                this.props.NextScreen("TermCondition",{userId:this.props.user.id});
                break;
            case 8:
                this.props.NextScreen("ContactUs");
                break;
            case 5:
                this.props.NextScreen("ChangePin");
                break;
            case 2:
                // code block
                this.props.NextScreen("MyMoney",{face:this.state.switches[4]});
                break;
            default:
            // code block
        }
    }
    handleConfirm=async ()=>{
        this.setState({logout:false})
        await Keychain.resetGenericPassword();
        this.props.navigation.replace('Signin')
    }
    handleLang=(lan)=>{
        this.props.handleLang(lan)
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    handleProfileType=(i)=>{
        this.setState({isVisible:false})
        this.props.handleProfileType(i)
    }
    handleSwitch=async (index)=>{
        const newState={... this.state}
        const value=newState.switches[index]
        newState.switches[index]=index==4?value?!value:false:!value
        this.setState(newState)
        switch(index) {
            case 4:
                if (!value) {
                    if (Platform.OS == 'ios') {
                        await checkForPermissions(true, 'faceID').then((status) => {
                            newState.switches[index] = status;
                            this.setState(newState);
                        });
                    } else {
                        newState.switches[index] = !value;
                        this.setState(newState);
                    }
                }
                const {setting} = this.props;
                setting.touchId = newState.switches[index];
                this.props.setSetting(setting);
                AsyncStorage.setItem('setting', JSON.stringify(setting));
                break;
            case 7:
                Api.ChangePrivacy({}).then((rs) => {
                   if(rs.status){
                       const {user} = this.props;
                       user.isShowPrivacy=newState.switches[index];
                       this.props.setUser(user)
                   }
                });
                break;
            default:
            // code block
        }
    }
    handleCheckPermission=async ()=>{
        await checkForPermissions(false,'faceID').then((status) => {
            const ns = {... this.state}
            ns.switches[4]=status;
            this.setState(ns)
        })
    }
    render() {
        const {map,switches,isVisible,logout} = this.state
        list[0].right=this.props.userType;
        const {lang,isAgent} = this.props;
        return (

            <>
                <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{width:'100%',borderRadius:20,backgroundColor:'#fff',marginTop:10,paddingBottom:0,alignItems:'center',justifyContent:'center'}}>
                            {
                                this.state.data.map((l, i) => (
                                    i==0?
                                        <View style={{width:'100%',flexDirection:'row',borderBottomWidth:0.3,borderColor:'rgba(13,112,217,0.48)',height:RFPercentage(6.3),alignItems:'center'}}>
                                            <View style={{width:'20%',alignItems:'center'}}>
                                                <Icon name={l.icon} size={RFPercentage(3)} color={l.red?'red':Colors.textColor}/>
                                            </View>
                                            <View style={{width:'50%'}}>
                                                <Text style={{fontSize:RFPercentage(2),color:l.red?'red':Colors.textColor,fontFamily:Fonts.primary}}>
                                                    {Lang[lang][l.title]}
                                                </Text>
                                            </View>
                                            <OptionsMenu
                                                customButton={<>
                                                    <View style={{width:'100%',alignItems:'center',flexDirection:'row'}}>
                                                        <Text style={{fontSize:RFPercentage(1.8),fontFamily:Fonts.primary}}>{isAgent?Lang[lang].agent:Lang[lang].torg}</Text>
                                                        {l.choose&&<Icon name={'chevron-down'} size={RFPercentage(2)}/>}
                                                    </View>
                                                </>}
                                                buttonStyle={{width:'20%'}}
                                                destructiveIndex={2}
                                                options={[Lang[lang].torg,Lang[lang].tagent,Lang[lang].close]}
                                                actions={[()=>this.handleProfileType(1),
                                                    ()=>this.handleProfileType(2)]}/>
                                        </View> :i==3?<View style={{width:'100%',flexDirection:'row',borderBottomWidth:0.3,borderColor:'rgba(13,112,217,0.48)',height:RFPercentage(6.3),alignItems:'center'}}>
                                            <View style={{width:'20%',alignItems:'center'}}>
                                                <Icon name={l.icon} size={RFPercentage(3)} color={l.red?'red':Colors.textColor}/>
                                            </View>
                                            <View style={{width:'50%'}}>
                                                <Text style={{fontSize:RFPercentage(2),color:l.red?'red':Colors.textColor,fontFamily:Fonts.primary}}>{Lang[lang][l.title]}</Text>
                                            </View>
                                            <OptionsMenu
                                                customButton={<>
                                                    <View style={{width:'70%',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                                                        <Text style={{fontSize:RFPercentage(1.8),fontFamily:Fonts.primary}}>{lang=='kh'?"ភាសាខ្មែរ":"English"}</Text>
                                                        {l.choose&&<Icon name={'chevron-down'} size={RFPercentage(2)}/>}
                                                    </View>
                                                </>}
                                                buttonStyle={{width:'20%'}}
                                                destructiveIndex={2}
                                                options={["ភាសាខ្មែរ","English",Lang[lang].close]}
                                                actions={[()=>this.handleLang('kh'),
                                                    ()=>this.handleLang('en')]}/>
                                        </View>:
                                    <TouchableOpacity onPress={()=>this.handleSelect(i)} style={{width:'100%',flexDirection:'row',borderBottomWidth:0.3,borderColor:'rgba(13,112,217,0.48)',height:RFPercentage(6.3),alignItems:'center'}}>
                                        <View style={{width:'20%',alignItems:'center'}}>
                                            {l.icons?
                                            <Icons name={l.icon} size={RFPercentage(3)} color={l.red?'red':Colors.textColor}/>:
                                                <Icon name={l.icon} size={RFPercentage(3)} color={l.red?'red':Colors.textColor}/>}
                                        </View>
                                        <View style={{width:'50%'}}>
                                            <Text style={{fontSize:RFPercentage(2),color:l.red?'red':Colors.textColor,fontFamily:Fonts.primary}}>{Lang[lang][l.title]}</Text>
                                        </View>
                                        <View style={{width:'25%',justifyContent:'flex-end',alignItems:'flex-end',flexDirection:'row'}}>
                                            {l.switch?
                                                <Switch
                                                    trackColor={{ false: "#767577", true: "#0D70D9" }}
                                                    thumbColor={"#fff"}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={()=>this.handleSwitch(i)}
                                                    value={switches[i]}
                                                />:
                                            <>
                                            <Text style={{fontSize:RFPercentage(1.8)}}>{l.right}</Text>
                                            {l.choose&&<Icon name={'chevron-down'} size={RFPercentage(2)}/>}
                                            </>}
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                            <View style={{width:'100%',flexDirection:'row'}}>
                                <Text style={{width:'50%'}}>ID: {this.props.user.userNo}</Text>
                                <Text style={{width:'50%',textAlign:'right'}}>V: {DeviceInfo.getVersion()}</Text>
                            </View>
                            <View style={{height:1000/RFPercentage(0.5)}}/>
                        </View>
            </ScrollView>

        <BottomSheet
                    isVisible={isVisible}
                    modalProps={{statusBarTranslucent:true}}
                    containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                    {profileType.map((l, i) => (
                        <ListItem key={i}  onPress={()=>this.handleProfileType(i)} containerStyle={l.containerStyle}>
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </BottomSheet>
                {logout&&<Confirm handleClose={()=>this.setState({logout:false})} handleConfirm={this.handleConfirm} title={'Warning'} subtitle={'Are you sure to logout?'} visible={logout}/>}
                </>
        );
    }
}
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        setting: state.setting.setting,
        user: state.user.user,
        notify: state.notify.notify,
        focus: state.focus.focus,
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
        setNotify: (notify) => {
            dispatch(setNotify(notify))
        },
        setSetting: (data) => {
            dispatch(setSetting(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
