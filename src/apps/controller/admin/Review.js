const ReviewModel = require('../../models/Review')

const index = async(req,res)=>{
    const reviews = await ReviewModel.find().populate({path:"convertId"});;
    res.render("admin/Review/index",{
        reviews
    })
}

const edit = async(req,res)=>{
    const id = req.params.id
    const review = await ReviewModel.findOne({_id:id}).populate({path:"convertId"});
    res.render("admin/Review/edit",{
        review
    })
}

const del = async(req,res)=>{
    const id = req.params.id
    await ReviewModel.deleteOne({_id:id})
    return res.json({msg:"Delete success",status:true})
}

module.exports = {
    index,
    edit,
    del
}