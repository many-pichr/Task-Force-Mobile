const messages = [
  {
    id: '1',
    type: 'text',
    content: 'hello world',
    targetId: 8,
    chatInfo: {
      avatar: require('../../source/defaultAvatar.png'),
      id: 8,
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 0,
    time: '1542006036549'
  },
  {
    id: '2',
    type: 'text',
    content: 'hi/{se}',
    targetId: 8,
    chatInfo: {
      avatar: require('../../source/defaultAvatar.png'),
      id: 8,
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 0,
    time: '1542106036549'
  },
  {
    id: '3',
    type: 'image',
    content: {
      uri: 'https://upload-images.jianshu.io/upload_images/11942126-044bd33212dcbfb8.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/300/h/240',
      width: 100,
      height: 80
    },
    targetId: 8,
    chatInfo: {
      avatar: require('../../source/defaultAvatar.png'),
      id: 8,
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 3,
    time: '1542106037000'
  },
  {
    id: '4',
    type: 'text',
    content: '你好/{weixiao}',
    targetId: 11,
    chatInfo: {
      avatar: require('../../source/avatar.png'),
      id: 8
    },
    renderTime: true,
    sendStatus: -2,
    time: '1542177036549'
  },
  {
    id: '5',
    type: 'voice',
    content: {
      uri: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-game-emergency-alarm-1000.mp3',
      length: 25
    },
    targetId: 8,
    chatInfo: {
      avatar: require('../../source/defaultAvatar.png'),
      id: 8,
      nickName: 'Test'
    },
    renderTime: true,
    sendStatus: 1,
    time: '1542260667161'
  },
  {
    id: '6',
    type: 'voice',
    content: {
      uri: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-game-emergency-alarm-1000.mp3',
      length: 61
    },
    targetId: 11,
    chatInfo: {
      avatar: require('../../source/avatar.png'),
      id: 8
    },
    renderTime: true,
    sendStatus: -2,
    time: '1542264667161'
  }
];

export default messages;
