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
    ScrollView,
    Dimensions,
    FlatList,
    StatusBar, RefreshControl, Keyboard,
} from 'react-native';
import {HeaderOrganizer} from '../../components/HeaderOrganizer'
import {Headers} from '../../components/Header'
import Icon from 'react-native-vector-icons/Feather';
import MapView, {Marker,PROVIDER_GOOGLE} from "react-native-maps";
import {Button} from 'react-native-elements';
import {barHight} from '../../utils/config'
import {setUser} from '../../redux/actions/user';
import {connect} from 'react-redux';
import { TouchableOpacity } from 'react-native';
const {width,height} = Dimensions.get('window')


class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            region: {
                latitude: 11.5564,
                longitude: 104.9282,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },


        }
        this.myRef = React.createRef();
    }
    onRegionChangeComplete=(region)=>{
       this.setState({region})
    }
    handleTabOverlay=()=>{
        Keyboard.dismiss();
        this.setState({focus:false})
    }
    render() {
        const {map,region,focus,refreshing,filter,posts,categories,apply} = this.state;
        const {user} = this.props;
        const renderItem = ({ item, index }: any) => (
            <Item key={`intro ${index}`} index={index} source={item.photoURL} title={item.name} />
        );
        return (
            <>
                <View style={{flex:1,alignItems: 'center',backgroundColor:'#F5F7FA' }}>
                    <View style={{marginTop:barHight}}>
                        <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent={true}/>
                        {/*<HeaderOrganizer bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>*/}
                        { user.userType=='1'?
                            <HeaderOrganizer bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>:
                            <Headers onFocus={()=>this.setState({focus:true})} bgColor={'#F5F7FA'} map={map} switchView={this.handleSwitch} handleFilter={()=>this.setState({filter:true})}/>}


                            <View style={{alignItems:'center',width,height:height}}>

                                    <>
                                    <MapView
                                        showsUserLocation={true}
                                        provider={PROVIDER_GOOGLE}
                                        onRegionChangeComplete={this.onRegionChangeComplete}
                                        // onPress={info=>this.setLocation(info.nativeEvent.coordinate)}
                                        // onPress={info=>console.log(info.nativeEvent.coordinate)}
                                        mapType={Platform.OS == "android" ? "standard" : "standard"}
                                        initialRegion={region}
                                        style={{ width: width, height: '100%'}}
                                    >

                                    </MapView>
                                    {focus&&<TouchableOpacity onPress={this.handleTabOverlay} style={{width:'100%',height:'100%',position:'absolute'}}>
                                    </TouchableOpacity>}
                                    </>
                            </View>
                    </View>


                </View>
                { user.userType=='1'&&map&&<View style={{position:'absolute',top:100,right:15}}>
                    <Button
                        onPress={()=>this.props.navigation.navigate('AddPost',{title:'Add Post',view:false})}
                        icon={
                            <Icon
                                name="plus"
                                size={30}
                                color="white"
                            />
                        }
                        buttonStyle={{width:50,height:50,borderRadius:30}}
                    />
                </View>}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        user: state.user.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
