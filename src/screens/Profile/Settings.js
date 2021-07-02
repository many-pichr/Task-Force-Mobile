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
    ActivityIndicator, Alert,
} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemFavorite, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../utils/config'
import Detail from './Detail'
import Setting from './Setting'
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import * as Keychain from "react-native-keychain";
import User from '../../api/User';
import {RFPercentage} from 'react-native-responsive-fontsize';
import * as ImagePicker from 'react-native-image-picker';
import {ImageCroper} from '../../components/ImageCroper';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing/dist/ImageViewing';
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:1,
            imgLoading:true,
            imageUrl:'',
            uri:'',
            viewImage:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        const {user} = this.props;
        this.setState({imageUrl:user.profileURL})
        setTimeout(()=>{
            // this.fadeIn();
            this.setState({loading: false})
        }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    handleTab=(index)=>{
        this.setState({index:index})
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
    handleProfileType=async (i)=>{

        const setting = this.props.setting;
        const data = this.props.user;
        console.log(data)
        if(i.toString()!=data.userType){
            data.userType = i.toString()
            // this.props.setUser(data)
            // Keychain.setGenericPassword(JSON.stringify(data), data.token)
            setting.isAgent = data.userType=='1'?false:true
            this.props.set(true)
            await User.SwitchProfile()
            // this.props.set(false)
            this.props.setSetting(setting)
            this.props.navigation.navigate(data.userType=='1'?'RootBottomTab':'RootBottomTabAgent')
        }

    }
    handleNextScreen=(screen)=>{
        this.props.navigation.navigate(screen)
    }
    handleImagePicker=(type)=>{
        ImagePicker[type](
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 700,
                maxWidth: 700,
            },
            (response) => {
                if(!response.didCancel&&response.uri){
                    this.setState({uri:response.uri})
                }


            },
        )
    }
    handleCrop=async (ref)=>{
        this.setState({imageUrl:ref.uri,uri:'',imgLoading:true})
        let url=''
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        await User.UploadImage(ref.uri).then((rs) => {
            if(rs.status){
                url=rs.data.fileName

            }
        })
        await User.ChangeProfile(url).then((rs) => {
            this.props.setUser(rs.data)
            Keychain.setGenericPassword(JSON.stringify(rs.data), token)
        })
        this.setState({imgLoading:false})

    }
    handlePicker=()=>{
        Alert.alert(
            'Choose Image',
            'Please choose image source',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'Gallery', onPress: () => this.handleImagePicker('launchImageLibrary')},
                {text: 'Camera', onPress: () => this.handleImagePicker('launchCamera')},
            ],
            {cancelable: true},
        );
    }

    render() {
        const {viewImage,uri,imgLoading,imageUrl} = this.state
        const {user} = this.props;
        const {params } = this.props.route
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                        style={{width:'95%',height:80,alignItems:'flex-end',flexDirection:'row'}}>
                        {params&&params.profile&& <>
                        <Icons name={'chevron-left'} size={30} color={'#fff'}/>
                        <Text style={{fontSize:25,color:'#fff'}}>Setting</Text>
                                </>}
                    </TouchableOpacity>
                    <View style={{width:width*0.95,marginTop:20,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>

                        <View style={{position:'absolute',width:RFPercentage(12),height:RFPercentage(12),
                            borderRadius:RFPercentage(12)/2,marginTop:-(RFPercentage(12)/2),alignSelf:'center'}}>
                            <FastImage onLoadEnd={()=>this.setState({imgLoading:false})}
                                       source={imageUrl&&imageUrl!=''?{uri:imageUrl,priority: FastImage.priority.normal,}:require('../../assets/images/avatar.png')}
                                       resizeMode={FastImage.resizeMode.contain}
                                       style={{width:RFPercentage(12),height:RFPercentage(12),
                                           borderWidth:3,borderColor:'#fff',borderRadius:RFPercentage(12)/2}}/>

                            {imgLoading&&<View style={{position:'absolute',width:RFPercentage(12),alignItems:'center',justifyContent:'center',
                                height:RFPercentage(12),borderRadius:RFPercentage(12)/2,backgroundColor:'rgba(0,0,0,0.19)'}}>
                                <ActivityIndicator size={'large'} color={'#fff'}/>
                            </View>}
                        </View>
                        <TouchableOpacity style={{position:'absolute',right:10,top:10,flexDirection:'row',alignItems:'center'}}>
                            <Icons name={'edit'} size={RFPercentage(2)} color={Colors.textColor}/>
                            <Text style={{color:Colors.textColor,fontSize:RFPercentage(2)}}>Edit Profile</Text>
                        </TouchableOpacity>
                        <View style={{position:'absolute',width:RFPercentage(14),height:RFPercentage(12),
                            borderRadius:RFPercentage(12)/2,marginTop:-(RFPercentage(12)/2),alignSelf:'center'}}>
                            <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({viewImage:true})} style={{position:'absolute',width:'100%',height:'100%',alignItems:'flex-end',justifyContent:'center'}}>
                                <TouchableOpacity onPress={this.handlePicker} style={{backgroundColor:'#cecece',padding:5,borderRadius:20}}>
                                    <Icon name={'edit'} size={15}/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop:RFPercentage(5)}}>
                            <Text style={{width:'100%',marginTop:10,textAlign:'center',fontSize:RFPercentage(2.5)}}>
                                {user.lastName} {user.firstName}
                            </Text>
                            <Setting NextScreen={this.handleNextScreen} userType={user.userType=='1'?" Oraganizer":" Agent"} navigation={this.props.navigation} user={user} handleProfileType={this.handleProfileType}/>
                        </View>
                        </View>
                    <ImageView
                        images={[{uri:imageUrl}]}
                        imageIndex={0}
                        visible={viewImage}
                        onRequestClose={() => this.setState({viewImage:false})}
                    />
                    <ImageCroper visible={uri!=''} uri={uri} handleClose={()=>this.setState({uri:''})} handleCrop={this.handleCrop}/>
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
