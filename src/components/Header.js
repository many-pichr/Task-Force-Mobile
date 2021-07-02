import React, { Component } from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import {Input, Header, Badge} from 'react-native-elements';
import Icons from 'react-native-vector-icons/Feather';
import {Colors} from '../utils/config'
import {setNotify} from '../redux/actions/notification';
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window')

const HeaderAgent=(props)=>{

        return (<View>
                <View style={{width:'90%',height:50,alignItems:'center',flexDirection:'row',alignSelf:'center'}}>
                        <View style={{width:"10%"}}>
                            <TouchableOpacity onPress={props.switchView}>
                                <Icons name={!props.map?'map':'list'} size={25} color={Colors.textColor}/>
                            </TouchableOpacity>
                        </View>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',width:'80%',borderRadius:10}}>
                        <View style={{width:'10%',justifyContent:'center',alignItems:'flex-end'}}>
                            <Icons name={'search'} size={20} color={Colors.textColor}/>
                        </View>
                        <View style={{width:'70%',justifyContent:'center'}}>
                            <TextInput
                                autoFocus={false}
                                onFocus={props.onFocus}
                                value={props.search}
                                keyboardType={"web-search"}
                                onSubmitEditing={props.handleGo}
                                onChangeText={val=>props.onChange('search',val)}
                                style={{height:45,marginLeft:10}}
                                placeholderTextColor={'rgba(16,82,104,0.39)'}
                                placeholder={'Find jobs, tasks, etc...'}
                            />
                        </View>
                        <TouchableOpacity disabled={!props.isFilter} onPress={props.handleClear} style={{flex:1,width:'10%',justifyContent:'center'}}>
                            {props.isFilter&&<Icons name={'x'} size={25} color={'red'}/>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.handleFilter} style={{flex:1,width:'10%',justifyContent:'center'}}>
                                <Icons name={'filter'} size={20} color={Colors.textColor}/>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity onPress={props.notiScreen} style={{width:"10%",alignItems:'center'}}>
                        <Icons name={'bell'} size={25} color={Colors.textColor}/>
                        {props.notify.count>0&&<Badge
                            status="error"
                            value={props.notify.count}
                            containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                        />}
                    </TouchableOpacity>
                    </View>
            </View>

        );
}
const HeaderText=(props)=>{

    return (<Header
            containerStyle={{width,borderBottomWidth:0}}
            backgroundColor={'transparent'}
            leftComponent={{ icon: 'chevron-left', color: '#fff',size:30,onPress:props.handleBack }}
            centerComponent={{ text: props.title, style: { color: '#fff',fontSize:20 } }}
            rightComponent={{ icon: props.rightIcon, color: '#fff',size:30,onPress:props.handleRight }}
        />

    );
}

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
const Headers =  connect(mapStateToProps, mapDispatchToProps)(HeaderAgent)
export {Headers,HeaderText}
