const axios = require('axios');
import config from './ApiRequest'
import SetLoading from './SetLoading'
export default {
    PostGuest: async (url, body) => {
        // SetLoading()
        return config.withoutAuth.post(url, body)
            .then(function ({data}) {

                return {status:true,data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
    Post: async (url, body) => {
        // SetLoading()
        return config.withAuth.post(url, body)
            .then(function ({data}) {

                return {status:true,data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
    Delete: async (url) => {
        // SetLoading()
        return config.withAuth.delete(url)
            .then(function ({data}) {
                return {status:true,data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
    PostImage: async (url, body) => {
        // SetLoading()
        return config.withAuthImage.post(url, body)
            .then(function ({data}) {

                return {status:true,data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
    Get: async (url) => {
        // SetLoading()
        return config.withAuth.get(url)
            .then(function ({data}) {
                return {status:true,data:data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
    GetGuest: async (url) => {
        return config.withoutAuth.get(url)
            .then(function ({data}) {
                return {status:true,data:data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
    Put: async (url, body) => {
        // SetLoading()
        return config.withAuth.put(url, body)
            .then(function ({data}) {

                return {status:true,data};
            })
            .catch(function (error) {
                return {status:false,message:error}
            });
    },
}
