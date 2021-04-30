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
import {connect} from 'react-redux';
import {HeaderText} from '../../components/Header'
import moment from 'moment'
import User from '../../api/User';
import * as Keychain from "react-native-keychain";
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {About, Education, Experience, Skill} from '../Profile/Tabs';
import {Colors} from '../../utils/config';
const {width,height} = Dimensions.get('window')
const initialLayout = { width: Dimensions.get('window').width };

const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]} />
);

const renderTabBar = props => (
    <TabBar
        {...props}
        scrollEnabled={false}
        // labelStyle={{color:Colors.primary}}
        activeColor={Colors.primary}
        inactiveColor={Colors.primaryBlur}
        indicatorStyle={{backgroundColor:Colors.primary}}
        style={{ backgroundColor: 'white' }}
    />
);
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            data:[],
            cashout:[],
            routes:[
                { key: '0', title: 'Transaction' },
                { key: '1', title: 'Cash Out' },
            ],
            loading:true,
            refreshing:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        this.handleGetTransaction()
        setTimeout(()=>{
            // this.fadeIn();
            this.setState({loading: false})
        }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    handleTab=(index)=>{
        this.setState({index:index})
    }
    handleGetTransaction=async ()=>{
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        await User.CheckUser().then((rs) => {
            if(rs.status){
                this.props.setUser(rs.data)
                Keychain.setGenericPassword(JSON.stringify(rs.data), token)
            }
        })
        await User.Post("/api/User/wallet-details",{}).then((rs) => {
            console.log(rs)
            if(rs.status){
                 const data=[];
                 const cashout=[];
                 for(var i=0;i<rs.data.length;i++){
                     const item=rs.data[i];
                     if(item.type=='Cash Out'){
                         cashout.push(item)
                     }else{
                         data.push(item)
                     }
                 }
                this.setState({data,cashout})
            }
        })
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
    FirstRoute = (loading,refreshing,data,type) => {
        return(<>
            {data.length>0?<FlatList
                contentContainerStyle={{marginTop:0,width:'95%',alignSelf:'center'}}
                refreshControl={<RefreshControl
                    colors={["#9Bd35A", "#689F38"]}
                    refreshing={refreshing}
                    onRefresh={()=>this.handleGetTransaction(true)} />}
                data={data}
                renderItem={({item,index}) =>{
                    const ref = item.ref?JSON.parse(item.ref):{account:'123 456 780'};
                    return(

                    <>
                    <View style={{width:'100%',height:100,borderRadius:10,backgroundColor:'#fff',marginTop:10,marginBottom:(index+1==data.length)?30:0}}>
                        <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:10,alignItems:'center'}}>
                            <View style={{width:'10%'}}>
                                <Icons name={'arrow-down'} color={'green'} size={20}/>
                            </View>
                            <View style={{width:'30%'}}>
                                <Text style={{fontSize:16}}>
                                    {item.type}
                                </Text>
                            </View>
                            <View style={{width:'20%'}}>
                                <Text style={{fontSize:15,color:'#1582F4'}}>
                                    ${item.amount}
                                </Text>
                            </View>
                            <View style={{width:'40%',alignItems:'flex-end'}}>
                                <Text style={{fontSize:13}}>

                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:10,alignItems:'center'}}>
                            <View style={{width:'10%'}}>
                                <Icons name={'user'} color={'#1582F4'} size={20}/>
                            </View>
                            <View style={{width:'60%'}}>
                                <Text style={{fontSize:16}}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',width:'90%',alignSelf:'center',marginTop:10,alignItems:'center'}}>
                            <View style={{width:'10%'}}>

                            </View>
                            <View style={{width:'40%'}}>
                                <Text style={{fontSize:13,color:'#1582F4'}}>
                                    #{ref.account}
                                </Text>
                            </View>
                            <View style={{width:'50%',alignItems:'flex-end'}}>
                                <Text style={{fontSize:13}}>
                                    {moment(item.date).format('DD/MM/YYYY HH:mm')}
                                </Text>
                            </View>
                        </View>
                    </View>
                        {data.length>5&&data.length==(index+1)&&<View style={{height:100}}/>}
                    </>
                )}}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />:<ScrollView refreshControl={<RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={refreshing}
                onRefresh={()=>this.handleGetTransaction(true)} />}>
                <View style={{width:width,height:height*0.5,justifyContent:'center',alignItems:'center'}}>
                    {loading?
                        <ActivityIndicator size={'large'} color={'#0D70D9'} />:
                        <Text style={{fontSize:20,color:'#0D70D9'}}>
                            No Data
                        </Text>}
                </View>
            </ScrollView>
            }

            </>
    )}
    render() {
        const {loading,index,routes,refreshing,data,cashout} = this.state;
        const {user} = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={"My Money"} handleBack={()=>this.props.navigation.goBack()} rightIcon={index=='0'?'add':'attach-money'} handleRight={()=>this.props.navigation.navigate(index=='0'?'CashIn':'CashOut',{balance:user.userWallet.setledCash})}/>
                    <View style={{width:width*0.95,alignSelf:'center',borderRadius:20,
                        backgroundColor:'#ffffff',marginTop:0,paddingBottom:10,justifyContent:'center',alignItems:'center'}}>
                        <View style={{marginTop:10,width:width*(0.95)-20,height:130,flexDirection:'row',alignItems:'center',backgroundColor:'rgba(21,130,244,0.22)',borderRadius:10}}>
                            <View style={{width:'50%',borderRightWidth:1,borderRightColor:'#fff',borderStyle: 'dashed',height:'70%',alignItems:'center'}}>
                                <Text style={{color:'#1582F4',fontWeight:'bold',fontSize:16,height:'25%',textAlignVertical:'center'}}>
                                    Your Balance
                                </Text>
                                <Text style={{color:'#1582F4',fontSize:20,fontWeight:'bold',height:'50%',textAlignVertical:'center'}}>

                                ${user.userWallet.setledCash?user.userWallet.setledCash:0}
                                </Text>
                                <Text style={{color:'#1582F4',fontSize:15,height:'25%',textAlignVertical:'center'}}>
                                Available
                                </Text>
                            </View>
                            <View style={{width:'45%',height:'70%',marginLeft:10,alignItems:'center'}}>
                                <Text style={{color:'#1582F4',fontWeight:'bold',fontSize:16,height:'25%',textAlignVertical:'center'}}>
                                    Your Balance
                                </Text>
                                <Text style={{color:'#1887ff',fontSize:20,fontWeight:'bold',height:'50%',textAlignVertical:'center'}}>

                                    ${user.userWallet.lockedCash}
                                </Text>
                                <Text style={{color:'#1582F4',fontSize:15,height:'25%',textAlignVertical:'center'}}>
                                    Blocked
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{width:width,marginTop:10,height:height*0.8}}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={SceneMap({
                                '0': ()=>this.FirstRoute(loading,refreshing,data,'tra'),
                                '1':  ()=>this.FirstRoute(loading,refreshing,cashout,'out')
                            })}
                            onIndexChange={index=>this.setState({index})}
                            // initialLayout={initialLayout}
                            renderTabBar={renderTabBar}
                        />
                    </View>




                </View>
                <View style={{position:'absolute',width,height:180,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

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
