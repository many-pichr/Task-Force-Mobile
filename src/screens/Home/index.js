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
    StatusBar, RefreshControl, Keyboard, ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {HeaderOrganizer} from '../../components/HeaderOrganizer'
import {Headers} from '../../components/Header'
import Icon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TextHorizontal} from '../../components/Texts'
import {CustomItem} from '../../components/Items'
import { SvgXml } from 'react-native-svg';
import {Item} from './Item';
import data from './data';
import Filter from './Filter'
import {map_blue, map_red} from './svg';
import MapView, {Marker,PROVIDER_GOOGLE,PROVIDER_DEFAULT} from "react-native-maps";
import {Button} from 'react-native-elements';
import {SlidePanel} from './SlidePanel';
import {barHight, Colors, Fonts} from '../../utils/config';
import RNBootSplash from 'react-native-bootsplash';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {connect} from 'react-redux';
import User from '../../api/User';
import { TouchableOpacity } from 'react-native';
import {SlideShow} from '../../components/SlideShow';
import Lang from '../../Language';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            map:true,
            start:true,
            loading:true,
            show:true,
            appleMap:false,
            fadeAnimation: new Animated.Value(0),
            region: {
                latitude: 11.5564,
                longitude: 104.9282,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0121,
            },
            items:[],
            values:{
                noExpiry:false,
                category:'',
                level:'',
                min:'',
                max:'',
                start:new Date(),
                end:new Date(),
                search:''
            },
            filter:false,
            isFilter:false,
            posts:[],
            recommended:[],
            type:'standard',
            item:null,
            categories:[],
            level:[],
            slides:[],


        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        const {user} = this.props;
        RNBootSplash.hide({ duration: 500,fade:true })
        this.fadeIn()
        setTimeout(()=>{
            this.setState({loading: false})

        }, 2000);
        setTimeout(()=>{
            this.props.set(false)

        }, 1500);
        this.handleGetCategory(false)
        if(user.pinCode.length<4){
            this.props.navigation.replace('PinCode')
        }
            this._unsubscribe = this.props.navigation.addListener('focus', () => {
                this.handleGetPost(false)
                this.handleGetCategory(false)
                this.handleCheckCagegory();

            });
        this.handleGps()
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    handleDetail=(id)=>{
        const {user} = this.props;
        this.myRef.current.snapTo(2)
        this.props.navigation.navigate('ViewPost',{title:'View Post',home:true,view:user.userType=='1'?false:true,id:id,agent:user.userType=='1'?false:true})
    }
    handleInput=async (f,v)=>{
        const newState={... this.state}
        newState.values[f]=v;
        // const err = await validate(newState.values, schama);
        // newState.error=err
        this.setState(newState)

    }
    handleGo=()=>{
        const {values} = this.state;
        if(values.search!=""){
            this.handleApply(values)
        }
    }
    handleMapType=()=>{
        const {type}=this.state;
        if(Platform.OS=='ios'){
            const newType=type=='standard'?'hybrid':'standard'
            this.setState({type:newType})
        }else{
            const newType=type=='standard'?'satellite':'standard'
            this.setState({type:newType})
        }

    }
    handleCheckCagegory=async ()=>{
        const {user} = this.props;
        const value = await AsyncStorage.getItem('chooseCategory');
        // await AsyncStorage.removeItem('chooseCategory');
        if (value===null) {
            await User.GetList('/api/UserCategory').then((rs) => {
                if (rs.status && !rs.data.length > 0) {
                    this.props.navigation.navigate("ChooseCategory", {userId: user.id});
                    AsyncStorage.setItem('chooseCategory', 'true');
                }
            })
        }
    }
    handleGetPost=async (refreshing)=>{
        // this.props.set(!refreshing)
        await User.GetList('/api/JobPost/recommended?_end=5&_start=0&categoryId=0&joblevelId=0&jobPriorityId=0&priceFrom=0&priceTo=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                this.setState({recommended:rs.data,refreshing:false})
            }
        })
        await User.GetList('/api/JobPost?_end=20&_start=0&categoryId=0&joblevelId=0&jobPriorityId=0&priceFrom=0&priceTo=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                this.setState({posts:rs.data,refreshing:false})
            }
        })
        // this.props.set(false)
    }
    handleApply=async (values)=>{
        // this.props.set(!refreshing)
        const priceFrom=values.min!=""?values.min:0;
        const priceTo=values.max!=""?values.max:0;
        const level=values.level!=""?values.level:0;
        const category=values.category!=""?values.category:0;
        this.setState({filter:false,loading:true,isFilter:true,values})
        const url="/api/JobPost?_end=10000&_start=0&categoryId="+category+"&joblevelId="+level+"&jobPriorityId=0&priceFrom="+priceFrom+"&priceTo="+priceTo+"&_order=ASC&_sort=id"
        // const url='/api/JobPost?_end=2000000&_start=0&categoryId='+category+'&joblevelId='+level+'&jobPriorityId=0&priceFrom='+priceFrom+'&priceTo='+priceTo+'&search='+values.search+'&_order=ASC&_sort=id';
        await User.GetList(url)
            .then((rs) => {

            if(rs.status){
                this.setState({filters:rs.data,loading:false})
            }
        })

    }
    handleGetCategory=async (refreshing)=>{
        // this.props.set(!refreshing)
        await User.GetList('/api/SlideShow').then((rs) => {
            if(rs.status){
                this.setState({slides:rs.data})
            }
        })
        await User.GetList('/api/JobCategory?_end=100&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                this.setState({categories:this.changeKeyName(rs.data),refreshing:false})
            }
        })
        await User.GetList('/api/JobLevel?_end=20&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                this.setState({level:this.changeKeyName(rs.data),refreshing:false})
            }
        })
        // this.props.set(false)
    }
    changeKeyName=(data)=>{
        const items=[]
        for(var i=0;i<data.length;i++){
            const item=data[i];
            item.value=item.id;
            item.label=item.name
            items.push(item)
        }
        return items
    }
    handleNext=()=>{
        this.props.navigation.navigate('Signin')
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration:500
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
        this.myRef.current.snapTo(0)
    }
    handleSubmitApply=async (id)=>{
        this.myRef.current.snapTo(2)
        await User.SubmitRequestJob({userId:this.props.user.id,jobId:id}).then((rs) => {
            if(rs.status){

            }
        })
    }
    handleGps=()=>{
        Geolocation.getCurrentPosition(info => {
            const region ={
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0521,
            }
            this.setState({region})
        });

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
    handleClear=()=>{
        const newState={... this.state}
        newState.values={
            noExpiry:false,
            category:'',
            level:'',
            min:'',
            max:'',
            start:new Date(),
            end:new Date(),
            search:''
        }
        newState.isFilter=false;
        this.setState(newState)
    }
    handleClosePanel=()=>{
        this.myRef.current.snapTo(2)
        this.setState({show:true})
    }
    render() {
        const {slides,appleMap,recommended,filters,isFilter,values,loading,map,type,region,focus,refreshing,filter,posts,categories,show,level} = this.state;
        const {user,notify} = this.props;
        const filterData={categories,level};
        const renderItem = ({ item, index }: any) => (
            <Item key={`intro ${index}`} index={index} source={item.photoURL} title={item.label} />
        );
        const {lang} = this.props.setting;
        return (
            <>
                <View style={{flex:1,alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                    <View style={{marginTop:barHight}}>
                        <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent={true}/>
                        {/*<HeaderOrganizer bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>*/}
                        { user.userType=='1'?
                            <HeaderOrganizer notiScreen={()=>this.props.navigation.navigate('Notification')} bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>:
                            <Headers handleGo={this.handleGo} onChange={this.handleInput} search={values.search} isFilter={isFilter} handleClear={this.handleClear} notiScreen={()=>this.props.navigation.navigate('Notification')} onFocus={()=>this.setState({focus:true})} bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>}

                        {map&&!isFilter?
                            <View style={{alignItems:'center',width,height:height}}>

                                    <>

                                    <MapView
                                        showsUserLocation={true}
                                        provider={!appleMap&&PROVIDER_GOOGLE}
                                        onRegionChangeComplete={this.onRegionChangeComplete}
                                        mapType={type}
                                        region={region}
                                        style={{ width: width, height: '90%'}}
                                    >
                                                <RenderMarker data={posts} onPress={this.handleOpen}/>
                                    </MapView>
                                    {focus&&<TouchableOpacity onPress={this.handleTabOverlay} style={{width:'100%',height:'100%',position:'absolute'}}>
                                    </TouchableOpacity>}
                                    </>
                            </View>:
                            isFilter?
                                <View style={{alignItems:'center',paddingBottom:100,width}}>
                                    <TextHorizontal title={"Result"} onPress={()=>this.props.navigation.navigate('JobList')}/>
                                    <View style={{width:'100%',alignSelf:'center',marginTop:0}}>
                            <FlatList
                            data={filters}
                            refreshControl={<RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                            renderItem={({item,index}) =>index<5&&<CustomItem lang={lang} onPress={()=>this.handleOpen(item)} userType={this.props.user.userType} userId={this.props.user.id} item={item}/>}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            />
                            {filters&&filters.length==0&&<View style={{width:'100%',height:'80%',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:20,color:Colors.textColor}}>
                                Not found!
                            </Text>
                            </View>}
                            </View>
                                </View>:
                                <Animated.View
                                    style={[
                                        {
                                            opacity: this.state.fadeAnimation,
                                        },
                                    ]}
                                >
                            <ScrollView showsVerticalScrollIndicator={false}
                                        refreshControl={<RefreshControl
                                            colors={["#9Bd35A", Colors.textColor]}
                                            tintColor={Colors.textColor}
                                            refreshing={refreshing}
                                            onRefresh={()=>this.handleGetPost(true)} />}>
                                <SlideShow top={0} items={slides}/>
                                <View style={{alignItems:'center',paddingBottom:100}}>
                                    {recommended.length>0&&<>
                                    <TextHorizontal title={Lang[lang].recommend} onPress={()=>this.props.navigation.navigate('JobList')}/>
                                    <View style={{width:'100%',alignSelf:'center',marginTop:0}}>
                                        <FlatList
                                            scrollEnabled={false}
                                            data={recommended}
                                            refreshControl={<RefreshControl
                                                colors={["#9Bd35A", "#689F38"]}
                                                refreshing={refreshing}
                                                onRefresh={()=>this.handleGetPost(true)} />}
                                            renderItem={({item,index}) =>index<5&&<CustomItem lang={lang} onPress={()=>this.handleOpen(item)} userType={this.props.user.userType} userId={this.props.user.id} item={item}/>}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                    </>}
                                    {/*<TextHorizontal title={Lang[lang].tcategory} onPress={()=>this.props.navigation.navigate('Category')}/>*/}
                                    {/*<FlatList*/}
                                    {/*    data={categories}*/}
                                    {/*    extraData={categories}*/}
                                    {/*    renderItem={renderItem}*/}
                                    {/*    keyExtractor={(item, index) => index.toString()}*/}
                                    {/*    horizontal={true}*/}
                                    {/*    showsHorizontalScrollIndicator={false}*/}
                                    {/*    showsVerticalScrollIndicator={false}*/}
                                    {/*/>*/}
                                    {posts.length?<>
                                    <TextHorizontal title={Lang[lang].lpost} onPress={()=>this.props.navigation.navigate('JobList')}/>
                                    <View style={{width:'100%',alignSelf:'center',marginTop:0}}>
                                        <FlatList
                                            data={posts}
                                            scrollEnabled={false}
                                            refreshControl={<RefreshControl
                                                colors={["#9Bd35A", "#689F38"]}
                                                refreshing={refreshing}
                                                onRefresh={()=>this.handleGetPost(true)} />}
                                            renderItem={({item,index}) =><>
                                                <CustomItem lang={lang} onPress={()=>this.handleOpen(item)} userType={this.props.user.userType} userId={this.props.user.id} item={item}/>
                                                {/*{index==2&&<SlideShow top={10}/>}*/}
                                                </>}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                    </>:
                                        <Text style={{fontSize:20,color:Colors.textColor,fontFamily:Fonts.primary,marginTop: height/4}}>
                                            {Lang[lang].nodata}
                                        </Text>}
                                </View>
                                <View style={{height:50}}/>
                            </ScrollView>
                                </Animated.View>}


                    </View>
                    {!show&&<TouchableOpacity onPress={this.handleClosePanel}
                        style={{width:'100%',height:'100%',backgroundColor:'rgba(0,0,0,0.31)',position:'absolute'}}>
                    </TouchableOpacity>}
                    <SlidePanel navigation={this.props.navigation} handleStart={()=>this.setState({show:false})} handleClose={()=>this.setState({show:true})}
                        loading={this.state.sloading} handleCofirm={()=>this.setState({apply:true})} handleApply={this.handleSubmitApply} onInterested={this.handleInterested} user={user} userId={user.id} item={this.state.item} myRef={this.myRef} handleDetail={this.handleDetail}/>
                    {filter&&<Filter values={values} visible={filter} handleApply={this.handleApply} data={filterData} handleClose={()=>this.setState({filter:false})}/>}
                    {loading&&<View style={{width,height:height,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
                        <ActivityIndicator size={'large'} color={Colors.textColor}/>
                    </View>}
                </View>
                { user.userType=='1'&&map&&<>
                    <View style={{position:'absolute',top:100,right:15}}>
                        <Button
                            onPress={()=>this.props.navigation.navigate('AddPost',{title:'Add Post',view:false,add:true})}
                            icon={
                                <Icon
                                    name="plus"
                                    size={30}
                                    color="white"
                                />
                            }
                            buttonStyle={{width:50,height:50,borderRadius:30,backgroundColor:'rgb(255,158,0)'}}
                        />

                    </View>

                    </>}
                {map&&show&&<View style={{position:'absolute',bottom:20,right:15}}>
                    <Button
                        onPress={this.handleGps}
                        icon={
                            <Icons
                                name="gps-fixed"
                                size={25}
                                color="white"
                            />
                        }
                        buttonStyle={{width:40,height:40,borderRadius:30,backgroundColor:'rgba(24,132,255,0.91)',marginBottom:10}}
                    />
                    <Button
                        onPress={this.handleMapType}
                        icon={
                            <Icons
                                name={type=='standard'?'satellite':'map'}
                                size={25}
                                color="white"
                            />
                        }
                        buttonStyle={{width:40,height:40,borderRadius:30,backgroundColor:'rgba(24,132,255,0.91)',marginBottom:10}}
                    />
                    {/*{Platform.OS=="ios"&&<Button*/}
                    {/*    onPress={()=>this.setState({appleMap:!this.state.appleMap})}*/}
                    {/*    icon={*/}
                    {/*        <FontAwesome*/}
                    {/*            name={appleMap?"google":"apple"}*/}
                    {/*            size={25}*/}
                    {/*            color="white"*/}
                    {/*        />*/}
                    {/*    }*/}
                    {/*    buttonStyle={{width:40,height:40,borderRadius:30,backgroundColor:'rgba(24,132,255,0.91)'}}*/}
                    {/*/>}*/}
                </View>}

            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        user: state.user.user,
        notify: state.notify.notify,
        setting: state.setting.setting,
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

class RenderMarker extends Component {
    constructor(props) {
        super(props);
        this.state={
            fade:true,
            fadeAnimation: new Animated.Value(1)
        }
    }
    // componentDidMount(): void {
    //     this.startTimer()
    //     // this.fadeIn()
    // }
    //
    // fadeIn = () => {
    //     Animated.timing(this.state.fadeAnimation, {
    //         toValue: 1,
    //         duration: 1000
    //     }).start();
    // };
    //
    // fadeOut = () => {
    //     Animated.timing(this.state.fadeAnimation, {
    //         toValue: 0,
    //         duration: 1000
    //     }).start();
    // };
    // TimeCounter () {
    //     const {fade} = this.state;
    //
    //     if(fade){
    //         this.fadeIn()
    //     }else{
    //         this.fadeOut()
    //     }
    //     this.setState({fade:!fade})
    // }
    // startTimer () {
    //     clearInterval(this.timer)
    //     this.timer = setInterval(this.TimeCounter.bind(this), 2000)
    // }
    render() {
        const {data,onPress} = this.props;
        return (<>
            {data.map((item, index) => {
                    return (
            <Marker key={index} title={item.title} coordinate={{longitude: item.locLONG, latitude: item.locLAT}}
                    onPress={()=>onPress(item)}>
                {/*<Image source={require('../../assets/images/user.png')} style={{flex:1,width:24,height:36,resizeMode: 'contain' }}/>*/}
                {/*<BlinkView blinking={true} delay={600}>*/}

                <SvgXml xml={item.jobPriority.name == 'Yes' ? map_red : map_blue} width={49.625 * 0.7}
                        height={57 * 0.7}/>
                {/*</BlinkView>*/}
            </Marker>
                    )})}</>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fadingContainer: {

    },
    fadingText: {
        fontSize: 28,
        textAlign: "center",
        margin: 10,
        color : "#fff"
    },
    buttonRow: {
        flexDirection: "row",
        marginVertical: 16
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Index)
