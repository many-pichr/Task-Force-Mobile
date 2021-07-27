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
    Linking,
    Dimensions,
    FlatList,
    AppState, ActivityIndicator, Keyboard,
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
import {Colors,ABA} from '../../utils/config'
import {Success} from '../../components/Dialog';
const {width,height} = Dimensions.get('window')
import Base64 from 'crypto-js/enc-base64';
const list=[
    {
        title:'ABA Pay',
        img:require('./img/abapay.png')
    },
    {
        title:'Wing Money',
        img:require('./img/wing.png')
    },
    {
        title:'Credit Card or Debit',
        img:require('./img/card.png')
    },
    {
        title:'Pay Pal',
        img:require('./img/paypal.png')
    },

]
var CryptoJS = require("crypto-js");
function hmac_512(message, secret) {
    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, secret);
    hmac.update(message);
    var hash = hmac.finalize();
    return hash;
}
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading:false,
            check:null,
            data:[1,2,3,4,5],
            refreshing:false,
            success:false,
            amount:'',
            showPin:false,
            ABALink:false,
            body:{}
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        AppState.addEventListener('change', this.listener);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this.listener);
    }
    listener=async (state)=>{
        const {body,ABALink} = this.state;

        if (state == 'active'&&ABALink) {
            // this.setState({success:true,loading:false})
            let hash = Base64.stringify(hmac_512(ABA.id+body.tran_id,ABA.key))
            body.hash=hash;
            await User.Post('/api/User/aba-verified',body).then((rs) => {
                if(rs.status){
                    console.log(JSON.parse(rs.data.message))
                    this.setState({success:true,loading:false})
                }
            })
            this.setState({loading:false})

        }
    }
    handleTab=(index)=>{
        this.setState({index:index})
    }
    handleNext=()=>{
        this.props.navigation.navigate('Start')
    }
    handleABAPay=async ()=>{
        const {map,amount,check,showPin} = this.state;
        const {user} = this.props;
        const tr_id=new Date().getTime();
        this.setState({showPin:false,loading:true})
        let hash = Base64.stringify(hmac_512(ABA.id+tr_id+amount,ABA.key))
        const body={
            "hash": hash,
            "tran_id": tr_id,
            "amount": amount,
            "firstname": user.firstName,
            "lastname": user.lastName,
            "phone": user.phone,
            "email": user.email,
            "payment_option": "abapay_deeplink"
        }
        console.log(JSON.stringify(body))
        this.setState({body})
        await User.Post('/api/User/aba-topup',body).then((rs) => {
            if(rs.status){
                const data=JSON.parse(rs.data.message)
                if(data.status==0){
                    this.handleABADeeplink(data)
                }
            }else{
                this.setState({loading:false})
            }
        })
        // this.setState({showPin:false,loading:false})

    }
    handleABADeeplink=(data)=>{
        Linking.openURL(data.abapay_deeplink)
            .then((res) => {
                this.setState({ABALink:true})
            })
            .catch((error) => {
                const storeDeepLink = Platform.select({
                    android: data.play_store,
                    ios: data.app_store,
                });

                if (storeDeepLink) {

                    Linking.openURL(storeDeepLink)
                        .then((res) => {
                            this.setState({loading:false})
                        }).catch((error) => { });
                }

                console.log('error', error);
            });
    }
    handleVerify=async ()=>{
        const {map,amount,check,showPin} = this.state;
        if(check==0){
            this.handleABAPay()
        }else{
            this.setState({showPin:false,loading:false})
        }
    }
    handleBack=()=>{
        this.setState({success:false});
        this.props.navigation.goBack({refresh:true})

    }
    render() {
        const {success,loading,amount,check,showPin} = this.state;
        const {user} = this.props;
        const disable=amount>=1&&check!=null
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{zIndex:1}}>
                    <HeaderText title={"Cash In"} handleBack={()=>this.props.navigation.goBack({refresh:false})}/>
                    <Text style={{color:'#fff',fontSize:20,alignSelf:'center',marginTop:10}}>
                        Choose Payment Method
                    </Text>
                    <Input
                        containerStyle={{marginTop:50}}
                        inputContainerStyle={{width:'100%'}}
                        value={amount}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({amount:val})}
                        keyboardType={'numeric'}
                        placeholder='0.00'
                        label={"Enter Amount"}
                        leftIcon={
                            <Icon
                                name='attach-money'
                                size={24}
                                color='gray'
                            />
                        }
                    />
                    <FlatList
                        contentContainerStyle={{width:'95%',alignSelf:'center'}}
                        data={list}
                        renderItem={({item,index}) =>(
                            <TouchableOpacity onPress={()=>this.setState({check:index==0?index:''})} style={{width:'100%',height:80,justifyContent:'center',borderRadius:10,backgroundColor:'#fff',marginTop:10}}>
                                <View style={{flexDirection:'row',height:'90%',width:'90%',alignSelf:'center',alignItems:'center'}}>
                                    <Image source={item.img} style={{width:index==0?70:50,height:50}}/>
                                    <Text style={{marginLeft:20,fontSize:18,width:'70%'}}>
                                        {item.title}
                                    </Text>
                                    {check===index&&<Icon name={'done'} size={25} color={Colors.textColor}/>}
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                    <View style={{height:100,width:'100%',alignSelf:'center',}}>
                        <TouchableOpacity disabled={!disable} onPress={()=>this.setState({showPin:true})}
                                          style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,height:70,backgroundColor:disable?Colors.textColor:Colors.primaryBlur,borderRadius:10,width:'75%'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#fff',fontSize:15}}>Cash in amount</Text>
                            <Text style={{color:'#fff',fontSize:22}}>${amount?amount:'0'}.00</Text>
                        </View>
                        <View style={{width:'50%',alignItems:'flex-end'}}>
                            <Text style={{color:'#fff',fontSize:25}}>Next</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <View style={{position:'absolute',width,height:150,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
                {success&&<Success handleClose={()=>this.setState({switchProfile:false})} handleConfirm={this.handleBack} title={'Success'} subtitle={'The transaction is successful'} visible={success}/>}

                {showPin&&<PinCode title={"For Top up: "+amount+"$"} handleVerify={this.handleVerify} handleClose={()=>this.setState({showPin:false})}/>}
            </View>
                {loading&&<View style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.18)',position:'absolute',justifyContent:'center',alignItems:'center'}}>
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
