const mongoose = require("../../common/database")();

const AccountSchema = new mongoose.Schema({
    username:{
        type:"string",
        required: true,
    },
    avatar:{
        type:"string",
        default:null,
    },
    email:{
        type:"string",
        required: true,
    },
    password:{
        type:"string",
        required: true,
    },
    status:{
        type:"string",
        default:'offline',
    },
    birth:{
        type:"string",
        default:'offline',
    }
},{
    timestamps: true,
});
const AccountModel = mongoose.model('Account',AccountSchema,"accounts");
module.exports = AccountModel;