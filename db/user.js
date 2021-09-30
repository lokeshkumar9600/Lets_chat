var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');
const secret = "XWEHOIUDAFBWERHFENFWJFLJDFIUDSFUERWJDNFJDNFNEFWFWEKBEWRBKJBJEBFWEFUIEWBFIWBOIIPRWFWBRFBKWHBFKBIDGSFRWLBL/4WBRK.BVEVEKRBEWHKVRWEBR;WERHVLWKBRWKEBJRKJWEBR.EJREWHGVR";

var Schema = mongoose.Schema;
var userSchema = new Schema({
    email:{
        type: 'string',
        required: true
    },
    password:{
        type: 'string',
        required: true
    }
});

userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
module.exports = mongoose.model("user",userSchema);