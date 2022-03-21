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
import {Input} from 'react-native-elements';
import User from '../../api/User';
import {Item} from '../Home/Item';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={
            comments: [],
            sending:false,
            loading:true,
            loadingComments: true,
            value:'',
            lastCommentUpdate: null,
            review: props.review ? props.review : null,
            login: null,
            id: props.id
        }
        this.myRef = React.createRef();
    }

    componentDidMount(): void {
        this.fadeIn()
        this.handleGetData()
        // setTimeout(()=>{
        //     // this.fadeIn();
        //     this.setState({loading: false})
        // }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude,coordinate:info.coords}));
    }
    handleSend=async ()=>{
        const { userId,item} = this.props.route.params
        const {value} = this.state;
        const body={
            "id": 0,
            "jobPostId": item.id,
            "userId": userId,
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
            const newState={...this.state}
            newState.comments.push({comment:value,userId:userId})
            newState.sending=true;
            this.setState(newState)
            await User.Post("/api/JobComment", body).then((rs) => {
                if (rs.status) {
                    this.setState({sending:false,value:''})
                }
            })
        }
    }
    handleGetData=async ()=>{
        const { userId,item} = this.props.route.params
        await User.GetList("/api/JobComment/JobPost/"+item.id).then((rs) => {
            if(rs.status){
                this.setState({comments:rs.data,loading:false})
            }
        })
        this.setState({loading:false})
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
    renderItem = ({item,index}) => {
        const {sending,comments} = this.state;
        const { userId} = this.props.route.params
        return(
            <View>
            <View style={{width:'100%'}}>
                {item.comment != '' &&
                <View style={{
                    backgroundColor: item.userId==userId?Colors.textColor:'rgba(0,0,0,0.18)',
                    alignSelf: item.userId==userId?'flex-start':'flex-end',
                    marginLeft: item.userId==userId?10:0,
                    marginRight: item.userId==userId?0:10,
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10
                }}>
                    {item.comment.split('/n')[1]&&<Text style={{color: item.userId==userId?'#ffffff':'#000',fontSize:RFPercentage(2)}}>
                        {item.comment.split('/n')[1]}
                    </Text>}
                    <Text style={{color: item.userId==userId?'#ffffff':'#000',fontSize:RFPercentage(2)}}>
                        {item.comment.split('/n')[0]}
                    </Text>
                </View>
                }
            </View>
                {item.comment != ''&&sending && (index == comments.length - 1) &&
                <Text style={{marginLeft: 10}}>
                    Sending...
                </Text>
                }
            </View>
        )
    }
    render() {
        const {value,comments,loading} = this.state
        const { title,item,userId} = this.props.route.params
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
                        <Text style={{color:'#fff',fontSize:18}}>{item.title}</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <View style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:10,height:height}}>
                    <ScrollView>
                        <View style={{flexDirection:'row',alignItems:'center',width:'95%',alignSelf:'center',marginTop:10}}>
                            <View style={{width:'90%',height:50,justifyContent:'center',borderBottomWidth:1,borderColor:Colors.textColor}}>
                                <Input
                                    placeholder={'Comment ...'}
                                    value={value}
                                    onChangeText={val=>this.setState({value:val})}
                                    inputStyle={{fontSize:13}}
                                    inputContainerStyle={[{borderBottomWidth:0}]}
                                    containerStyle={{width:'90%',height:50}}
                                />
                            </View>
                        <TouchableOpacity onPress={this.handleSend} style={{marginBottom:0,width:'10%',alignItems:'flex-end'}}>
                            <Icons name={'send'} size={30} color={Colors.textColor}/>
                        </TouchableOpacity>
                        </View>

                        {loading?<View style={{height:height*0.6,alignSelf:'center',justifyContent:'center'}}>
                            <ActivityIndicator size={'large'} color={Colors.textColor}/>
                        </View>:<FlatList
                            data={comments}
                            inverted={true}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.id}
                        />}



                    </ScrollView>


                </View>

            </View>
            <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

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
