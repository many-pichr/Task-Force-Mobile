import React, { Component } from 'react';
import {
    Animated,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    TouchableWithoutFeedback,
    Text,
    Modal,
    Platform,
    RefreshControl,
    Dimensions,
    FlatList,
    Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { SliderPicker } from 'react-native-slider-picker';
import {MyPostList} from '../../components/ListScreen';
import {ItemProgress,ItemComplete, ItemPost} from '../../components/Items';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
import User from '../../api/User';
import {Button} from 'react-native-elements';
import {Confirm} from '../../components/Dialog';
import {Colors} from '../../utils/config';
import {setNotify} from '../../redux/actions/notification';
import {setFocus} from '../../redux/actions/screenfocus';
const {width,height} = Dimensions.get('window')

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            active:0,
            refreshing:false,
            start:true,
            confirm:false,
            data:[],
            value:0,
            cancel:false,
            currentValue:0,
            id:0,
            loading:true,
            proModal:false,
            inprogress:[],
            completed:[],
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        this.handleGetPost(false)

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.setFocus({
                "MyTask": true,
                "MyPost": false,
                "isProgress": false,
                "isComplete": false,
            })
            if(!this.state.start){
                this.handleGetPost(false)
            }
        });
        this._unsubscribeBlur = this.props.navigation.addListener('blur', (action, state) => {
            this.props.setFocus({
                "MyTask": false,
                "MyPost": false,
                "isProgress": false,
                "isComplete": false,
            })
        });
        this.setState({start:false})
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }

    componentWillUnmount() {
        this._unsubscribe();
        this._unsubscribeBlur();
    }
    handleGetPost=async (refreshing)=>{
        await User.GetList('/api/JobCandidate/CurrentUser').then((rs) => {
            if(rs.status){
                const items=[]
                const completed=[]
                for(var i=0;i<rs.data.length;i++){
                    const item=rs.data[i].jobPost
                    if(item.status=='selected'){
                        if(item.completedStatus<100){
                            items.push(item)
                        }else{
                            completed.push(item)
                        }

                    }
                }
                this.setState({data:rs.data,completed:completed,inprogress:items,refreshing:false,loading:false})
            }
        })
        this.handleSetNotify()
    }
    handleSetNotify=(status)=>{
        const {notify,focus} = this.props;
        notify.isMyTask=false;
        focus.MyTask=true;
        this.props.setNotify(notify)
        this.props.setFocus(focus)
        User.Put("/api/ManuNotification/"+notify.id,notify)
        this.props.navigation.navigate("MyTask",{refresh:true});
    }
    handleSubmit=async ()=>{
        const {id,value} = this.state;
        this.setState({confirm:false,proModal:false,refreshing:true})
        const url="/api/JobPost/Progress/"+id+"/"+value+0
        await User.GetList(url)
        this.handleGetPost(true);
        this.setState({refreshing:false})
    }
    handleCancel=async ()=>{
        const {id} = this.state;
        this.setState({cancel:false,refreshing:true})
        const url="/api/JobCandidate/"+id
        // await User.Delete(url)
        this.handleGetPost(true);
        this.setState({refreshing:false})

        // this.setState({cancel:false,refreshing:true})
        // const url="/api/JobPost/ChangeStatus/"+id+"/cancel"
        // await User.Put(url)
        // this.handleGetPost(true);
        // this.setState({refreshing:false})

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
    handleDelete=()=>{

    }
    handleAction=(index,item)=>{
        const {user} = this.props
       if(index==1){
           this.props.navigation.navigate('ViewPost',{title:'View Post',view:true,home:false,id:item.id,job:true})
       }else if(index==2){
           this.props.navigation.navigate('AddPost',{title:'Edit Post'})
       }else if(index==4){
           this.props.navigation.navigate('Comment',{title:'Edit Post',item:item,userId:user.id})
    }else if(index==5){
    this.props.navigation.navigate('Review',{title:'Edit Post',item:item})
    }else if(index==7){
           this.setState({cancel:true,id:item.id,currentValue:item.completedStatus/100,value:item.completedStatus/10})

       }else if(index==3){
           this.handleDelete()
       }else if(index==6){
           this.setState({proModal:true,id:item.id,currentValue:item.completedStatus/100,value:item.completedStatus/10})
       }
    }
    handleSwitch=(status)=>{
        this.setState({active:status})
    }
    render() {
        const {loading,cancel,currentValue,completed,confirm,proModal,inprogress,data,refreshing,active,value} = this.state
    return (<>
            <MyPostList
                title={'My Task'}
                titles={['All Task','In Progress',"Complete"]}
                active={active}
                onSwitch={this.handleSwitch}
                renderItem={active==0?<>
                    {data.length>0?<FlatList
                        contentContainerStyle={{marginTop:0}}
                        refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                        data={data}
                        renderItem={({item,index}) =><ItemPost status={item.status} agent onPress={()=>this.handleAction(1,item.jobPost)} handleAction={this.handleAction} item={item.jobPost} index={index} bottom={(index+1)==data.length?250:0}/>}
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
                                <Text style={{fontSize:20,color:Colors.textColor}}>
                                    No Data
                                </Text>}
                        </View>
                    </ScrollView>}</>:active==1?<>
                    {inprogress.length>0?<FlatList
                        contentContainerStyle={{marginTop:0}}
                        refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                        data={inprogress}
                        renderItem={({item,index}) =><ItemProgress agent={true} onPress={()=>this.handleAction(1,item)} item={item} handleAction={this.handleAction} index={index} bottom={(index+1)==inprogress.length?250:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />:<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                        colors={["#9Bd35A", Colors.textColor]}
                        tintColor={Colors.textColor}
                        refreshing={refreshing}
                        onRefresh={()=>this.handleGetPost(true)} />}>
                        <View style={{height:height*0.7,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:20,color:Colors.textColor}}>
                                No Data
                            </Text>
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
                            renderItem={({item,index}) =><ItemComplete agent={true} onPress={()=>this.handleAction(1,item.jobPost)} item={item} handleAction={this.handleAction} index={index} bottom={(index+1)==inprogress.length?250:0}/>}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />:<ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl
                            colors={["#9Bd35A", Colors.textColor]}
                            tintColor={Colors.textColor}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}>
                            <View style={{height:height*0.7,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:20,color:Colors.textColor}}>
                                    No Data
                                </Text>
                            </View>
                        </ScrollView>}
                    </>
                }
                onAdd={()=>this.props.navigation.navigate('AddPost',{title:'Add Post',view:false})}
            />
        {proModal&&<Modal statusBarTranslucent={true} visible={true} animationType={'fade'} transparent={true}>
            <TouchableOpacity onPress={()=>this.setState({proModal:false})} style={{width,height:height,backgroundColor:'rgba(0,0,0,0.43)',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity activeOpacity={1} style={{width:'95%',height:'40%',borderRadius:10,backgroundColor:'#fff',justifyContent:'center'}}>
                    <View style={{height:50}}>
                    <SliderPicker
                        // minLabel={'min'}
                        // midLabel={'mid'}
                        // maxLabel={'max'}
                        maxValue={10}
                        callback={position => {
                            this.setState({ value: position });
                        }}
                        defaultValue={value}
                        labelFontColor={Colors.textColor}
                        // labelFontWeight={'600'}
                        showFill={true}
                        fillColor={Colors.primary}
                        showNumberScale={false}
                        showSeparatorScale={true}
                        buttonBackgroundColor={'#fff'}
                        buttonBorderColor={Colors.textColor}
                        buttonBorderWidth={2}
                        scaleNumberFontWeight={'300'}
                        buttonDimensionsPercentage={5}
                        heightPercentage={1}

                    />
                    </View>
                    <View style={{width:'100%',alignSelf:'center',flexDirection:'row'}}>
                        {[0,1,2,3,4,5,6,7,8,9,10].map((v,index)=>{
                            return (
                                <View style={{width:'9.1%',alignItems:'center'}}>
                                    <Text>{v>0&&v}0</Text>
                                </View>
                            )
                        })}

                    </View>
                    <View style={{width:100,height:100,borderWidth:2,marginTop:20,borderColor:Colors.textColor,
                        alignSelf:'center',borderRadius:50,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:25,color:Colors.textColor}}>{value>0&&value}0%</Text>
                    </View>
                    {confirm?
                    <>
                        <Text style={{alignSelf:'center',marginTop:20,fontSize:18}}>
                            Are you sure to accept?
                        </Text>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Button
                            title={"NO"}
                            onPress={()=>this.setState({confirm:false})}
                            titleStyle={{fontSize: 20}}
                            containerStyle={{alignSelf: 'center', marginTop: 10}}
                            buttonStyle={{
                                paddingVertical: 13,
                                width: width * 0.40,
                                borderRadius: 10,
                                backgroundColor: '#f43a16'
                            }}
                        />
                        <View style={{width:width*0.05}}/>
                        <Button
                            title={"YES"}
                            onPress={this.handleSubmit}
                            titleStyle={{fontSize: 20}}
                            containerStyle={{alignSelf: 'center', marginTop: 10}}
                            buttonStyle={{
                                paddingVertical: 13,
                                width: width * 0.40,
                                borderRadius: 10,
                                backgroundColor: '#1582F4'
                            }}
                        />

                    </View>
                    </>:
                        <Button
                        disabled={!((value/10)>currentValue)}
                        title={"Update Progress"}
                        onPress={this.handleSubmit}
                        titleStyle={{fontSize: 20}}
                        containerStyle={{alignSelf: 'center', marginVertical: 20}}
                        buttonStyle={{
                            paddingVertical: 13,
                            width: width * 0.6,
                            borderRadius: 10,
                            backgroundColor: Colors.textColor
                        }}
                    />}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>}
            {/*{confirm&&<Confirm handleClose={()=>this.setState({confirm:false})} handleConfirm={this.handleSubmit} title={'Warning'} subtitle={'Are you sure to submit?'} visible={confirm}/>}*/}
            {cancel&&<Confirm handleClose={()=>this.setState({cancel:false})} handleConfirm={this.handleCancel} title={'Warning'} subtitle={'Are you sure to cancel?'} visible={cancel}/>}

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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
