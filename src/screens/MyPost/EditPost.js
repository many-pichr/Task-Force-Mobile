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
    Switch,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    Button,
    Alert, TextInput, ActivityIndicator,
} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import Feather from 'react-native-vector-icons/Feather'
import Icon  from 'react-native-vector-icons/MaterialIcons'
import {CustomItem, ItemCandidate, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors, Fonts} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import MapView, {Marker, PROVIDER_GOOGLE,AnimatedRegion,Animated as Animateds} from 'react-native-maps';
import User from '../../api/User'
import Geolocation from '@react-native-community/geolocation';

import * as ImagePicker from 'react-native-image-picker';
import {CheckBox} from 'react-native-elements';
import {setLoading} from '../../redux/actions/loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import {connect} from 'react-redux';
import {Confirm,MoneyWarning} from '../../components/Dialog';
import {RFPercentage} from 'react-native-responsive-fontsize';
import moment from 'moment';
import schama from './validator';
import Lang from '../../Language';
import {checkForPermissions} from '../../components/Permission';
import Func from '../../utils/Functions'
const validate = require("validate.js");
const FormatDate = (date) => {
    return moment(date).format('DD/MM/YYYY')
};
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        const {item} = props.route.params;
        console.log(item)
        super(props);
        this.state={
            region: item.jobPostArea,
            camera:false,
            loading:true,
            coordinate:null,
            title:'Edit Task',
            warning:false,
            view:false,
            long:104.9282,
            confirm:false,
            noExpiry:item.isNoneExpired,
            pinLocation:false,
            lat:11.5564,
            tab:0,
            isLocation:item.isShowLocation,
            values:{
                id: item.id,
                title: item.title,
                category:item.jobCategoryId,
                description:item.description,
                level:item.jobLevelId,
                deadline:'',
                priority:item.jobPriorityId,
                extra:item.extraCharge.toString(),
                reward:item.reward.toString(),
                location:'',
                start:item.createDate,
                end:item.expireDate,
                address:item.address,
                skill:[],
                noExpiry:item.isNoneExpired
            },
            focus:false,
            error:[],
            choosedate:false,
            images:this.getImageUrl(item.jobPostPhotos),
            imagesUrl:this.getImageUrl(item.jobPostPhotos),
            loadings:[false,false,false,false,false],
            category:[],
            level:[],
            deadline:[],
            priority:[],
            skill:[],
            selectSkill:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        const {params } = this.props.route
        this.handleCheckPermission()
        this.fadeIn()
        this.handleGetPredata()
        // Geolocation.getCurrentPosition(info => {
        //     const region ={
        //         latitude: info.coords.latitude,
        //         longitude: info.coords.longitude,
        //         latitudeDelta: 0.0922,
        //         longitudeDelta: 0.0521,
        //     }
        //     this.setState({region})
        // });
    }
    handleCheckPermission=async ()=>{
        checkForPermissions(true,'camera').then((status) => {
            this.setState({camera:status})
        })
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
        this.setState({loading:true,confirm:false})
        const {params} = this.props.route;
        await User.EditJob(
            this.state.values,
            this.state.imagesUrl,
            this.props.user.id,this.state.isLocation,this.state.noExpiry,this.state.region
        ).then((rs) => {
            this.setState({confirm:false})
            if(params&&params.add){
                this.props.navigation.goBack()
            }else{
                this.props.navigation.navigate("MyPost",{refresh:true});
            }
        })
        this.setState({loading:false})
    }
    setLocation=(event,coordinate)=>{
        this.setState({coordinate:coordinate})
        // this.setState({coordinate:coordinate,lat:coordinate.latitude,long:coordinate.longitude})
    }
    handleSwitch=(index)=>{
        this.setState({tab:index})
    }
    handlePicker=(index)=>{
        Alert.alert(
            "Choose Image",
            "Please choose image source",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Gallery", onPress: () => this.handleImagePicker(index,false) },
                { text: "Camera", onPress: () => this.handleImagePicker(index,true) },
            ],
            { cancelable: true }
        );
    }
    handleImagePicker=(index,cameraType)=>{
        const {camera} = this.state;
        if(cameraType&&!camera) {
            this.handleCheckPermission()
        }else{
            ImagePicker[cameraType ? 'launchCamera' : 'launchImageLibrary'](
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    quality: 0.3,
                    // maxHeight: 200,
                    // maxWidth: 500,
                },
                (response) => {
                    if (!response.didCancel) {
                        const newState = {...this.state}
                        newState.images[index] = response.uri
                        newState.loadings[index] = true;
                        this.setState(newState)
                        User.UploadImage(response.uri,true).then((rs) => {

                            if (rs.status) {
                                const newState = {...this.state}
                                newState.loadings[index] = false;
                                newState.imagesUrl[index] = rs.data.fileName
                                this.setState(newState);
                            }
                        })
                    }


                },
            )
        }
    }
    changeKeyName=(data)=>{
        const items=[]
        for(var i=0;i<data.length;i++){
            items.push({
                value:data[i].id,
                label:data[i].name,
            })
        }
        return items
    }
    getSkillId(val,val1){
        let result=0;
        for(var i=0;i<val.length;i++){
            const item=val[i];
            if(item.skillId==val1.id){
                result=val1.id;
            }
        }
        return result;
    }
    getImageUrl(val){
        const images=['','','','',''];
        for(var i=0;i<val.length;i++){
            const item=val[i];
            images[i]=item.url;
        }
        return images;
    }
    handleGetPredata=async ()=>{
        const { view } = this.state;
        const {item} = this.props.route.params;
        await User.GetList('/api/JobCategory/mobile').then((rs) => {
            if(rs.status){
                this.setState({category:this.changeKeyName(rs.data)})
            }
        })
        await User.GetList('/api/JobLevel/mobile').then((rs) => {
            if(rs.status){
                this.setState({level:this.changeKeyName(rs.data)})
            }
        })
        await User.GetList('/api/JobPriority/mobile').then((rs) => {
            if(rs.status){
                this.setState({priority:this.changeKeyName(rs.data)})
            }
        })
        await User.GetList('/api/Skill/mobile').then((rs) => {
            if(rs.status){
                const newState={... this.state}
                newState.skill=rs.data
                const items=[]
                for(var i=0;i<rs.data.length;i++){
                    const skill=this.getSkillId(item.jobPostSkills,rs.data[i]);
                    items.push(skill)
                }
                newState.values.skill=items
                newState.confirm=false
                this.setState(newState)
            }
        })
        if(view){
            const { id } = this.props.route.params
            await User.GetList('/api/JobPost/'+id).then((rs) => {
                if(rs.status){
                    const {data}=rs
                    const newState={... this.state}
                    newState.values.title=data.title;
                    newState.values.category=data.jobCategoryId;
                    newState.values.description=data.description;
                    newState.values.level=data.jobLevelId;
                    newState.values.priority=data.jobPriorityId;
                    newState.values.start=data.createDate;
                    newState.values.end=data.expiryDate;
                    newState.values.extra=data.extraCharge.toString();
                    newState.values.reward=data.reward.toString();
                    newState.isLocation=data.isShowLocation;
                    const skills=this.state.skill
                    const skill=[]
                    for(var i=0;i<skills.length;i++){
                        let id=0
                        for(var j=0;j<data.jobPostSkills.length;j++){
                            if(skills[i].id==data.jobPostSkills[j].skillId){
                                id=skills[i].id
                            }
                        }
                        skill.push(id)
                    }
                    const images=newState.images
                    for(var j=0;j<data.jobPostPhotos.length;j++){
                        images[j]=(data.jobPostPhotos[j].url)
                    }
                    newState.images=images;
                    newState.imagesUrl=images;
                    newState.values.skill=skill;
                    newState.loading=false,
                    this.setState(newState)
                }
            })
        }
        this.setState({loading:false})
    }
    handleInput=async (f,v)=>{
        const newState={... this.state}
        newState.values[f]=v;
        const err = await validate(newState.values, schama);
        newState.error=err
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
    submitButton=async ()=>{
        const {item} = this.props.route.params;
        const newState={... this.state}
        const err = await validate(newState.values, schama);
        newState.error=err
        newState.focus=true
        this.setState(newState)
        if(err==undefined){
            const {values} = this.state;
            const {user} = this.props;
            const total = (parseFloat(values.reward)+parseFloat(values.extra==''?0:values.extra))
            const oldTotal = (item.reward+item.extraCharge)
            const balance=user.userWallet.setledCash+oldTotal;
            if(total>0){
                if(total>balance){
                    this.setState({warning:true})
                }else{
                    this.handleSubmit()
                }
            }
        }

    }
    handleWarning=async ()=>{
        this.setState({warning:false})
        this.props.navigation.navigate("CashIn",{post:true})
    }
    onRegionChangeComplete=(region)=>{

        // this.setState({coordinate:coordinate,lat:coordinate.latitude,long:coordinate.longitude})
        this.setState({region})
    }
    render() {
        const {params} = this.props.route;
        const {error,region,focus,warning,loading,pinLocation,noExpiry,loadings,view,title,confirm,selectSkill,choosedate,coordinate,long,lat,tab,isLocation,images,category,level,priority,skill,values} = this.state
        const data={error,focus,values}
        const {lang} = this.props.setting;
        return (
        <>
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#FFF' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
            <View style={{zIndex:1}}>
                <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                    <View style={{width:'10%',justifyContent:'flex-end'}}>
                        {params&&params.add&& <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                        </TouchableOpacity>}
                    </View>
                    <View style={{width:'70%',alignSelf:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',fontSize:RFPercentage(2.8),fontFamily:Fonts.primary}}>{"Edit Task"}</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <View style={{flex:1,width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#f7f9fc',marginTop:10,height:height}}>
                    {title=="View Post"&&
                    <View style={{width:'90%',alignSelf:'center',height:60,flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.handleSwitch(0)}  style={{width:'50%',height:50,borderBottomWidth:tab==0?2:0,borderColor:Colors.textColor,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:Colors.textColor}}>Post Detail</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.handleSwitch(1)} style={{width:'50%',height:50,borderBottomWidth:tab==1?2:0,borderColor:Colors.textColor,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:Colors.textColor}}>Agents</Text>
                        </TouchableOpacity>
                    </View>}
                    {tab == 0 ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{
                                width: (width * 0.9) * 0.9,
                                alignSelf: 'center',
                                alignItems: 'center',
                                paddingBottom: 200,
                            }}>
                                <View style={{flexDirection: 'row', marginTop: 5}}>
                                    <Text style={{color: Colors.textColor, width: '50%', textAlign: 'left',fontFamily:Fonts.primary}}>{Lang[lang].photo}</Text>
                                    <Text style={{color: Colors.textColor, width: '50%', textAlign: 'right'}}>0/5</Text>
                                </View>
                                <View style={{flexDirection: 'row',borderRadius:10,}}>
                                    <FlatList
                                        style={{marginTop: 10, flexDirection: 'row',borderRadius:10,}}
                                        data={[0,1,2,3,4]}
                                        renderItem={({item, index}) =>(
                                            images[index]!=''?
                                                <TouchableOpacity onPress={()=>this.handlePicker(index)}>
                                                <Image source={{uri:images[index]}} style={{
                                                    marginLeft: index == 0 ? 0 : 10,
                                                    width: ((width * 0.9) * 0.9) / 3,
                                                    height: ((width * 0.9) * 0.9) / 3,
                                                    backgroundColor: 'rgba(21,130,244,0.18)',
                                                    justifyContent: 'center',
                                                    borderRadius:10,
                                                    alignItems: 'center'
                                                }}/>
                                                    {loadings[index]&&<View style={{marginLeft: index == 0 ? 0 : 10,
                                                      width: ((width * 0.9) * 0.9) / 3,
                                                      height: ((width * 0.9) * 0.9) / 3,
                                                      justifyContent: 'center',
                                                      borderRadius:10,
                                                      alignItems: 'center',position:'absolute',backgroundColor:'rgba(0,0,0,0.22)'}}>
                                                        <ActivityIndicator color={'#fff'}/>
                                                    </View>}
                                                </TouchableOpacity>:
                                                    <TouchableOpacity onPress={()=>this.handlePicker(index)} style={{
                                                marginLeft: index == 0 ? 0 : 10,
                                                width: ((width * 0.9) * 0.9) / 3,
                                                height: ((width * 0.9) * 0.9) / 3,
                                                backgroundColor: 'rgba(21,130,244,0.18)',
                                                justifyContent: 'center',
                                                        borderRadius:10,
                                                alignItems: 'center'
                                            }}>
                                                <Icons name={'add-photo-alternate'} size={30} color={Colors.textColor}/>
                                                <Text style={{fontSize: 13, color: Colors.textColor}}>{Lang[lang].cphoto}</Text>
                                            </TouchableOpacity>)
                                        }
                                        horizontal
                                        pagingEnabled={true}
                                        showsHorizontalScrollIndicator={false}
                                        legacyImplementation={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                    />

                                </View>
                                <CustomPicker required handleInput={this.handleInput} input label={Lang[lang].subject} title={Lang[lang].subject} name={'title'} value={data}/>
                                <CustomPicker required handleInput={this.handleInput} items={category} lang={lang} label={Lang[lang].category} name={'category'} title={'Mobile App UX/UI'} value={data}/>
                                <CustomPicker required handleInput={this.handleInput} input label={Lang[lang].description} title={Lang[lang].description} name={'description'} textarea value={data}/>
                                <CustomPicker handleInput={this.handleInput} items={level} lang={lang} label={Lang[lang].level} name={'level'} title={'Medium'} value={data}/>
                                <CustomPicker noError required date disabled={noExpiry} onPress={()=>this.setState({choosedate:true})} label={Lang[lang].deadline} title={(values.start&&values.end)?(FormatDate(values.start)+' - '+FormatDate(values.end)):Lang[lang].pls+Lang[lang].select} name={'deadline'} value={data}/>
                                <View style={{flexDirection:'row',marginTop:5}}>
                                    <Text style={{fontSize: RFPercentage(2.2), color: Colors.textColor,width:'85%',fontFamily:Fonts.primary}}>{Lang[lang].expiry}</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#1884ff" }}
                                        // thumbColor={isLocation ? "#f5dd4b" : "#f4f3f4"}
                                        // ios_backgroundColor="#3e3e3e"
                                        onValueChange={()=>this.setState({noExpiry:!noExpiry})}
                                        value={noExpiry}
                                    />
                                </View>
                                <CustomPicker required handleInput={this.handleInput} lang={lang} items={priority} label={Lang[lang].priority} name={'priority'} title={'Urgent'} value={data}/>
                                <TouchableOpacity style={{width:'100%'}} onPress={()=>this.setState({selectSkill:true})} >
                                    <Text style={{fontSize:RFPercentage(2.5),color:Colors.textColor,marginTop:10,fontFamily:Fonts.primary}}>{Lang[lang].skill}</Text>
                                    <View style={{width:'100%',flexDirection:'row',borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                                        <Text style={{width:'50%',fontSize:RFPercentage(2)}}>{Lang[lang].select}{Lang[lang].skill}</Text>
                                        <View style={{width:'47%',alignItems:'flex-end'}}>
                                        <Icon name={'arrow-drop-down'} size={25}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <FlatList
                                    contentContainerStyle={{marginTop:0}}
                                    data={skill}
                                    renderItem={({item,index}) =>(
                                        item.id==values.skill[index]&&<View style={{flexDirection:'row',width:'100%',alignSelf:'center',borderBottomWidth:0.3,height:35,alignItems:'center'}}>
                                            <Text style={{width:'85%'}}>{item.name}</Text>
                                            <TouchableOpacity onPress={()=>this.handleRemove(index)} style={{width:'15%',alignItems:'center'}}>
                                                <Icon name={'close'} size={20} color={'red'}/>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                                <CustomPicker required number handleInput={this.handleInput} input label={Lang[lang].reward} title={'0.00'} name={'reward'} value={data}/>
                                <CustomPicker number handleInput={this.handleInput} input label={Lang[lang].extra} title={'0.00'} name={'extra'} value={data}/>
                                <CustomPicker handleInput={this.handleInput} input label={Lang[lang].address} title={'Address'} name={'address'} input value={data}/>

                                <View style={{width: '100%', marginTop: 10}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{fontSize: RFPercentage(2.5), color: Colors.textColor,width:'85%',fontFamily:Fonts.primary}}>{Lang[lang].location}</Text>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "#1884ff" }}
                                            // thumbColor={isLocation ? "#f5dd4b" : "#f4f3f4"}
                                            // ios_backgroundColor="#3e3e3e"
                                            onValueChange={()=>this.setState({isLocation:!isLocation})}
                                            value={isLocation}
                                        />
                                    </View>
                                    {isLocation &&
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
                                            mapType={Platform.OS == "android" ? "standard" : "standard"}
                                            region={region}
                                            style={{width: '100%', height: '100%', borderRadius: 0}}
                                        >
                                            <MapView.Marker.Animated
                                                ref={marker => { this.marker = marker }}
                                                coordinate={{longitude: region.longitude,latitude: region.latitude}}
                                            />
                                        </MapView>
                                        <TouchableOpacity  onPress={()=>this.setState({pinLocation:true})} style={{width:'100%',height:'100%',position:'absolute'}}>

                                        </TouchableOpacity>
                                    </View>
                                    }
                                    <TouchableOpacity
                                        onPress={this.submitButton}
                                        style={{
                                            alignSelf: 'center',
                                            backgroundColor:Colors.textColor,
                                            width:RFPercentage(40),
                                            height:RFPercentage(8),
                                            marginTop:RFPercentage(7.5),
                                            borderRadius:10,
                                            justifyContent:'center',
                                            alignItems:'center'
                                        }}
                                    >
                                        <Text style={{color:'#fff',fontSize:RFPercentage(2.5),fontFamily:Fonts.primary}}>{"Update"}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </ScrollView> :
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <FlatList
                                contentContainerStyle={{marginTop:0}}
                                data={[1,2,3,4,5,6,7,8,9]}
                                renderItem={({item,index}) =><ItemCandidate  index={index} bottom={index==8?250:0}/>}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </ScrollView>
                    }
                </View>

            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

            </View>

            {selectSkill&&<Modal statusBarTranslucent={true} visible={true} animationType={'fade'} transparent={true}>
                <View style={{width,height:height,backgroundColor:'rgba(0,0,0,0.43)',alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'90%',maxHeight:'80%',backgroundColor:'#fff',borderRadius:20}}>
                    <View style={{width:'100%',height:60,borderBottomWidth:0.3,flexDirection:'row',alignItems:'center'}}>
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
                                <View style={{flexDirection:'row',width:'90%',alignSelf:'center',borderBottomWidth:0.3,height:50,alignItems:'center'}}>
                                    <Text style={{width:'85%',fontSize:16}}>{item.name}</Text>
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
            {choosedate&&<Modal statusBarTranslucent={true} visible={choosedate} animationType={'fade'} transparent={true}>
                <View style={{width,height:'100%',backgroundColor:'rgba(0,0,0,0.43)',alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'70%',paddingBottom:10,backgroundColor:'#fff',borderRadius:20}}>
                        <View style={{width:'100%',paddingVertical:10,borderBottomWidth:0.3,flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.setState({choosedate:false})} style={{width:'15%',alignItems:'center'}}>
                                <Icon name={'close'} size={30} color={'red'}/>
                            </TouchableOpacity>
                            <Text style={{fontSize:RFPercentage(2.5),width:'70%',textAlign:'center',fontFamily:Fonts.primary}}>{Lang[lang].cdateline}</Text>
                            <TouchableOpacity onPress={()=>this.setState({choosedate:false})} style={{width:'15%',alignItems:'center'}}>
                                <Icon name={'done'} size={30} color={'green'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'90%',alignSelf:'center'}}>
                        <CustomPicker subDate choosedate date handleInput={this.handleInput} label={Lang[lang].startdate} title={Lang[lang].pls+Lang[lang].select} name={'start'} value={data}/>
                        <View style={{}}/>
                        <CustomPicker subDate choosedate date handleInput={this.handleInput} label={Lang[lang].enddate} title={Lang[lang].pls+Lang[lang].select} name={'end'} value={data}/>
                        </View>


                    </View>
                </View>
            </Modal>}
            {pinLocation&&<Modal statusBarTranslucent={true} visible={pinLocation} animationType={'fade'} transparent={true}>
                <View style={{width,height:height,backgroundColor:'rgba(0,0,0,0)',alignItems:'center'}}>


                        <MapView
                            showsUserLocation={true}
                            provider={PROVIDER_GOOGLE}
                            onRegionChangeComplete={this.onRegionChangeComplete}
                            onPress={info => this.setLocation(info.nativeEvent,info.nativeEvent.coordinate)}
                            mapType={Platform.OS == "android" ? "standard" : "standard"}
                            initialRegion={region}
                            style={{width: '100%', height: height+(height*0.1), borderRadius: 0,justifyContent:'center',alignItems:'center'}}
                        >
                            <Icon name={'place'} size={40} style={{marginBottom:30}} color={'rgb(240,0,47)'}/>
                        </MapView>

                </View>
                {Platform.OS=='android'&&<View style={{width: '100%', height: height+(height*0.1), borderRadius: 0,justifyContent:'center',alignItems:'center',position:'absolute'}}>
                    <Icon name={'place'} size={40} style={{marginBottom:30}} color={'rgb(240,0,47)'}/>
                </View>}
                <TouchableOpacity onPress={()=>this.setState({pinLocation:false})} style={{backgroundColor:'rgba(0,0,0,0.19)',paddingHorizontal:10,position:'absolute',left:20,top:40,width:RFPercentage(8),borderRadius:20,alignItems:'center',justifyContent:'center'}}>
                    <Icons name={'keyboard-backspace'} size={RFPercentage(6)} color={Colors.textColor}/>
                </TouchableOpacity>
            </Modal>}
            {confirm&&<Confirm handleClose={()=>this.setState({confirm:false})} handleConfirm={this.handleConfirm} title={'Warning!'} subtitle={'Are you sure to submit?'} visible={confirm}/>}
            {warning&&<MoneyWarning handleClose={()=>this.setState({warning:false})} handleConfirm={this.handleWarning} title={'Warning!'} subtitle={'Your balance is not enough'} visible={warning}/>}
        </View>
            {loading&&<View style={{width,height:height*1.2,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor}/>
            </View>}
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
        user: state.user.user,
        setting: state.setting.setting,
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
