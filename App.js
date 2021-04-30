import React, { Component} from "react";
import {ImageBackground, View, Platform,Alert, Animated, Modal, Dimensions, StatusBar} from 'react-native';
import RootStackNavigator from './Navigation'
import RootStackNavigatorAgent from './NavigationAgent'
import {setLoading} from './src/redux/actions/loading';
import { ActivityIndicator, Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import assets from './src/assets/index';
import OneSignal from 'react-native-onesignal';
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window')
const storeData = async (value) => {
    try {
        await AsyncStorage.setItem('@notification_id', value)
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
        /* O N E S I G N A L   S E T U P */
        OneSignal.setAppId("9301b7be-36f5-47ec-919b-9ce25be83e21");
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("Prompt response:", response);
        });
        OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
            // this.OSLog("OneSignal: notification will show in foreground:", notifReceivedEvent);
            let notif = notifReceivedEvent.getNotification();

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
    render(){
         const {loading,setting,user} = this.props;
  return (
      <View style={{flex:1,width,height}}>
          <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent={true}/>
          {setting.isAgent?
      <RootStackNavigatorAgent/>:
      <RootStackNavigator/>}
      {loading &&
          <ImageBackground source={assets.loading} style={{
              width,
              height:height+(height*0.1),
              // opacity: 0.7,
              flex:1,
              position:'absolute',
              backgroundColor: 'rgb(255,255,255)',
              alignItems: 'center',
              justifyContent: 'center'
          }}>
              <ActivityIndicator size={50} animating={true} color={'#1477ff'}/>
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
