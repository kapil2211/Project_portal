const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required :true
    },
    auth:{
        type:String,
        required :true,
        enum: ['admin', 'btech','mtech','phd'],
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);
