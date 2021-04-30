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
    RefreshControl,
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
            current:'',
            newpin:'',
            confirm:'',
            showPin:false
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
    handleVerify=async ()=>{
        const {map,amount,check,showPin} = this.state;
        this.setState({showPin:false})
        this.props.set(true)
        await User.Post("/api/User/top-up", {
            "amount": amount,
            "bank": "testing",
            "ref": "testing"
        })
        await User.CheckUser().then((rs) => {
            if(rs.status){
                this.props.setUser(rs.data)
                Keychain.setGenericPassword(JSON.stringify(rs.data), rs.data.token)
                this.props.navigation.goBack();
            }
        })
        this.props.set(false)
    }
    render() {
        const {map,current,newpin,confirm,check,showPin} = this.state;
        const {user} = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={"Change Pin"} handleBack={()=>this.props.navigation.goBack()}/>
                    <Text style={{color:'#fff',fontSize:20,alignSelf:'center',marginTop:10}}>

                    </Text>
                    <Input
                        containerStyle={{marginTop:50}}
                        inputContainerStyle={{width:'100%'}}
                        value={current}
                        labelStyle={{color:'#1582F4'}}
                        onChangeText={val=>this.setState({current:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
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
                        containerStyle={{marginTop:50}}
                        inputContainerStyle={{width:'100%'}}
                        value={newpin}
                        labelStyle={{color:'#1582F4'}}
                        onChangeText={val=>this.setState({newpin:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
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
                        containerStyle={{marginTop:20}}
                        inputContainerStyle={{width:'100%'}}
                        value={confirm}
                        labelStyle={{color:'#1582F4'}}
                        onChangeText={val=>this.setState({confirm:val})}
                        keyboardType={'numeric'}
                        placeholder='****'
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
                        <TouchableOpacity
                                          style={{justifyContent:'center',alignItems:'center',width:'80%',height:70,backgroundColor:'#1582F4',borderRadius:10}}>

                            <Text style={{color:'#fff',fontSize:25}}>Submit</Text>

                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{position:'absolute',width,height:150,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
                {showPin&&<PinCode handleVerify={this.handleVerify} handleClose={()=>this.setState({showPin:false})}/>}
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
