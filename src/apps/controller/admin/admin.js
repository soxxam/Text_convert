const AccountModel = require('../../models/Account');
const BillModel = require('../../models/Bill');
const bcrypt = require('bcrypt');
const ConvertModel = require('../../models/Convert');

const index = async(req,res)=>{
    const user = req.session.account;
    const bill = await BillModel.find().populate({path:"priceId"}).populate({path:"userId"});
    let total = 0
    for(let item of bill){
        total += item.totalPrice
    }
    const bills = await BillModel.find().populate({path:"priceId"}).populate({path:"userId"}).limit(5);
    const imageToText = await ConvertModel.findOne({name:"Ảnh Sang Văn Bản"})
    const pdfToText = await ConvertModel.findOne({name:"PDF Sang Văn Bản"})
    res.render('admin/dashboard',{user,total,bills,bill,imageToText,pdfToText})
}

const getLogin = async(req,res)=>{
    res.render('admin/login')
}

const getRegister = async(req,res)=>{
    res.render("admin/register")

}


const postLogin = async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const usernameCheck = await AccountModel.findOne({email})
    if(!usernameCheck){
        res.json({status: 'false',msg:"email don't exist "})
        return false;
    }
    console.log(password)
    console.log(usernameCheck.password)
    const isPasswordValid = await bcrypt.compare(password, usernameCheck.password)
    if(!isPasswordValid){
        res.json({status: 'false',msg:"Wrong password"})
        return false;
    }
    req.session.account = usernameCheck
    req.session._id = usernameCheck._id;
    // return res.redirect(redirect?redirect:"/admin/dashboard")
    res.json({status: 'true',msg:"Login success",usernameCheck})

}




const postRegister = async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const emailCheck = await AccountModel.findOne({email})
    if(emailCheck){
        return res.json({msg: "Email already in use",status:false})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await AccountModel.create({
        username,
        email,
        password:hashedPassword
    })
    delete user.password
    return res.json({msg:"Register success",status:true,user})
}

const logOut = (req, res)=>{
    req.session.destroy();
    res.redirect("/admin/dashboard");
}

module.exports ={
    index,
    getLogin,
    getRegister,
    postLogin,
    postRegister,
    logOut
}