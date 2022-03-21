import React, { Component } from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
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
import {CustomItem, ItemFavorite, ItemPost} from '../../components/Items';
import Icons from 'react-native-vector-icons/Feather';
import {barHight, Colors} from '../../utils/config';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import * as Progress from 'react-native-progress';
import {About,Education,Skill,Experience} from './Tabs'
import {FormAbout} from './Form'
import BottomSheet from 'reanimated-bottom-sheet';
import {setLoading} from '../../redux/actions/loading';
import {setUser} from '../../redux/actions/user';
import {setSetting} from '../../redux/actions/setting';
import {connect} from 'react-redux';
import User from '../../api/User';
const {width,height} = Dimensions.get('window')
const initialLayout = { width: Dimensions.get('window').width };

const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]} />
);

const renderHeader = () => (
    <View style={styles.header}>
        <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
        </View>
    </View>

)
const skill=[
    'UX/UI Designer','Mobile app development','Software Engineer','Graphic Design'
]
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            index:0,
            progress:0,
            experience:[],
            education:[],
            skills:[],
            start:true,
            refreshing:false,
            loading:true,

        }
        this.myRef = React.createRef();
    }
    componentDidMount(): void {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
                this.handleGetPost(false)
        });
        this.handleGetPost(false)
        // this.props.set(true)
        // Geolocation.getCurrentPosition(info => this.setState({long:info.coords.longitude,lat:info.coords.latitude}));
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    handleGetPost=async (refreshing)=>{
        const {view,userId} = this.props;
        const user = view?this.props.users:this.props.user;
        await User.GetList(view?"/api/Experience/ByUser/"+userId:'/api/Experience/ByUser').then((rs) => {
            if(rs.status){
                this.setState({experience:rs.data})
            }
        })
        await User.GetList(view?"/api/Education/ByUser/"+userId:'/api/Education/ByUser').then((rs) => {
            if(rs.status){
                this.setState({education:rs.data})
            }
        })
        await User.GetList(view?"/api/UserSkill/ByUser/"+userId:'/api/UserSkill/ByUser').then((rs) => {
            if(rs.status){
                this.setState({skills:rs.data})
            }
        })
       this.setState({loading:false})
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
     handleAction=(i,add,item)=>{
         const {view} = this.props;
         if(!view){
             switch(i) {
             case 1:
                 this.props.navigation.navigate('FormAbout');
                 break;
             case 2:
                 this.props.navigation.navigate('FormExperience',{add,item});
                 break;
             case 3:
                 this.props.navigation.navigate('FormEducation',{add,item});
                 break;
             case 4:
                 this.props.navigation.navigate('FormSkill',{add,item});
                 break;
             case 2:
                 // code block
                 this.props.NextScreen("MyMoney");
                 break;
             default:
             // code block
         }
         }


     }
    render() {
        const {refreshing,skills,education,experience,loading} = this.state
        const {view,setting} = this.props;
        const user = view?this.props.users:this.props.user;
        const {lang}  = setting;
        return (
            <>
                {loading ?
                    <View style={{width, height: '65%', alignItems: 'center', justifyContent: 'center'}}>
                        {!this.props.load&&<ActivityIndicator size={'large'} color={Colors.primary}/>}
                    </View> :
                    <ScrollView refreshControl={<RefreshControl
                        colors={["#9Bd35A", Colors.primary]}
                        tintColor={Colors.primary}
                        refreshing={refreshing}
                        onRefresh={() => this.handleGetPost(true)}/>} showsVerticalScrollIndicator={false}>
                        <View style={{width: '100%', marginTop: 0,paddingBottom:300}}>

                            <About lang={lang} onAdd={() => this.handleAction(1)} about={user.about} view={view}/>
                            <Experience lang={lang} data={experience} onPress={this.handleAction} view={view}/>
                            <Education lang={lang} data={education} onPress={this.handleAction} view={view}/>
                            <Skill lang={lang} data={skills} onPress={this.handleAction} view={view}/>
                        </View>
                    </ScrollView>
                }
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
    },
    header: {
        backgroundColor: '#f1f1f1',
        shadowColor: '#000000',
        paddingTop: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
});
const mapStateToProps = state => {
    return {
        setting: state.setting.setting,
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
        },
        setSetting: (data) => {
            dispatch(setSetting(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
