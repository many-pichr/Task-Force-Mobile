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
    RefreshControl, ActivityIndicator,
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

const list=[
    {
        title:'ABA Bank',
        img:require('./img/aba.png')
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
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            check:null,
            data:[1,2,3,4,5],
            refreshing:false,
            amount:'',
            pin1:'',
            pin2:'',
            showPin:false,
            loading:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
    }
    handleTab=(index)=>{
        this.setState({index:index})
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
        const {pin1,amount,check,showPin} = this.state;
        const {user} = this.props;
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        this.setState({loading:true})
        await User.Post("/api/User/set-pin", {
            "userId": user.id,
            "pin": pin1,
        })
        await User.CheckUser().then((rs) => {
            if(rs.status){
                this.props.setUser(rs.data)
                Keychain.setGenericPassword(JSON.stringify(rs.data), token)
                this.props.navigation.replace('RootBottomTab')
            }
        })
        this.setState({loading:false})
    }
    render() {
        const {pin1,pin2,amount,check,loading} = this.state;
        const {user} = this.props;
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={"Create Pin Code"} handleBack={()=>alert("Please create pin code")}/>
                    <Text style={{color:'#fff',fontSize:20,alignSelf:'center',marginTop:10}}>

                    </Text>
                    <Input
                        containerStyle={{marginTop:50}}
                        inputContainerStyle={{width:'100%'}}
                        value={pin1}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({pin1:pin1.length==4&&pin1.length<val.length?pin1:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
                        label={"Enter New Pin"}
                        secureTextEntry={true}
                        leftIcon={
                            <Icon
                                name='lock'
                                size={24}
                                color='gray'
                            />
                        }
                    />
                    <Input
                        containerStyle={{marginTop:20}}
                        inputContainerStyle={{width:'100%'}}
                        value={pin2}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({pin2:pin2.length==4&&pin2.length<val.length?pin2:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
                        secureTextEntry={true}
                        errorMessage={pin2.length==4&&pin1!=pin2?"Pin not match!":""}
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
                        <TouchableOpacity disabled={!(pin2.length==4&&pin1==pin2)} onPress={this.handleSubmit}
                                          style={{justifyContent:'center',alignItems:'center',width:'80%',height:RFPercentage(8),backgroundColor:(pin2.length==4&&pin1==pin2)?Colors.textColor:Colors.primaryBlur,borderRadius:10}}>

                            <Text style={{color:'#fff',fontSize:25}}>Submit</Text>

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{position:'absolute',width,height:150,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
            </View>
        {loading&&<View style={{width,height:height*1.2,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.primary}/>
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
