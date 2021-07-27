import React, {Component} from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Modal,
    Platform,
    Dimensions,
    FlatList,
    ActivityIndicator, Alert,
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
import PinCode from '../../components/PinCode';
import Lang from '../../Language';

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
            loading:false,
            uri: '',
            user: props.user,
            switchProfile: false,
            imageUrl: '',
            viewImage:false
        };
        this.myRef = React.createRef();
        this.cropViewRef = React.createRef();
    }

    componentDidMount(): void {
        const {user} = this.props;
        const {params} = this.props.route;
        if (params && params.userId) {
            this.handleGetUser(params.userId);
        }
        this.setState({imageUrl: user.profileURL});
        this.fadeIn();
        setTimeout(() => {
            // this.fadeIn();
            this.setState({loading: false});
        }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }

    handleGetUser = async (id) => {
        await User.GetList('/api/User/' + id).then((rs) => {
            if (rs.status) {
                this.setState({user: rs.data, imageUrl: rs.data.profileURL});
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
    handleConfirm = async () => {
        await this.setState({switchProfile: false});
        const {setting} = this.props;
        const data = this.state.user;
        data.userType = data.userType == '1' ? '2' : '1';
        // this.props.setUser(data)
        // Keychain.setGenericPassword(JSON.stringify(data), data.token)
        setting.isAgent = !setting.isAgent;
        this.props.set(true);
        await User.SwitchProfile();
        // this.props.set(false)
        this.props.setSetting(setting);
        // this.props.navigation.navigate(data.userType=='1'?'RootBottomTab':'RootBottomTabAgent')
    };
    handleImagePicker = (type) => {
        ImagePicker[type](
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
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
        const {viewImage,switchProfile, imageUrl, uri, imgLoading, user,loading} = this.state;
        const {params} = this.props.route;
        const view = params && params.view ? true : false;
        const {lang} = this.props.setting;
        return (
            <>
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#f5f7fa'}}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex: 1}}>
                    {view && <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
                        paddingHorizontal: 10,
                        position: 'absolute',
                        left: 0,
                        top: 40,
                        width: RFPercentage(8),
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Icon name={'chevron-left'} size={RFPercentage(6)} color={'#fff'}/>
                    </TouchableOpacity>}
                    <View style={{
                        width: width * 0.95, alignSelf: 'center', borderRadius: 20, marginBottom: 10,
                        backgroundColor: '#fff', marginTop: Platform.OS == 'ios' ? 80 : 100, paddingBottom: 10,
                    }}>

                        <View style={{width: '100%', height: 50, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: '50%'}}>
                                {!view && <TouchableOpacity onPress={() => this.setState({switchProfile: true})}
                                                            style={{
                                                                marginLeft: 10,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                width: '60%',
                                                                height: 25,
                                                                borderRadius: 15,
                                                                flexDirection: 'row',
                                                            }}>
                                    <Icons name={'user'} color={Colors.textColor} size={RFPercentage(2.3)}/>
                                    <Text style={{
                                        color: Colors.textColor,
                                        fontSize: RFPercentage(2),fontFamily:Fonts.primary
                                    }}>{user.userType == '1' ? ' Oraganizer' : Lang[lang].agent}</Text>
                                </TouchableOpacity>}
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
                                borderTopWidth: 0.3,
                                marginVertical: 10,
                                flexDirection: 'row',
                            }}>
                                <View style={{width: '50%', flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                                    <Icons name={'mail'} color={Colors.textColor} style={{}}/>
                                    <Text style={{color: Colors.textColor,fontSize:RFPercentage(1.5)}}> {user.email}</Text>
                                </View>
                                <View style={{
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 5,
                                    justifyContent: 'flex-end',
                                }}>
                                    <Icons name={'phone'} color={Colors.textColor} style={{marginTop: 3}}/>
                                    <Text style={{color: Colors.textColor,fontSize:RFPercentage(1.8)}}> {user.phone}</Text>
                                </View>
                            </View>
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
                                <ActivityIndicator size={'large'} color={'#fff'}/>
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

                    <Detail navigation={this.props.navigation} view={view} users={user}
                            userId={params && params.userId ? params.userId : 0}/>

                    {switchProfile && <TermCondition handleClose={() => this.setState({switchProfile: false})}
                                                     handleConfirm={this.handleConfirm} title={'Warning'}
                                                     subtitle={'Are you sure to switch profile?'}
                                                     visible={switchProfile}/>}
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
