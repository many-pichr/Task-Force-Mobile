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
    ActivityIndicator, RefreshControl, Keyboard,
} from 'react-native';
import moment from 'moment'
import { SearchBar } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import data from '../Home/data';
import Svg, { Rect } from 'react-native-svg';
import User from '../../api/User';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
const avatarSize=((width*0.9)*0.9)/5
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            originData:[],
            data:[],
            loading:false,
            refreshing:false,
            search:''
        }
        this.myRef = React.createRef();
        this._unsubscribe = this.props.navigation.addListener('focus', (action, state) => {
            // do something
            this.handleGetPost(false)
        });
    }
    componentDidMount(): void {
        this.fadeIn()
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    handleSearch=async (search)=>{
       this.setState({search})
        const {originData} = this.state;
        const excludeColumns = ["body","type","lastAccess"];
        const filteredData =await originData.filter(item => {
            return Object.keys(item).some(key =>
                excludeColumns.includes(key) ? false : (item[key]==null?false:item[key].toString().toLowerCase().includes(search.toLowerCase()))
            );
        });
        this.setState({data:filteredData})
    }
    onCancel=()=>{
        this.setState({search:''});
        Keyboard.dismiss();
    }
    handleGetPost=async (refreshing)=>{
        this.setState({refreshing})
        await User.GetList("/api/Chat").then((rs) => {
            if(rs.status){
                const items=[]
                for(var i=0;i<rs.data.length;i++){
                    const item=rs.data[i]
                    if(this.props.user.id==item.toUserId){
                        const fromUser = item.fromUser;
                        const toUser = item.toUser;
                        item.fromUser=toUser;
                        item.toUser = fromUser;
                        item.fromUserId=toUser.id;
                        item.toUserId=fromUser.id;
                        item.firstName=item.toUser.firstName;
                        item.lastName=item.toUser.lastName;
                        items.push(item)
                    }else{
                        item.firstName=item.toUser.firstName;
                        item.lastName=item.toUser.lastName;
                        items.push(item)
                    }
                }
                this.setState({originData:items,data:items})
            }
        })
        this.setState({loading:false,refreshing:false})
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

    renderItems=({item,index})=>{
        let format = 'ddd MMM YY'
        const d = item.lastAccess;
        const year = moment(new Date()).isSame(d, 'year');
        const month = moment(new Date()).isSame(d, 'month');
        const day = moment(new Date()).isSame(d, 'day');
        if(year&&month&&day){
            format = 'HH:mm'
        }else if(year&&month){
            format = 'dddd'
        }else if(year){
            format = 'ddd MMM'
        }
            return(
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Chat',{item:item,user:this.props.user})} key={index} bottomDivider style={{width:'100%',flexDirection:'row',alignItems:'center',paddingVertical:10,
                borderBottomColor:'#d9d9d9',borderBottomWidth:0.3}}>
                <FastImage onLoadEnd={() => this.setState({imgLoading: false})}
                           source={item.toUser.profileURL && item.toUser.profileURL != '' ? {
                               uri: item.toUser.profileURL,
                               priority: FastImage.priority.normal,
                           } : require('../../assets/images/avatar.png')}
                           resizeMode={FastImage.resizeMode.contain}
                           style={{width:avatarSize,height:avatarSize,borderRadius:avatarSize/2,marginLeft:10}}/>

                <View style={{marginLeft:10,width:'80%',alignSelf:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:'70%',fontSize:18,marginTop:0}}>{item.toUser.lastName} {item.toUser.firstName}</Text>
                        <Text style={{width:'30%',textAlign:'center',marginTop:10,fontSize:13}}>{moment(item.lastAccess).format(format)}</Text>
                    </View>
                    <Text style={{color:'#878787'}}>{item.body?(item.type=='text'?item.body:(item.type=='voice'?"Voice message":"Sent Photo")):"No message yet"}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const {search,refreshing,loading,data,originData} = this.state
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#ffff' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                        <SearchBar
                            containerStyle={{backgroundColor:'transparent',borderTopWidth:0,borderBottomWidth: 0,width:'90%'}}
                            inputContainerStyle={{backgroundColor:'#f9f9f9'}}
                            round
                            placeholder="Search ..."
                            onClear={this.onCancel}
                            onChangeText={this.handleSearch}
                            value={search}
                            />
                    </View>
                    <View style={{width:width,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                        backgroundColor:'#fff',marginTop:0,paddingBottom:data.length<3?100:0}}>

                        {loading?
                            <View style={{justifyContent:'center',borderTopLeftRadius:20,height:'90%',borderTopRightRadius:20,alignItems:'center',backgroundColor:'#fff',width:'100%'}}>

                                            <ActivityIndicator size={'large'} color={Colors.textColor}/>
                            </View>:
                            <>
                            {/*{!(data.length==0&&originData.length==0)&&<SearchBar*/}
                            {/*        containerStyle={{backgroundColor:'transparent',borderTopWidth:0,borderBottomWidth: 0}}*/}
                            {/*        inputContainerStyle={{backgroundColor:'#e0e0e0'}}*/}
                            {/*        round*/}
                            {/*        placeholder="Search ..."*/}
                            {/*        onClear={this.onCancel}*/}
                            {/*        onChangeText={this.handleSearch}*/}
                            {/*        value={search}*/}
                            {/*    />}*/}
                                {data.length>0?<FlatList
                            contentContainerStyle={[{alignItems:'center',marginTop:0,width:'100%',alignSelf:'center'},data.length<6&&{height:height*0.8}]}
                            data={data}
                            refreshControl={<RefreshControl
                                colors={["#9Bd35A", Colors.textColor]}
                                tintColor={Colors.textColor}
                                refreshing={refreshing}
                                onRefresh={()=>this.handleGetPost(true)} />}
                            renderItem={this.renderItems}
                            showsHorizontalScrollIndicator={false}
                            legacyImplementation={false}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />:<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                                    colors={["#9Bd35A", "#689F38"]}
                                    refreshing={refreshing}
                                    onRefresh={()=>this.handleGetPost(true)} />}>
                                    <View style={{width,height:height*0.7,alignItems:'center',justifyContent:'center'}}>
                                        <Icons name={'chat'} size={50} color={'gray'}/>
                                        <Text style={{marginTop:20,fontSize:20}}>
                                            { (data.length==0&&originData.length==0)?"No message yet":"Not found"}
                                        </Text>
                                    </View>
                                </ScrollView>}
                        </>}



                    </View>
                </View>
                <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

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

        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
