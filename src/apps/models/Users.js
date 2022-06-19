const mongoose = require("../../common/database")();

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    PriceId:{
        type: mongoose.Types.ObjectId,
        ref: "Price",
    },
    dayBuy:{
        type:String,
        default:null
    },
    convertCount:{
        type:Number,
        default:0
    },
    totalFileConvert:{
        type:Number,
        default:0
    }

},{
    timestamps: true,
});
const UserModel = mongoose.model('User',UserSchema,"users");
module.exports = UserModel;