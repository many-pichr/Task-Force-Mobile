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
    RefreshControl,
    Dimensions,
    FlatList,
    Alert, ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import {MyPostList} from '../../components/ListScreen';
import {ItemProgress,ItemComplete, ItemPost} from '../../components/Items';
import {setLoading} from '../../redux/actions/loading';
import {setFocus} from '../../redux/actions/screenfocus';
import {connect} from 'react-redux';
import User from '../../api/User';
import {Confirm} from '../../components/Dialog';
import {Colors, Fonts} from '../../utils/config';
import {setNotify} from '../../redux/actions/notification';
import {SliderPicker} from 'react-native-slider-picker';
import {Button} from 'react-native-elements';
import Lang from '../../Language';
import {setJobPost} from '../../redux/actions/jobpost';
import Func from '../../utils/Functions';
const {width,height} = Dimensions.get('window')

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            confirm:false,
            active:0,
            loading:false,
            refreshing:false,
            currentValue:0,
            data:props.jobpost,
            inprogress:[],
            value:0,
            proModal:true,
            cancel:false,
            cancel1:false,
            cancel2:false,
            completed:[]
        }
        this.myRef = React.createRef();
        this._unsubscribe = this.props.navigation.addListener('focus', (action, state) => {
            // do something
            this.props.setFocus({
                "MyPost": true,
                "isProgress": false,
                "isComplete": false,
            })
            const params = this.props.route.params;
            if(params&&params.refresh){
                this.handleGetPost(false)
            }
        });
        this._unsubscribeBlur = this.props.navigation.addListener('blur', (action, state) => {
            this.props.setFocus({
                "MyPost": false,
                "isProgress": false,
                "isComplete": false,
            })
        });
    }
    componentDidMount(): void {
        this.fadeIn()
        this.handleGetPost(false)
        // this.props.set(true)
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    componentWillUnmount() {
        this._unsubscribe();
        this._unsubscribeBlur();
    }
    handleGetPost=async (refresh)=>{
        await Func.GetJobPost().then((data) => {
                this.props.setJobPost(data);
        });
        this.setState({refreshing:false,loading:false})
        this.handleSetNotify()
    }
    handleSetNotify=(status)=>{
        const {notify,focus} = this.props;
        notify.isMyPost=false;
        focus.MyPost=true;
        if(status==1){
            notify.isProgress=false;
            focus.isProgress=true;
            focus.isComplete=false
        }else if(status==2){
            notify.isComplete=false;
            focus.isProgress=false;
            focus.isComplete=true;

        }else{
            focus.isProgress=false;
            focus.isComplete=false;
        }
        this.props.setNotify(notify)
        this.props.setFocus({
            "MyPost": focus.MyPost,
            "isProgress": focus.isProgress,
            "isComplete": focus.isComplete,
        })

        User.Put("/api/ManuNotification/"+notify.id,notify)
        this.props.navigation.navigate("MyPost",{refresh:true});
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
    handleCancel=async ()=>{
        const {id} = this.state;
        this.setState({cancel:false,refreshing:true})
        const url="/api/JobPost/ChangeStatus/"+id+"/cancel"
        await User.Put(url).then((rs) => {
        })
        this.handleGetPost(true);
        this.setState({refreshing:false})

    }
    handleAction=(index,item)=>{
        const {user} = this.props;
        if(index==0){
            this.props.navigation.navigate('ViewPost',{title:'View Post',id:item.id,post:true,agent:false})
        }else
        if(index==1){
            this.props.navigation.navigate('ViewCandidate',{title:'View Candidate',id:item.id,post:true,agent:false})
       }else if(index==2){
           this.props.navigation.navigate('EditPost',{title:'Edit Post',view:true,id:item.id,add:true,item})
       }else if(index==4){
           this.props.navigation.navigate('Comment',{title:'Edit Post',item:item,userId:user.id})
       }else if(index==7){
            if(item.completedStatus<=20){
                this.setState({cancel1:true,id:item.id})
            }else if(item.completedStatus>20){
                this.setState({cancel2:true,id:item.id})
            }else{
                this.setState({cancel:true,id:item.id})
            }
            // this.setState({cancel:true,id:item.id,currentValue:item.completedStatus/100,value:item.completedStatus/10})

        }else if(index==5){
           this.props.navigation.navigate('Review',{title:'Edit Post',item:item,user})
       }else if(index==3){
            if(item.completedStatus<=20){
                this.setState({cancel1:true,id:item.id})
            }else if(item.completedStatus>20){
                this.setState({cancel2:true,id:item.id})
            }else{
                this.setState({cancel:true,id:item.id})
            }

       }else if(index==8){
            this.props.navigation.navigate('ViewUser',{userId:item.agent.id,view:true,loading:true})
       }
    }
    handleSwitch=(status)=>{
        this.setState({active:status})
        this.handleSetNotify(status)
    }
    render() {
        const {cancel,loading,refreshing,active, cancel1, cancel2} = this.state
        const {lang} = this.props.setting;
        const {data,completed,inprogress} = this.props.jobpost;
        return (<>
            <MyPostList
                title={Lang[lang].mtask}
                notify={this.props.notify}
                titles={[Lang[lang].allpost,Lang[lang].inprogress,Lang[lang].complete]}
                active={active}
                add
                onSwitch={this.handleSwitch}
                renderItem={active==0?<>
                    {data.length>0?<FlatList
                        contentContainerStyle={{marginTop:0,paddingBottom:data.length>3?0:300}}
                        refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                        data={data}
                        renderItem={({item,index}) =><ItemPost lang={lang} isPost={true} status={item.status} onPress={()=>this.handleAction(0,item)} handleAction={this.handleAction} item={item} index={index} bottom={(index+1)==data.length?300:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />:<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                        colors={["#9Bd35A", Colors.textColor]}
                        tintColor={Colors.textColor}
                        refreshing={refreshing}
                        onRefresh={()=>this.handleGetPost(true)} />}>
                        <View style={{height:height*0.7,justifyContent:'center',alignItems:'center'}}>
                            {loading?
                                <ActivityIndicator size={'large'} color={Colors.textColor} />:
                                <Text style={{fontSize:20,color:Colors.textColor,fontFamily:Fonts.primary }}>
                                    {Lang[lang].nodata}
                                </Text>}
                        </View>
                    </ScrollView>}</>:active==1?<>
                    {inprogress.length>0?<FlatList
                        contentContainerStyle={{marginTop:0,paddingBottom:inprogress.length>3?0:300}}
                        refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                        data={inprogress}
                        renderItem={({item,index}) =><ItemProgress onPress={()=>this.handleAction(0,item)} item={item} handleAction={this.handleAction} index={index} bottom={(index+1)==inprogress.length?300:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />:<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}>
                            <View style={{height:height*0.7,justifyContent:'center',alignItems:'center'}}>
                                {loading?
                                    <ActivityIndicator />:
                                    <Text style={{fontSize:20,color:Colors.textColor,fontFamily:Fonts.primary}}>
                                        {Lang[lang].nodata}
                                </Text>}
                            </View>
                        </ScrollView>}
                    </>:
                    <>
                        {completed.length>0?<FlatList
                            contentContainerStyle={{marginTop:0,paddingBottom:completed.length>3?0:300}}
                            refreshControl={<RefreshControl
                                colors={["#9Bd35A", Colors.textColor]}
                                tintColor={Colors.textColor}
                                refreshing={refreshing}
                                onRefresh={()=>this.handleGetPost(true)} />}
                            data={completed}
                            renderItem={({item,index}) =><ItemComplete createDate={new Date()} lang={lang} isPost={true} onPress={()=>this.handleAction(5,item)} item={item} handleAction={this.handleAction} index={index} bottom={(index+1)==completed.length?300:0}/>}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />:<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}>
                            <View style={{height:height*0.7,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:20,color:Colors.textColor,fontFamily:Fonts.primary}}>
                                    {Lang[lang].nodata}
                                </Text>
                            </View>
                        </ScrollView>}
                    </>
                    }
                onAdd={()=>this.props.navigation.navigate('AddPost',{title:'Add Post',view:false,add:true})}

            />
        {cancel&&<Confirm handleClose={()=>this.setState({cancel:false})} handleConfirm={this.handleCancel} title={'Warning'} subtitle={'Are you sure to cancel?'} visible={cancel}/>}
        {cancel1&&<Confirm handleClose={()=>this.setState({cancel1:false})} handleConfirm={this.handleCancel} title={'Warning'} subtitle={'If you cancel your task now, 50% of the reward will be deduct from your poket'} visible={cancel1}/>}
        {cancel2&&<Confirm handleClose={()=>this.setState({cancel2:false})} handleConfirm={this.handleCancel} title={'Warning'} subtitle={'If you cancel your task now, 100% of the reward will be deduct from your poket'} visible={cancel2}/>}

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
        setting: state.setting.setting,
        user: state.user.user,
        notify: state.notify.notify,
        focus: state.focus.focus,
        jobpost: state.jobpost.data,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setNotify: (notify) => {
            dispatch(setNotify(notify))
        },
        setFocus: (focus) => {
            dispatch(setFocus(focus))
        },
        setJobPost: (jobpost) => {
            dispatch(setJobPost(jobpost))

        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
