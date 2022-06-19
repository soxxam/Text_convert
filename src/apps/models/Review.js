const mongoose = require("../../common/database")();

const ReviewSchema = new mongoose.Schema({
    convertId:{
        type: mongoose.Types.ObjectId,
        ref: "Convert",
    },
    rate:{
        type:Number,
        default:0
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
const ReviewModel = mongoose.model('Review',ReviewSchema,"reviews");
module.exports = ReviewModel;
