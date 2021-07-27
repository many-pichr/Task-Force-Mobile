import React  from 'react';
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
    RefreshControl, ActivityIndicator, Keyboard,
} from 'react-native';
import {setLoading} from '../redux/actions/loading';
import {setUser} from '../redux/actions/user';
import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window')

function Index({setting,field}) {
console.log(setting.lang=='en'?"Hello":"សថដថដថ")

return <>{setting.lang=='en'?"Hello":"សថដថដថ"}</>

}

const mapStateToProps = state => {
    return {
        setting: state.setting.setting,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (loading) => {
            dispatch(setLoading(loading))

        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
