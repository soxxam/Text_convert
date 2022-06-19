const mongoose = require("../../common/database")();

const ImageSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    img:[
        {
            type: String,
            default: null,
        }
    ],
    size:{
        type: String,
        default: null,
    },
    numfile:{
        type: String,
        default: null,
    },
    comment:{
        type: String,
        default: null,
    },
    rate:{
        type: Number,
        default: null
    },
    user_id:{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    isUserSet:{
        type: Boolean,
        default: false,
    },
    day:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required:true
    }
},{
    timestamps: true,
});
const ImageModel = mongoose.model('Image',ImageSchema,"images");
module.exports = ImageModel;