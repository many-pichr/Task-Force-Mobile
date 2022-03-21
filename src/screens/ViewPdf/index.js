import React, { Component } from 'react';
import {
    Animated,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import {barHight, Colors} from '../../utils/config';
import PDFView from 'react-native-view-pdf';
const {width,height} = Dimensions.get('window')
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            loading:true,
        }
        this.myRef = React.createRef();
    }
    render() {
        const { url } = this.props.route.params
        const resources = {
            url
        };
        const resourceType = 'url';
        return (
            <View style={{ flex: 1, alignItems: 'center',backgroundColor:Colors.primary }}>
                <StatusBar  barStyle = "dark-content" hidden = {false} backgroundColor={'transparent'} translucent/>
                    <View style={{width:width,alignSelf:'center',marginTop:barHight,flexDirection:'row',alignItems:'flex-end',paddingBottom:10}}>
                        <View style={{width:'15%',justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                <Icons name={'chevron-left'} color={'#fff'} size={35}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'70%',alignSelf:'center',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:20}}>
                                View Attachment
                            </Text>
                        </View>
                    </View>
                    <View style={{width:width,alignSelf:'center',
                        backgroundColor:'#fff',flex:1}}>
                            {/* Some Controls to change PDF resource */}
                            <PDFView
                                fadeInDuration={250.0}
                                style={{ flex: 1,width: '100%' }}
                                resource={resources[resourceType]}
                                resourceType={resourceType}
                                onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                                onError={(error) => console.log('Cannot render PDF', error)}
                            />
                    </View>
                </View>
        );
    }
}
