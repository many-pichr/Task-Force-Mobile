import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import {Colors} from '../../../utils/config'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import FastImage from 'react-native-fast-image'
import RNFS from 'react-native-fs'
import Sound from 'react-native-sound'
import Material from 'react-native-vector-icons/MaterialIcons'
import { Header } from '@react-navigation/stack';
import { ChatScreen } from 'react-native-easy-chat-ui'
import * as Keychain from "react-native-keychain";
import {connect} from 'react-redux';
import {RenderTextMessage,RenderAvatar,RenderVoiceMessage,RenderImage} from './MessageContainer'
import moment from 'moment'
import {setId} from '../../../redux/actions/audioid';
import User from '../../../api/User';
import message from './messages'
import * as ImagePicker from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing/dist/ImageViewing';
const { width, height } = Dimensions.get('window')
class App extends Component {

  constructor (props) {
    super(props)
    this.timer = null
    this.state = {
      messages: message,
      chatBg: require('../../../assets/images/bg.jpg'),
      inverted: false, // require
      voiceHandle: true,
      currentTime: 0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: '',
      voicePlaying: false,
      voiceLoading: false,
      voiceVolume: 0,
        value:0,
        fill:25,
      panelSource: [
        {
          icon: <FastImage source={require('../../../assets/images/photo.png')} style={{ width: 30, height: 30 }} />,
          title: 'Library'
        }, {
          icon: <FastImage source={require('../../../assets/images/camera.png')} style={{ width: 30, height: 30 }} />,
          title: 'Camera'
        }
      ],
      ws:null,
        playing:{
          progress:0,
            index:0,
            total:0,
            play:false,
            loading:false
        },
      loading:true,
    }
    this.sound = null
    this.activeVoiceId = -1
  }
  componentDidMount() {
      const {item,user} = this.props;
    this.handleGetPost()
    this._handleWebSocketSetup();

  }
  componentWillUnmount () {
    this.reconnect = false
    this.state.ws.close();
    clearInterval(this.timer);
    this.sound=null;
  }
    TimeCounter () {
      const {playing} = {... this.state}
        if(playing.progress<playing.total){
            playing.progress=playing.progress+0.25;
            this.setState({playing})
        }else{
            clearInterval(this.timer)

        }
    }
    startTimer () {
        clearInterval(this.timer)
        this.timer = setInterval(this.TimeCounter.bind(this), 250)
    }
  handleGetPost=async (refreshing)=>{
    const {item,user} = this.props
    await User.GetList("/api/Message?userId="+user.id+"&friendId="+item.toUserId).then((rs) => {
      if(rs.status){
        this.handleSetData(rs.data)
      }
    })
  }
  handleSetData=(data)=>{
    const {user,item} = this.props
    const items=[]
    for(var i=0;i<data.length;i++){

      const l = data[i]
      const content=l.type.toLowerCase()=='text'?l.body:{
        uri:l.body,
        length:l.duration
      }
        items.push({
          id: i + 1,
          type: l.type.toLowerCase(),
          content,
          targetId: l.fromUserId,
          chatInfo: {
            id: item.toUserId,
            avatar: require('../../source/defaultAvatar.png'),
            nickName: 'Test'
      },
        renderTime: true,
            sendStatus: 0,
          time: TimeFormat(l.date)
        })
    }
    this.setState({messages:items})
    setTimeout(()=>{
      // this.fadeIn();
      this.setState({loading: false})
    }, 800);


  }
  _handleWebSocketSetup = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.password;
    const ws = new WebSocket('ws://data-solution.expressloan.info:8081?access_token='+token)
    ws.onopen = () => {
      this.setState({online:true})
    }
    ws.onmessage = (event) => {this.receive(event)}
    ws.onerror = (error) => { alert("Connection failed") }
    ws.onclose = () => this.reconnect ? this._handleWebSocketSetup() : (this.props.onClose && this.props.onClose())
    this.setState({ws})
  }
  submitChatMessage(message,type,length) {
    const {item,user} = this.props;
    const body={
      ToUserId:item.toUserId,
      FromUserId:item.fromUserId,
      Type:type,
      Duration:length,
      Body:message,
        ChatId:item.id

    }
    this.state.ws.send(JSON.stringify(body))
  }
  audioProgress = () => {
    AudioRecorder.onProgress = (data) => {
      if (data.currentTime === 0) {
        this.setState((prevState) => ({ currentTime: Math.floor(prevState.currentTime + 0.25) }))
      } else {
        this.setState({ currentTime: Math.floor(data.currentTime) })
      }
      this._setVoiceHandel(false)
      this.setState({ volume: Math.floor(data.currentMetering) })
      this.random()
    }
  }

  audioFinish = () => {
    AudioRecorder.onFinished = (data) => this._finishRecording(data.status === 'OK', data.audioFileURL,data)
  }

  random = () => {
    if (this.timer) return
    console.log('start')
    this.timer = setInterval(() => {
      const num = Math.floor(Math.random() * 10)
      this.setState({
        voiceVolume: num
      })
    }, 500)
  }

  checkDir = async () => {
    if (!await RNFS.exists(`${AudioUtils.DocumentDirectoryPath}/voice/`)) {
      RNFS.mkdir(`${AudioUtils.DocumentDirectoryPath}/voice/`)
    }
  }

  initPath = async () => {
    await this.checkDir()
    const nowPath = `${AudioUtils.DocumentDirectoryPath}/voice/voice${Date.now()}.aac`
    this.setState({ audioPath: nowPath, currentTime: 0 })
    this.prepareRecordingPath(nowPath)
    console.log(nowPath)
    this._record()
  }

  prepareRecordingPath (audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      OutputFormat: 'aac_adts',
      AudioEncodingBitRate: 32000,
      MeteringEnabled: true
    })
  }

  _record = async () => {
    try {
      this.setState({start: new Date()})
      await AudioRecorder.startRecording()
    } catch (error) {
      console.log(error)
    }
  }

  _stop = async () => {
    try {
      await AudioRecorder.stopRecording()
      this.timer && clearInterval(this.timer)
      if (Platform.OS === 'android') {
        this._finishRecording(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  _setVoiceHandel = (status) => {
    this.setState({ voiceHandle: status })
  }

  _pause = async () => {
    try {
      await AudioRecorder.pauseRecording() // Android 由于API问题无法使用此方法
    } catch (e) {
      console.log(e)
    }
  }

  _resume = async () => {
    try {
      await AudioRecorder.resumeRecording() // Android 由于API问题无法使用此方法
    } catch (e) {
      console.log(e)
    }
  }
   _finishRecording (didSucceed, filePath,data) {
    this.setState({ finished: didSucceed })
  }

  _requestAndroidPermission = async () => {
    try {
      const rationale = {
        title: '麦克风权限',
        message: '需要权限录制语音.',
        buttonPositive: '确定'
      }
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      this.setState({ hasPermission: granted === PermissionsAndroid.RESULTS.GRANTED })
    } catch (e) {
      console.log(e)
    }
  }

  onPress = (type, index, content) => {
    if (type === 'voice') {
      const { playing } = {... this.state}
      if (playing.play) {
        if (index === this.activeVoiceId) {
          this.stopSound()
        } else {
          this.stopSound(true)
          this.playSound(content, index)
        }
      } else {
        if (index !== this.activeVoiceId) {
          this.stopSound(true)
        }
        this.playSound(content, index)
      }
    }else if(type=='image'){
        this.setState({viewImage:true,imageUrl:content.uri})
    }
  }

  playSound = (content, index) => {
      const url=content.uri;
    this.activeVoiceId = index
    if (this.sound === null) {
        const {playing}={...this.state}
        playing.loading=true;
        playing.total=content.length;
        playing.play=true,
      this.setState({ playing: playing })
      this.sound = new Sound(url, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error)
          this.setState({ voiceLoading: false })
          this.sound = null
          return
        }
          const {playing}={...this.state}
          playing.loading=false;
          playing.progress=0.25;
          console.log('contuie====>')
          this.setState({ playing: playing })
          this.startTimer()
          this.sound.play((success) => {
          if (success) {
              const {playing}={...this.state}
              playing.play=false;
              playing.progress=0;
              this.setState({ playing: playing })
              clearInterval(this.timer)
          } else {
              const {playing}={...this.state}
              playing.play=false;
              this.setState({ playing: playing })
            console.log('playback failed due to audio decoding errors')
          }
        })
      })
    } else {
        const {playing}={...this.state}
        playing.play=true;
        this.setState({ playing: playing })
        this.startTimer()
      this.sound.play((success) => {
        if (success) {
            const {playing}={...this.state}
            playing.play=false;
            playing.progress=0;
            this.setState({ playing: playing })
            clearInterval(this.timer)
          console.log('successfully finished playing')
        } else {
            const {playing}={...this.state}
            playing.play=false;
            this.setState({ playing: playing })
          console.log('playback failed due to audio decoding errors')
        }
      })
    }
  }

  stopSound = (remove = false) => {
    this.sound && this.sound.pause()
      const {playing}={...this.state}
      playing.play=false;
      this.setState({ playing: playing })
      clearInterval(this.timer);
    if (remove) {
      this.sound = null;
        const {playing}={...this.state}
        playing.progress=0;
        this.setState({ playing: playing })

    }

  }

  receive = (e) => {
    const {item,user} = this.props
    const data = JSON.parse(e.data)
    if(data.FromUserId!=user.id){
      const {messages}=this.state;
      const newMsg = [...messages]
      const id=newMsg.length>0?(newMsg[newMsg.length-1].id)+1:1;
      const content=data.Type.toLowerCase()=='text'?data.Body:{
        uri:data.Body,
        length:data.Duration
      }
      newMsg.push(
          {
            id: id,
            type: data.Type.toLowerCase(),
            content,
            targetId: data.FromUserId,
            chatInfo: {
              id: item.toUserId,
            },
            renderTime: true,
            sendStatus: 1,
            animated:true ,
            time: TimeFormat(new Date())
          })
      this.setState({ messages: newMsg })
    }

  }

  sendMessage = async (type, content, isInverted) => {
    const { messages } = this.state
    const {item,user} = this.props
    const newMsg = [...messages]
    const id=newMsg.length>0?(newMsg[newMsg.length-1].id)+1:1;
    if(type=='voice'){
        // this.playSound(content, 1)
        // User.UploadVoice(Platform.OS==''?"ios":"file:"+content.uri).then((rs) => {
        //     if(rs.status){
        //         console.log(rs)
        //         // this.submitChatMessage(rs.data.fileName,'voice',content.length)
        //
        //     }
        // })
      var whoosh = await new Sound(content.uri, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        newMsg.push(
            {
              id: id,
              type,
              content:{uri:content.uri,length:whoosh.getDuration()},
              targetId: user.id,
              chatInfo: {
                id: item.toUserId,
                nickName: 'Test'
              },
              renderTime: true,
              sendStatus: 0,
              animated:true,
              time: TimeFormat(new Date())
            })
        this.setState({ messages: newMsg})
          User.UploadVoice(Platform.OS==''?"ios":"file:"+content.uri).then((rs) => {
              if(rs.status){
                this.submitChatMessage(rs.data.fileName,'voice',content.length)

              }
          })
        // this.submitChatMessage(content)

      });
    }else if(type=='image'){

        newMsg.push(
            {
              id: id,
              type,
              content,
              targetId: user.id,
              chatInfo: {
                id: item.toUserId,
                nickName: 'Test'
              },
              renderTime: true,
              sendStatus: 0,
              animated:true,
              time: TimeFormat(new Date())
            })
        this.setState({ messages: newMsg})
        User.UploadImage(content.uri).then((rs) => {
            console.log(content.uri)
            if(rs.status){
                this.submitChatMessage(rs.data.fileName,'image',0)

            }
        })


    }else{
      newMsg.push(
          {
            id: id,
            type,
            content,
            targetId: user.id,
            chatInfo: {
              id: item.toUserId,
              nickName: 'Test'
            },
            renderTime: true,
            sendStatus: 0,
            animated:true,
            time: TimeFormat(new Date())
          })
      this.setState({ messages: newMsg})
      this.submitChatMessage(content,'text',0)

    }
  }
  handleImagePicker=(type)=>{
    ImagePicker[type](
        {
          mediaType: 'photo',
          includeBase64: false,
            quality:0.4,
          maxWidth: 500,
          maxHeight: 700,
        },
        (response) => {
          if(!response.didCancel){
            console.log(response)
            this.sendMessage('image',response,true)
          }


        },
    )
  }
  renderPanelRow = (data, index) =>
      <TouchableOpacity
          key={index}
          style={{
            width: (width - 30) / 4,
            height: (width - 30) / 4,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20
          }}
          activeOpacity={0.7}
          onPress={() => this.handleImagePicker(index==0?'launchImageLibrary':'launchCamera')}
      >
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, borderColor: '#ccc', borderWidth: StyleSheet.hairlineWidth }}>
          {data.icon}
        </View>
        <Text style={{ color: '#7a7a7a', marginTop: 10 }}>{data.title}</Text>
      </TouchableOpacity>

  render () {
    const {imageUrl,viewImage, playing,voiceLoading, voicePlaying, messages, loading, inverted, voiceVolume, panelSource } = this.state
    const {item,user} = this.props
    return (
        <View style={styles.container}>
          <ChatScreen
              containerBackgroundColor={'#fff'}
              ref={(e) => this.chat = e}
              CustomImageComponent={FastImage}
              messageList={messages}
              panelSource={panelSource}
              userProfile={{id:user.id}}
              // chatId={item.toUserId}
              renderPanelRow={this.renderPanelRow}
              inverted={inverted}
              isIPhoneX
              headerHeight={Platform.OS=='ios'?90:110}
              useEmoji={false}
              // chatBackgroundImage={chatBg}
              sendMessage={this.sendMessage}
              onMessagePress={this.onPress}
              placeholder={"Aa..."}
              pressOutText={"Press out to finish"}
              pressInText={"Hold to record voice"}
              voiceCancelText={"Cancel Voice"}
              voiceNoteText={"Please speak to the phone"}
              voiceErrorText={"Please hold to record"}
              renderMessageTime={RenderAvatar}
              itemContainerStyle={{paddingVertical:0}}
              // userProfile={{avatar:null}}
              allPanelAnimateDuration={300}
              messageSelectIcon={<Material name={'keyboard-voice'} size={30} color={Colors.textColor}/>}
              voiceIcon={<Material name={'keyboard-voice'} size={30} color={Colors.textColor}/>}
              plusIcon={<Material name={'add-circle-outline'} size={30} color={Colors.textColor}/>}
              changeHeaderLeft={this.changeHeaderLeft}
              renderTextMessage={RenderTextMessage}
              renderImageMessage={(data,index)=>RenderImage(data,index,this.onPress)}
              audioPath={this.state.audioPath}
              voiceCustom={false}
              useVoice={true}
              renderVoiceMessage={(data,index)=>RenderVoiceMessage(data,this.activeVoiceId,playing,this.onPress)}
              delPanelStyle={{height:0}}
              audioHasPermission={this.state.hasPermission}
              checkPermission={AudioRecorder.requestAuthorization}
              requestAndroidPermission={this._requestAndroidPermission}
              audioOnProgress={this.audioProgress}
              audioOnFinish={this.audioFinish}
              audioInitPath={this.initPath}
              audioRecord={this._record}
              audioStopRecord={this._stop}
              renderAvatar={RenderAvatar}
              audioPauseRecord={this._pause}
              audioResumeRecord={this._resume}
              audioCurrentTime={this.state.currentTime}
              audioHandle={this.state.voiceHandle}
              setAudioHandle={this._setVoiceHandel}
              voiceLoading={voiceLoading}
              voicePlaying={voicePlaying}
              voiceVolume={voiceVolume}
          />
            <ImageView
                images={[{uri:imageUrl}]}
                imageIndex={0}
                visible={viewImage}
                onRequestClose={() => this.setState({viewImage:false})}
            />
          {loading&&<View style={{position:'absolute',justifyContent:'center',alignItems:'center',backgroundColor:'#fff',width:'100%',height:'100%'}}>
            <ActivityIndicator size={'large'} color={Colors.textColor} style={{marginBottom:100}}/>
          </View>}
        </View>
    )
  }
}
const mapStateToProps = state => {
  return {
    audioid: state.audioid.id,
    user: state.user.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    set: (audioid) => {
      dispatch(setId(audioid))

    }
  }
}
function TimeFormat(date) {
  let format = 'ddd MMM YY'
  const d = date;
  const year = moment(new Date()).isSame(d, 'year');
  const month = moment(new Date()).isSame(d, 'month');
  const day = moment(new Date()).isSame(d, 'day');
  if(year&&month&&day){
    format = 'HH:mm'
  }else if(year&&month){
    format = 'dddd'
  }else if(year){
    format = 'ddd MMM'
  }

  return moment(date).format(format);
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#0078fe",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },

  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#fff",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20

  },

  /*Arrow head for recevied messages*/
  leftArrow: {
    position: "absolute",
    backgroundColor: "#dedede",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10
  },

  leftArrowOverlap: {
    position: "absolute",
    backgroundColor: "#fff",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20

  },
})
