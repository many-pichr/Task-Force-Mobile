import axios from '../utils/axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
export default {
    Signup: async (data,type) => {
        var body = {
            "id": 0,
            "firstName": data.firstname,
            "lastName": data.lastname,
            "username": (data.lastname+data.firstname).toLowerCase(),
            "password": data.password,
            "phone": data.phone,
            "email": data.email,
            "description": "",
            "userType": type.toString(),
        }

        const URL = `/api/User`;
        return await axios.PostGuest(URL,body)
    },
    AddJob: async (data,image,userId,location,noExpiry,region) => {
        const images=[]
        const skills=[]
        let mainImage=''
        for(var i=0;i<image.length;i++){
            if(image[i]!=''){
                if(mainImage!='') mainImage=image[i];
                images.push(
                    {
                        "id": 0,
                        "jobPostId": 0,
                        "url": image[i]
                    }
                )
            }
        }
        for(var i=0;i<data.skill.length;i++){
            if(data.skill[i]>0){
               skills.push(
                   {
                       "skillId": data.skill[i],
                   }
               )
            }
        }
        var body =
        {
            "id": 0,
            "title": data.title,
            "description": data.description,
            "address": data.address,
            "jobPriorityId": data.priority,
            "isNoneExpired": noExpiry,
            "jobLevelId": data.level,
            "jobCategoryId": data.category,
            "extraCharge": parseInt(data.extra==''?0:data.extra),
            "reward": parseInt(data.reward),
            "isShowLocation": location,
            "locLAT": region.latitude,
            "locLONG": region.longitude,
            "jobPostArea":{
                "id": 0,
                "jobPostId": 0,
                "latitude": region.latitude,
                "longitude": region.longitude,
                "latitudeDelta": region.latitudeDelta,
                "longitudeDelta": region.longitudeDelta
            },
            "createDate": data.start!=''?data.start:new Date(),
            "expireDate": data.end!=''?data.end:new Date(),
            "userId": userId,
            "status": "Pending",
            "completedStatus": 0,
            "profileURL": mainImage,
            "order": 0,
            "jobPostPhotos": images,
            "jobPostSkills": skills,
        }

        const URL = `/api/JobPost`;
        const rs=await axios.Post(URL,body);
        return rs;
    },
    AddInterested: async (data) => {
        var body =
            {
                "id": 0,
                "userId": data.userId,
                "JobPostId": data.jobId,
                "createdDate": new Date()
            }

        const URL = `/api/JobInterested`;
        return await axios.Post(URL,body)
    },
    DeleteInterested: async (id) => {
        const URL = '/api/JobInterested/'+id;
        return await axios.Delete(URL)
    },
    SubmitRequestJob: async (data) => {

        var body =
            {
                "id": 0,
                "userId": data.userId,
                "JobPostId": data.jobId,
                "status":"pending"
            }

        const URL = `/api/JobCandidate`;
        return await axios.Post(URL,body)
    },
    UpdateUser: async (body) => {
        const URL = '/api/User/'+body.id;
        return await axios.Put(URL,body)
    },
    ChangeProfile: async (data) => {
        var body =
            {

            }

        const URL = '/api/User/change-profile-url?profileURL='+data;
        return await axios.Post(URL,body)
    },
    SwitchProfile: async (data) => {
        const URL = '/api/Authenticate/SwitchProfile';
        return await axios.Get(URL)
    },
    CheckUser: async (data) => {
        const token = await AsyncStorage.getItem('@notification_id')
        const URL = "/api/Authenticate?notification_id="+token;
        console.log(URL)
        return await axios.Get(URL)
    },
    GetList: async (URL) => {
        return await axios.Get(URL)
    },
    Delete: async (URL) => {
        return await axios.Delete(URL)
    },
    Put: async (URL,body) => {
        return await axios.Put(URL,body)
    },
    Post: async (URL,body) => {
        return await axios.Post(URL,body)
    },
    UploadImage: async (uri) => {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            }
        }
        let formdata = new FormData();
        formdata.append("file", {uri: uri, name: 'post_'+new Date().getTime()+'.jpg', type: 'image/jpeg'})
        const URL = `/api/file/upload`;
        return await axios.Post(URL,formdata)
    },
    UploadVoice: async (uri) => {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            }
        }
        let formdata = new FormData();
        formdata.append("file", {uri: uri, name: 'post_'+new Date().getTime()+'.aac', type: 'audio/*'})
        const URL = `/api/file/upload`;
        return await axios.Post(URL,formdata)
    },
}
