const mongoose = require("../../common/database")();

const ConvertSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    avatar:{
        type:String,
        default:null
    },
    description:{
        type: String,
        default:null
    },
    rate:{
        type: Number,
        default:null
    },
    web:{
        type: String,
        default:null,
    },
    status:{
        type: String,
        default:null,
    },
    totalFile:{
        type: String,
        default:null,
    }
    

},{
    timestamps: true,
})

const ConvertModel = mongoose.model('Convert',ConvertSchema,"converts");
module.exports = ConvertModel;
