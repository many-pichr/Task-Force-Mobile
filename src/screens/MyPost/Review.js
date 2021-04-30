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
    Alert, ActivityIndicator,
} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemCandidate, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import PINCode from '@haskkor/react-native-pincode'
import User from '../../api/User';
const {width,height} = Dimensions.get('window')

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={
            showPin:false,
            loading:false
        }
        this.myRef = React.createRef();
    }

    componentDidMount(): void {
        this.fadeIn()
        // setTimeout(()=>{
        //     // this.fadeIn();
        //     this.setState({loading: false})
        // }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude,coordinate:info.coords}));
    }

    handleNext=async ()=>{
            this.setState({showPin:false,loading:true})
            await this.handleChangeStatus();
            this.setState({loading:false})
            this.props.navigation.goBack()
    }
    handleChangeStatus=async ()=>{
        const { item } = this.props.route.params
        const url="/api/JobPost/ChangeStatus/"+item.id+"/completed"
        await User.Put(url)
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    render() {
        const {loading} = this.state
        const { item } = this.props.route.params
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
                        <Text style={{color:'#fff',fontSize:25}}>Review Task</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <View style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:10,height:height}}>

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
                                    <Text style={{fontSize:16,color:'#1582F4',height:20}}>
                                        {item.agent.address?item.agent.address:"N/A"}
                                    </Text>
                                    <Text style={{fontSize:13,color:'#333333',height:16}}>
                                        Start Task: 02/Dec/2020
                                    </Text>
                                </View>
                            </View>
                        </View>
                    <View style={{width:'90%',alignSelf:'center'}}>
                    <CustomPicker view label={'Subject'} name={'title'} value={{title:item.title}}/>
                    <CustomPicker view label={'Reward $'} name={'reward'} value={{reward:item.reward}}/>
                    <CustomPicker view label={'Extra Tip $'} name={'extra'} value={{extra:item.extraCharge}}/>
                    <Text style={{fontSize:16,color:Colors.primary,marginTop:10,}}>Rate Task</Text>
                        <View style={{width:'90%',alignSelf:'center',flexDirection:'row'}}>
                            {[1,2,3,4,5].map(function(object, i){
                                return (
                                    <TouchableOpacity key={i} style={{width:'20%',height:50,alignItems:'center',justifyContent:'center'}}>
                                        <Icons name={'star-rate'} size={50} color={'orange'}/>
                                    </TouchableOpacity>
                                )
                            })}

                        </View>

                        <View style={{width:250,height:100,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:'#1582F4',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'#fff',fontSize:20}}>Total Payment</Text>
                            <Text style={{color:'#fff',fontSize:25}}>${item.extraCharge+item.reward}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>this.setState({showPin:true})} style={{width:250,height:60,alignSelf:'center',marginTop:20,borderRadius:10,
                            backgroundColor:'#1582F4',alignItems:'center',justifyContent:'center'}}>
                            {loading?<ActivityIndicator color={'#ffff'}/>:<Text style={{color:'#fff',fontSize:18}}>Confirm Payment</Text>}
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

            </View>
            <Modal visible={this.state.showPin} animationType={'fade'}>
                <View style={{position:'absolute',width,height,backgroundColor:'#1582F4'}}>
                    <View style={{width:'95%',alignSelf:'center',height:50,position:'absolute',justifyContent:'center'}}>
                        <TouchableOpacity onPress={()=>this.setState({showPin:false})}>
                            <Icons name={'chevron-left'} size={50} color={'#fff'}/>
                        </TouchableOpacity>
                    </View>
                    <PINCode status={'enter'} stylePinCodeColorTitle={'#fff'} storedPin={'2222'}
                             onClickButtonLockedPage={()=>this.setState({showPin:false})}
                             stylePinCodeButtonCircle={{width:80,height:80,borderRadius:40}}
                             stylePinCodeColumnButtons={{width:80,height:80}}
                             stylePinCodeColumnDeleteButton={{width:80,height:80}}
                             finishProcess={this.handleNext}/>
                </View>
            </Modal>
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
    }
});
