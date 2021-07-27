import React, { Component} from "react";
import {ImageBackground, View, Text, Alert, Animated, Modal, Dimensions, StatusBar, Image} from 'react-native';
import RootStackNavigator from './Navigation'
import RootStackNavigatorAgent from './NavigationAgent'
import {setLoading} from './src/redux/actions/loading';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import assets from './src/assets/index';
import OneSignal from 'react-native-onesignal';
import {connect} from 'react-redux';
import {Colors} from './src/utils/config';
import User from './src/api/User';
import {setNotify} from './src/redux/actions/notification';
import {RFPercentage} from 'react-native-responsive-fontsize';
const {width,height} = Dimensions.get('window')
const storeData = async (value) => {
    try {
        await AsyncStorage.setItem('@notification_id', value)
        // await AsyncStorage.removeItem('@notification_id')
    } catch (e) {

    }
}
class App extends Component{

    constructor(props) {
        super(props);
        this.state={
            fadeAnim:new Animated.Value(0)
        }
    }
    async componentDidMount() {
        // this.startTimer()
        this.handleGetPost()
        /* O N E S I G N A L   S E T U P */
        OneSignal.setAppId("9301b7be-36f5-47ec-919b-9ce25be83e21");
        OneSignal.setLogLevel(1, 0);
        // OneSignal.disablePush(false)
        // OneSignal.setInFocusDisplaying();
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("Prompt response:", response);
        });
        OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
            let notif = notifReceivedEvent.getNotification();
            this.handleGetPost()
            notifReceivedEvent.complete(notif);
            const button1 = {
                text: "Cancel",
                onPress: () => { notifReceivedEvent.complete(); },
                style: "cancel"
            };

            const button2 = { text: "Complete", onPress: () => { notifReceivedEvent.complete(notif); }};

            // Alert.alert("Complete notification?", "Test", [ button1, button2], { cancelable: true });
        });
        OneSignal.setNotificationOpenedHandler(notification => {
            // this.OSLog("OneSignal: notification opened:", notification);
        });
        OneSignal.setInAppMessageClickHandler(event => {
            // this.OSLog("OneSignal IAM clicked:", event);
        });
        OneSignal.addEmailSubscriptionObserver((event) => {
            // this.OSLog("OneSignal: email subscription changed: ", event);
        });
        OneSignal.addSubscriptionObserver(event => {
            // this.OSLog("OneSignal: subscription changed:", event);
            // this.setState({ isSubscribed: event.to.isSubscribed})
        });
        OneSignal.addPermissionObserver(event => {
            // this.OSLog("OneSignal: permission changed:", event);
        });
        const deviceState = await OneSignal.getDeviceState();
        if(deviceState.isSubscribed) storeData(deviceState.userId)
    }
    componentWillUnmount(): void {
        clearInterval(this.timer)
    }

    TimeCounter () {

        const {time} = {... this.state}
        if(time<=30){

        }else{
            clearInterval(this.timer)

        }

    }

    startTimer () {
        clearInterval(this.timer)
        this.timer = setInterval(this.TimeCounter.bind(this), 30000)
    }
    handleGetPost=async ()=> {
        const {notify, focus} = this.props
        // const body={
        //     date: "2021-05-12T09:31:25.625185",
        //     id: 1,
        //     isAllPost: false,
        //     isComplete: false,
        //     isMyPost: false,
        //     isMyTask: true,
        //     isProgress: true,
        //     user: null,
        //     userId: 47,
        // }
        // await User.Put("/api/ManuNotification/"+1,body).then((rs) => {
        //     if (rs.status) {
        //         console.log(123456,rs.data)
        //
        //     }
        // })
        await User.GetList("/api/ManuNotification/ByUser").then((rs) => {
            console.log('many===>',rs.data)
            if (rs.status) {
                if (focus.MyPost) rs.data.isMyPost=false;
                if (focus.MyTask) rs.data.isMyTast=false;
                if (focus.isProgress) rs.data.isProgress=false;
                if (focus.isComplete) rs.data.isComplete=false;
                this.props.setNotify(rs.data)
            }
        })

    }
    render(){
         const {loading,setting,focus} = this.props;
  return (
      <View style={{flex:1,width,height}}>
          <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent={true}/>
          {/*<Text>*/}
          {/*    sdfdfd {focus.MyTask?'true':'false'}*/}
          {/*</Text>*/}
          {setting.isAgent?
      <RootStackNavigatorAgent testing={'hdsfdfd'}/>:
      <RootStackNavigator testing={'hdsfdfd'}/>}
      {loading &&
          <ImageBackground source={assets.loading} style={{
              width,
              height:height+(height*0.1),
              // opacity: 0.7,
              flex:1,
              position:'absolute',
              backgroundColor: 'rgb(255,255,255)',
              alignItems: 'center',
          }}>
              <Image source={assets.logo1} style={{width:RFPercentage(60),height:RFPercentage(15),marginTop:height/8}}/>
              <Image source={assets.logo_txt} style={{width:RFPercentage(50),height:RFPercentage(7),marginTop:0}}/>

              <View style={{width:'100%',height:'100%',position:'absolute',justifyContent:'center'}}>
                  <ActivityIndicator size={50} animating={true} color={Colors.textColor}/>
              </View>
          </ImageBackground>
      }
          </View>);
}
}

const mapStateToProps = state => {
    return {
        loading: state.loading.loading,
        setting: state.setting.setting,
        user: state.user.user,
        notify: state.notify.notify,
        focus: state.focus.focus,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        },
        setNotify: (notify) => {
            dispatch(setNotify(notify))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
