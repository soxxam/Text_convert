const AccountModel = require("../models/Account")


const checkLogin = (req, res, next)=>{
    if(req.session.account){
        return res.redirect("/admin/dashboard");
    }
    next();
}

const checkAdmin = (req, res, next)=>{
    if( !req.session.account){
       return res.redirect('/admin/login');
    }
    next();
}
const checkUser = (req, res,next) => {
    if(!req.session.account){
        return res.redirect(`/admin/login?redirect=${req.originalUrl}`);
    }
    next();
}

const checkStatus = async(req, res, next) => {
    if(req.session.account){
        let id = req.session.account._id;
        let status = "online";
        await AccountModel.updateOne({_id: id, status: status})
    }
    // else
    // {
    //     let id = req.session.account._id;
    //     let status = "offline";
    //     await AccountModel.updateOne({_id: id, status: status})
    // }
}

module.exports = {
    checkLogin: checkLogin,
    checkAdmin: checkAdmin,
    checkUser: checkUser,
    checkStatus: checkStatus,
}