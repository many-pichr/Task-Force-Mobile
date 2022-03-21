import React, { Component } from 'react';
import {
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Text,
    Linking,
    Platform,
    ScrollView,
    Dimensions,
    FlatList,
    ActivityIndicator, Switch,
} from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import {Colors, Fonts} from '../../utils/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import assets from '../../assets'
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')

const list = [
    {
        title: 'Tel: ',
        right:'023 000 0000',
        icon: 'phone',
    },
    {
        title: 'Email: ',
        right:'info@taskforce.com',
        color:'#268cff',
        icon: 'phone',
    },
    {
        title: 'Website: ',
        right:'www.taskforce.com',
        color:'#268cff',
        icon: 'phone',
    },

]
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:1,
            mail:'taskforcekh@gmail.com',
            loading:false
        }
        this.myRef = React.createRef();
    }

    render() {
        const {map,long,mail,loading} = this.state
        const {user} = this.props;
        return (
            <>
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                <View style={{zIndex:1}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()}
                        style={{width:'95%',height:50,alignItems:'center',flexDirection:'row',marginTop:RFPercentage(5)}}>
                            <Icons name={'chevron-left'} size={30} color={'#fff'}/>
                        <Text style={{fontSize:RFPercentage(3),color:'#fff'}}>Contact Us</Text>
                    </TouchableOpacity>
                    <View style={{width:width*0.95,marginTop:10,alignSelf:'center',borderRadius:20,height:height,
                        backgroundColor:'#fff',paddingBottom:10}}>

                        <View style={{width:'100%',height:'100%',marginTop:10}}>
                            <View style={{width:100,height:100,marginTop:30,alignSelf:'center',
                                backgroundColor:Colors.primary,borderRadius:50,
                                alignItems:'center',justifyContent:'center'}}>
                                <Icon name={'phone-in-talk'} size={50} color={'#fff'}/>
                            </View>
                            <Text style={{color:"#363636",fontSize:25,marginTop:40,alignSelf:'center'}}>Need Help?</Text>
                            <Text style={{color:"#363636",fontSize:18,marginTop:20,alignSelf:'center'}}>Contact us in working hour</Text>
                            {/*<Image source={assets.appLogo} style={{width:100,height:100,alignSelf:'center'}}/>*/}
                            {/*<Image source={assets.logo_txt} style={{width:250,height:40,marginBottom:20,alignSelf:'center'}}/>*/}

                            {/*{list.map((l, i) => (*/}
                            {/*    <View style={{width:'90%',flexDirection:'row',marginTop:10,alignItems:'center',alignSelf:'center'}}>*/}
                            {/*        /!*<Icon name={l.icon} size={20} color={Colors.textColor}/>*!/*/}
                            {/*        <Text style={{color:"#363636",fontSize:16}}>{l.title}</Text>*/}
                            {/*        <Text style={{color:l.color?l.color:"#6a6a6a",fontSize:16}}> {l.right}</Text>*/}
                            {/*    </View>*/}
                            {/*))*/}
                            {/*}*/}
                            <View style={{height:100}}/>
                            <TouchableOpacity style={styles.button} onPress={()=>Linking.openURL('mailto:'+mail) }>
                                <View style={{width:'20%',alignItems:'flex-end'}}>
                                <Icon name={'email'} size={30} color={Colors.textColor}/>
                                </View>
                                <View style={{width:'70%',alignItems:'center'}}>
                                <Text style={{color:Colors.textColor,fontSize:16}}>{mail}</Text>
                                </View>
                            </TouchableOpacity>
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
    button:{
        width:width*0.8,height:width*0.14,alignSelf:'center',borderColor:Colors.primary,borderWidth:1,
        marginTop:10,borderRadius: 10,flexDirection:'row',alignItems:'center'
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
