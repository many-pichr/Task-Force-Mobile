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
    RefreshControl, ActivityIndicator,
} from 'react-native';
import {ListScreen} from '../../components/ListScreen';
import {CustomItem, ItemFavorite} from '../../components/Items';
import User from '../../api/User';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {connect} from 'react-redux';
import {Colors, Fonts} from '../../utils/config';
import Lang from '../../Language';
const {width,height} = Dimensions.get('window')

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            loading:true,
            start:true,
            refreshing:false
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        this.handleGetPost(false)

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if(!this.state.start){
                this.handleGetPost(false)
            }
        });
        this.setState({start:false})
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    handleGetPost=async (refreshing)=>{
        await User.GetList('/api/JobInterested/CurrentUser').then((rs) => {
            if(rs.status){
                console.log(rs.data,222)
                this.setState({data:rs.data,refreshing:false,loading:false})
            }
        })
        this.props.set(false)
    }
    handleNext=(id)=>{
        this.props.navigation.navigate('ViewPost',{title:'View Post',home:true,view:true,id:id})
    }
    fadeIn = async () => {
        await this.setState({fadeAnimation:new Animated.Value(0)})
        Animated.timing(this.state.fadeAnimation, {
            toValue: 1,
            duration: 600
        }).start();
    };
    handleRemove=async (item)=>{
        this.setState({loading:true})
        await User.DeleteInterested(item.id).then((rs) => {
            if(rs.status){
                console.log(rs.data,555)
            }
        })
        this.handleGetPost(false)
    }
    handleSubmit=async (item)=>{
        this.setState({refreshing:true})
        await User.SubmitRequestJob({userId:this.props.user.id,jobId:item.jobPost.id}).then((rs) => {
            if(rs.status){
            }
        })
        await User.DeleteInterested(item.id)
        this.handleGetPost(true)
        this.setState({loading:false})

    }
    setLocation=(coor)=>{
        const {items} = this.state
        items.push(coor)
        this.setState(items)
    }
    render() {
        const {loading,long,refreshing,data} = this.state
        const {lang} = this.props.setting;
    return (
            <ListScreen
                title={Lang[lang].mfavorite}
                renderItem={<>
                    {data.length>0?<FlatList
                        contentContainerStyle={{marginTop:30,paddingBottom:data.length>3?0:300}}
                        refreshControl={<RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                        data={data}
                        renderItem={({item,index}) =><ItemFavorite user={item.jobPost.user} handleRemove={()=>this.handleRemove(item)} handleRequest={()=>this.handleSubmit(item)} onPress={()=>this.handleNext(item.jobPost.id)} item={item} index={index} bottom={index==8?250:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />:<ScrollView showsVerticalScrollIndicator={false}  refreshControl={<RefreshControl
                        colors={["#9Bd35A", "#689F38"]}
                        refreshing={refreshing}
                        onRefresh={()=>this.handleGetPost(true)} />}>
                        <View style={{height:height*0.8,justifyContent:'center',alignItems:'center'}}>
                            {loading?
                                <ActivityIndicator size={'large'} color={Colors.textColor} />:
                                <Text style={{fontSize:20,color:Colors.textColor,fontFamily:Fonts.primary}}>
                                    {Lang[lang].nodata}
                                </Text>}
                        </View>
                    </ScrollView>
                        }
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
const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        setting: state.setting.setting,
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
