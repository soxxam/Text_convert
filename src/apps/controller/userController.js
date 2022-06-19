const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');

const getLogin = (req,res)=>{
    res.render('site/Login');
}

const getRegister = (req,res)=>{
    res.render('site/Register');
}

const postLogin = async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const usernameCheck = await UserModel.findOne({username})
    if(!usernameCheck){
        res.json({status: 'false',msg:"username don't exist "})
        return false;
    }
    console.log(password)
    console.log(usernameCheck.password)
    const isPasswordValid = await bcrypt.compare(password, usernameCheck.password)
    if(!isPasswordValid){
        res.json({status: 'false',msg:"Wrong password"})
        return false;
    }
    res.json({status: 'true',msg:"Login success",usernameCheck})
}

const postRegister = async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const emailCheck = await UserModel.findOne({email})
    if(emailCheck){
        return res.json({msg: "Email already in use",status:false})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await UserModel.create({
        username,
        email,
        password:hashedPassword
    })
    delete user.password
    return res.json({msg:"Register success",status:true,user})
}
module.exports={
    getLogin,
    getRegister,
    postRegister,
    postLogin,

}