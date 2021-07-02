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
    Alert, ActivityIndicator, KeyboardAvoidingView, Keyboard,
} from 'react-native';
import {Rating, AirbnbRating, Button} from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import PINCode from '@haskkor/react-native-pincode'
import User from '../../api/User';
import PinCode from '../../components/PinCode';
import {RFPercentage} from 'react-native-responsive-fontsize';
import schama from './validator';
import {SliderPicker} from 'react-native-slider-picker';
const {width,height} = Dimensions.get('window')

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        const { item } = this.props.route.params
        this.state={
            showPin:false,
            loading:false,
            mainLoading:false,
            scroll:false,
            id:item.id,
            value:item.completedStatus/10,
            proModal:false,
            currentValue:0,
            confirm:false,
            values:{
                comment:'',
                rate:''
            }
        }
        this.myRef = React.createRef();
    }

    componentDidMount(): void {
        this.fadeIn()
    }
    handleKeyShow=(status)=>{
        if(status){
            this.setState({scroll:true})
        }else{
            this.setState({scroll:false})
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
        const {id,value} = this.state;
        this.setState({confirm:false,proModal:false,mainLoading:true})
        const url="/api/JobPost/Progress/"+id+"/"+value+0
        await User.GetList(url)
        this.props.navigation.goBack()
        this.setState({mainLoading:false})
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
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    render() {
        const {mainLoading,proModal,currentValue,value,confirm,loading,showPin,values,scroll} = this.state
        const { item } = this.props.route.params
        const data={error:{},focus:{},values}
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
                                <Image source={item.agent.profileURL&&item.agent.profileURL!=''?{uri:item.agent.profileURL}:require('../../assets/images/avatar.png')}
                                       style={{width:60,height:60,borderRadius:10}}/>
                            </View>
                            <View style={{width:'75%',height:90,justifyContent:'center'}}>
                                <View style={{width:'100%',height:60}}>
                                    <Text style={{fontSize:16,color:'#333333',height:20}}>
                                        {item.agent.lastName} {item.agent.firstName}
                                    </Text>
                                    <Text style={{fontSize:16,color:Colors.textColor,height:20}}>
                                        {item.agent.address?item.agent.address:"N/A"}
                                    </Text>
                                    <Text style={{fontSize:13,color:'#333333',height:16}}>
                                        Start Task: 02/Dec/2020
                                    </Text>
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
                        <View style={{width:'90%',alignSelf:'center',alignItems:'center',height:RFPercentage(10),marginTop:-30}}>
                            <AirbnbRating
                                count={5}
                                reviews={["", "", "", "", ""]}
                                defaultRating={0}
                                onFinishRating={val=>this.handleInput('rate',val)}
                                size={RFPercentage(5)}
                                style={{bottom:0}}
                            />

                        </View>
                        <CustomPicker onFocus={this.handleKeyShow} handleInput={this.handleInput} input label={'Comment'} title={'Type your comment here'} name={'comment'} textarea value={data}/>
                        <TouchableOpacity onPress={()=>this.setState({showPin:true})} style={{width:250,height:100,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:Colors.textColor,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:20}}>Confirm Payment</Text>
                            <Text style={{color:'#fff',fontSize:25}}>${item.extraCharge+item.reward}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({proModal:true})} style={{width:250,height:60,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:"#ff3445",alignItems:'center',justifyContent:'center'}}>
                            {loading?<ActivityIndicator color={'#ffff'}/>:<Text style={{color:'#fff',fontSize:18}}>Return Task</Text>}
                        </TouchableOpacity>
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
            {mainLoading&&<View style={{width,height:height,position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
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
    }
});
