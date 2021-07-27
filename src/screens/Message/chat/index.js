import React, { Component } from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    View,
    Text,
    Modal,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    SafeAreaView,
} from 'react-native';
import {ListScreen} from '../../../components/ListScreen';
import {CustomItem, ItemFavorite, ItemPost} from '../../../components/Items';
import Icons from 'react-native-vector-icons/Feather';
import {barHight, Colors} from '../../../utils/config';
import CustomPicker from '../../../components/customPicker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import data from '../../Home/data';
import {SvgXml} from 'react-native-svg';
import {map_blue, map_red} from '../../Home/svg';
import {ListItem,Avatar} from 'react-native-elements';
import Chat from './App'
import FastImage from 'react-native-fast-image';
import {RFPercentage} from 'react-native-responsive-fontsize';
import User from '../../../api/User';
const {width,height} = Dimensions.get('window')
const avatarSize=((width*0.9)*0.9)/5
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            loading:true,
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {

        // this.fadeIn()
        // setTimeout(()=>{
        //     // this.fadeIn();
        //     this.setState({loading: false})
        // }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }

    handleNext=()=>{
        this.props.navigation.navigate('Signin')
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    handleSwitch=()=>{
        this.setState({map:!this.state.map})
        this.fadeIn()
    }
    setLocation=(coor)=>{
        const {items} = this.state
        items.push(coor)
        this.setState(items)
    }
    render() {
        const {map,long,lat,data} = this.state
        const {item,user} = this.props.route.params;
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:Colors.primary }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                    <View style={{width:width,alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end',paddingBottom:10}}>
                        <View style={{width:'15%',justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'70%',alignSelf:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:20}}>
                                {item.toUser.firstName} {item.toUser.lastName}
                            </Text>
                        </View>
                        <View style={{width:'15%',justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('ViewUser',{userId:item.toUser.id,view:true})}>
                                <FastImage onLoadEnd={()=>this.setState({imgLoading:false})}
                                           source={item.toUser.profileURL&&item.toUser.profileURL!=''?{uri:item.toUser.profileURL,priority: FastImage.priority.normal,}:require('../../../assets/images/avatar.png')}
                                           resizeMode={FastImage.resizeMode.contain}
                                           style={{width:RFPercentage(5),height:RFPercentage(5),
                                               borderWidth:3,borderColor:'#fff',borderRadius:RFPercentage(12)/2}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width:width,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                        backgroundColor:'#fff',flex:1}}>
                        <Chat item={item} user={user}/>

                    </View>
                </View>
        );
    }
}
const styles = StyleSheet.create({
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
