import React, { ReactElement } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, Route, useRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
    StartScreen, ChooseProfile, Signin, Message, Chat, Profile, Category,
    Signup, ChooseCategory, JobList, Home, AddPost, Comment, Review, Settings,
    MyFavorite, MyPost, Otp, MyJob, ViewPost, MyMoney, CashIn, TermCondition, PinCode, ChangePin, CashOut, FormAbout,
    FormExperience,FormEducation,FormSkill,Notification
} from './src/screens/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { enableScreens } from "react-native-screens";
import {Colors, Fonts} from './src/utils/config';
import {setNotify} from './src/redux/actions/notification';
import {connect} from 'react-redux';
import Lang from './src/Language';
enableScreens();

console.disableYellowBox = true;

const RootStack = createStackNavigator();
const BottomTab = createMaterialBottomTabNavigator();

const BottomMenu = ({notify,setting}) => {
    const {lang} = setting;
  return (
    <BottomTab.Navigator
      initialRouteName="Discover"
      activeColor={Colors.primary}
      barStyle={{ backgroundColor: "#fff" }}
      sceneAnimationEnabled={Platform.OS === "ios"} // TODO: Since it has buggy with android elevation
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
            title:<Text style={{fontFamily:Fonts.primary}}>{Lang[lang].home}</Text>,
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
            name="MyTask"
            title={'My Task'}
            component={MyJob}
            options={{
                title:<Text style={{fontFamily:Fonts.primary}}>{Lang[lang].mjob}</Text>,
                tabBarBadge: notify.isMyTask?'':false,
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
            name="Favorite"
            component={MyFavorite}
            options={{
                title:<Text style={{fontFamily:Fonts.primary,fontSize:10}}>{Lang[lang].favorite}</Text>,
                tabBarIcon: ({ focused }) => (
                    <Icon
                        name="heart-outline"
                        size={25}
                        color={focused ? Colors.primary : "lightgray"}
                    />
                ),
            }}
        />
      <BottomTab.Screen
        name="Message"
        options={{
            title:<Text style={{fontFamily:Fonts.primary}}>{Lang[lang].message}</Text>,
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
                title:<Text style={{fontFamily:Fonts.primary}}>{Lang[lang].profile}</Text>,
                tabBarIcon: ({ focused }) => (
                    <Icons
                        name="user"
                        size={25}
                        color={focused ? Colors.primary : "lightgray"}
                    />
                ),
            }}
            component={Profile}
        />

    </BottomTab.Navigator>
  );
};
const mapStateToProps = state => {
    return {
        notify: state.notify.notify,
        setting: state.setting.setting,
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
            <RootStack.Screen name="Start" component={StartScreen}/>
            <RootStack.Screen name="Choose" component={ChooseProfile}/>
            <RootStack.Screen name="Signin" component={Signin}/>
            <RootStack.Screen name="Signup" component={Signup}/>
            <RootStack.Screen name="ChooseCategory" component={ChooseCategory}/>
            <RootStack.Screen name="MyFavorite" component={MyFavorite}/>
            <RootStack.Screen name="JobList" component={JobList}/>
            <RootStack.Screen name="MyTask" component={MyJob}/>
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
            <RootStack.Screen name="ChangePin" component={ChangePin}/>
            <RootStack.Screen name="FormAbout" component={FormAbout}/>
            <RootStack.Screen name="FormExperience" component={FormExperience}/>
            <RootStack.Screen name="FormEducation" component={FormEducation}/>
            <RootStack.Screen name="FormSkill" component={FormSkill}/>
            <RootStack.Screen name="Notification" component={Notification}/>

        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootStackNavigator;
