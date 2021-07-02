var moment = require('moment');
function isValidCharacter(str) {
    var format = /[`_+\=\[\]{};':"\\|,.<>\/~]/;
    var format0 = /[`!@#$%^&*()\/?]/;//$@$!%*#?-^()
    var format1 = /[`^A-Z]/;
    var format2 = /[`^0-9]/;
    var format3 = /[ ]/;
    return !format.test(str) && format0.test(str) && format1.test(str) && format2.test(str) && !format3.test(str)
}
export default {
    jobTitle: {
        presence: { allowEmpty: false, message: ' is required' },
    },
    companyName: {
        presence: { allowEmpty: false, message: ' is required' },

    },
    startDate: {
        presence: { allowEmpty: false, message: ' is required' },

    },
    endDate: {
        presence: { allowEmpty: false, message: ' is required' },

    }

};


