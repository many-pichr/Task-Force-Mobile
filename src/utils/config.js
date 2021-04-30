import {StatusBar,Platform} from 'react-native';

const Colors={
        primary:'#1582F4',
        primaryBlur:'rgba(21,130,244,0.6)',
    }
const barHight=Platform.OS=='ios'?44:StatusBar.currentHeight;
export {Colors,barHight}
