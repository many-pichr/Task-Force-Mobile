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
    Alert, TextInput, ActivityIndicator,
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
import {connect} from 'react-redux';
import {Confirm} from '../../components/Dialog';
const {width,height} = Dimensions.get('window')

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            coordinate:null,
            long:104.9282,
            confirm:false,
            lat:11.5564,
            tab:0,
            isLocation:false,
            values:{
                title:'',
                category:0,
                description:'',
                level:0,
                deadline:'No Expiry',
                priority:0,
                extra:'0',
                reward:'0',
                location:'',
                skill:[],

            },
            images:['','','','',''],
            imagesUrl:['','','','',''],
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

        this.fadeIn()
        this.handleGetPredata()
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude,coordinate:info.coords}));
    }
    handleGetViewData=async ()=>{

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
        this.props.set(true)
        await User.AddJob(
            this.state.values,
            this.state.imagesUrl,
            this.props.user.id,
            {location:this.state.isLocation,
                long:this.state.long,lat:this.state.lat}
        ).then((rs) => {
            console.log(rs)
        })
        this.props.set(false)
    }
    setLocation=(coordinate)=>{
        this.setState({coordinate:coordinate,lat:coordinate.latitude,long:coordinate.longitude})
    }
    handleSwitch=(index)=>{
        this.setState({tab:index})
    }
    handleImagePicker=(index)=>{
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                // maxHeight: 200,
                // maxWidth: 200,
            },
            (response) => {
                if(!response.didCancel){
                    const newState={... this.state}
                    newState.images[index]=response.uri
                    newState.loadings[index]=true;
                    this.setState(newState)
                    User.UploadImage(response.uri).then((rs) => {
                        if(rs.status){
                            const newState={... this.state}
                            newState.loadings[index]=false;
                            newState.imagesUrl[index]=rs.data.fileName
                            this.setState(newState)
                        }
                    })
                }


            },
        )
    }
    handleGetPredata=async ()=>{
        const { view,id } = this.props.route.params
        this.props.set(true)
            await User.GetList('/api/JobPost/'+id).then((rs) => {
                if(rs.status){
                    const {data}=rs
                    console.log(data)
                    const newState={... this.state}
                    newState.values.title=data.title;
                    newState.values.category=data.jobCategory.name;
                    newState.values.description=data.description;
                    newState.values.level=data.jobLevel.name;
                    newState.values.priority=data.jobPriority.name;
                    newState.values.extra=data.extraCharge.toString();
                    newState.values.reward=data.reward.toString();
                    newState.isLocation=data.isShowLocation;

                    const images=newState.images
                    for(var j=0;j<data.jobPostPhotos.length;j++){
                        images[j]=(data.jobPostPhotos[j].url)
                    }
                    newState.images=images;
                    newState.imagesUrl=images;
                    newState.values.skill=data.jobPostSkills;
                    this.setState(newState)
                }
            })
        this.props.set(false)
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
    render() {
        const {loadings,confirm,selectSkill,coordinate,long,lat,tab,isLocation,images,category,level,priority,skill,values} = this.state
        const { title,view,home } = this.props.route.params
    return (
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
            <View style={{zIndex:1}}>
                <View style={{width:'100%',alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end'}}>
                    <View style={{width:'10%',justifyContent:'flex-end'}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'70%',alignSelf:'center',alignItems:'center'}}>
                        <Text style={{color:'#fff',fontSize:25}}>{title}</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <View style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:10,height:height}}>
                    {title=="View Post" &&!home&&
                    <View style={{width:'90%',alignSelf:'center',height:60,flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>this.handleSwitch(0)}  style={{width:'50%',height:50,borderBottomWidth:tab==0?2:0,borderColor:'#1582F4',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#1582F4'}}>Post Detail</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.handleSwitch(1)} style={{width:'50%',height:50,borderBottomWidth:tab==1?2:0,borderColor:'#1582F4',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#1582F4'}}>Agents</Text>
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
                                    <Text style={{color: '#1582F4', width: '50%', textAlign: 'left'}}>Photos</Text>
                                    <Text style={{color: '#1582F4', width: '50%', textAlign: 'right'}}></Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>

                                                <TouchableOpacity>
                                                <Image source={{uri:images[0]}} style={{
                                                    width: ((width * 0.9) * 0.9) ,
                                                    height: ((width * 0.9) * 0.9) / 2,
                                                    backgroundColor: 'rgba(21,130,244,0.18)',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}/>

                                                </TouchableOpacity>

                                </View>
                                <CustomPicker handleInput={this.handleInput} view label={'Title'} title={'Title'} name={'title'} value={values}/>
                                <CustomPicker handleInput={this.handleInput} view label={'Category'} name={'category'} title={'Mobile App UX/UI'} value={values}/>
                                <CustomPicker handleInput={this.handleInput} view label={'Description'} title={'Description'} name={'description'} textarea value={values}/>
                                <CustomPicker handleInput={this.handleInput} view label={'Task Level'} name={'level'} title={'Medium'} value={values}/>
                                <CustomPicker handleInput={this.handleInput} view title={'No expiry'} label={'Deadline'} name={'deadline'} value={values}/>
                                <CustomPicker handleInput={this.handleInput} view label={'Priority'} name={'priority'} title={'Urgent'} value={values}/>
                                <View style={{width:'100%'}}>
                                    <Text style={{fontSize:16,color:Colors.primary,marginTop:10,}}>Skill</Text>
                                </View>
                                <FlatList
                                    contentContainerStyle={{marginTop:0}}
                                    data={values.skill}
                                    renderItem={({item,index}) =>(
                                        <View style={{flexDirection:'row',width:'100%',alignSelf:'center',borderBottomWidth:0.3,height:35,alignItems:'center'}}>
                                            <Text style={{width:'100%'}}>{item.skill.name}</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                                <CustomPicker handleInput={this.handleInput} input label={'Extra ($)'} title={''} name={'extra'} value={values}/>
                                <CustomPicker handleInput={this.handleInput} input label={'Reward ($)'} title={''} name={'reward'} value={values}/>
                                <View style={{width: '100%', marginTop: 10}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={{fontSize: 18, color: Colors.primary,width:'85%'}}>Location</Text>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                                            // thumbColor={isLocation ? "#f5dd4b" : "#f4f3f4"}
                                            // ios_backgroundColor="#3e3e3e"
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
                                            onPress={info => this.setLocation(info.nativeEvent.coordinate)}
                                            mapType={Platform.OS == "android" ? "standard" : "standard"}
                                            region={{
                                                latitude: lat,
                                                longitude: long,
                                                latitudeDelta: 0.8,
                                                longitudeDelta: 0.8
                                            }}
                                            style={{width: '100%', height: '100%', borderRadius: 0}}
                                        >
                                            {coordinate != null && <Marker description={''} coordinate={coordinate}/>}
                                        </MapView>
                                    </View>
                                    }
                                    {!view && <Button
                                        title={"Submit"}
                                        onPress={this.handleSubmit}
                                        titleStyle={{fontSize: 20}}
                                        containerStyle={{alignSelf: 'center', marginVertical: 20}}
                                        buttonStyle={{
                                            paddingVertical: 13,
                                            width: width * 0.6,
                                            borderRadius: 10,
                                            backgroundColor: '#1582F4'
                                        }}
                                    />
                                    }
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
            <View style={{position:'absolute',width,height:180,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

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
            {confirm&&<Confirm handleClose={()=>this.setState({confirm:false})} handleConfirm={this.handleConfirm} title={'Warning'} subtitle={'Are you sure to submit?'} visible={confirm}/>}
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
