const mongoose = require("../../common/database")();

const BillSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    priceId:{
        type: mongoose.Types.ObjectId,
        ref:"Price",
    },
    totalPrice:{
        type: Number,
        default: 0,
    },
    day:{
        type: String,
        required:true
    },
    status:{
        type: String,
        required:true
    }
},{
    timestamps: true,
})
const BillModel = mongoose.model('Bill',BillSchema,"bills");
module.exports = BillModel;