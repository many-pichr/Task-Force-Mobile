import {Alert} from 'react-native'
import ImageResizer from 'react-native-image-resizer';
import User from '../api/User';
export default {
    ResizeImage: async (uri) => {
        return ImageResizer.createResizedImage(uri, 700, 500, 'JPEG', 100, 0, undefined, false, { mode:'contain', onlyScaleDown:false })
            .then(resizedImage => {
                return resizedImage;
            })
            .catch(err => {
                return Alert.alert(
                    'Unable to resize the photo',
                    'Check the console for full the error message',
                );
            });
    },
    GetJobPost: async () => {
        let data={data:[],completed:[],inprogress:[]}
        await User.GetList('/api/JobPost/CurrentUser?_end=10&_start=0&_order=ASC&_sort=id').then((rs) => {
            if(rs.status){
                const items=[]
                const completed=[]
                for(var i=0;i<rs.data.length;i++){
                    if(rs.data[i].status=='selected'||rs.data[i].status=='completed'){
                        if(rs.data[i].completedStatus<100&&rs.data[i].status=='selected'){
                            items.push(rs.data[i])
                        }else{
                            completed.push(rs.data[i])
                        }
                    }
                }
                data={completed,data:rs.data,inprogress:items}
            }
        })

        return data;
    },
    GetColorStatus: (status) => {
        let color="#4c4c4c";
        switch(status) {
            case "Rejected": {
                color="#ff252c"
                break;
            }
            case "Completed": {
                color="#69d55d"
                break;
            }
            case "Pending": {
                color="#ff9f1d"
                break;
            }
            case "Blocked": {
                color="#ff252c"
                break;
            }
            default: {
                //statements;
                break;
            }
        }
        return color;
    },
    GetPaymentStatus: (status,name) => {
        let str=status;
        switch(status) {
            case "Received": {
                str=status+" from "+name;
                break;
            }
            case "Completed": {
                str="#69d55d"
                break;
            }
            case "Pending": {
                str="#ff9f1d"
                break;
            }
            default: {
                //statements;
                break;
            }
        }
        return str;
    },
    GetFromUser: (status,from,to) => {
        let name={
            from,
            to
        }
        switch(status) {
            case "Received": {
                name={
                    from:to,
                    to:null
                }
                break;
            }
            case "Top Up": {
                name={
                    from:null,
                    to:to
                }
                break;
            }
            case "Paid": {
                name={
                    from:to,
                    to:null
                }
                break;
            }
            default: {
                //statements;
                name={
                    from:null,
                    to:null
                }
                break;
            }
        }
        return name;
    },
}
