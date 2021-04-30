import React, { Component } from 'react';
import {Animated,StatusBar,TouchableOpacity, StyleSheet,Image, View, Text,Modal, Platform, ScrollView, Dimensions, FlatList} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemFavorite, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {barHight, Colors} from '../../utils/config';
import CustomPicker from '../../components/customPicker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import data from '../Home/data';
import {SvgXml} from 'react-native-svg';
import {map_blue, map_red} from '../Home/svg';
import {Button} from 'react-native-elements';
const {width,height} = Dimensions.get('window')

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={

        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        setTimeout(()=>{
            // this.fadeIn();
            this.setState({loading: false})
        }, 2000);
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
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
    setLocation=(coor)=>{
        const {items} = this.state
        items.push(coor)
        this.setState(items)
    }
    render() {
        const {map,long,lat,filter} = this.state
        const renderItem = ({ item, index }: any) => (
            <Item key={`intro ${index}`} index={index} source={item.source} title={item.name} />
        );
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
                        <Text style={{color:'#fff',fontSize:25}}>New Post</Text>
                    </View>
                    <View style={{width:'15%',justifyContent:'flex-end'}}/>
                </View>
                <View style={{width:width*0.9,alignSelf:'center',borderTopLeftRadius:20,borderTopRightRadius:20,
                    backgroundColor:'#fff',marginTop:10,height:height}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{width:(width*0.9)*0.9,alignSelf:'center',alignItems:'center',paddingBottom:200,}}>
                        <View style={{flexDirection:'row',marginTop:5}}>
                            <Text style={{color:'#1582F4',width:'50%',textAlign:'left'}}>Photos</Text>
                            <Text style={{color:'#1582F4',width:'50%',textAlign:'right'}}>0/5</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <FlatList
                                contentContainerStyle={{marginTop:10,flexDirection:'row'}}
                                data={[1,2,3,4,5]}
                                renderItem={({item,index}) =>
                                    <View style={{marginLeft:index==0?0:10,width:((width*0.9)*0.9)/3,height:((width*0.9)*0.9)/3,
                                        backgroundColor:'rgba(21,130,244,0.18)',justifyContent:'center',alignItems:'center'}}>
                                        <Icons name={'add-photo-alternate'} size={30} color={'#1582F4'}/>
                                        <Text style={{fontSize:13,color:'#1582F4'}}>Add Photo</Text>
                                    </View>
                                }
                                horizontal
                                pagingEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                legacyImplementation={false}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />

                        </View>
                        <CustomPicker input label={'Title'} title={'Title'} value={''}/>
                        <CustomPicker label={'Category'} title={'Mobile App UX/UI'}/>
                        <CustomPicker input label={'Description'} title={'Description'} textarea/>
                        <CustomPicker label={'Task Level'} title={'Medium'}/>
                        <CustomPicker label={'Deadline'} title={'No expiry'}/>
                        <CustomPicker label={'Priority'} title={'Urgent'}/>
                        <CustomPicker input label={'Extra ($)'} title={''} value={'50'}/>
                        <CustomPicker input label={'Reward ($)'} title={''} value={'500'}/>
                        <View style={{width:'100%',marginTop:10}}>
                            <Text style={{fontSize:18,color:Colors.primary}}>Location</Text>
                            <View style={{width:'100%',height:150,borderWidth:1,borderColor:Colors.primary,marginTop:10,borderRadius:10}}>
                                <MapView
                                    showsUserLocation={true}
                                    provider={PROVIDER_GOOGLE}
                                    onPress={info=>this.setLocation(info.nativeEvent.coordinate)}
                                    mapType={Platform.OS == "android" ? "standard" : "standard"}
                                    region={{
                                        latitude:11.5564,
                                        longitude: 104.9282,
                                        latitudeDelta: 0.8,
                                        longitudeDelta: 0.8
                                    }}
                                    style={{ width: '100%', height: '100%',borderRadius:10}}
                                >

                                </MapView>
                            </View>
                            <Button
                                title={"Submit"}
                                titleStyle={{fontSize:20}}
                                containerStyle={{alignSelf:'center',marginVertical:20}}
                                buttonStyle={{paddingVertical:13,width:width*0.6,borderRadius:10,backgroundColor:'#1582F4'}}
                            />
                        </View>
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
        marginVertical: 10,
    }
});
