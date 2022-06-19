const fs = require('fs');
var Tesseract = require("tesseract.js");
const path = require('path');
const ImageModel = require("../models/Images")
const UploadMiddlewares = require("../middlewares/upload");
const pdfConverter = require('pdf-poppler')
const { forEach } = require('p-iteration');
var upload = UploadMiddlewares.upload.single("image")
const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');
const ConvertModel = require('../models/Convert')
const PriceModel = require('../models/Price')
const paypal  =  require('paypal-rest-sdk');
const BillModel = require('../models/Bill')
const ejs = require("ejs")
const transporter = require("../../common/transporter");
const paginate = require("../middlewares/paginate")

var getPrice;
const home = async = async(req,res)=>{
    const converts = await ConvertModel.find();
    res.render("site/home",{
        converts
    })
}
const imageToText = (req,res)=>{
    res.render('site/index');
}
const uploadImage = async(req,res)=>{
    let convertImage = await ConvertModel.findOne({name:"Ảnh Sang Văn Bản"})
    let totalFile =  convertImage.totalFile;
    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; 
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    today = yyyy + "-" + mm + '-' + dd 
    let ab="";
    let nameImg=''
    const body = req.body;
    const userId = body.user
    let arrImg = []

    let p = 'src/public/site/imageToText/'+totalFile
    fs.mkdirSync(p)
    const files = req.files;
    await forEach(files,async(file)=>{
        let name = file.originalname;
        for(let i = name.length;i>=0;i--){
            if(name[i]=='.'){
                chr = i
                break;
            }
        }
        nameImg += name.substring(0,chr)+'-'
        if(file){
            arrImg.push(file.originalname)
            fs.renameSync(file.path, path.resolve("src/public/site", "imageToText/"+totalFile+"/"+file.originalname));
        }
        return new Promise(async(resolve, reject)=> {
            upload(req,res, async(err) =>{
                if(err){
                    console.log(err);
                    return res.send("Lỗi")
                }
                var image = fs.readFileSync(p +'/'+ file.originalname,{
                    encoding:null
                });
                let lan = body.lan;
                await Tesseract.recognize(image,lan)
                .then(({ data: {text} }) => {
                    ab += text;
                })
                resolve()
            })
        })
    })
    let wstream;
    nameImg = nameImg.slice(0, nameImg.length-1)
    nameImg=nameImg+'.txt'
    wstream = fs.createWriteStream('src/public/site/imageToText/'+totalFile+'/'+nameImg);
    wstream.write(ab,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('dataWritten')
        }
    })
    const img = {
        name:nameImg,
        img:arrImg,
        numfile: totalFile,
        user_id: userId,
        day:today,
        type:"picture",
    }
    if(userId){
        img["isUserSet"] = true;
        let user = await UserModel.findOne({_id:userId})
        let totalFile = user.totalFileConvert
        totalFile = totalFile+1;
        let users = {
            totalFileConvert:totalFile
        }
        await UserModel.updateOne({_id :userId},{$set:users});
    }
    let convert = {
        "totalFile":parseInt(totalFile)+1,
    };
    await ConvertModel.updateOne({_id :convertImage._id},{$set:convert});
    new ImageModel(img).save((err,result)=>{
        id = result._id;
        res.redirect('/convert'+id,);
    })
}
const Convert = async(req,res)=>{
    const id = req.params.id;
    const img = await ImageModel.findById(id);
    let name = img.name;
    let chr
    for(let i = name.length;i>=0;i--){
        if(name[i]=='.'){
            chr = i
            break;
        }
    }
    name = name.substring(0,chr) + '.txt'
    let context = img.context;    
    let imgCount = img.numfile
    let stats;
    if(img.type=="picture"){
        stats = fs.statSync('src/public/site/imageToText/'+imgCount+'/'+name);
    }
    else
    {
        stats = fs.statSync('src/public/site/pdfToText/'+imgCount+'/'+name);

    }
    var size = stats.size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
    i=0;while(size>900){size/=1024;i++;}
    var dl = (Math.round(size*100)/100)+' '+fSExt[i];
    const imgNew = {
        size:dl
    }
    let rate = img.rate;
    let comment = img.comment;
    await ImageModel.updateOne({_id : id} , {$set : imgNew}); 
    res.render('site/upload',{
        id,
        img,
        name,
        context,
        dl,
        rate,
        comment,
    })
}
const download = async(req,res)=>{
    let id = req.query.id;
    const img = await ImageModel.findById(id);
    let name = img.name;
    let imgCount = img.numfile;
    if(img.type == "picture"){
        res.download('src/public/site/imageToText/'+imgCount+'/'+name)
    }
    else{
        res.download('src/public/site/pdfToText/'+imgCount+'/'+name)

    }
}

const pdf = (req,res)=>{
    res.render('site/pdfToText')
}
const pdfToWord = async (req,res)=>{
    let convertImage = await ConvertModel.findOne({name:"PDF Sang Văn Bản"})
    let totalFile =  convertImage.totalFile;
    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; 
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    today = yyyy + "-" + mm + '-' + dd 
    let beforeAdd=0
    let afterAdd=0
    let arrStr=[]
    let arrImg = []
    let p = 'src/public/site/pdfToText/'+totalFile
    fs.mkdirSync(p)
    fs.readdirSync(p).forEach((item,index) => {
        beforeAdd++;
    });
    const body = req.body
    const file = req.file
    console.log(file)
    const userId = body.user

    let strConvert=''
    let name = req.file.originalname;
    console.log(typeof name)
    let str = ''
    str = name    
    for(let i = name.length;i>=0;i--){
        if(name[i]=='.'){
            chr = i
            break;
        }
    }
    name = name.substring(0,chr) + '.txt'
    const img = {
        name:name,
    }
    img["numfile"] = totalFile;
    if(file){
        arrImg.push(file.originalname)
        img["img"] = arrImg;
        fs.renameSync(file.path, path.resolve("src/public/site", "pdfToText/"+totalFile+"/"+file.originalname));
    }
    console.log(req.file.originalname)
    let option = {
        format : 'jpeg',
        out_dir : 'src/public/site/pdfToText/'+totalFile,
        out_prefix : path.basename("src/public/site/pdfToText/"+totalFile+"/"+file.originalname, path.extname("src/public/site/pdfToText/"+totalFile+"/"+file.originalname)),
        page : null
    }

    await pdfConverter.convert("src/public/site/pdfToText/"+totalFile+"/"+file.originalname, option)
    .then((res) => {
        console.log(res.count)
        console.log('file converted')
    })
    .catch(err => {
        console.log('an error has occurred in the pdf converter ' + err)
    })
    fs.readdirSync(p).forEach((item,index) => {
        afterAdd++;
    });   
    let numImg = afterAdd-beforeAdd-1
    let arr = []
    for(let i=1; i<=numImg; i++){
        arr.push(i)
    }
    await forEach(arr,async(item)=>{
        let nameImg = file.originalname.replace('.pdf','-'+item+'.jpg')
        return new Promise((resolve,reject) =>{upload(req,res, async(err)=>{
            var image = fs.readFileSync('src/public/site/pdfToText/'+totalFile+'/'+nameImg,{
                encoding:null
            });
            let lan = body.lan;
            console.log(lan)
            await Tesseract.recognize(image,lan)
            .then(({ data: {text} }) => {
                ab = text;
                console.log(text)
                arrStr.push(text);
            })
            resolve()
        })})
    })
    for(let i = 1; i < arrStr.length; i++){
        strConvert+=arrStr[i]
    }
    strConvert+=arrStr[0]
    console.log("text:"+strConvert)
    let wstream = fs.createWriteStream('src/public/site/pdfToText/'+totalFile+'/'+name);
    wstream.write(strConvert,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('dataWritten')
        }
    })    
    img["user_id"] = userId;
    img["day"] = today
    if(userId){
        img["isUserSet"] = true;
        let user = await UserModel.findOne({_id:userId})
        console.log(user)
        let totalFile = user.totalFileConvert
        totalFile = totalFile+1;
        let users = {
            totalFileConvert:totalFile
        }
        await UserModel.updateOne({_id :userId},{$set:users});
    }
    img["type"] = "pdf";
    let convert = {
        "totalFile":parseInt(totalFile)+1,
    };
    await ConvertModel.updateOne({_id :convertImage._id},{$set:convert});

    new ImageModel(img).save((err,result)=>{
        id = result._id;
        res.redirect('/convert'+id,);
    })
}

const addComment = async(req, res)=>{
    let rate = req.body.rating
    console.log(rate)
    let comment = req.body.comment
    const img ={
        rate: rate,
        comment: comment
    }
    let id = req.params.id
    console.log(id)
    await ImageModel.updateOne({_id : id} , {$set : img});
    res.json({status:true})
}

const getHistory = async (req, res) => {    

    const id = req.params.id;
    const total =  await ImageModel.find({user_id:id}).countDocuments()
    const file = await ImageModel.find({user_id:id})
    res.render('site/history',{
        file,
        id,
        
    })
}
const deleteFile = async(req,res)=>{
    const id = req.params.id;
    let userId = req.params.userId;
    const FileData = await ImageModel.findById(id);
    await FileData.deleteOne({_id:id});
    console.log(id)
    console.log(userId)
    const file = await ImageModel.find({
        user_id : userId
    });
    // console.log(file)
    return res.json({msg:"Delete success",status:true,file})
}

const setting = async (req,res) => {
    let id = req.params.id
    let user = await UserModel.findById({_id:id});
    let price = await PriceModel.findOne({status:"active"})
    res.render('site/setting',{
        user,
        id,
        price
    
    
    })
}
const pay = async (req,res) => {
    res.render('site/pay')
}
const help = async (req,res)=>{
    res.render("site/help")
}
const price = async(req,res)=>{
    res.render("site/price")
}
const about = async(req,res) => {
    res.render("site/about")
}

const changeName = async(req,res) => {
    let id = req.params.id
    let username = req.body.username
    let email = req.body.email
    const user = {
        username: username,
        email: email,
    }
    await UserModel.updateOne({_id:id},{$set:user})
    return res.json({msg:"Update success",status:true})

}


const changePass = async (req, res) => {
    let id = req.params.id
    const user = await UserModel.findOne({_id:id})
    let oldPass = req.body.oldPass
    let newPass = req.body.newPass
    console.log( oldPass+ newPass)
    const isPasswordValid = await bcrypt.compare(oldPass, user.password)
    if(!isPasswordValid){
        res.json({status: 'false',msg:"Mật khẩu hiện tại sai"})
        return false;
    }
    else{
        console.log("A")
        const hashedPassword = await bcrypt.hash(newPass,10);
        const user = {
            password: hashedPassword,
        }
        await UserModel.updateOne({_id:id},{$set:user})
        res.json({status: 'true',msg:"Thành Công"})
    }


}

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARyNC7vQdv3rWpCYuVaJk0zcjOr2PYz_8GfakEBSunxlw9IKnAvt01Bsg7UD9toMMnlt_TIGggPf9QI9',
    'client_secret': 'ELd2qoVFANHrFihw63J7lLY3eb6qchrrKjnryG0AZiDr-2aXyX_-Zq1Xid0ei_srSmFPtRliK3Irpzdv'
});     
const getPay = async(req, res) => {
    res.render("site/pay")

}
const postPay = async(req, res) => {
    let today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; 
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    today = yyyy + "-" + mm + '-' + dd 
    let name = req.body.priceName;
    let price = req.body.pricePrice;

    let user = {
        PriceId : req.body.priceId,
        dayBuy: today,
        convertCount:200
    }
    getPrice = price.toString();
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": name,
                    "sku": "001",
                    "price": price.toString(),
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": price.toString()
            },
            "description": "LK Convert Premium"
        }]
    };
    paypal.payment.create(create_payment_json, async function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    let bill = {
                        userId : req.body.userId,
                        priceId:req.body.priceId,
                        totalPrice:price,
                        day:today,
                        status:"Đã thanh toán"
                    }
                    await UserModel.updateOne({_id :req.body.userId},{$set:user})
                    await BillModel(bill).save()
                    const userOne = await UserModel.findOne({_id:req.body.userId})
                    console.log(userOne)
                    const viewPath = req.app.get('views');
                    const html = await ejs.renderFile(
                        path.join(viewPath,'site/mail.ejs'),
                        {
                            username:userOne.username,
                            email: userOne.email,
                            price: price,
                            name:name,
                        }
                    );
                    await transporter.sendMail({
                        to: userOne.email,
                        from: "LK Shop",
                        subject: "Xác nhận đơn hàng từ LK GEAR",
                        html,
                    })
                    res.redirect(payment.links[i].href);
                }
            }

        }
    });
}
const mail = async(req,res)=>{
    res.render('site/mail');
}
const success = async(req, res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log(getPrice)
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": getPrice
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.render("site/success");
        }
    });
}


const checkSuccess =async (req, res) => {
    const user = await UserModel.findOne({_id:req.body.userId})
    res.json({msg:"Success",user})
}
module.exports ={
    download,
    imageToText,
    uploadImage,
    pdf,
    Convert,
    pdfToWord,
    addComment,
    getHistory,
    deleteFile,
    help,
    price,
    about,
    setting,
    pay,
    changeName,
    changePass,
    home,
    getPay,
    postPay,
    success,
    checkSuccess,
    mail
}

