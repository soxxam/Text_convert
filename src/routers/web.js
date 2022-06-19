const express = require("express");
const router = express.Router();
const SiteController = require('../apps/controller/site')
const UserController = require('../apps/controller/userController')
const UploadMiddlewares = require("../apps/middlewares/upload");
const AdminController = require('../apps/controller/admin/admin')
const AccountController = require('../apps/controller/admin/Account')
const ConvertController = require('../apps/controller/admin/Convert')
const PriceController = require('../apps/controller/admin/Price')
const AdminUserController = require('../apps/controller/admin/User')
const AuthMiddlewares = require("../apps/middlewares/auth")
const FileController = require("../apps/controller/admin/File")
const BillController = require("../apps/controller/admin/Bill")

router.get('/home',SiteController.home)
router.get('/imageToText',SiteController.imageToText)
router.post('/upload', UploadMiddlewares.upload.array("image"),SiteController.uploadImage)
router.get('/convert:id',SiteController.Convert)
router.get('/download',SiteController.download)

router.get('/pdfToText',SiteController.pdf)
router.post('/pdfToWord',UploadMiddlewares.upload.single("image"),SiteController.pdfToWord)

router.post('/addComment:id',SiteController.addComment)


router.get('/Login',UserController.getLogin)
router.get('/Register',UserController.getRegister)


router.post('/postRegister',UserController.postRegister)
router.post('/postLogin',UserController.postLogin)

router.get('/historyConvert-:id',SiteController.getHistory)

router.post('/deleteFile/:userId/:id',SiteController.deleteFile)

router.get("/help",SiteController.help)

router.get("/price",SiteController.price)

router.get("/about",SiteController.about)

router.get("/setting-:id",SiteController.setting)

router.get("/pay-:id",SiteController.pay)

router.post("/changeName-:id",SiteController.changeName)

router.post("/changePass-:id",SiteController.changePass)

router.get("/pay",SiteController.getPay)
router.post("/postPay",SiteController.postPay)
router.get("/success",SiteController.success)
router.post("/checkSuccess",SiteController.checkSuccess)

router.get('/mail',SiteController.mail);




// admin

router.get("/admin/login",AuthMiddlewares.checkLogin, AdminController.getLogin)

router.get("/admin/register",AuthMiddlewares.checkLogin, AdminController.getRegister)

router.post("/admin/postLogin", AdminController.postLogin)

router.post("/admin/postRegister", AdminController.postRegister)

router.get("/admin/dashboard",AuthMiddlewares.checkAdmin, AdminController.index)

router.get("/admin/logout", AuthMiddlewares.checkAdmin, AdminController.logOut);


//admin - account

router.get("/admin/account/index",AuthMiddlewares.checkAdmin,AccountController.index )
router.get("/admin/account/create",AuthMiddlewares.checkAdmin,AccountController.create)
router.get("/admin/account/edit-:id",AuthMiddlewares.checkAdmin,AccountController.edit)
router.post("/admin/account/createAccount",AuthMiddlewares.checkAdmin,UploadMiddlewares.upload.single("avatar"),AccountController.postCreate)
router.post("/admin/account/updateAccount-:id",AuthMiddlewares.checkAdmin,UploadMiddlewares.upload.single("avatar"),AccountController.postUpdate)
router.post("/admin/account/deleteAccount-:id",AuthMiddlewares.checkAdmin,AccountController.del)

//admin - convert
router.get("/admin/convert/index",AuthMiddlewares.checkAdmin,ConvertController.index )
router.get("/admin/convert/create",AuthMiddlewares.checkAdmin,ConvertController.create)
router.get("/admin/convert/edit-:id",AuthMiddlewares.checkAdmin,ConvertController.edit)
router.post("/admin/convert/createConvert",AuthMiddlewares.checkAdmin,UploadMiddlewares.upload.single("avatar"),ConvertController.postCreate)
router.post("/admin/convert/updateConvert-:id",AuthMiddlewares.checkAdmin,UploadMiddlewares.upload.single("avatar"),ConvertController.postUpdate)
router.post("/admin/convert/deleteConvert-:id",AuthMiddlewares.checkAdmin,ConvertController.del)

// admin-price
router.get("/admin/price/index",AuthMiddlewares.checkAdmin,PriceController.index )

router.get("/admin/price/create",AuthMiddlewares.checkAdmin,PriceController.create)
router.post("/admin/price/createPrice",AuthMiddlewares.checkAdmin,PriceController.postCreate)
router.get("/admin/price/edit-:id",AuthMiddlewares.checkAdmin,PriceController.edit)
router.post("/admin/price/deletePrice-:id",AuthMiddlewares.checkAdmin,PriceController.del)
router.post("/admin/price/updatePrice-:id",AuthMiddlewares.checkAdmin,PriceController.postUpdate)


//admin-user

router.get("/admin/user/index",AuthMiddlewares.checkAdmin,AdminUserController.index)
router.get("/admin/user/edit-:id",AuthMiddlewares.checkAdmin,AdminUserController.edit)
//admin-file
router.get("/admin/file/index",AuthMiddlewares.checkAdmin,FileController.index)
router.get("/admin/file/edit-:id",AuthMiddlewares.checkAdmin,FileController.edit)
router.post("/admin/file/deleteFile-:id",AuthMiddlewares.checkAdmin,FileController.del)

// admin-bill

router.get("/admin/bill/index",AuthMiddlewares.checkAdmin,BillController.index)
router.get("/admin/bill/edit-:id",AuthMiddlewares.checkAdmin,BillController.edit)
router.get("/admin/bill/searchMonth",AuthMiddlewares.checkAdmin,BillController.searchMonth)
module.exports = router;