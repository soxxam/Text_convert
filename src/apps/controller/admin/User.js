const UserModel = require('../../models/Users')
const paginate = require('../../middlewares/paginate')

const index = async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = limit * (page - 1);
    const total = await UserModel.find().countDocuments();
    totalPage = Math.ceil(total / limit);
    const users = await UserModel.find().skip(skip).limit(limit).sort({ _id: 1 });
    res.render("admin/User/index",{
        users:users,
        pages: paginate(page, totalPage),
        totalPage: totalPage,
        page: page,
    })
}
const edit = async(req,res)=>{
    let id = req.params.id
    const user = await UserModel.findOne({id:id});
    res.render("admin/User/edit",{user:user})
}
module.exports ={index,edit}