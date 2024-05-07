const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const projectSchema=new Schema({
    projectName:{
        type:String,
        required:true,
    },
    postedBy:{
        type:String,
        required:true,
    },
    requirements:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    job_location:{
        type:String,
        required:true,
    },
    domain:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    }
})

const Project=mongoose.model("project",projectSchema);
module.exports=Project;