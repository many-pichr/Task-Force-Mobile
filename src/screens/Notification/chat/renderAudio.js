import React,{Component}  from 'react';
import {TouchableOpacity, View, Dimensions, ActivityIndicator} from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import {Colors} from '../../../utils/config';
import Slider from '@react-native-community/slider';
// import SoundPlayer from 'react-native-sound-player'
import {setId} from '../../../redux/actions/audioid';
import {connect} from 'react-redux';
const {width} =Dimensions.get('window')
let _onFinishedPlayingSubscription = null
let _onFinishedLoadingSubscription = null
let _onFinishedLoadingFileSubscription = null
let _onFinishedLoadingURLSubscription = null
class RenderAudio extends Component{
    constructor(props) {
        super(props);
        this.state={
            play:false,
            duration:0,
            current:0,
            loading:false
        }
    }
// Subscribe to event(s) you want when component mounted
    PlayAudio=async ()=> {
        // var track = {
        //     id: props.data._id, // Must be a string, required
        //     url: props.data.audio, // Load media from the network
        //
        // };
        const {props} = this
        const {play} = this.state
        props.set(props.data._id)
        // try {
        //     SoundPlayer.playSoundFile('tone', 'mp3')
        //         // or play from url
        //     if(play){
        //         SoundPlayer.stop()
        //         this.setState({play:false})
        //     }else {
        //         if(props.data._id == props.audioid){
        //             await this.setState({loading: true})
        //             await SoundPlayer.resume()
        //             this.setState({play:true})
        //         }else{
        //             await this.setState({loading: true})
        //             await SoundPlayer.stop()
        //             await SoundPlayer.loadUrl(props.data.audio)
        //             await SoundPlayer.play()
        //             const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
        //             this.setState({play: true, duration: info.duration, current: info.current, loading: false})
        //         }
        //
        //
        //     }
        //
        // } catch (e) {
        //     alert(e)
        // }

    }

    render() {
        const {play,duration,current,loading} = this.state;
        const {props} = this
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {props.data._id == props.audioid&&loading ?
                    <View style={{width: 30}}><ActivityIndicator color={'blue'} style={{marginLeft: 10}}/></View> :
                    <TouchableOpacity style={{}} onPress={() => this.PlayAudio()}>
                        <Icons name={props.data._id == props.audioid&&play ? 'pause' : 'play'}
                               style={{marginLeft: 10}} color={Colors.primary} size={25}/>
                    </TouchableOpacity>}
                <Slider
                    style={{width: width * 0.7, height: 40}}
                    minimumValue={0}
                    maximumValue={duration}
                    value={current}
                    disabled={props.data._id != props.audioid}
                    // onValueChange={val => TrackPlayer.seekTo(val)}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                />
                {/*<Text style={{marginRight:10}}>{progress.duration.toFixed(0)}</Text>*/}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        audioid: state.audioid.id,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: (audioid) => {
            dispatch(setId(audioid))

        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RenderAudio)
