const mongoose = require("mongoose");

module.exports = ()=>{
    mongoose.connect('mongodb://localhost/Tess',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose;
}