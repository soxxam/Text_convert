const BillModel = require('../../models/Bill')
const UserModel = require('../../models/Users')
const PriceModel = require('../../models/Price')
const paginate = require('../../middlewares/paginate')

const index = async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = limit * (page - 1);
    const total = await BillModel.find().countDocuments();
    totalPage = Math.ceil(total / limit);
    const bills = await BillModel.find().populate({path:"userId"}).populate({path:"priceId"}).skip(skip).limit(limit).sort({ _id: 1 });
    res.render("admin/Bill/index",{
        bills,
        pages: paginate(page, totalPage),
        totalPage: totalPage,
        page: page,
    });
}

const edit = async(req,res)=>{
    const id = req.params.id;
    const bill = await BillModel.findOne({_id:id}).populate({path:"priceId"}).populate({path:"userId"});
    res.render("admin/Bill/edit",{bill})
}

const searchMonth = async(req,res)=>{
    const month = req.query.month
    const bill = await BillModel.find({}).populate({path:"priceId"}).populate({path:"userId"})
    let arrBill = []
    for(let item of bill){
        let day = item.day.slice(0,7);
        console.log(day)
        if(day == month){
            arrBill.push(item)
        }
    }
    res.render("admin/Bill/search",{arrBill})
}
module.exports = {
    index,
    edit,
    searchMonth,
}