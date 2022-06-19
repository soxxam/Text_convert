const mongoose = require("../../common/database")();

const ReportSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    comment:{
        type:String,
        default:null
    },
    day:{
        type:String,
        default:null
    }
},{
    timestamps: true,
})
const ReportModel = mongoose.model('Report',ReportSchema,"reports");
module.exports = ReportModel;
