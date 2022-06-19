const ReportModel = require('../../models/Report')

const index = async(req,res)=>{
    const reports = await ReportModel.find().populate({path:"userId"});
    res.render("admin/Report/index",{
        reports
    })
}

const edit = async(req,res)=>{
    const id = req.params.id
    const report = await ReportModel.findOne({_id:id}).populate({path:"userId"});
    res.render("admin/Report/edit",{
        report
    })
}

const del = async(req,res)=>{
    const id = req.params.id
    await ReportModel.deleteOne({_id:id})
    return res.json({msg:"Delete success",status:true})

}

module.exports = {
    index,
    edit,
    del
}