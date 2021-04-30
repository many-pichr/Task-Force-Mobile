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
import Icons from 'react-native-vector-icons/MaterialIcons';
import OptionsMenu from 'react-native-option-menu';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
const profileType = [
    { title: 'Task ForceOrganizer' },
    { title: 'Task Force Agent' }
];
const list = [
    {
        title: 'Profile Type',
        right:'Organizer',
        choose:true,
        icon: 'user',
        subtitle: 'Vice President'
    },
    {
        title: 'Notification',
        right:'',
        icon: 'bell',
        switch:true,
        subtitle: 'Vice Chairman'
    },
    {
        title: 'My Money',
        right:'',
        icon: 'dollar-sign',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'Language',
        right:'English',
        choose:true,
        icon: 'globe',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'Face & Fingerprint',
        right:'',
        switch:true,
        icons:true,
        icon: 'fingerprint',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'Change Pin',
        right:'',
        icon: 'lock',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'Contact Us',
        right:'',
        icon: 'phone',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'Term & Condition',
        right:'',
        icon: 'file-text',
        subtitle: 'Vice Chairman'
    },
    {
        title: 'Logout',
        red:true,
        right:'',
        icon: 'log-out',
        subtitle: 'Vice Chairman'
    },
]
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            switches:{
                1:true,
                4:false
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
            case 8:
                this.setState({logout:true})
                break;
            case 7:
                this.props.NextScreen("TermCondition");
                break;
            case 6:
                alert("Not yet available")
                break;
            case 5:
                this.props.NextScreen("ChangePin");
                break;
            case 2:
                // code block
                this.props.NextScreen("MyMoney");
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
    handleSwitch=(index)=>{
        const newState={... this.state}
        newState.switches[index]=!newState.switches[index]
        this.setState(newState)
    }
    render() {
        const {map,switches,isVisible,logout} = this.state
        list[0].right=this.props.userType
        return (
            <>
                        <View style={{width:'100%',borderRadius:20,backgroundColor:'#fff',marginTop:10,paddingBottom:100,alignItems:'center',justifyContent:'center'}}>

                            {
                                this.state.data.map((l, i) => (
                                    i==0?
                                        <View style={{width:'100%',flexDirection:'row',borderBottomWidth:0.3,borderColor:'rgba(13,112,217,0.48)',paddingVertical:15,alignItems:'center'}}>
                                            <View style={{width:'20%',alignItems:'center'}}>
                                                <Icon name={l.icon} size={RFPercentage(3)} color={l.red?'red':'#0D70D9'}/>
                                            </View>
                                            <View style={{width:'50%'}}>
                                                <Text style={{fontSize:RFPercentage(2),color:l.red?'red':'#0D70D9'}}>{l.title}</Text>
                                            </View>
                                            <OptionsMenu
                                                customButton={<>
                                                    <View style={{width:'100%',alignItems:'flex-end',flexDirection:'row'}}>
                                                        <Text style={RFPercentage(1.8)}>{l.right}</Text>
                                                        {l.choose&&<Icon name={'chevron-down'} size={RFPercentage(2)}/>}
                                                    </View>
                                                </>}
                                                buttonStyle={{width:'20%'}}
                                                destructiveIndex={2}
                                                options={["Task Force Organizer","Task Force Agent","Close"]}
                                                actions={[()=>this.handleProfileType(1),
                                                    ()=>this.handleProfileType(2)]}/>
                                        </View> :i==3?<View style={{width:'100%',flexDirection:'row',borderBottomWidth:0.3,borderColor:'rgba(13,112,217,0.48)',paddingVertical:15,alignItems:'center'}}>
                                            <View style={{width:'20%',alignItems:'center'}}>
                                                <Icon name={l.icon} size={RFPercentage(3)} color={l.red?'red':'#0D70D9'}/>
                                            </View>
                                            <View style={{width:'50%'}}>
                                                <Text style={{fontSize:RFPercentage(2),color:l.red?'red':'#0D70D9'}}>{l.title}</Text>
                                            </View>
                                            <OptionsMenu
                                                customButton={<>
                                                    <View style={{width:'70%',justifyContent:'center',alignItems:'flex-end',flexDirection:'row'}}>
                                                        <Text style={RFPercentage(1.8)}>{l.right}</Text>
                                                        {l.choose&&<Icon name={'chevron-down'} size={RFPercentage(2)}/>}
                                                    </View>
                                                </>}
                                                buttonStyle={{width:'20%'}}
                                                destructiveIndex={2}
                                                options={["Khmer","English","Close"]}
                                                actions={[()=>alert(true),
                                                    ()=>alert(false)]}/>
                                        </View>:
                                    <TouchableOpacity onPress={()=>this.handleSelect(i)} style={{width:'100%',flexDirection:'row',borderBottomWidth:0.3,borderColor:'rgba(13,112,217,0.48)',paddingVertical:15,alignItems:'center'}}>
                                        <View style={{width:'20%',alignItems:'center'}}>
                                            {l.icons?
                                            <Icons name={l.icon} size={RFPercentage(3)} color={l.red?'red':'#0D70D9'}/>:
                                                <Icon name={l.icon} size={RFPercentage(3)} color={l.red?'red':'#0D70D9'}/>}
                                        </View>
                                        <View style={{width:'50%'}}>
                                            <Text style={{fontSize:RFPercentage(2),color:l.red?'red':'#0D70D9'}}>{l.title}</Text>
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

                        </View>
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
const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    textStyle:{
        color:'#5e5e5e',
        fontSize:13,
        marginTop:2
    },
    container: {
        flex: 1,
        paddingTop: 40,
        alignItems: "center"
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