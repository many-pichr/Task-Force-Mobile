import React,{Component} from 'react';
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
    Alert,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import PINCode from '@haskkor/react-native-pincode'
import {setLoading} from '../redux/actions/loading';
import {setUser} from '../redux/actions/user';
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window')
class Pin extends Component {

    render() {
        const props=this.props
        return (
            <Modal visible={true} animationType={'fade'} statusBarTranslucent={true}>
                <View style={{position: 'absolute', width, height:'100%', backgroundColor: '#1582F4'}}>
                    <PINCode status={'enter'} stylePinCodeColorTitle={'#fff'} storedPin={props.user.pinCode}
                             onClickButtonLockedPage={props.handleClose}
                             stylePinCodeButtonCircle={{width: 80, height: 80, borderRadius: 40}}
                             stylePinCodeColumnButtons={{width: 80, height: 80}}
                             stylePinCodeColumnDeleteButton={{width: 80, height: 80}}
                             finishProcess={props.handleVerify}
                    />
                    <View style={{
                        width: '95%',
                        alignSelf: 'center',
                        height: 80,
                        position: 'absolute',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity onPress={props.handleClose} style={{marginTop:40,flex:1}}>
                            <Icons name={'chevron-left'} size={50} color={'#fff'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pin)