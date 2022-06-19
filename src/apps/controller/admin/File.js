const FileModel = require('../../models/Images')
const UserModel = require('../../models/Users')
const paginate = require('../../middlewares/paginate')
const index = async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = limit * (page - 1);
    const total = await FileModel.find().countDocuments();
    totalPage = Math.ceil(total / limit);
    const files = await FileModel.find().skip(skip).limit(limit).sort({ _id: 1 });
    res.render("admin/File/index",{
        files,
        pages: paginate(page, totalPage),
        totalPage: totalPage,
        page: page,
    
    });
}

const edit = async (req,res)=>{
    const id = req.params.id;
    let file = await FileModel.findOne({_id:id});
    console.log(file)
    let user = await UserModel.findOne({_id:file.user_id})
    res.render("admin/File/edit",{file,user});
}

const del = async (req,res)=>{
    const id = req.params.id
    await FileModel.deleteOne({_id:id});

    return res.json({msg:"Delete success",status:true})
}

module.exports ={
    index,
    edit,
    del
}