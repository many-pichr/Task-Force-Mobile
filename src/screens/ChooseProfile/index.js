import React, { Component } from 'react';
import {Animated, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, StatusBar} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Colors, Fonts} from '../../utils/config';
import {connect} from 'react-redux';
import Lang from '../../Language';
const {width,height} = Dimensions.get('window')

const data=[
    {id:1,title:'iorganizer',
        subTittle: 'You will be organizing a task, and reward an agent accordingly.',
        source:require('../../assets/images/bag.png'),width:61.046875,height:52.78125},
    {id:2,title:'iagent',
        subTittle: 'You will apply to complete a task, and get reward accordingly.',
        source:require('../../assets/images/person.png'),width:61.046875,height:52.78125},
    {id:3,title:'both',
        subTittle: 'Please select both if you are not sure.',
        source:require('../../assets/images/people.png'),width:61.046875,height:52.78125},
]
class Index extends Component {
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

    handleNext=(id)=>{
            this.props.navigation.replace('Signin',{profileType:id})
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
    render() {
        const {lang} = this.props.setting;
    return (
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:'#f9f9f9' }}>
            <StatusBar  barStyle = "light-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <View style={{width:width,height:height*0.3,alignItems:'center',justifyContent:'center',backgroundColor:Colors.primary}}>
            <View style={{width:'90%',alignSelf:'center'}}>
                <Text style={{fontSize:RFPercentage(3),color:'#fff',fontFamily:Fonts.primary}}>{Lang[lang].intro1}</Text>
                <Text style={{fontSize:RFPercentage(2),color:'#fff',marginTop:10,fontFamily:Fonts.primary}}>
                    {Lang[lang].introduce}
                </Text>
            </View>
          </View>
            <View style={{width:width,height:height*0.70,alignItems:'center'}}>
                <View style={{width:'100%',height:'80%',alignItems:'center',backgroundColor:'#f9f9f9',borderRadius:25,marginTop:-20,justifyContent:'center'}}>
                    <View style={{width:'100%',alignSelf:'center',alignItems:'center',height:height*0.4,justifyContent:'center'}}>
                        {data.map((item,index) => {
                        return (
                            <TouchableOpacity onPress={()=>this.handleNext(item.id)} style={styles.cardItem}>
                                <View style={{width:'20%',justifyContent:'center',alignItems:'center',height:'100%'}}>
                                    <Image source={item.source} style={{width:item.width*(RFPercentage(10)/100),height:item.height*(RFPercentage(10)/100)}}/>
                                </View>
                                <View style={{width:'80%',height:'100%',justifyContent:'center'}}>
                                    <Text style={[{fontSize:18,color:'#20354E'}, lang==='kh'&&{fontFamily:Fonts.primary}]}>
                                        {Lang[lang][item.title]}
                                    </Text>
                                    <Text style={{fontSize:13,color:'#838383'}}>
                                        {item.subTittle}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                    </View>
                </View>
            </View>
        </View>
    );
  }
}
const mapStateToProps = state => {
    return {
        setting: state.setting.setting,
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)

const styles = StyleSheet.create({
    cardItem:{
        width:'90%',height:RFPercentage(13),backgroundColor:'#fff',borderRadius:10,
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
