import React, { Component } from 'react';
import {
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
    ActivityIndicator,
} from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import {Colors} from '../../utils/config';
// import {WebView} from 'react-native-webview'
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:1,
            loading:false
        }
        this.myRef = React.createRef();
    }

    render() {
        const {loading} = this.state
        const {user} = this.props;
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                        style={{width:'95%',height:40,alignItems:'center',flexDirection:'row',marginTop:RFPercentage(5)}}>
                            <Icons name={'chevron-left'} size={30} color={'#fff'}/>
                        <Text style={{fontSize:RFPercentage(3),color:'#fff'}}>Term and Condition</Text>
                    </TouchableOpacity>
                    <View style={{width:width*0.95,marginTop:20,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>

                        <View style={{width:'100%',height:'100%',marginTop:20,alignItems:'center',justifyContent:'center'}}>
                        {/*<WebView*/}
                        {/*    source={{uri:'https://firebasestorage.googleapis.com/v0/b/task-force-c07fe.appspot.com/o/privacy.html?alt=media&token=d4dc91f1-a89b-4fe2-8815-08c26c702cdf'}}*/}
                        {/*    style={{flex:1,paddingBottom:100}}*/}
                        {/*    onLoadEnd={()=>this.setState({loading:false})}*/}
                        {/*/>*/}
                        <Text style={{fontSize:20,marginTop:-200}}>
                            Not Available
                        </Text>
                        </View>
                    </View>


                </View>

                <View style={{position:'absolute',width,height:180,backgroundColor:Colors.primary,borderBottomLeftRadius:20,borderBottomRightRadius:20}}>

                </View>

            </View>
                {loading&&<View style={{width,height:'100%',position:'absolute',backgroundColor:'rgba(0,0,0,0.16)',alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor}/>
            </View>}
            </>
        );
    }
}
const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
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
        setting: state.setting.setting,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setUser: (user) => {
            dispatch(setUser(user))
        },
        setSetting: (data) => {
            dispatch(setSetting(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
