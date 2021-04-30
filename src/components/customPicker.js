import React, {Component, useEffect,useState,useRef} from 'react';
import {Platform, Picker, View, Text, TextInput, TouchableOpacity, Dimensions, BackHandler} from 'react-native';
import {Colors} from '../utils/config'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {RFPercentage} from 'react-native-responsive-fontsize';
import ActionSheet from 'react-native-actions-sheet';
const {width,height} = Dimensions.get('window')

function getLabel(data,value) {
    if(data&&data.length>0){
        let result ="Please Select"
        for(var i=0;i<data.length;i++){
            if(data[i].value==parseInt(value)){
                result=data[i].label
                break;
            }
        }
       return result;

    }else{
        return "Please Select"
    }

}
const App = (props) => {
    const [choosedate,setChooseDate] = useState(false);
    const {values,error,focus} = props.value
    const dateSlider = useRef(null);
    const onChange = (event, selectedDate) => {
        setChooseDate(false)
        if(event.type=='set'||Platform.OS=='ios'){
            const currentDate = selectedDate || new Date();
            props.handleInput(props.name,currentDate)
        }

    };
    function toggleSlider() {
        dateSlider.current?.setModalVisible()
    }
        return (<>
                {props.input?
                    <View style={{width:'100%'}}>
                        <Text style={{fontSize:RFPercentage(2.5),color:Colors.primary,marginTop:5,}}>{props.nolabel?"":props.label} {props.required&&<Text style={{color:'#ff514d'}}>*</Text>}</Text>
                        <TextInput
                        placeholder={props.title}
                        multiline={props.textarea}
                        value={values[props.name]}
                        numberOfLines={4}
                        keyboardType={props.number?'numeric':'default'}
                        onChangeText={value=>props.handleInput(props.name,value)}
                        labelStyle={[{color:'#1582F4'},{fontWeight:'normal'}]}
                        style={[{height:props.textarea?100:40,borderBottomWidth:1,borderBottomColor:Colors.primary,width:'100%'}]}

                    />
                    </View>:<>
                        {props.view?
                            <View style={{width:'100%',borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                                <Text style={{fontSize:RFPercentage(2.5),color:Colors.primary,marginTop:5,}}>{props.nolabel?"":props.label}</Text>
                                <Text style={{marginTop:10,marginBottom:3,marginLeft:5,fontSize:RFPercentage(2)}}>{values[props.name]}</Text>
                            </View>:<>
                                {props.date?<>
                                    <TouchableOpacity disabled={props.disabled} onPress={()=>props.subDate?toggleSlider(true):props.onPress()} style={{width:'100%',height:60,marginTop:5,borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                                        <Text style={{fontSize:RFPercentage(2.5),color:Colors.primary}}>{props.label} {props.required&&<Text style={{color:'#ff514d'}}>*</Text>}</Text>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={{marginTop:10,marginBottom:3,marginLeft:5,fontSize:RFPercentage(2),width:'88%'}}>{values[props.name]?moment(values[props.name]).format('DD/MM/YYYY'):props.title}</Text>
                                            <MaterialIcons name={'today'} size={30} color={"#125bb5"}/>
                                        </View>

                                    </TouchableOpacity>
                                    {choosedate&&Platform.OS=='android'&&
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        style={{flex:1,width:'100%'}}
                                        value={values[props.name]?values[props.name]:new Date()}
                                        mode={'date'}
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChange}
                                    />}</>:<>
                                    <View style={{width:'100%'}}>
                                    <RNPickerSelect
                                        fixAndroidTouchableBug={true}
                                        onValueChange={(value) => props.handleInput(props.name,value)}
                                        value={values[props.name]}
                                        items={props.items}

                                    >
                        <View style={{width:'100%',height:60,marginTop:5,borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                            <Text style={{fontSize:RFPercentage(2.5),color:Colors.primary}}>{props.label} {props.required&&<Text style={{color:'#ff514d'}}>*</Text>}</Text>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{marginTop:10,marginBottom:3,marginLeft:5,fontSize:RFPercentage(2),width:'88%'}}>{getLabel(props.items,values[props.name])}</Text>
                                <MaterialIcons name={'arrow-drop-down'} size={25}/>
                            </View>

                        </View>
                                    </RNPickerSelect>
                                    </View>

                        </>}</>}
                        </>}
            {!props.noError&&<Text style={{width:'100%',fontSize:RFPercentage(1.8),color:'#ff514d'}}>
                {focus&&error&&error[props.name]&&error[props.name][0]}
            </Text>}
            <ActionSheet ref={dateSlider} gestureEnabled={true}>
                <View style={{width,height:250,backgroundColor:'#fff'}}>

                    <DateTimePicker
                        testID="dateTimePicker"
                        style={{alignSelf:'center',width:'100%',color:'blue'}}
                        textColor={"#0c3f7a"}
                        value={values[props.name]?values[props.name]:new Date()}
                        mode={'date'}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChange}
                    />
                </View>
            </ActionSheet>
        </>);
}
export default App;