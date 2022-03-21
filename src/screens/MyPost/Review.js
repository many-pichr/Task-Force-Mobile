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
    Alert, ActivityIndicator, Keyboard,
} from 'react-native';
import {Rating, AirbnbRating, Button} from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import moment from 'moment'
import User from '../../api/User';
import PinCode from '../../components/PinCode';
import {RFPercentage} from 'react-native-responsive-fontsize';
import schama from './validator';
import {SliderPicker} from 'react-native-slider-picker';
import {Confirm, MoneyWarning} from '../../components/Dialog';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window')

class Index extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        const { item } = this.props.route.params
        this.state={
            showPin:false,
            warning:false,
            loading:false,
            mainLoading:false,
            scroll:false,
            id:item.id,
            value:9,
            proModal:false,
            currentValue:0,
            confirm:false,
            dispute:false,
            values:{
                comment:'',
                rate:'',
                reason:'',
            }
        }
        this.myRef = React.createRef();
    }

    componentDidMount(): void {
        this.fadeIn()
    }
    handleKeyShow=(status)=> {
        if (Platform.OS == 'ios') {
            if (status) {
                this.setState({scroll: true})
            } else {
                this.setState({scroll: false})
            }
        }
    }

    handleInput=async (f,v)=>{
        const newState={... this.state}
        newState.values[f]=v;
        this.setState(newState)
    }

    handleNext=async ()=>{
            this.setState({showPin:false,mainLoading:true})
            await this.handleChangeStatus();
            this.setState({mainLoading:false})
            this.props.navigation.goBack()
    }
    handleSubmit=async ()=>{
        const { item ,userId} = this.props.route.params
        const {id,value,values} = this.state;
        this.setState({mainLoading:true,dispute:false})
        const reason=values.reason.length>0?"Reason: "+values.reason+" /n":""
        const ms=reason+(item.unSatified+1)+"X Organizer Unsatified, Progress to "+value+"0%";
        this.setState({confirm:false,proModal:false,mainLoading:true})
        const url="/api/JobPost/Progress/"+id+"/"+value+0
        await User.GetList(url);
        await this.handleSend(ms);
        this.props.navigation.goBack()
        this.setState({mainLoading:false})
    }
    handleSend=async (value)=>{
        const {item} = this.props.route.params;
        const body={
            "id": 0,
            "jobPostId": item.id,
            "userId": item.user.id,
            "comment": value,
            "date": new Date(),
            "status": "string",
            "createdDate": new Date(),
            "createdBy": "string",
            "modifyDate": "2021-03-19T08:16:36.834Z",
            "modifyBy": "string",
            "active": true,
            "isDelete": true
        }
        if(value!="") {
            await User.Post("/api/JobComment", body)
        }
    }
    handleConfirm=async ()=>{
        const { item } = this.props.route.params
        this.setState({dispute:false,mainLoading:true});
        const body= {
            "id": 0,
            "jobPostId": item.id,
        }
        await User.Post('/api/Dispute',body);
        this.setState({mainLoading:false});
        this.props.navigation.goBack();
    }
    handleChangeStatus=async ()=>{
        const { item } = this.props.route.params
        const {values} = this.state;
        const url="/api/JobPost/ChangeStatus/"+item.id+"/completed"
        await User.Put(url,{})
        const url1="/api/JobPost/Rating/"+item.id
        await User.Put(url1,{
            "jobPostId": item.id,
            "rate": values.rate.toString(),
            "comment": values.comment
        })
    }
    viewAttachment=()=>{
        const { item,agent,date } = this.props.route.params
        this.props.navigation.navigate("ViewPdf",{url:item.disputeFileUrl})
    }
    handleWarning=async ()=>{
        this.setState({warning:false})
        this.props.navigation.navigate("CashIn",{post:true})
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    checkBalance=async ()=>{
            const {values} = this.state;
            const { user } = this.props;
            const { item,agent } = this.props.route.params;
            const balance=user.userWallet.setledCash;
            const fee = (item.reward+item.extraCharge)*0.05;
                if(fee>balance){
                    this.setState({warning:true,dispute:false})
                }else{
                    this.handleConfirm()
                }


    }
    render() {
        const {warning,dispute,mainLoading,proModal,currentValue,value,confirm,loading,showPin,values,scroll} = this.state
        const { item,agent,date } = this.props.route.params
        const data={error:{},focus:{},values}
        const user=agent?item.user:item.agent;
        const winner=item.disputeWinner=='agent'?item.agent.lastName+" "+item.agent.firstName:item.user.lastName+" "+item.user.firstName;
    return (
        <>
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
                        <Text style={{color:'#fff',fontSize:25}}>Review Task</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:10}}>
                <ScrollView ref={ref => {this.scrollView = ref}}
                            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
                    <View style={{height:scroll?height*1.3:height}}>
                        <View style={{flexDirection:'row',width:'100%'}}>
                            <View style={{width:'25%',height:90,alignItems:'center',justifyContent:'center'}}>
                                <Image source={user.profileURL&&user.profileURL!=''?{uri:user.profileURL}:require('../../assets/images/avatar.png')}
                                       style={{width:60,height:60,borderRadius:10}}/>
                            </View>
                            <View style={{width:'75%',height:90,justifyContent:'center'}}>
                                <View style={{width:'100%',height:60}}>
                                    <Text style={{fontSize:16,color:'#333333',height:20}}>
                                        {user.lastName} {user.firstName}
                                    </Text>
                                    <Text style={{fontSize:16,color:Colors.textColor,height:20}}>
                                        {user.address?user.address:"N/A"}
                                    </Text>
                                    <Text style={{fontSize:13,color:'#333333',height:20}}>
                                        Start Task: {moment(item.startedDate).format('DD/MM/YYYY')}
                                    </Text>
                                    {item.completedDate&&<Text style={{fontSize:13,color:'#333333',height:16}}>
                                        Close Task: {moment(item.completedDate).format('DD/MM/YYYY')}
                                    </Text>}
                                </View>
                            </View>
                        </View>
                    <View style={{width:'90%',alignSelf:'center'}}>
                    <CustomPicker view label={'Subject'} name={'title'} value={{focus:true,error:undefined,values:{title:item.title}}}/>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'48%'}}>
                            <CustomPicker view label={'Reward $'} name={'reward'} value={{focus:true,error:undefined,values:{reward:item.reward}}}/>
                        </View>
                        <View style={{width:'4%'}}/>
                        <View style={{width:'48%'}}>
                            <CustomPicker view label={'Extra Tip $'} name={'extra'} value={{focus:true,error:undefined,values:{extra:item.extraCharge}}}/>
                        </View>
                    </View>
                        <Text style={{fontSize:16,color:Colors.primary,marginTop:0,}}>Rate Task</Text>
                        <View style={{width:'90%',alignSelf:'center',alignItems:'center',height:RFPercentage(10),marginTop:-30,paddingBottom:30}}>
                            <AirbnbRating
                                count={5}
                                reviews={["", "", "", "", ""]}
                                defaultRating={0}
                                onFinishRating={val=>this.handleInput('rate',val)}
                                size={RFPercentage(5)}
                                style={{bottom:0}}
                            />
                            {agent&&<TouchableOpacity activeOpacity={1} style={{width:'100%',height:100,position:'absolute'}}/>}
                        </View>
                        {/*<CustomPicker onFocus={this.handleKeyShow} col={2} handleInput={this.handleInput} input label={'Reason'} title={'Type here  ....'} name={'reason'} textarea value={data}/>*/}
                        <CustomPicker view={agent}  col={2} onFocus={this.handleKeyShow} input={!agent} handleInput={this.handleInput} label={'Comment'} title={'Type your comment here'} name={'comment'} textarea value={data}/>
                        {!agent&&<>
                        {item.status!="completed"&&<TouchableOpacity onPress={()=>this.setState({showPin:true})} style={{width:250,height:100,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:Colors.textColor,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:20}}>Confirm Payment</Text>
                            <Text style={{color:'#fff',fontSize:25}}>${item.extraCharge+item.reward}</Text>
                        </TouchableOpacity>}
                            {item.unSatified<2?<TouchableOpacity onPress={()=>this.setState({proModal:true})} style={{width:250,height:60,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:"#ff3445",alignItems:'center',justifyContent:'center'}}>
                            {loading?<ActivityIndicator color={'#ffff'}/>:<View style={{flexDirection:'row',alignItems:'center'}}>
                                <Icons name={'sentiment-dissatisfied'} color={'#fff'} size={RFPercentage(4)}/>
                                {item.unSatified>0&&<Text style={{color:'#fff',fontSize:RFPercentage(3),marginRight:5}}>{item.unSatified}X</Text>}
                                <Text style={{color:'#fff',fontSize:RFPercentage(3)}}> Unsatisfied</Text>
                            </View>}
                        </TouchableOpacity>:
                                !item.isDispute&&<TouchableOpacity onPress={()=>this.setState({dispute:true})} style={{width:250,height:60,alignSelf:'center',marginTop:20,borderRadius:10,
                                    backgroundColor:"#ff3445",alignItems:'center',justifyContent:'center'}}>
                                    {loading?<ActivityIndicator color={'#ffff'}/>:<View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Icons name={'forward-to-inbox'} color={'#fff'} size={RFPercentage(4)}/>
                                        <Text style={{color:'#fff',fontSize:RFPercentage(3)}}> Submit Dispute</Text>
                                    </View>}
                                </TouchableOpacity>}
                        </>}
                        <View style={{width:250,height:60,alignSelf:'center',marginTop:10,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                            {!item.disputeWinner&&item.isDispute&&<View style={{flexDirection:'row',alignItems:'center'}}>
                                <Icons name={'pan-tool'} color={'orange'} size={RFPercentage(3)}/>
                                <Text style={{color:'orange',fontSize:RFPercentage(3)}}> Disputed</Text>
                            </View>}
                            {item.disputeWinner&&item.isDispute&&<View style={{flexDirection:'row',alignItems:'center'}}>
                                <Icons name={'done-all'} color={'green'} size={RFPercentage(4)}/>
                                <Text style={{color:'green',fontSize:RFPercentage(3)}}> Winner: {winner}</Text>
                            </View>}
                        </View>
                        {item.disputeFileUrl&&<TouchableOpacity onPress={this.viewAttachment}
                            style={{width:250,height:60,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:"#0b6d79",alignItems:'center',justifyContent:'center'}}>
                            {loading?<ActivityIndicator color={'#ffff'}/>:
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Icons name={'attach-file'} color={'#fff'} size={RFPercentage(4)}/>
                                <Text style={{color:'#fff',fontSize:RFPercentage(3)}}> View Attachment</Text>
                            </View>}
                        </TouchableOpacity>}
                    </View>
                    </View>
                </ScrollView>
                </TouchableOpacity>
                {showPin&&<PinCode handleVerify={this.handleNext} handleClose={()=>this.setState({showPin:false})}/>}

            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

            </View>

        </View>
            {proModal&&<Modal statusBarTranslucent={true} visible={true} animationType={'fade'} transparent={true}>
                <TouchableOpacity activeOpacity={1} onPress={()=>this.setState({proModal:false})} style={{width,height:height,backgroundColor:'rgba(0,0,0,0.43)',alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1} style={{width:'95%',borderRadius:10,backgroundColor:'#fff',justifyContent:'center'}}>
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
                        <View  style={{width:'90%',alignSelf:'center'}}>
                        <CustomPicker onFocus={this.handleKeyShow} col={2} handleInput={this.handleInput} input label={'Reason'} title={'Type here  ....'} name={'reason'} textarea value={data}/>
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
                                title={"Re-Update Progress"}
                                onPress={this.handleSubmit}
                                titleStyle={{fontSize: RFPercentage(2)}}
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
            {warning&&<MoneyWarning handleClose={()=>this.setState({warning:false})} handleConfirm={this.handleWarning} title={'Warning!'} subtitle={'Your balance is not enough'} visible={warning}/>}

            {dispute&&<Confirm handleClose={()=>this.setState({dispute:false})} handleConfirm={this.checkBalance} title={'Warning!'}
                               subtitle={'You are about to enter dispute mode,5% of the amount will be deducted when a dispute verdict is reach by our dispute officers'} visible={dispute}/>}

            {mainLoading&&<View style={{width,height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size={'large'} color={Colors.textColor}/>
            </View>}
        </>
    );
  }
}
const mapStateToProps = state => {
    return {
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
