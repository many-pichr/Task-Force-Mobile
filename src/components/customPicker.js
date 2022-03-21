import React, {Component, useEffect,useState,useRef} from 'react';
import {Platform, Picker, View, Text, TextInput, TouchableOpacity, Dimensions, BackHandler} from 'react-native';
import {Colors, Fonts} from '../utils/config';
import moment from 'moment';
import {Input} from 'react-native-elements'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReactNativePickerModule from 'react-native-picker-module';
import {RFPercentage} from 'react-native-responsive-fontsize';
import ActionSheet from 'react-native-actions-sheet';
import Lang from '../Language';
const {width,height} = Dimensions.get('window')

function getLabel(data,value,la) {
    const lang=la?la:'en'
    if(data&&data.length>0){
        let result =Lang[lang].pls+" "+Lang[lang].select
        for(var i=0;i<data.length;i++){
            if(data[i].value==parseInt(value)){
                result=data[i].label
                break;
            }
        }
       return result;

    }else{
        return Lang[lang].pls+Lang[lang].select
    }

}
const App = (props) => {
    const [choosedate,setChooseDate] = useState(false);
    const {values,error,focus} = props.value
    const dateSlider = useRef(null);
    const selectPicker = useRef(null);
    const onChange = (event, selectedDate) => {
        setChooseDate(false)
        if(event.type=='set'||Platform.OS=='ios'){
            const currentDate = selectedDate || new Date();
            props.handleInput(props.name,currentDate)
        }

    };
    function toggleSlider() {
        if(Platform.OS=='ios'){
            dateSlider.current?.setModalVisible()
        }else{
            setChooseDate(true)
        }
    }
        return (<>
                {props.input?
                    <View style={{width:'100%'}}>
                        <Text style={{fontSize:RFPercentage(2.2),color:Colors.textColor,marginTop:5,fontFamily:Fonts.primary}}>{props.nolabel?"":props.label} {props.required&&<Text style={{color:'#ff514d'}}>*</Text>}</Text>
                        <TextInput
                        placeholder={props.title}
                        placeholderTextColor={Colors.primaryBlur}
                        multiline={props.textarea}
                        value={values[props.name]}
                        numberOfLines={props.col?props.col:4}
                        onFocus={()=>props.onFocus&&props.onFocus(true)}
                        onBlur={()=>props.onFocus&&props.onFocus(false)}
                        keyboardType={props.number?'numeric':'default'}
                        onChangeText={value=>props.handleInput(props.name,value)}
                        labelStyle={[{color:Colors.textColor},{fontWeight:'normal'}]}
                        style={[{height:props.textarea?props.col?props.col*20:100:40,borderBottomWidth:1,borderBottomColor:Colors.primary,width:'100%'}]}

                    />
                    </View>:<>
                        {props.view?
                            <View style={{width:'100%',borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                                <Text style={{fontSize:RFPercentage(2.2),fontFamily:Fonts.primary,color:Colors.textColor,marginTop:5,}}>{props.nolabel?"":props.label}</Text>
                                <Text style={{marginTop:10,marginBottom:3,marginLeft:5,fontSize:RFPercentage(2)}}>{values[props.name]}</Text>
                            </View>:<>
                                {props.date?<>
                                    <TouchableOpacity disabled={props.disabled} onPress={()=>props.subDate?toggleSlider(true):props.onPress()} style={{width:'100%',marginTop:5,borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                                        <Text style={{fontSize:RFPercentage(2.2),fontFamily:Fonts.primary,color:Colors.textColor}}>{props.label} {props.required&&<Text style={{color:'#ff514d'}}>*</Text>}</Text>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Text style={{marginTop:10,marginBottom:3,marginLeft:5,fontSize:RFPercentage(2),width:'88%'}}>
                                                {values[props.name]?moment(values[props.name]).format('DD/MM/YYYY'):props.title}
                                            </Text>
                                            <MaterialIcons name={'today'} size={30} color={Colors.textColor}/>
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
                                    {/*<RNPickerSelect*/}
                                    {/*    fixAndroidTouchableBug={true}*/}
                                    {/*    // disabled={true}*/}
                                    {/*    onValueChange={(value) => props.handleInput(props.name,value)}*/}
                                    {/*    value={values[props.name]}*/}
                                    {/*    items={props.items}*/}

                                    {/*>*/}
                        <TouchableOpacity onPress={() => {selectPicker.current?.show()}}
                            style={{width:'100%',marginTop:5,borderBottomWidth:1,borderBottomColor:Colors.primary}}>
                            <Text style={{fontSize:RFPercentage(2.2),color:Colors.textColor,fontFamily:Fonts.primary}}>{props.label} {props.required&&<Text style={{color:'#ff514d'}}>*</Text>}</Text>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{marginTop:10,marginBottom:3,marginLeft:5,fontSize:RFPercentage(2),width:'88%'}}>{getLabel(props.items,values[props.name],props.lang)}</Text>
                                <MaterialIcons name={'arrow-drop-down'} size={25}/>
                            </View>

                        </TouchableOpacity>
                                        <ReactNativePickerModule
                                            pickerRef={selectPicker}
                                            value={values[props.name]}
                                            title={"Select "+props.label}
                                            items={props.items}
                                            onValueChange={(value) => props.handleInput(props.name,value)}
                                        />

                                    </View>

                        </>}</>}
                        </>}
            {!props.noError&&<Text style={{width:'100%',fontSize:RFPercentage(1.8),color:'#ff514d'}}>
                {focus&&error&&(focus[props.name]||focus==true)&&error[props.name]&&error[props.name][0]}
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
