import React, { Component } from 'react';
import {
    Animated,
    StyleSheet,
    View,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ImageBackground,
} from 'react-native';
import assets from '../../assets'
import {Item} from './Item'
import {Header} from './Header'
import {Colors} from '../../utils/config';
import User from '../../api/User';
import {FullIndicator} from '../../components/customIndicator'
const {width,height} = Dimensions.get('window')
const styles = StyleSheet.create({
    title:{
        textAlign:'justify',marginVertical:10,fontWeight:'bold',fontSize:fontSizer(width),color:'#20354E'
    },
    subTitle:{textAlign:'center',color:Colors.textColor,fontSize:16},
    bubble:{width:8,height:6,borderRadius:4,backgroundColor:'#b9b9b9'},
    bubbleContainer:{width:'33.33%',alignItems:'center'},
    exBubble:{width:16,backgroundColor: '#1582F4'},
    footerContainer: {
        flex: 1,
        alignItems: "center",
        height:'10%'
    },

    btnApply: {
        backgroundColor: Colors.primary,
        width: width*0.7,
        height:width*0.13,
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
            loading:true,
            fadeAnimation: new Animated.Value(0),
            fadeAnimation1: new Animated.Value(0),
            categories:[],
            checks:{},
            checked:{},
            ids:{}
        }
    }
    componentDidMount(): void {
        this.fadeIn()
        this.fadeIn1()
        this.handleGetCategory();
    }
    handleGetCategory=async (refreshing)=>{
        const items=[];
        const checks = {};
        await User.GetList('/api/JobCategory?_end=100&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                for(var i=0;i<rs.data.length;i++){
                    const item=rs.data[i];
                    checks[item.id]=false
                    items.push(item)
                }

                this.setState({categories:items,refreshing:false,checks})
            }
        })
        await User.GetList('/api/UserCategory/ByUser').then((rs) => {
            if(rs.status){
                const checked = {};
                const ids = {};
                for(var i=0;i<rs.data.length;i++){
                        const cat = rs.data[i];
                        checked[cat.jobCategoryId]=true;
                        ids[cat.jobCategoryId]=cat.id;
                }
                for(var j=0;j<items.length;j++){
                    const item=items[j];
                    if(checked[item.id]){
                        checked[item.id]=true;
                        checks[item.id]=true;
                    }else{
                        checked[item.id]=false;
                    }
                }
                this.setState({checked,checks,ids})
            }
        })
        this.setState({loading:false})
    }
    handleDelete=async ()=>{
        const {values} = this.state;
        const url="/api/UserSkill/"+values.id;
        await User.Delete(url)
        this.props.navigation.goBack();
        this.setState({loading:false})
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
    handleCheck=(index)=>{
        const {checks} = this.state;
        checks[index]=!checks[index];
        this.setState({checks})
    }
    handleUpdate=async ()=>{
        this.setState({loading:true})
        const {params} = this.props.route;
        const {checks,categories,checked,ids} = this.state;
        for(var i=0;i<categories.length;i++){
           const item=categories[i];
           if(checked[item.id]){
               if(!checks[item.id]) {
                   const url="/api/UserCategory/"+ids[item.id];
                   await User.Delete(url)
               }
           }else{
               if(checks[item.id]){
                   const url="/api/UserCategory";
                   const body={
                       "id": 0,
                       "userId": params.userId,
                       "jobCategoryId": item.id,
                   }
                   User.Post(url, JSON.stringify(body))
               }
           }

        }
        this.setState({loading:false});
        this.props.navigation.goBack();
    }
    renderFooterComponent = () => {
        return (
            <View style={styles.footerContainer}>
                {/*<TouchableOpacity>*/}
                {/*    <Text style={styles.moreTopicText}>Load More</Text>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity
                    style={styles.btnApply}
                    onPress={this.handleUpdate}
                >
                    <Text style={styles.btnLabel}>Apply</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {loading,checks,categories} = this.state
        const renderItem = ({ item, index }: any) => (
            <Item key={`intro ${index}`} url={item.photoURL} title={item.name} checked={checks[item.id]} handleCheck={()=>this.handleCheck(item.id)}/>
        );
    return (
        <ImageBackground source={assets.background}
                         style={{flex: 1, alignItems: 'center', backgroundColor: '#F5F7FA',height:'100%',width}}>
            <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent = {true}/>
            <View style={{width:width,height:'90%',alignItems:'center',justifyContent:'center'}}>
                <Header onBack={this.props.navigation.goBack}/>
                <Text style={styles.titleText}>
                    What kind of tasks are you interested in?
                </Text>

                <FlatList
                      data={categories}
                      extraData={categories}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={3}
                      showsVerticalScrollIndicator={false}
                  />

          </View>
            <View style={styles.footerContainer}>
                <TouchableOpacity
                    style={styles.btnApply}
                    onPress={this.handleUpdate}
                >
                    <Text style={styles.btnLabel}>Apply</Text>
                </TouchableOpacity>
            </View>
            {loading&&<FullIndicator/>}
        </ImageBackground>
    );
  }
}
