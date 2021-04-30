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
        phone: {
            presence: { allowEmpty: false, message: '^Phone number is required' },
            numericality: true,
            length: {
                minimum:8,
                message: '^Phone number with minimum 8 digit'
            },
            // equality: {
            //     attribute: "E-mail",
            //     message: "^Invalid phone number",
            //     comparator: function(v1, v2) {
            //         return v1.charAt(0)==0;
            //     }
            // }
        },

        password: {
            presence: {allowEmpty: false, message: '^Password is required'},
            length: {
                minimum: 8,
                message: '^Password with minimum 8 characters'
            },
            // equality: {
            //     attribute: "password",
            //     message: "^Password does not match policy",
            //     comparator: function(v1, v2) {
            //         return isValidCharacter(v1);
            //     }
            // },
        }

};


