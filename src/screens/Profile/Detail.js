import React, { Component } from 'react';
import {Animated,StatusBar,TouchableOpacity, StyleSheet,Image, View, Text,Modal, Platform, ScrollView, Dimensions, FlatList} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemFavorite, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/Feather';
import {barHight, Colors} from '../../utils/config';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import * as Progress from 'react-native-progress';
import {About,Education,Skill,Experience} from './Tabs'
const {width,height} = Dimensions.get('window')
const initialLayout = { width: Dimensions.get('window').width };

const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]} />
);

const renderTabBar = props => (
    <TabBar
        {...props}
        scrollEnabled={true}
        // labelStyle={{color:Colors.primary}}
        activeColor={Colors.primary}
        inactiveColor={Colors.primaryBlur}
        indicatorStyle={{backgroundColor:Colors.primary}}
        style={{ backgroundColor: '#F5F7FA' }}
    />
);
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            progress:0,
            routes:[
                { key: '0', title: 'Experience' },
                { key: '1', title: 'About' },
                { key: '2', title: 'Education' },
                { key: '3', title: 'Skill' },
            ]
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        setTimeout(()=>{
            // this.fadeIn();
            this.setState({progress: 0.8})
        }, 1000);
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
     renderScene = ()=>{
       return  SceneMap({
             first: FirstRoute,
             second: SecondRoute,
         });
     }
    render() {
        const {progress,long,routes,index} = this.state
        return (
            <><ScrollView>



                    <View style={{flex:1,width:width,marginTop:10}}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={SceneMap({
                                '0': Experience,
                                '1': About,
                                '2': Education,
                                '3': Skill,
                            })}
                            onIndexChange={index=>this.setState({index})}
                            initialLayout={initialLayout}
                            renderTabBar={renderTabBar}
                        />
                    </View>
            </ScrollView>
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
