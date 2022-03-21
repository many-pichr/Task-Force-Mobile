import React, {Component} from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    Dimensions,
    FlatList,
    ActivityIndicator, Alert, Linking,
} from 'react-native';
import ImageView from "react-native-image-viewing";
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import Detail from './Detail';
import Setting from './Setting';
import * as ImagePicker from 'react-native-image-picker';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {connect} from 'react-redux';
import {RFPercentage} from 'react-native-responsive-fontsize';
import User from '../../api/User';
import {ImageCroper} from '../../components/ImageCroper';
import * as Keychain from 'react-native-keychain';
import {Colors, Fonts} from '../../utils/config';
import {TermCondition} from '../../components/Dialog';
import {setSetting} from '../../redux/actions/setting';
import assets from '../../assets';
import Lang from '../../Language';
import OptionsMenu from 'react-native-option-menu';
import {checkForPermissions} from '../../components/Permission';

const {width, height} = Dimensions.get('window');

class Index extends Component {
    constructor(props) {
        const {params} = props.route;
        if (params && params.userId) {
            // props.set(true)
        }
        super(props);
        this.state = {
            index: 1,
            imgLoading: true,
            camera:false,
            loading: params&&params.loading,
            uri: '',
            user: props.user,
            switchProfile: false,
            imageUrl:  props.user.profileURL,
            viewImage: false,
            info: {
                jobsCompleted:0,
                jobsPosted:0,
                avgRate:3
            }
        }
        this.myRef = React.createRef();
        const {user} = props;
        const view = params && params.view ? true : false;
        this._unsubscribe = props.navigation.addListener('focus', (action, state) => {
            if (params && !params.userId) {
                this.setState({user});
            }
            if (params && params.userId) {
                this.handleGetUser(params.userId);
            }
            // if(!view)this.setState({imageUrl: user.profileURL});

            this.handleGetInfo(params&&params.userId?params.userId:user.id);
        });
    }

    componentDidMount(): void {
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    handleGetUser = async (id) => {
        await User.GetList('/api/User/' + id).then((rs) => {
            if (rs.status) {
                this.setState({user: rs.data, imageUrl: rs.data.profileURL,loading:false});
            }
        });
    };
    handleGetInfo = async (id) => {
        await User.Post("/api/User/job-info-by-user/" + id,{}).then((rs) => {
            if (rs.status) {
                this.setState({info: rs.data});

            }
        });
    };
    handleMessage = async () => {
        const {user} = this.props
        const body={
            "id": 0,
            "fromUserId": user.id,
            "toUserId": this.state.user.id,
            "avalta": "",
            "date": new Date(),
            "lastAccess": new Date()
        }
        this.setState({loading:true})
        await User.Post("/api/Chat",body).then((rs) => {
            if(rs.status){
                this.props.navigation.navigate('Chat',{item:rs.data,user:user})
            }
        })

        this.setState({loading:false})
    };
    handleNext = () => {
        this.props.navigation.navigate('Start');
    };
    fadeIn = async () => {
        await this.setState({fadeAnimation: new Animated.Value(0)});
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600,
        }).start();
    };
    handleProfileType=async (i)=>{

        const setting = this.props.setting;
        const data = this.props.user;
        if(i.toString()!=data.userType){
            data.userType = i.toString()
            // this.props.setUser(data)
            // Keychain.setGenericPassword(JSON.stringify(data), data.token)
            setting.isAgent = data.userType=='1'?false:true
            User.SwitchProfile()
            this.props.setSetting(setting)
            this.props.navigation.navigate('Home')
        }

    }
    handleImagePicker = (type) => {
        ImagePicker[type](
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 700,
                maxWidth: 700,
            },
            (response) => {
                if (!response.didCancel) {
                    this.setState({uri: response.uri});
                }


            },
        );
    };
    handleCrop = async (ref) => {
        this.setState({imageUrl: ref.uri, uri: '', imgLoading: true});
        let url = '';
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        await User.UploadImage(ref.uri).then((rs) => {
            if (rs.status) {
                url = rs.data.fileName;

            }
        });
        await User.ChangeProfile(url).then((rs) => {
            this.props.setUser(rs.data);
            Keychain.setGenericPassword(JSON.stringify(rs.data), token);
        });
        this.setState({imgLoading: false});

    };
    handleCheckPermission=async ()=>{
        checkForPermissions(true,'camera').then((status) => {
            this.setState({camera:status})
        })
    }
    handlePicker=()=>{
        const {camera} = this.state;
        if(!camera) {
            // alert(true)
            this.handleCheckPermission()
        }else {
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
    }
    render() {
        const {viewImage,info, imageUrl, uri, imgLoading, user,loading} = this.state;
        const {params} = this.props.route;
        const data = this.props.user;
        const view = params && params.view ? true : false;
        const {lang} = this.props.setting;
        const isOrg=data.userType == '1';
        return (
            <>
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#f5f7fa'}}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex: 1,width:'95%'}}>
                    {view &&
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
                        position: 'absolute',
                        left: 0,
                        top: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Icon name={'chevron-left'} size={RFPercentage(6)} color={'#fff'}/>
                    </TouchableOpacity>}
                    <View style={{
                        width: width * 0.95, alignSelf: 'center', borderRadius: 20, marginBottom: 10,
                        backgroundColor: '#fff', marginTop: Platform.OS == 'ios' ? 80 : 100, paddingBottom: 0,
                    }}>

                        <View style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: '50%'}}>
                                {!view && <OptionsMenu
                                    customButton={<View style={{        marginLeft: 10,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        width: '60%',
                                                                        flexDirection: 'row'
                                                                    }}>
                                        <Image source={isOrg?assets.bag:assets.person}
                                               style={{width:30,height:30}}/>
                                        <Text style={{
                                            color: Colors.textColor,
                                            fontSize: RFPercentage(2),
                                            marginLeft:5,
                                            marginTop:1,
                                            fontFamily:Fonts.primary
                                        }}>{isOrg ? Lang[lang].torg : Lang[lang].agent}</Text>
                                    </View>}
                                    buttonStyle={{width:'20%'}}
                                    destructiveIndex={2}
                                    options={[Lang[lang].torg,Lang[lang].tagent,Lang[lang].close]}
                                    actions={[()=>this.handleProfileType(1),
                                        ()=>this.handleProfileType(2)]}/>}
                            </View>
                            <View style={{width: '48%'}}>
                                {!view &&
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Settings', {profile: true})}
                                    style={{
                                        alignSelf: 'flex-end',
                                        padding: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 5,
                                    }}>
                                    <Icon name={'settings'} size={RFPercentage(3)} color={Colors.textColor}/>
                                </TouchableOpacity>}
                            </View>
                        </View>
                        <View style={{width: '100%'}}>
                            <Text style={{width: '100%', textAlign: 'center', fontSize: RFPercentage(2.5)}}>
                                {user.lastName} {user.firstName}
                            </Text>
                            {/*<Text style={{width:'100%',textAlign:'center',fontSize:RFPercentage(2.5)}}>*/}
                            {/*    UX/UI Designer*/}
                            {/*</Text>*/}
                            <Text style={{width: '100%', textAlign: 'center', fontSize: RFPercentage(2)}}>
                                {user.address}
                            </Text>
                            <View style={{
                                width: '90%',
                                alignSelf: 'center',
                                marginBottom: 3,
                                flexDirection: 'row',

                                alignItems:'center'
                            }}>
                                {isOrg ?
                                <View style={{width: '50%', flexDirection: 'row', alignItems: 'flex-end'}}>
                                    <Icon name={'done-all'} color={Colors.textColor} size={20}/>
                                    <Text style={{color: Colors.textColor,fontSize:RFPercentage(2)}}> {info.jobsPosted} Post</Text>
                                </View>:
                                    <View style={{width: '50%', flexDirection: 'row', alignItems: 'flex-end'}}>
                                        <Icon name={'done-all'} color={Colors.textColor} size={20}/>
                                        <Text style={{color: Colors.textColor,fontSize:RFPercentage(2)}}> {info.jobsCompleted} Done</Text>
                                    </View>}
                                <TouchableOpacity style={{
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                }}>
                                    <View style={{flexDirection: 'row',borderRadius:5, alignItems: 'center',backgroundColor:'rgba(16,189,206,0.18)'}}>
                                    <Icon name={'grade'} color={Colors.textColor} style={{padding: 3}} size={15}/>
                                    <Text style={{color: Colors.textColor,paddingRight:5,fontSize:RFPercentage(2)}}>{info.avgRate}</Text>
                                    </View>
                                    </TouchableOpacity>
                            </View>
                            {user.isShowPrivacy&&<View style={{
                                width: '90%',
                                alignSelf: 'center',
                                borderTopWidth: 0.3,
                                marginBottom: 10,
                                flexDirection: 'row',
                            }}>
                                <View style={{width: '50%', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                                    <Icons name={'mail'} color={Colors.textColor} style={{}}/>
                                    <Text style={{color: Colors.textColor,fontSize:RFPercentage(1.5)}}> {user.email}</Text>
                                </View>
                                <TouchableOpacity onPress={()=>callNumber(user.phone)} style={{
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 5,
                                    justifyContent: 'flex-end',
                                }}>
                                    <Icons name={'phone'} color={Colors.textColor} style={{marginTop: 3}}/>
                                    <Text style={{color: Colors.textColor,fontSize:RFPercentage(1.8)}}> {user.phone}</Text>
                                </TouchableOpacity>
                            </View>}
                        </View>
                        <View style={{
                            position: 'absolute', width: RFPercentage(12), height: RFPercentage(12),
                            borderRadius: RFPercentage(12) / 2, marginTop: -(RFPercentage(12) / 2), alignSelf: 'center',
                        }}>
                            <FastImage onLoadEnd={() => this.setState({imgLoading: false})}
                                       source={imageUrl && imageUrl != '' ? {
                                           uri: imageUrl,
                                           priority: FastImage.priority.normal,
                                       } : require('../../assets/images/avatar.png')}
                                       resizeMode={FastImage.resizeMode.contain}
                                       style={{
                                           width: RFPercentage(12), height: RFPercentage(12),
                                           borderWidth: 3, borderColor: '#fff', borderRadius: RFPercentage(12) / 2,
                                       }}/>

                            {imgLoading && <View style={{
                                position: 'absolute',
                                width: RFPercentage(12),
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: RFPercentage(12),
                                borderRadius: RFPercentage(12) / 2,
                                backgroundColor: 'rgba(0,0,0,0.19)',
                            }}>

                            </View>}

                        </View>
                        <View style={{
                            position: 'absolute', width: RFPercentage(14), height: RFPercentage(12),
                            borderRadius: RFPercentage(12) / 2, marginTop: -(RFPercentage(12) / 2), alignSelf: 'center',
                        }}>
                            <TouchableOpacity disabled={!(imageUrl&&imageUrl!='')} activeOpacity={1} onPress={()=>this.setState({viewImage:true})} style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}>
                                {!view && <TouchableOpacity onPress={this.handlePicker} style={{backgroundColor: '#cecece', padding: 5, borderRadius: 20}}>
                                    <Icon name={'edit'} size={15}/>
                                </TouchableOpacity>}
                            </TouchableOpacity>
                        </View>
                        {view&&<TouchableOpacity onPress={this.handleMessage} style={{position:'absolute',right:20,top:20,paddingVertical:4,paddingHorizontal:5,
                            alignItems:'center',flexDirection:'row',justifyContent:'center',backgroundColor:'#1884ff',borderRadius:RFPercentage(1)}}>
                            <Icons name={'message-circle'} color={'#fff'} size={RFPercentage(2)}/>
                            <Text style={{fontSize:RFPercentage(1.5),color:'#fff'}}> Message</Text>
                        </TouchableOpacity>}
                    </View>

                    <Detail load={loading} navigation={this.props.navigation} view={view} users={user}
                            userId={params && params.userId ? params.userId : 0}/>

                    {/*{switchProfile && <TermCondition handleClose={() => this.setState({switchProfile: false})}*/}
                    {/*                                 handleConfirm={this.handleConfirm} title={'Warning'}*/}
                    {/*                                 subtitle={'Are you sure to switch profile?'}*/}
                    {/*                                 visible={switchProfile}/>}*/}
                    <ImageCroper visible={uri != ''} uri={uri} handleClose={() => this.setState({uri: ''})}
                                 handleCrop={this.handleCrop}/>

                </View>
                <View style={{
                    position: 'absolute',
                    width,
                    height: 180,
                    backgroundColor: Colors.primary,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                }}>

                </View>
                {/*<PinCode/>*/}
            </View>
                <ImageView
                    images={[{uri:imageUrl}]}
                    imageIndex={0}
                    visible={viewImage}
                    onRequestClose={() => this.setState({viewImage:false})}
                />
        {loading&&<View style={{width,height:height*1.2,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor}/>
        </View>}
        </>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    cropView: {
        flex: 1,
        backgroundColor: 'red',
    },
    textStyle: {
        color: '#5e5e5e',
        fontSize: 13,
        marginTop: 2,
    },
    cardItem: {
        width: '90%', height: height * 0.1, backgroundColor: '#fff', borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection: 'row',
        elevation: 5,
        marginVertical: 10,
    },
});
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        user: state.user.user,
        setting: state.setting.setting,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading));

        },
        setUser: (user) => {
            dispatch(setUser(user));
        },
        setSetting: (data) => {
            dispatch(setSetting(data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
export const callNumber = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else  {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};
