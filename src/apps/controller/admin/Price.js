const PriceModel = require("../../models/Price")

const index = async(req,res)=>{
    const price = await PriceModel.find();
    res.render('admin/Price/index',{price})
}

const create =  async(req,res)=>{
    res.render("admin/Price/create");
}
const postCreate = async(req,res)=>{
    const name = req.body.name
    const ConvertCount = req.body.ConvertCount
    const description = req.body.description;
    const price = req.body.price;
    const status = req.body.status;
    console.log(name)
    console.log(description)
    console.log(price)
    console.log(ConvertCount)
    const prices = {
        name,
        ConvertCount,
        description,
        price,
        status
    }
    new PriceModel(prices).save();
    return res.json({msg: "Create Succes",status:true})
}


const del = async(req,res)=>{
    const id = req.params.id;
    await PriceModel.deleteOne({_id:id});
    return res.json({msg:"Delete success",status:true})
}
const edit = async (req, res)=>{
    const id = req.params.id;
    const price = await PriceModel.findOne({_id:id})
    res.render("admin/Price/edit",{price})
}

const postUpdate = async(req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const ConvertCount = req.body.ConvertCount
    const description = req.body.description;
    const price = req.body.price;
    const status = req.body.status;
    console.log(name)
    console.log(description)
    console.log(price)
    console.log(ConvertCount)
    const prices = {
        name,
        ConvertCount,
        description,
        price,
        status
    }
    await PriceModel.updateOne({_id:id},{$set:prices})

    return res.json({msg: "Update Succes",status:true})
}
module.exports = {
    edit,
    index,
    create,
    postCreate,
    del,
    postUpdate
}