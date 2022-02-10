const validator = require('validator');

const validate = {
    validateSalary(num) {
        if (validator.isDecimal(num)) return true;
        return 'Enter a valid salary'
    }
};
module.exports= validate;
 