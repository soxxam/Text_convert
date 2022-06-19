const AccountModel = require('../../models/Account');
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const index = async(req, res)=>{
    const accounts = await AccountModel.find();
    res.render("admin/Account/index",{
        accounts
    })
}

const create = async(req, res)=>{
    res.render("admin/Account/create")
}

const postCreate = async(req, res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email;
    const birth = req.body.birth;
    const avatar = req.file;
    console.log(birth)
    console.log(typeof birth)

    const emailCheck = await AccountModel.findOne({email})
    if(emailCheck){
        return res.json({msg: "Email already in use",status:false})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = {
        username,
        email,
        password:hashedPassword,
        birth
    }
    user["avatar"] = "imageAccount/"+avatar.originalname;
    fs.renameSync(avatar.path, path.resolve("src/public/admin/assets", "imageAccount/"+avatar.originalname));  
    new AccountModel(user).save();
    return res.json({msg: "Create Succes",status:true})
}

const edit = async(req, res)=>{
    const id = req.params.id;
    const account = await AccountModel.findOne({_id:id})

    res.render("admin/Account/edit",{account: account})

}

const postUpdate = async(req, res)=>{
    const id = req.params.id;
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email;
    const birth = req.body.birth;
    const avatar = req.file;
    console.log(id + username + password + email  +birth)
    let user={}
    if(password){
        const hashedPassword = await bcrypt.hash(password,10);
        user = {
            username,
            email,
            password:hashedPassword,
            birth
        }
    }
    else
    {
        user = {
            username,
            email,
            birth
        }
    }
    if(avatar){
        user["avatar"] = "imageAccount/"+avatar.originalname;

        fs.renameSync(avatar.path, path.resolve("src/public/admin/assets", "imageAccount/"+avatar.originalname));  
    }
    await AccountModel.updateOne({_id:id},{$set:user})

    return res.json({msg: "Update Succes",status:true})
}

const del = async(req, res)=>{
    console.log("a")
    const id = req.params.id;
    await AccountModel.deleteOne({_id:id});
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