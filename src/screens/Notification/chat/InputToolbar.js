/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React,{useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import { InputToolbar, Actions, Composer, Send, RenderMessageAudioProps } from 'react-native-gifted-chat';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../../utils/config';
import Slider from '@react-native-community/slider';
export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#fff',
        justifyContent:'center',
        paddingTop: 0,
    }}
    primaryStyle={{ alignItems: 'center' }}
  />
);
export function renderAudio(props){
    const [count, setCount] = useState(0);
    return(
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity>
                <Icons name={'play'} style={{marginLeft: 10}} color={Colors.primary} size={20}/>
            </TouchableOpacity>
            <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
            />
        </View>
    )
}
export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => (
      <Icons name={'plus-circle'} size={30} color={'#1582F4'}/>
    )}
    options={{
      'Choose From Library': () => {
        console.log('Choose From Library');
      },
      Cancel: () => {
        console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 0,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}
  >
      <Icon name={'send'} size={30} color={'#1582F4'}/>
  </Send>
);
