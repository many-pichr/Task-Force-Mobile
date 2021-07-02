import {StatusBar,Platform} from 'react-native';

const Colors={
        primary:'#10bdce',
        textColor:'#0d8b99',
        primaryBlur:'rgba(16,189,206,0.47)',
        Blur:'rgba(16,189,206,0.18)',
    }
const barHight=Platform.OS=='ios'?44:StatusBar.currentHeight;
export {Colors,barHight}
