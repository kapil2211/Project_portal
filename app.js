const express=require("express");
const app=express();
const mongoose=require("mongoose");

let port=8080;

app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));

const User=require("models/user.ejs");
const passport=require("passport");
const localStrategy=require("passport-local");


main()
.then((res)=>{
    console.log("connection with database formed successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/project_portal');
};


app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

app.post("/signup",async(req,res)=>{
   try{
    let{username,email,password}=req.body;
    const newUser=new User({email,password});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return nextTick(err);
        }
        res.redirect("/home.ejs");
    });
   }catch(err){
    res.send("some error occured");
   }

});

app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

app.use((req,res)=>{
    console.log("request received");
});

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});

