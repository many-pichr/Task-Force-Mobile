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
    email: {
        presence: { allowEmpty: false, message: ' is required' },
        email: true,
    },
    firstname: {
        presence: { allowEmpty: false, message: ' is required' },

    },
    lastname: {
        presence: { allowEmpty: false, message: ' is required' },

    },
    phone: {
        presence: { allowEmpty: false, message: ' is required' },
        numericality: true,
        length: {
            minimum:8,
            message: '^Phone number with minimum 8 digit'
        },
    },

    password: {
        presence: {allowEmpty: false, message: '^Password is required'},
        length: {
            minimum: 8,
            message: '^Password with minimum 8 characters'
        },

    },
    cpassword: {
        presence: { allowEmpty: false, message: '^Confirm password is required' },
        equality: {
            attribute: "password",
            message: "^Confirm password does not match",
            comparator: function(v1, v2) {
                return JSON.stringify(v1) === JSON.stringify(v2);
            }
        },
        length: {
            minimum: 8,
            message: '^Minimum 8 characters'
        }
    },

};


