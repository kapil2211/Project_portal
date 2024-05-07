const express=require("express");
const app=express();
const User=require("./models/user");
const mongoose=require("mongoose");
const session=require("express-session");
const methodOverride = require('method-override');
const mongodb=require("mongodb");
const ExpressError=require("./ExpressError.js");
const Project=require("./models/project");
const multer  = require('multer')
let port=8080;
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public/")));


const passport=require("passport");
const localStrategy=require("passport-local");

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()*7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
    }
  };
  function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
        };
    }
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser=req.user;
   
   return next();
});


main()
.then((res)=>{
    console.log("connection with database formed successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/project_portal');
};


app.get("/signup",(req,res)=>{
   return res.render("users/signup.ejs");
});

app.post("/signup",asyncWrap,async(req,res)=>{
   
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        return  res.redirect("/home");
    });
  
});
app.get("/home",asyncWrap(async (req,res)=>{
    const projects=await Project.find();
    return res.render("projects.ejs",{projects});
}));
app.post("home",asyncWrap(async (req,res)=>{
    console.log(req.body);
    const projects=await Project.find();
    return res.render("projects.ejs",{projects});
}));
app.get("/projects",asyncWrap(async (req,res)=>{
    const projects=await Project.find();
    return res.render("projects.ejs",{projects});
}));
app.post("/projects",asyncWrap(async (req,res)=>{
 
 if(req.body.project){
    const project=req.body.project;
    const newProject=new Project(project);
    await newProject.save();
 }
   let filter;
let projects= await Project.find();

let q="";
   if((req.body.q)&&(req.body.q!="")){
    
     q=req.body.q;
     projects= projects.filter((project) => (
        project.projectName.toLowerCase().includes(q.toLowerCase())
    ))

   }
   if(req.body.filter){
    
     filter=req.body.filter;
  
    if(filter.location){
       let  filtered_location= projects.filter((project) => (
            project.job_location.includes(filter.location)
        ))
        
        projects=filtered_location;
    }
    if(filter.domain){
        let  filtered_domain= projects.filter((project) => (
            project.domain.includes(filter.domain)
        ))
        projects=filtered_domain;
    }if(filter.duration){
        if(filter.duration==1){
           let  filtered_duration= projects.filter((project) => (
                (project.duration==1)||(project.duration==2)
            ))
            projects=filtered_duration;
        }
       else if(filter.duration==3){
       let filtered_duration= projects.filter((project) => (
                (project.duration>2)&&(project.duration<5)
            ))
            projects=filtered_duration;
        }
       else if(filter.duration==4){
        let filtered_duration= projects.filter((project) => (
                (project.duration>3)&&(project.duration<7)
            ))
            projects=filtered_duration;
        }
        else{
            let filtered_duration= projects.filter((project) => (
                (project.duration>6)
            ))
            projects=filtered_duration;
        }
      
    }
   
   }
   return res.render("projects.ejs",{projects:projects,filters:filter})
   
}))
app.get("/projects/new",asyncWrap((req,res)=>{
    return res.render("new.ejs");
}))
app.get("/login",asyncWrap((req,res)=>{
    res.render("users/login.ejs");
}));

app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
    res.redirect("/home");
});

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/home");
    });
});
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
   })

app.use((err,req,res,next)=>{
    let {status=501,message="some error occured"}= err;
    res.render("error.ejs",{message})
    } );

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});

