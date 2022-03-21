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
    Linking,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    Alert, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons'
import Feather  from 'react-native-vector-icons/Feather'
import FbGrid from "react-native-fb-image-grid";
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import User from '../../api/User'
import {Button,CheckBox} from 'react-native-elements';
import {setLoading} from '../../redux/actions/loading';
import moment from 'moment';
import {connect} from 'react-redux';
import {Confirm} from '../../components/Dialog';
import FastImage from 'react-native-fast-image';
import {RFPercentage} from 'react-native-responsive-fontsize';
import ImageView from 'react-native-image-viewing/dist/ImageViewing';
const {width,height} = Dimensions.get('window')
const FormatDate = (date) => {
    return moment(date).format('DD/MM/YYYY')
};
class Index extends Component {
    constructor(props) {
        const { post } =props.route.params
        super(props);
        this.state={
            coordinate:null,
            long:104.9282,
            index:0,
            confirm:false,
            lat:11.5564,
            tab:post?1:0,
            loading:true,
            isLocation:false,
            viewImage:false,
            values:{
                id:0,
                title:'',
                category:0,
                description:'',
                level:0,
                deadline:'',
                priority:0,
                extra:'0',
                reward:'0',
                location:'',
                skill:[],
                name:'',
                check:false,

            },
            user:null,
            images:[],
            imagesUrl:[],
            loadings:[false,false,false,false,false],
            category:[],
            level:[],
            deadline:[],
            priority:[],
            candidate:[],
            apply:false,
            skill:[],
            selectSkill:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {

        this.fadeIn()
        this.handleGetPredata()
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude,coordinate:info.coords}));
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
    handleSubmit=async ()=>{
        this.setState({confirm:true})
    }
    handleConfirm=async ()=>{
        // this.props.set(true)
        await User.AddJob(
            this.state.values,
            this.state.imagesUrl,
            this.props.user.id,
            {location:this.state.isLocation,
                long:this.state.long,lat:this.state.lat}
        ).then((rs) => {

        })
        this.props.set(false)
    }
    setLocation=(coordinate)=>{
        this.setState({coordinate:coordinate,lat:coordinate.latitude,long:coordinate.longitude})
    }
    handleSwitch=(index)=>{
        this.setState({tab:index})
    }

    handleGetPredata=async ()=>{
        const { view,id } = this.props.route.params
        // this.props.set(true)
            await User.GetList('/api/JobPost/'+id).then((rs) => {
                if(rs.status){
                    const {data}=rs
                    const newState={... this.state}
                    newState.values.id=data.id;
                    newState.values.title=data.title;
                    newState.values.category=data.jobCategory.name;
                    newState.values.description=data.description;
                    newState.values.level=data.jobLevel.name;
                    newState.values.priority=data.jobPriority.name;
                    newState.values.extra=data.extraCharge.toString();
                    newState.values.reward=data.reward.toString();
                    newState.values.address=data.address.toString();
                    newState.values.deadline=data.isNoneExpired?"No Expiry":FormatDate(data.createdDate)+" - "+FormatDate(data.expiryDate);
                    newState.isLocation=data.isShowLocation;
                    newState.long=data.locLONG;
                    newState.lat=data.locLAT;
                    newState.region=data.jobPostArea;
                    newState.values.createDate=data.createdDate;
                    newState.values.profile=data.user.profileURL;
                    newState.values.phone=data.user.phone;
                    newState.user=data.user;
                    newState.values.name=data.user.lastName+" "+data.user.firstName;
                    const images=[]
                    const imagesUrl=[]
                    for(var j=0;j<data.jobPostPhotos.length;j++){
                        images.push(data.jobPostPhotos[j].url)
                        imagesUrl.push({uri:data.jobPostPhotos[j].url})
                    }
                    newState.images=images;
                    newState.imagesUrl=imagesUrl;
                    newState.values.skill=data.jobPostSkills;
                    this.setState(newState)
                }
            })
        await User.GetList('/api/JobCandidate/JobPost/'+id).then((rs) => {
            if(rs.status){
                const {data}=rs
                const newState={... this.state}
                newState.candidate=rs.data
                this.setState(newState)
            }
        })
        this.setState({loading:false})
    }
    handleSelect=async (item)=>{
        this.setState({loading:true})
        await User.Put('/api/JobCandidate/Progress/'+item.id+'/selected',{})
        // await User.Put('/api/JobPost/Progress/'+item.jobPostId+'/selected',{})
        await this.handleGetPredata()
        this.setState({loading:false})
    }
    handleInput=(f,v)=>{
        const newState={... this.state}
        newState.values[f]=v;
        this.setState(newState)

    }
    handleCheck=(index,id)=>{
        const newState={... this.state}
        newState.values.skill[index]=newState.values.skill[index]==id?0:id
        this.setState(newState)
    }
    handleRemove=(index)=>{
        const newState={... this.state}
        newState.values.skill[index]=0
        this.setState(newState)
    }
    handleSubmitApply=async ()=>{
        const {values} = this.state
        this.setState({apply:false,loading:true})
        await User.SubmitRequestJob({userId:this.props.user.id,jobId:values.id}).then((rs) => {
            if(rs.status){
            }
        })
        this.setState({loading:false});
        this.props.navigation.goBack()

    }
    openMap=(long,lat)=>{
        const url=Platform.OS=='ios'?'maps://app?saddr=100+101&daddr='+lat+'+'+long:'google.navigation:q='+lat+'+'+long
        Linking.openURL(url)
    }
    renderTextItem(label,text){
        return(
            <View style={{width:'100%',flexDirection:'row',marginTop:5,alignItems:'center'}}>
                <Text style={styles.textItem}>{label}: </Text>
                <Text style={[styles.textItem,{fontWeight:'bold'}]}>{text}</Text>

            </View>

        )
    }
    handleFavorite=()=>{
        const newState={... this.state}
        newState.values.check=!newState.values.check;
        this.setState(newState);
        User.AddInterested({userId:this.props.user.id,jobId:newState.values.id})
    }
    handleViewCandidate=()=>{
        this.props.navigation.navigate('ViewUser',{userId:this.state.user.id,view:true})
    }
    render() {
        const {loading,index,candidate,confirm,apply,selectSkill,region,viewImage,imagesUrl,tab,isLocation,images,category,level,priority,skill,values} = this.state
        const { title,view,home,post,job } = this.props.route.params;
        const {user} = this.props
        const data={values,error:[],focus:false}
    return (
        <>
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:Colors.primary }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
            <View style={{height:'10%',justifyContent:'flex-end'}}>
                <View style={{width:'100%',alignSelf:'center',flexDirection:'row',alignItems:'flex-end',backgroundColor:Colors.primary}}>
                    <View style={{width:'10%',justifyContent:'flex-end',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'80%',alignSelf:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',fontSize:20}}>{values.name}</Text>
                    </View>
                    <TouchableOpacity disabled={post}
                    onPress={this.handleViewCandidate} style={{width:'10%',alignSelf:'center',alignItems:'center'}}>
                        <FastImage
                                   source={values.profile && values.profile != '' ? {
                                       uri: values.profile,
                                       priority: FastImage.priority.normal,
                                   } : require('../../assets/images/avatar.png')}
                                   resizeMode={FastImage.resizeMode.contain}
                                   style={{
                                       width: 30, height: 30,marginRight:10,
                                       borderWidth: 1, borderColor: '#fff', borderRadius: 25,
                                   }}/>
                    </TouchableOpacity>
                </View>
            </View>
                <View style={{width,alignSelf:'center',
                    backgroundColor:'#fff',marginTop:10,height:post?'90%':'80%',flex:1}}>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{
                                width: (width * 0.9),
                                alignSelf: 'center',
                                alignItems: 'center',
                                paddingBottom: 10,
                            }}>
                                {images.length>0&&images[0]!=''&&<View style={{width:'110%',height:height*0.3,alignItems:'center'}}>
                                    <FbGrid

                                    images={images}
                                    onPress={(image,index,e)=>this.setState({viewImage:true,index})}
                                />
                                </View>}
                                <Text style={styles.textSm}>{values.title}</Text>
                                <View style={{width:'100%',flexDirection:'row',marginTop:10,alignItems:'center'}}>
                                    <Text style={[styles.reward,{fontWeight:'bold',width:'40%'}]}>
                                        ${(Number(values.reward)+Number(values.extra)).toFixed(2)}
                                    </Text>
                                    <Text style={[styles.reward,{width:'40%',fontSize:14,color:'gray',textAlign: 'right'}]}>
                                        {moment(values.createDate).fromNow()}
                                    </Text>
                                    {view&&
                                    <TouchableOpacity
                                        onPress={this.handleFavorite} style={{width:'20%',alignSelf:'center',alignItems:'flex-end'}}>
                                        <Icons name={values.check?'favorite':'favorite-outline'} color={Colors.textColor} size={25}/>
                                    </TouchableOpacity>}
                                </View>
                                <Text style={styles.textTitle}>Description</Text>
                                {this.renderTextItem('Category',values.category)}
                                {this.renderTextItem('Task Level',values.level)}
                                {this.renderTextItem('Deadline',values.deadline)}
                                {this.renderTextItem('Priority',values.priority)}
                                {this.renderTextItem('Reward','$'+values.reward)}
                                {this.renderTextItem('Extra','$'+values.extra)}
                                {this.renderTextItem('Address',values.address?values.address:"N/A")}
                                <Text style={[styles.textStyle,{marginTop:10}]}>{values.description}</Text>

                                <View style={{width: '100%', marginTop: 10}}>
                                    {isLocation && region &&
                                    <View style={{
                                        width: '100%',
                                        height: 150,
                                        borderWidth: 1,
                                        borderColor: Colors.primary,
                                        marginTop: 10,
                                        borderRadius: 0
                                    }}>
                                        <MapView
                                            showsUserLocation={true}
                                            provider={PROVIDER_GOOGLE}
                                            onPress={info => this.setLocation(info.nativeEvent.coordinate)}
                                            mapType={Platform.OS == "android" ? "standard" : "standard"}
                                            region={region}
                                            style={{width: '100%', height: '100%', borderRadius: 0,justifyContent:'flex-end',alignItems:'flex-end'}}
                                        >
                                            <Marker description={''} coordinate={{latitude: region.latitude,
                                                longitude: region.longitude}}/>
                                        </MapView>
                                        <TouchableOpacity onPress={() => this.openMap(region.longitude,region.latitude)} style={{alignItems:'center',justifyContent:'center',position:'absolute',width:50,height:50,backgroundColor:'rgba(24,132,255,0.86)',borderRadius:25,right:5,bottom:5}}>
                                            <Icon name={'directions'} size={30} color={'#fff'} style={{}}/>
                                        </TouchableOpacity>
                                    </View>
                                    }
                                </View>
                            </View>

                        </ScrollView>
                    {view&&
                    <View style={{height:Platform.OS=='ios'?'10%':'8%',backgroundColor:Colors.primary}}>
                        <View style={{width:'100%',alignSelf:'center',flexDirection:'row',alignItems:'flex-end',backgroundColor:Colors.primary,height:Platform.OS=='ios'?'80%':'100%'}}>
                                <TouchableOpacity style={{width:'50%',borderRightWidth:1,height:'100%',borderColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}
                                                  onPress={()=>callNumber(values.phone)}>
                                    <Icons name={'phone'} color={'#fff'} size={35}/>
                                    <Text style={{color:'#fff',fontSize:20}}> Call</Text>
                                </TouchableOpacity>
                            <TouchableOpacity style={{width:'50%',height:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}
                                              onPress={()=>this.setState({apply:true})}>
                                <Text style={{color:'#fff',fontSize:20}}> Apply</Text>
                                <Icons name={'done'} color={'#fff'} size={35}/>

                            </TouchableOpacity>
                        </View>
                    </View>}
            </View>

            {selectSkill&&<Modal statusBarTranslucent={true} visible={true} animationType={'fade'} transparent={true}>
                <View style={{width,height:height,backgroundColor:'rgba(0,0,0,0.43)',alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'90%',height:'80%',backgroundColor:'#fff',borderRadius:20}}>
                    <View style={{width:'100%',height:60,borderBottomWidth:0.5,flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.setState({selectSkill:false})} style={{width:'15%',alignItems:'center'}}>
                            <Icon name={'close'} size={30} color={'red'}/>
                        </TouchableOpacity>
                        <Text style={{fontSize:20,width:'70%',textAlign:'center'}}>Select Skill</Text>
                        <TouchableOpacity onPress={()=>this.setState({selectSkill:false})} style={{width:'15%',alignItems:'center'}}>
                            <Icon name={'done'} size={30} color={'green'}/>
                        </TouchableOpacity>
                    </View>
                        <FlatList
                            contentContainerStyle={{marginTop:0}}
                            data={skill}
                            renderItem={({item,index}) =>(
                                <View style={{flexDirection:'row',width:'90%',alignSelf:'center',borderBottomWidth:0.3,height:40,alignItems:'center'}}>
                                    <Text style={{width:'85%'}}>{item.name}</Text>
                                    <CheckBox
                                        onPress={()=>this.handleCheck(index,item.id)}
                                        checked={item.id==values.skill[index]}
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>}
            {confirm&&<Confirm handleClose={()=>this.setState({confirm:false})} handleConfirm={this.handleConfirm} title={'Confirm'} subtitle={'Are you sure to submit?'} visible={confirm}/>}
            {apply&&<Confirm handleClose={()=>this.setState({apply:false})} handleConfirm={this.handleSubmitApply} title={'Confirm'} subtitle={'Are you sure to submit?'} visible={apply}/>}
        </View>
        {loading&&<View style={{width,height:height*1.2,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor}/>
        </View>}
            <ImageView
                images={imagesUrl}
                imageIndex={index}
                visible={viewImage}
                backgroundColor={'#000'}
                onRequestClose={() => this.setState({viewImage:false})}
            />
        </>
    );
  }
}
export const callNumber = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else  {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};
const styles = StyleSheet.create({
    textStyle:{
        color:'#5e5e5e',
        fontSize:14,
        marginTop:0,
        width:'100%'
    },
    textSm:{
        color:'#5e5e5e',
        fontSize:20,
        marginTop:10,
        width:'100%'
    },
    textLabel:{
        color:'#5e5e5e',
        fontSize:14,
        marginTop:2,
        width:'100%'
    },
    textItem:{
        color:'#5e5e5e',
        fontSize:14,
    },
    reward:{
        color:'red',
        fontSize:20,
    },
    textTitle:{
        color:Colors.textColor,
        fontSize:20,
        marginTop:10,
        width:'100%'
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
