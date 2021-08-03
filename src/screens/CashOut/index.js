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
import {Colors} from '../../utils/config'
import PinCode from '../../components/PinCode';
import User from '../../api/User';
import * as Keychain from "react-native-keychain";
import {Success} from '../../components/Dialog';
const {width,height} = Dimensions.get('window')

const list=[
    {
        title:'ABA Bank',
        code:"0361006",
        img:require('./img/aba.png')
    },
    // {
    //     title:'Wing Money',
    //     img:require('./img/wing.png')
    // }

]
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading:false,
            check:0,
            data:[1,2,3,4,5],
            refreshing:false,
            amount:'',
            account:'',
            showPin:false,
            success:false
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
    handleVerify=async ()=>{
        const {account,amount,check,showPin} = this.state;
        const {params} = this.props.route;
        this.setState({showPin:false,loading:true})
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        await User.Post("/api/User/cash-out", {
            "amount": Number(amount),
            "bank": (check!=null&&list[check].code),
            "AccountNumber": account,
            "Currency":"USD",
            "Note":"Test Case out"
        }).then((rs) => {
            if(rs.status){
                User.CheckUser().then((rs) => {
                    if(rs.status){
                        this.props.setUser(rs.data)
                        Keychain.setGenericPassword(JSON.stringify(rs.data), token)
                        this.setState({success:true,amount:'',account:''})
                    }
                })
            }

        })

        this.setState({loading:false})
    }
    handleBack=()=>{
        this.setState({success:false});
        this.props.navigation.goBack()

    }
    render() {
        const {loading,success,amount,check,showPin,account} = this.state;
        const {user} = this.props;
        const {balance} = this.props.route.params;
        const disable=(parseFloat(amount)<=balance)&&amount>0&&check!=null
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={"Cash Out"} handleBack={()=>this.props.navigation.goBack()}/>
                    <Text style={{color:'#fff',fontSize:20,alignSelf:'center',marginTop:10}}>
                        Choose Account Receiver
                    </Text>
                    <Input
                        containerStyle={{marginTop:50}}
                        inputContainerStyle={{width:'100%'}}
                        value={account}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({account:val})}
                        keyboardType={'numeric'}
                        placeholder='00 00 00 00'
                        label={"Account Number"}
                        leftIcon={
                            <Icon
                                name='credit-card'
                                size={24}
                                color='gray'
                            />
                        }
                    />
                    <Input
                        containerStyle={{marginTop:0}}
                        inputContainerStyle={{width:'100%'}}
                        value={amount}
                        labelStyle={{color:Colors.textColor}}
                        onChangeText={val=>this.setState({amount:val})}
                        keyboardType={'numeric'}
                        errorMessage={parseFloat(amount)>balance?'Sorry! Your balance is not enough':''}
                        placeholder='0.00'
                        label={"Amount"}
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
                            <TouchableOpacity onPress={()=>this.setState({check:index})} style={{width:'100%',height:80,justifyContent:'center',borderRadius:10,backgroundColor:'#fff',marginTop:10}}>
                                <View style={{flexDirection:'row',height:'90%',width:'90%',alignSelf:'center',alignItems:'center'}}>
                                    <Image source={item.img} style={{width:50,height:50}}/>
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
                            <Text style={{color:'#fff',fontSize:15}}>Cash out amount</Text>
                            <Text style={{color:'#fff',fontSize:22}}>${amount?amount:'0'}.00</Text>
                        </View>
                        <View style={{width:'50%',alignItems:'flex-end'}}>
                            <Text style={{color:'#fff',fontSize:25}}>Next</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{position:'absolute',width,height:150,backgroundColor:Colors.primary ,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>
                {success&&<Success handleClose={()=>this.setState({switchProfile:false})} handleConfirm={this.handleBack} title={'Success'} subtitle={'The transaction is successful'} visible={success}/>}

                {showPin&&<PinCode handleVerify={this.handleVerify} handleClose={()=>this.setState({showPin:false})}/>}
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
