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
    RefreshControl, KeyboardAvoidingView, Keyboard, ActivityIndicator,
} from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {Input} from 'react-native-elements'
import {connect} from 'react-redux';
import {HeaderText} from '../../components/Header'
import {RFPercentage} from 'react-native-responsive-fontsize';
import {ItemFavorite} from '../../components/Items';
import PinCode from '../../components/PinCode';
import User from '../../api/User';
import * as Keychain from "react-native-keychain";
import {Colors} from '../../utils/config';
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            check:null,
            data:[1,2,3,4,5],
            refreshing:false,
            loading:false,
            current:'',
            newpin:'',
            confirm:'',
            showPin:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
    }
    handleNext=()=>{
        this.props.navigation.navigate('Start')
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    handleSubmit=async ()=>{
        const {confirm} = this.state;
        const {user} = this.props;
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        this.setState({loading:true})
        await User.Post("/api/User/set-pin", {
            "userId": user.id,
            "pin": confirm,
        })
        await User.CheckUser().then((rs) => {
            if(rs.status){
                this.props.setUser(rs.data)
                Keychain.setGenericPassword(JSON.stringify(rs.data), token)
                this.props.navigation.goBack()
            }
        })
        this.setState({loading:false})
    }
    render() {
        const {map,current,newpin,confirm,check,loading} = this.state;
        const {user} = this.props;
        const checkPin=current.length==4&&user.pinCode!=current;
        const validator=!checkPin&&(current.length==4&&newpin.length==4)&&newpin==confirm

        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <TouchableOpacity activeOpacity={1} style={{zIndex:1}} onPress={Keyboard.dismiss}>
                    <HeaderText title={"Change Pin"} handleBack={()=>this.props.navigation.goBack()}/>
                    <Text style={{color:'#fff',fontSize:20,alignSelf:'center',marginTop:10}}>

                    </Text>
                    <Input
                        containerStyle={{marginTop:50}}
                        inputContainerStyle={{width:'100%'}}
                        value={current}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({current:current.length==4&&current.length<val.length?current:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
                        errorMessage={checkPin&&"Current pin not match!"}
                        secureTextEntry={true}
                        label={"Enter Current Pin"}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color='gray'
                            />
                        }
                    />
                    <Input
                        containerStyle={{marginTop:10}}
                        inputContainerStyle={{width:'100%'}}
                        value={newpin}
                        disabled={!(current.length==4&&!checkPin)}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({newpin:newpin.length==4&&newpin.length<val.length?newpin:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
                        secureTextEntry={true}
                        label={"Enter New Pin"}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color='gray'
                            />
                        }
                    />
                    <Input
                        containerStyle={{marginTop:10}}
                        inputContainerStyle={{width:'100%'}}
                        value={confirm}
                        disabled={!(current.length==4&&newpin.length==4)}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({confirm:confirm.length==4&&confirm.length<val.length?confirm:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
                        secureTextEntry={true}
                        errorMessage={confirm.length==4&&newpin!=confirm?"Pin not match!":""}
                        label={"Confirm Pin"}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color='gray'
                            />
                        }
                    />
                    <View style={{height:100,width:width,alignSelf:'center',alignItems:'center'}}>
                        <TouchableOpacity disabled={!validator} onPress={this.handleSubmit}
                                          style={{justifyContent:'center',alignItems:'center',width:'80%',height:RFPercentage(8),backgroundColor:validator?Colors.textColor:"#cbcbcb",borderRadius:10}}>

                            <Text style={{color:'#fff',fontSize:25}}>Submit</Text>

                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <View style={{position:'absolute',width,height:150,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
            </View>
        {loading&&<View style={{width,height:height,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
