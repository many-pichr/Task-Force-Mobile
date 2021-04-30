import axios from './axios'
export default {
    GetToken: async (username, password) => {

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            }
        }
        var details = {
            'username': username,
            'password': password,
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        const URL = `/api/Authenticate/login`;
        return await axios.PostGuest(URL,details)
    },
}
