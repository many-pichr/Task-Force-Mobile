var moment = require('moment');
function isValidCharacter(str) {
    var format = /[`_+\=\[\]{};':"\\|,.<>\/~]/;
    var format0 = /[`!@#$%^&*()\/?]/;//$@$!%*#?-^()
    var format1 = /[`^A-Z]/;
    var format2 = /[`^0-9]/;
    var format3 = /[ ]/;
    return !format.test(str) && format0.test(str) && format1.test(str) && format2.test(str) && !format3.test(str)
}
// title:'',
//     category:0,
//     description:'',
//     level:0,
//     deadline:'',
//     priority:0,
//     extra:'',
//     reward:'',
//     location:'',
//     start:'',
//     end:'',
//     address:'',
//     skill:[],
//     noExpiry:false
export default {
    title: {
        presence: { allowEmpty: false, message: 'is required' },
    },
    category: {
        presence: { allowEmpty: false, message: 'is required' },
    },
    description: {
        presence: { allowEmpty: false, message: 'is required' },
    },
    priority: {
        presence: { allowEmpty: false, message: 'is required' },
    },
        reward: {
            presence: { allowEmpty: false, message: 'is required' },
            numericality: true,
        },
    skill: {
            presence: { allowEmpty: false, message: 'is required' },
        },



};


