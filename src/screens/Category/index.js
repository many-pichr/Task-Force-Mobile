import React, { Component } from 'react';
import {Animated, StyleSheet, View, FlatList, Text, Image, TouchableOpacity, Dimensions, StatusBar} from 'react-native';
import assets from '../../assets'
import { Button,Input } from 'react-native-elements';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Item} from './Item'
import {Header} from './Header'
import {Colors} from '../../utils/config';
const {width,height} = Dimensions.get('window')
const styles = StyleSheet.create({
    title:{
        textAlign:'justify',marginVertical:10,fontWeight:'bold',fontSize:fontSizer(width),color:'#20354E'
    },
    subTitle:{textAlign:'center',color:'#959595',fontSize:16},
    bubble:{width:8,height:6,borderRadius:4,backgroundColor:'#b9b9b9'},
    bubbleContainer:{width:'33.33%',alignItems:'center'},
    exBubble:{width:16,backgroundColor: '#1582F4'},
    footerContainer: {
        flex: 1,
        alignItems: "center",
    },

    btnApply: {
        backgroundColor: Colors.primary,
        width: 180,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 10,
    },

    btnLabel: {
        color: "#fff",
        fontSize: 20,
    },

    moreTopicText: {
        color: Colors.primary,
        textDecorationLine: "underline",
    },
});
let images = [
    { source: require("./img/img1.png"), name: "Programming" },
    { source: require("./img/img2.png"), name: "Accounting" },
    { source: require("./img/img3.png"), name: "Education" },
    { source: require("./img/img4.png"), name: "Tour Guide" },
    { source: require("./img/img5.png"), name: "Interview" },
    { source: require("./img/img6.png"), name: "History" },
    { source: require("./img/img7.png"), name: "History" },
    { source: require("./img/img1.png"), name: "History" },
    { source: require("./img/img1.png"), name: "History" },
];
function fontSizer (screenWidth) {
    if(screenWidth > 400){
        return 18;
    }else if(screenWidth > 250){
        return 23;
    }else {
        return 12;
    }
}
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            fadeAnimation: new Animated.Value(0),
            fadeAnimation1: new Animated.Value(0),
        }
    }
    componentDidMount(): void {
        this.fadeIn()
        this.fadeIn1()
    }

    handleNext=(index,value)=>{
            this.props.navigation.navigate('RootBottomTab')
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    fadeIn1 = async () => {
        Animated.timing(this.state.fadeAnimation1, {
            toValue: 1,
            duration: 600
        }).start();
    };
    renderFooterComponent = () => {
        return (
            <View style={styles.footerContainer}>
                <TouchableOpacity>
                    <Text style={styles.moreTopicText}>Load More</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnApply}
                    onPress={() =>
                        this.props.navigation.navigate("RootBottomTab", { screen: "Discover" })
                    }
                >
                    <Text style={styles.btnLabel}>Apply</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {focus,values} = this.state
        const renderItem = ({ item, index }: any) => (
            <Item key={`intro ${index}`} source={item.source} title={item.name} />
        );
    return (
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#F5F7FA' }}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <View style={{width:width,height:height,alignItems:'center',justifyContent:'center'}}>
              <Animated.View
                  style={[
                      {
                          opacity: this.state.fadeAnimation
                      }
                  ]}
              >

                  <FlatList
                      data={images}
                      extraData={images}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={3}
                      ListHeaderComponent={<Header handleBack={()=>this.props.navigation.goBack()}/>}
                      // ListFooterComponent={this.renderFooterComponent}
                      showsVerticalScrollIndicator={false}
                  />

              </Animated.View>
          </View>
          {/*<TouchableOpacity onPress={()=>this.props.navigation.navigate('RootBottomTab')}>*/}
          {/*  <Text>Get Start</Text>*/}
          {/*</TouchableOpacity>*/}
        </View>
    );
  }
}
