import React, { Component } from 'react';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    Image,
    View,
    Text,
    Modal,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    StatusBar, RefreshControl, Keyboard,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import ActionSheet from "react-native-actions-sheet";
import {HeaderOrganizer} from '../../components/HeaderOrganizer'
import {Headers} from '../../components/Header'
import Icon from 'react-native-vector-icons/Feather';
import {TextHorizontal} from '../../components/Texts'
import {CustomItem} from '../../components/Items'
import LottieView from 'lottie-react-native';
import { SvgXml } from 'react-native-svg';
import {Item} from './Item';
import data from './data';
import Filter from './Filter'
import {map_blue, map_red} from './svg';
import MapView, {Marker,PROVIDER_GOOGLE} from "react-native-maps";
import {Button} from 'react-native-elements';
import {SlidePanel} from './SlidePanel';
import {barHight} from '../../utils/config'
import RNBootSplash from 'react-native-bootsplash';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {connect} from 'react-redux';
import User from '../../api/User';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Mapview, { AnimatedRegion } from 'react-native-maps';
import { TouchableOpacity } from 'react-native';
const {width,height} = Dimensions.get('window')


class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            map:true,
            loading:true,
            fadeAnimation: new Animated.Value(0),
            region: {
                latitude: 11.5564,
                longitude: 104.9282,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            items:[],
            filter:false,
            posts:[],
            item:null,
            categories:[],


        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        const {user} = this.props;
        RNBootSplash.hide({ duration: 500,fade:true })
        this.fadeIn()
        setTimeout(()=>{
            // this.fadeIn();
            this.setState({loading: false})
        }, 2000);
        setTimeout(()=>{
            // this.fadeIn();
            this.props.set(false)

        }, 500);
        this.handleGetPost(false)
        this.handleGetCategory(false)
        if(user.pinCode.length<4){
            this.props.navigation.navigate('PinCode')
        }

        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    handleDetail=(id)=>{
        this.myRef.current?.setModalVisible(false)
        this.props.navigation.navigate('ViewPost',{title:'View Post',home:true,view:true,id:id})
    }
    handleGetPost=async (refreshing)=>{
        // this.props.set(!refreshing)
        await User.GetList('/api/JobPost?_end=20&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                this.setState({posts:rs.data,refreshing:false})
                console.log(rs.data)
            }
        })
        // this.props.set(false)
    }
    handleGetCategory=async (refreshing)=>{
        // this.props.set(!refreshing)
        await User.GetList('/api/JobCategory?_end=20&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                this.setState({categories:rs.data,refreshing:false})
            }
        })
        // this.props.set(false)
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
    handleViewPost=(id)=>{
        this.props.navigation.navigate('ViewPost',{title:'View Post',view:true,home:true,id:id})
    }
    handleOpen=(item)=>{
        this.setState({item:item})
        this.myRef.current?.setModalVisible()
    }
    handleSubmitApply=async (id)=>{
        this.props.set(true)
        await User.SubmitRequestJob({userId:this.props.user.id,jobId:id}).then((rs) => {
            if(rs.status){
                this.myRef.current?.setModalVisible(false)
            }
        })
        this.props.set(false)

    }
    handleInterested=async ()=>{
        const {item} = this.state
        const {user} = this.props;
        this.setState({sloading:true})
        await User.AddInterested({userId:user.id,jobId:item.id})
        this.setState({sloading:false})
    }
    onRegionChangeComplete=(region)=>{
       this.setState({region})
    }
    handleTabOverlay=()=>{
        Keyboard.dismiss();
        this.setState({focus:false})
    }
    render() {
        const {map,region,focus,refreshing,filter,posts,categories} = this.state;
        const {user} = this.props;
        const renderItem = ({ item, index }: any) => (
            <Item key={`intro ${index}`} index={index} source={item.photoURL} title={item.name} />
        );
        return (
            <>
                <View style={{flex:1,alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                    <View style={{marginTop:barHight}}>
                        <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent={true}/>
                        {/*<HeaderOrganizer bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>*/}
                        { user.userType=='1'?
                            <HeaderOrganizer bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>:
                            <Headers onFocus={()=>this.setState({focus:true})} bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>}

                        {map?
                            <View style={{alignItems:'center',width,height:height}}>

                                    <>
                                    <MapView
                                        showsUserLocation={true}
                                        provider={PROVIDER_GOOGLE}
                                        onRegionChangeComplete={this.onRegionChangeComplete}
                                        // onPress={info=>this.setLocation(info.nativeEvent.coordinate)}
                                        // onPress={info=>console.log(info.nativeEvent.coordinate)}
                                        mapType={Platform.OS == "android" ? "standard" : "standard"}
                                        region={region}
                                        style={{ width: width, height: '100%'}}
                                    >
                                        {posts.map((item, index) => {
                                            return (
                                                <Marker key={index} title={item.title} coordinate={{longitude:item.locLONG,latitude:item.locLAT}} onPress={()=>this.handleOpen(item)}>
                                                    {/*<Image source={require('../../assets/images/user.png')} style={{flex:1,width:24,height:36,resizeMode: 'contain' }}/>*/}
                                                    <SvgXml xml={item.jobPriority.name=='Yes'?map_red:map_blue} width={49.625*0.7} height={57*0.7}/>
                                                </Marker>
                                            )})}
                                    </MapView>
                                    {focus&&<TouchableOpacity onPress={this.handleTabOverlay} style={{width:'100%',height:'100%',position:'absolute'}}>
                                    </TouchableOpacity>}
                                    </>
                            </View>:
                            <ScrollView showsVerticalScrollIndicator={false}
                                        refreshControl={<RefreshControl
                                            colors={["#9Bd35A", "#689F38"]}
                                            refreshing={refreshing}
                                            onRefresh={()=>this.handleGetPost(true)} />}>
                                <View style={{alignItems:'center',paddingBottom:100}}>
                                    <TextHorizontal title={"Recommend for you"} onPress={()=>this.props.navigation.navigate('JobList')}/>
                                    <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                                        <FlatList
                                            data={posts}
                                            refreshControl={<RefreshControl
                                                colors={["#9Bd35A", "#689F38"]}
                                                refreshing={refreshing}
                                                onRefresh={()=>this.handleGetPost(true)} />}
                                            renderItem={({item,index}) =>index<5&&<CustomItem onPress={()=>this.handleOpen(item)} userId={this.props.user.id} item={item}/>}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                    <TextHorizontal title={"Top Categories"} onPress={()=>this.props.navigation.navigate('Category')}/>
                                    <FlatList
                                        data={categories}
                                        extraData={categories}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    <TextHorizontal title={"Latest Post"} onPress={()=>this.props.navigation.navigate('JobList')}/>
                                    <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                                        <FlatList
                                            data={posts}
                                            refreshControl={<RefreshControl
                                                colors={["#9Bd35A", "#689F38"]}
                                                refreshing={refreshing}
                                                onRefresh={()=>this.handleGetPost(true)} />}
                                            renderItem={({item}) =><CustomItem onPress={()=>this.handleOpen(item)} userId={this.props.user.id} item={item}/>}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                </View>
                            </ScrollView>}

                        <SlidePanel loading={this.state.sloading} handleApply={this.handleSubmitApply} onInterested={this.handleInterested} userId={user.id} item={this.state.item} myRef={this.myRef} handleDetail={this.handleDetail}/>
                        {filter&&<Filter visible={filter} handleClose={()=>this.setState({filter:false})}/>}
                    </View>


                </View>
                { user.userType=='1'&&map&&<View style={{position:'absolute',top:100,right:15}}>
                    <Button
                        onPress={()=>this.props.navigation.navigate('AddPost',{title:'Add Post',view:false})}
                        icon={
                            <Icon
                                name="plus"
                                size={30}
                                color="white"
                            />
                        }
                        buttonStyle={{width:50,height:50,borderRadius:30}}
                    />
                </View>}
            </>
        );
    }
}

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
