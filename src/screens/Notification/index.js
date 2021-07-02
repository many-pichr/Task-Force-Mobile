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
    ActivityIndicator, RefreshControl,
} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemFavorite, ItemPost} from '../../components/Items';
import moment from 'moment'
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import ContentLoader from 'react-native-masked-loader';
import data from '../Home/data';
import Svg, { Rect } from 'react-native-svg';
import User from '../../api/User';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
const avatarSize=((width*0.9)*0.9)/6
function getMaskedElement() {
    return (
        <Svg height={100} width="100%" fill={'black'}>
            {/*<Rect x="0" y="0" rx="8" ry="8" width="50%" height="16" />*/}
            <Rect x="0" y="10" rx="40" ry="40" width="80" height="80" />
            <Rect x="90" y="20" rx="4" ry="4" width="70%" height="15" />
            <Rect x="90" y="60" rx="4" ry="4" width="40%" height="15" />
        </Svg>
    );
}
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            loading:true,
            refreshing:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        this.handleGetPost('false')
        this.handleResetNotify()
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    handleResetNotify=async ()=>{
        const {notify, focus} = this.props
        notify.count=0;
        await User.Put("/api/ManuNotification/"+notify.id,notify).then((rs) => {
            if (rs.status) {

            }
        })
    }
    handleGetPost=async (refreshing)=>{
        this.setState({refreshing})
        await User.GetList("/api/Notification/ByUser").then((rs) => {
            if(rs.status){
                console.log(rs.data)
                this.setState({data:rs.data})
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
        const {map,refreshing,loading,data} = this.state
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
            <TouchableOpacity key={index} bottomDivider style={{width:'100%',flexDirection:'row',alignItems:'center',paddingVertical:10,
                borderBottomColor:'#d9d9d9',borderBottomWidth:0.3}}>
                {/*<FastImage onLoadEnd={() => this.setState({imgLoading: false})}*/}
                {/*           source={item.toUser.profileURL && item.toUser.profileURL != '' ? {*/}
                {/*               uri: item.toUser.profileURL,*/}
                {/*               priority: FastImage.priority.normal,*/}
                {/*           } : require('../../assets/images/avatar.png')}*/}
                {/*           resizeMode={FastImage.resizeMode.contain}*/}
                {/*           style={{width:avatarSize,height:avatarSize,borderRadius:avatarSize/2,marginLeft:10}}/>*/}
                <View style={{left:3,width:avatarSize,height:avatarSize,alignItems:'center',justifyContent:'center',borderRadius:avatarSize,backgroundColor:'rgba(16,189,206,0.15)'}}>
                <Icons name={'notifications'} size={30} color={Colors.textColor}/>
                </View>
                <View style={{marginLeft:10,width:'80%',alignSelf:'center'}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:'70%',fontSize:RFPercentage(2.2),marginTop:0}}>{item.heading}</Text>
                        <Text style={{width:'30%',textAlign:'center',marginTop:10,fontSize:RFPercentage(1.8)}}>{moment(item.date).format(format)}</Text>
                    </View>
                    <Text style={{color:'#878787'}}>{item.content}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        const {map,refreshing,loading,data} = this.state
        console.log('12345678====',this.props.notify)
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#ffff' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                        <View style={{width:'10%',justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'70%',alignSelf:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:25}}>Notification</Text>
                        </View>
                        <View style={{width:'10%',justifyContent:'flex-end'}}>
                            {/*<TouchableOpacity>*/}
                            {/*    <Icons name={'search'} color={'#fff'} size={30}/>*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
                    <View style={{width:width,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                        backgroundColor:'#fff',marginTop:20,paddingBottom:data.length<3?100:0}}>
                            {/*<FlatList*/}
                            {/*    contentContainerStyle={{flexDirection:'row',alignItems:'center',marginTop:20}}*/}
                            {/*    data={users}*/}
                            {/*    renderItem={({item,index}) =>*/}
                            {/*        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Chat')} style={{marginLeft:20,justifyContent:'center',alignItems:'center',width:avatarSize}}>*/}
                            {/*            <Image source={{uri:item}} style={{width:avatarSize,height:avatarSize,borderRadius:avatarSize/2,}}/>*/}
                            {/*            <Text style={{}}>Many</Text>*/}
                            {/*        </TouchableOpacity>*/}
                            {/*    }*/}
                            {/*    horizontal*/}
                            {/*    showsHorizontalScrollIndicator={false}*/}
                            {/*    legacyImplementation={false}*/}
                            {/*    keyExtractor={(item, index) => index.toString()}*/}
                            {/*    showsVerticalScrollIndicator={false}*/}
                            {/*/>*/}

                        {loading?
                            <View style={{justifyContent:'center',borderTopLeftRadius:20,borderTopRightRadius:20,alignItems:'center',backgroundColor:'#fff',width:'100%'}}>

                                            <ActivityIndicator size={'large'} color={Colors.textColor}/>
                            </View>:
                            <>
                                {data.length>0?<FlatList
                            contentContainerStyle={[{paddingBottom:200,alignItems:'center',marginTop:0,width:'100%',alignSelf:'center'},data.length<6&&{height:height*0.8}]}
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
                                            No message yet
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
        notify: state.notify.notify,
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
