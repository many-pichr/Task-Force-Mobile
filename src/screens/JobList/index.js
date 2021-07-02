import React, { Component } from 'react';
import {Animated,SafeAreaView, StyleSheet,Image, View, Text,Modal, Platform, ScrollView, Dimensions, FlatList} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemFavorite} from '../../components/Items';
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
    render() {
    return (
            <ListScreen
                title={'Job List'}
                back
                renderItem={<>
                    <FlatList
                        contentContainerStyle={{marginTop:0}}
                        data={[1,2,3,4,5,6,7,8,9]}
                        renderItem={({item,index}) =><CustomItem index={index} bottom={index==8?250:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </>}
                goBack={()=>this.props.navigation.goBack()}
            />
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
