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
    Alert,
} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemCandidate, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Comments from "react-native-comments";
import moment from "moment";
import {Input} from 'react-native-elements';
const {width,height} = Dimensions.get('window')

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={
            comments: [],
            loadingComments: true,
            lastCommentUpdate: null,
            review: props.review ? props.review : null,
            login: null,
            id: props.id
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
    render() {
        const {} = this.state
        const { title } = this.props.route.params
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
                        <Text style={{color:'#fff',fontSize:25}}>Post Comment</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <View style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:10,height:height}}>

                        <View style={{flexDirection:'row',width:'100%',borderBottomWidth:0.3,borderColor:'rgba(49,145,245,0.45)'}}>
                            <View style={{width:'100%',height:90,justifyContent:'center',alignSelf:'center',alignItems:'center'}}>
                                <View style={{width:'95%',height:60,alignItems:'flex-end'}}>
                                    <View style={{justifyContent:'center',alignItems:'center',width:50,height:25,backgroundColor:'rgba(49,145,245,0.34)',borderRadius:15,flexDirection:'row'}}>
                                        <Icons name={'star'} color={'#3191F5'}/>
                                        <Text style={{color:'#3191F5'}}>5.0</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',width:'100%',position:'absolute'}}>
                            <View style={{width:'25%',height:90,alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('./img/girl.jpg')}
                                       style={{width:60,height:60,borderRadius:10}}/>
                            </View>
                            <View style={{width:'75%',height:90,justifyContent:'center'}}>
                                <View style={{width:'100%',height:60}}>
                                    <Text style={{fontSize:16,color:'#333333',height:20}}>
                                        Jobpost.com
                                    </Text>
                                    <Text style={{fontSize:16,color:'#1582F4',height:20}}>
                                        Software Engineer
                                    </Text>
                                    <Text style={{fontSize:13,color:'#333333',height:20}}>
                                        Sensok, Phnom Penh, Cambodia
                                    </Text>
                                </View>
                            </View>
                        </View>


                    <ScrollView>
                        <View style={{flexDirection:'row',alignItems:'center',width:'95%',alignSelf:'center',marginTop:10}}>
                            <View style={{backgroundColor:'rgba(21,130,244,0.15)',borderRadius:10,width:'90%',height:50,justifyContent:'center'}}>
                                <Input
                                    placeholder={'Comment ...'}
                                    inputStyle={{fontSize:13}}
                                    inputContainerStyle={[{borderBottomWidth:0}]}
                                    containerStyle={{width:'90%',height:50}}
                                />
                            </View>
                        <TouchableOpacity style={{marginBottom:0,width:'10%',alignItems:'flex-end'}}>
                            <Icons name={'send'} size={30} color={'#1582F4'}/>
                        </TouchableOpacity>
                        </View>
                    </ScrollView>


                </View>

            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:'#1582F4',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

            </View>

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
