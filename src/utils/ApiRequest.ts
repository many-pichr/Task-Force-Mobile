import Axios from 'axios';
import * as Keychain from "react-native-keychain";
const url='https://api.taskforce.asia/'
const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE2MDk5MDcxODcsImV4cCI6MTYxMDUxMTk4NywiaWF0IjoxNjA5OTA3MTg3fQ.JU2OxCiFt9a0Y79Sm9-xjfoKvzZ3oY3AflAuxGQpHkg'

 const withAuth = Axios.create({
    baseURL: url,
});
withAuth.interceptors.request.use(config => {
    return new Promise(async (resolve, reject) => {
        let access_token = '';

        // TODO:
        // For Oauath2, get access token
        // access_token = ......
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;

        const bearer = 'Bearer '+token;
        config.headers['Authorization'] = bearer;
        config.headers['Accept'] = 'application/json';
        config.headers['content-type'] = 'application/json';
        resolve(config);
    });
}, Promise.reject);
const withAuthImage = Axios.create({
    baseURL: url,
});
withAuthImage.interceptors.request.use(config => {
    return new Promise(async (resolve, reject) => {
        let access_token = '';

        // TODO:
        // For Oauath2, get access token
        // access_token = ......
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.password;
        const bearer = 'Bearer '+token;
        config.headers['Authorization'] = bearer;
        config.headers['Accept'] = 'application/json';
        config.headers['content-type'] = 'multipart/form-data';
        resolve(config);
    });
}, Promise.reject);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
 const withoutAuth = Axios.create({
    baseURL: url,
    timeout: 10000,
});


export default {
    withAuth, withoutAuth,withAuthImage
}
