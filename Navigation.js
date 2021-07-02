import React, { ReactElement } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, Route, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
    StartScreen, ChooseProfile, Signin, Message, Chat, Profile, Category,
    Signup, ChooseCategory, JobList, Home, AddPost, Comment, Review, Settings,
    MyFavorite, MyPost, Otp, ViewPost, CashOut, CashIn, MyMoney, TermCondition,PinCode,FormAbout,Notification
} from './src/screens/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { enableScreens } from "react-native-screens";
import {Colors} from './src/utils/config';
import {setLoading} from './src/redux/actions/loading';
import {setNotify} from './src/redux/actions/notification';
import {Marker} from "react-native-maps";
import {SvgXml} from 'react-native-svg';
import {map_blue, map_red} from './src/screens/Home/svg';
import {connect} from 'react-redux';
enableScreens();

console.disableYellowBox = true;

const RootStack = createStackNavigator();
const BottomTab = createMaterialBottomTabNavigator();

const BottomMenu = ({notify}) => {

    return (
        <BottomTab.Navigator
            initialRouteName="Home"

            activeColor={Colors.primary}
            barStyle={{ backgroundColor: "#fff",height:60,justifyContent:'center' }}
            sceneAnimationEnabled={Platform.OS === "ios"} // TODO: Since it has buggy with android elevation
        >
            <BottomTab.Screen
                name={"Home"}
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="home-outline"
                            size={25}
                            color={focused ? Colors.primary : "lightgray"}
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name="MyPost"
                component={MyPost}
                options={{
                    tabBarBadge: notify.isMyPost?'':false,
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons
                            name="list-alt"
                            size={25}
                            color={focused ? Colors.primary : "lightgray"}
                        />
                    ),
                }}
            />
            <BottomTab.Screen
                name=" "
                component={AddPost}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{width:100,alignItems:'center',marginTop:focused?-10:-15,position:'absolute'}}>
                            <Icons
                                name="plus-circle"
                                size={50}
                                color={focused ? Colors.primary : "lightgray"}
                            />
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name="Message"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon
                            name="message-outline"
                            size={25}
                            color={focused ? Colors.primary : "lightgray"}
                        />
                    ),
                }}
                component={Message}
            />
            <BottomTab.Screen
                name="Profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icons
                            name="user"
                            size={25}
                            color={focused ? Colors.primary : "lightgray"}
                        />
                    ),
                }}
                component={Settings}
            />

        </BottomTab.Navigator>
    );
};
const mapStateToProps = state => {
    return {
        notify: state.notify.notify,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNotify: (notify) => {
            dispatch(setNotify(notify))
        }
    }
}
const Tabs =  connect(mapStateToProps, mapDispatchToProps)(BottomMenu)
const RootStackNavigator = ()=> {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootStack.Navigator initialRouteName="Start" headerMode="none"
                                     screenOptions={{gestureEnabled: true}}
                >
                    <RootStack.Screen name="RootBottomTab" component={Tabs} />
                    {/*<RootStack.Screen name="RootBottomTabAgent" component={BottomMenuAgent} />*/}
                    <RootStack.Screen name="Start" component={StartScreen}/>
                    <RootStack.Screen name="Choose" component={ChooseProfile}/>
                    <RootStack.Screen name="Signin" component={Signin}/>
                    <RootStack.Screen name="Signup" component={Signup}/>
                    <RootStack.Screen name="ChooseCategory" component={ChooseCategory}/>
                    <RootStack.Screen name="MyFavorite" component={MyFavorite}/>
                    <RootStack.Screen name="JobList" component={JobList}/>
                    <RootStack.Screen name="MyPost" component={MyPost}/>
                    <RootStack.Screen name="AddPost" component={AddPost}/>
                    <RootStack.Screen name="Comment" component={Comment}/>
                    <RootStack.Screen name="Review" component={Review}/>
                    <RootStack.Screen name="Chat" component={Chat}/>
                    <RootStack.Screen name="Category" component={Category}/>
                    <RootStack.Screen name="Settings" component={Settings}/>
                    <RootStack.Screen name="Otp" component={Otp}/>
                    <RootStack.Screen name="ViewPost" component={ViewPost}/>
                    <RootStack.Screen name="MyMoney" component={MyMoney}/>
                    <RootStack.Screen name="CashIn" component={CashIn}/>
                    <RootStack.Screen name="CashOut" component={CashOut}/>
                    <RootStack.Screen name="ViewUser" component={Profile}/>
                    <RootStack.Screen name="TermCondition" component={TermCondition}/>
                    <RootStack.Screen name="PinCode" component={PinCode}/>
                    <RootStack.Screen name="FormAbout" component={FormAbout}/>
                    <RootStack.Screen name="Notification" component={Notification}/>
                </RootStack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default RootStackNavigator;
