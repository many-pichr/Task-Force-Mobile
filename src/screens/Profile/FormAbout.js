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
    ActivityIndicator, Alert, TextInput, Keyboard,
} from 'react-native';
import {Colors} from '../../utils/config'
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {HeaderText} from '../../components/Header';
import User from '../../api/User';
import * as Keychain from "react-native-keychain";
const {width,height} = Dimensions.get('window')
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading:false,
            text:props.user.about,
        }
    }
    handleUpdate=async ()=>{
        const {text} = this.state;
        const {params} = this.props.route;
        this.setState({showPin:false,loading:true})
        await User.Post("/api/User/change-info", JSON.stringify({
            "language": "",
            "address": "",
            "idType": "",
            "idNumber": "",
            "dob": "2020-01-01",
            "progress": 0,
            "about": text
        }))
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        await User.CheckUser().then((rs) => {
            if(rs.status){
                this.props.setUser(rs.data)
                Keychain.setGenericPassword(JSON.stringify(rs.data), token)
                this.props.navigation.goBack();
            }
        })
        this.setState({loading:false})
    }
    render() {
        const {loading,text} = this.state
        const {user} = this.props;
        console.log(user)
        const {params } = this.props.route
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#edeff2' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <HeaderText title={"Edit About"} handleBack={()=>this.props.navigation.goBack()} rightIcon={''} handleRight={()=>console.log('true')}/>
                    <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1} style={{width:width*0.95,marginTop:20,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>
                        <View style={{width:'90%',alignSelf:'center',marginTop:20}}>
                            <Text>
                                Describe about yours
                            </Text>
                            <View style={styles.textAreaContainer} >
                                <TextInput
                                    style={styles.textArea}
                                    value={text}
                                    onChangeText={val=>this.setState({text:val})}
                                    underlineColorAndroid="transparent"
                                    placeholder="Type something"
                                    placeholderTextColor="grey"
                                    numberOfLines={10}
                                    multiline={true}
                                />
                            </View>
                        </View>
                        <View style={{width:width,alignSelf:'center',alignItems:'center',marginTop:20}}>
                            <TouchableOpacity onPress={this.handleUpdate}
                                style={{justifyContent:'center',alignItems:'center',width:'70%',height:RFPercentage(7),backgroundColor:Colors.textColor,borderRadius:10}}>

                                <Text style={{color:'#fff',fontSize:RFPercentage(2.5)}}>Update</Text>

                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

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
    },
    textAreaContainer: {
        borderColor: Colors.textColor,
        borderWidth: 0.5,
        marginTop:10,
        padding: 5,
        width:'100%',
        alignSelf:'center'
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
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
