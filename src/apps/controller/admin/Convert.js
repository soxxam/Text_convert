const ConvertModel = require('../../models/Convert');
const fs = require("fs");
const path = require("path");
const index = async(req,res)=>{
    const converts = await ConvertModel.find();
    res.render("admin/Convert/index",{
        converts
    })
}
const create = async(req,res)=>{
    res.render("admin/Convert/create")
}
const edit = async(req,res)=>{
    const id = req.params.id;
    const convert = await ConvertModel.findOne({_id:id})

    res.render("admin/Convert/edit",{convert: convert})
}
const postCreate = async(req,res)=>{
    const name = req.body.name
    const web = req.body.web
    const description = req.body.description;
    const status = req.body.status;
    const avatar = req.file;
    const nameCheck = await ConvertModel.findOne({name})
    if(nameCheck){
        return res.json({msg: "Name already in use",status:false})
    }
    const user = {
        name,
        web,
        description,
        status,
        rate:0,
        totalFile:"0"
    }
    if(avatar){
        user["avatar"] = "imageConvert/"+avatar.originalname;
        fs.renameSync(avatar.path, path.resolve("src/public/admin/assets", "imageConvert/"+avatar.originalname));  
    }
   
    new ConvertModel(user).save();
    return res.json({msg: "Create Succes",status:true})
}
const postUpdate = async(req,res)=>{
    const id = req.params.id;
    const name = req.body.name
    const web = req.body.web
    const description = req.body.description;
    const status = req.body.status;
    const avatar = req.file;
    const user = {
        name,
        web,
        description,
        status,
    }
    if(avatar) {
        user["avatar"] = "imageConvert/"+avatar.originalname;
        fs.renameSync(avatar.path, path.resolve("src/public/admin/assets", "imageConvert/"+avatar.originalname));  
    }
   
    await ConvertModel.updateOne({_id:id},{$set:user})
    return res.json({msg: "Update Succes",status:true})
}
const del = async(req,res)=>{
    const id = req.params.id;
    await ConvertModel.deleteOne({_id:id});
    return res.json({msg:"Delete success",status:true})
}

module.exports = {
    index,
    create,
    edit,
    del,
    postCreate,
    postUpdate
}