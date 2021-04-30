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
    RefreshControl,
    Dimensions,
    FlatList,
    Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import {MyPostList} from '../../components/ListScreen';
import {ItemProgress,ItemComplete, ItemPost} from '../../components/Items';
import {setLoading} from '../../redux/actions/loading';
import {connect} from 'react-redux';
import User from '../../api/User';
import {Confirm} from '../../components/Dialog';
const {width,height} = Dimensions.get('window')

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            active:0,
            loading:true,
            refreshing:false,
            data:[],
            inprogress:[],
            cancel:false,
            completed:[],
        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this.fadeIn()
        this.props.navigation.addListener('focus', () => {
            // do something
            const params = this.props.route.params;
            if(params&&params.refresh){
                this.handleGetPost(false)
            }
        });
        this.handleGetPost(false)
        // this.props.set(true)
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    handleGetPost=async (refreshing)=>{
        await User.GetList('/api/JobPost/CurrentUser?_end=10&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                const items=[]
                const completed=[]
                for(var i=0;i<rs.data.length;i++){
                    if(rs.data[i].status=='selected'||rs.data[i].status=='completed'){
                        if(rs.data[i].completedStatus<100&&rs.data[i].status=='selected'){
                            items.push(rs.data[i])
                        }else if(rs.data[i].status=='completed'){
                            completed.push(rs.data[i])
                        }
                    }
                }
                this.setState({completed,data:rs.data,inprogress:items,refreshing:false,loading:false})
            }
        })
        // this.props.set(false)
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
    handleDelete=()=>{
        Alert.alert(
            //title
            'Please confirm!',
            //body
            'Are you sure to delete ?',
            [

                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'), style: 'cancel'
                },
                {
                    text: 'Yes',
                    // onPress: () => this.props.navigation.goBack()
                },
            ],
            {cancelable: false},
            //clicking out side of alert will not cancel
        );
    }
    handleCancel=async ()=>{
        const {id} = this.state;
        this.setState({cancel:false,refreshing:true})
        const url="/api/JobPost/ChangeStatus/"+id+"/cancel"
        await User.Put(url)
        this.handleGetPost(true);
        this.setState({refreshing:false})

    }
    handleAction=(index,item)=>{
        const {user} = this.props
        if(index==1){
           this.props.navigation.navigate('ViewPost',{title:'View Post',view:true,id:item.id})
       }else if(index==2){
           this.props.navigation.navigate('AddPost',{title:'Edit Post',view:true,id:item.id})
       }else if(index==4){
           this.props.navigation.navigate('Comment',{title:'Edit Post',item:item,userId:user.id})
       }else if(index==7){
            this.setState({cancel:true,id:item.id,currentValue:item.completedStatus/100,value:item.completedStatus/10})

        }else if(index==5){
           this.props.navigation.navigate('Review',{title:'Edit Post',item:item})
       }else if(index==3){
           this.handleDelete()
       }
    }
    handleSwitch=(status)=>{
        this.setState({active:status})
    }
    render() {
        const {cancel,loading,inprogress,data,refreshing,active,completed} = this.state
        return (<>
            <MyPostList
                title={'My Post'}
                titles={['All Post','In Progress','Complete']}
                active={active}
                add
                onSwitch={this.handleSwitch}
                renderItem={active==0?<>
                    {data.length>0?<FlatList
                        contentContainerStyle={{marginTop:10}}
                        refreshControl={<RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}
                        data={data}
                        renderItem={({item,index}) =><ItemPost isPost={true} status={item.status} onPress={()=>this.handleAction(1,item)} handleAction={this.handleAction} item={item} index={index} bottom={(index+1)==data.length?250:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />:<ScrollView refreshControl={<RefreshControl
                        colors={["#9Bd35A", "#689F38"]}
                        refreshing={refreshing}
                        onRefresh={()=>this.handleGetPost(true)} />}>
                        <View style={{height:height*0.8,justifyContent:'center',alignItems:'center'}}>
                            {loading?
                                <ActivityIndicator size={'large'} color={'#0D70D9'} />:
                                <Text style={{fontSize:20,color:'#0D70D9'}}>
                                    No Data
                                </Text>}
                        </View>
                    </ScrollView>}</>:active==1?<>
                    {inprogress.length>0?<FlatList
                        contentContainerStyle={{marginTop:10}}
                        data={inprogress}
                        renderItem={({item,index}) =><ItemProgress onPress={()=>this.handleAction(1,item)} item={item} handleAction={this.handleAction} index={index} bottom={(index+1)==inprogress?250:0}/>}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />:<ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}>
                            <View style={{height:height*0.8,justifyContent:'center',alignItems:'center'}}>
                                {loading?
                                    <ActivityIndicator />:
                                    <Text style={{fontSize:20,color:'#0D70D9'}}>
                                    No Data
                                </Text>}
                            </View>
                        </ScrollView>}
                    </>:
                    <>
                        {completed.length>0?<FlatList
                            contentContainerStyle={{marginTop:10}}
                            data={completed}
                            renderItem={({item,index}) =><ItemComplete isPost={true} onPress={()=>this.handleAction(5,item)} item={item} handleAction={this.handleAction} index={index} bottom={(index+1)==inprogress?250:0}/>}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />:<ScrollView refreshControl={<RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={refreshing}
                            onRefresh={()=>this.handleGetPost(true)} />}>
                            <View style={{height:height*0.8,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:20,color:'#0D70D9'}}>
                                    No Data
                                </Text>
                            </View>
                        </ScrollView>}
                    </>
                    }
                onAdd={()=>this.props.navigation.navigate('AddPost',{title:'Add Post',view:false})}

            />
        {cancel&&<Confirm handleClose={()=>this.setState({cancel:false})} handleConfirm={this.handleCancel} title={'Warning'} subtitle={'Are you sure to cancel?'} visible={cancel}/>}

        </>
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
        user: state.user.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Index)
