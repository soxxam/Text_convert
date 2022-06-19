const mongoose = require("../../common/database")();

const PriceSchema = new mongoose.Schema({
    name:{
        type: String,
        default:null
    },
    ConvertCount:{
        type: Number,
        default:0,
    },  
    description:{
        type: String,
        default:null
    },
    price:{
        type: Number,
        default:0
    },
    status:{
        type: String,
        default:null,
    }

},{
    timestamps: true,
})

const PriceModel = mongoose.model('Price',PriceSchema,"prices");
module.exports = PriceModel;
