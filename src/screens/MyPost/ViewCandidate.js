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
import {ListScreen} from '../../components/ListScreen';
import Feather from 'react-native-vector-icons/Feather'
import Icon  from 'react-native-vector-icons/MaterialIcons'
import {CustomItem, ItemCandidate, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import User from '../../api/User'
import Geolocation from '@react-native-community/geolocation';
import * as ImagePicker from 'react-native-image-picker';
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

            },
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
                    newState.values.deadline=data.isNoneExpired?"No Expiry":FormatDate(data.createDate)+" - "+FormatDate(data.expiryDate);
                    newState.isLocation=data.isShowLocation;
                    newState.long=data.locLONG;
                    newState.lat=data.locLAT;
                    newState.region=data.jobPostArea;
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
        this.props.set(true)
        this.setState({apply:false})
        await User.SubmitRequestJob({userId:this.props.user.id,jobId:values.id}).then((rs) => {
            if(rs.status){
            }
        })
        this.props.set(false)

    }
    openMap=(long,lat)=>{
        const url=Platform.OS=='ios'?'maps://app?saddr=100+101&daddr='+lat+'+'+long:'google.navigation:q='+lat+'+'+long
        Linking.openURL(url)
    }
    render() {
        const {loading,selected,candidate,confirm,apply,selectSkill,region,viewImage,imagesUrl,tab,isLocation,images,category,level,priority,skill,values} = this.state
        const { title,view,home,job } = this.props.route.params;
        const {user} = this.props
        const data={values,error:[],focus:false}
    return (
        <>
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
            <View style={{zIndex:1}}>
                <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                    <View style={{width:'10%',justifyContent:'flex-end',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'80%',alignSelf:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',fontSize:25}}>{title}</Text>
                    </View>
                    <View style={{width:'10%',justifyContent:'flex-start'}}>
                    </View>
                </View>
                <View style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:0,height:'90%'}}>
                    <>
                        {candidate.length>0?<ScrollView showsVerticalScrollIndicator={false}>
                            <FlatList
                                contentContainerStyle={{marginBottom:0}}
                                data={candidate}
                                renderItem={({item,index}) =><ItemCandidate selected={selected} viewUser={()=>this.props.navigation.navigate('ViewUser',{userId:item.userId,view:true,loading:true})}
                                                                            handleSelect={()=>this.handleSelect(item)} status={item.status} date={item.createdDate} item={item} index={index} bottom={index==8?250:0}/>}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </ScrollView>:

                            <ScrollView
                                // refreshControl={<RefreshControl
                                // colors={["#9Bd35A", "#689F38"]}
                                // refreshing={false}
                                // onRefresh={()=>this.handleGetPredata(true)} />}
                            >
                                {!loading&&<View style={{width:'100%',height:height*0.8,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:20,color:Colors.textColor}}>
                                        No Candidate
                                    </Text>
                                </View>}
                            </ScrollView>}
                            </>

                </View>

            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

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
        {loading&&<View style={{width,height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor}/>
        </View>}
            <ImageView
                images={imagesUrl}
                imageIndex={0}
                visible={viewImage}
                backgroundColor={'#000'}
                onRequestClose={() => this.setState({viewImage:false})}
            />
        </>
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
