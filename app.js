const express=require("express");
const app=express();
const User=require("./models/user");
const mongoose=require("mongoose");
const session=require("express-session");
const methodOverride = require('method-override');
const mongodb=require("mongodb");
const ExpressError=require("./ExpressError.js");
const Project=require("./models/project");
const flash=require("connect-flash");
const multer  = require('multer')
const {projectSchema}=require("./Schema.js");
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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.suc=req.flash("suc");
    res.locals.sucdel=req.flash("sucdel");
    res.locals.err=req.flash("err");
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

const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash("err", "you must be logged !");
		return res.redirect("/login");
	}
	return next();
};
const saveRedirectUrl=(req,res,next)=>{
	if(req.session.redirectUrl){
		res.locals.redirectUrl=req.session.redirectUrl;
	}
	return next();
}
const check_auth=(req,res,next)=>{
    if(req.user.auth=='btech'){
        throw new ExpressError(401,"You are not authorized to access this page!")
    }
    else next();
}

app.get("/home",asyncWrap(async (req,res)=>{
    const projects=await Project.find();
    return res.render("projects.ejs",{projects});
}));


app.get("/projects/new",saveRedirectUrl,isLoggedIn,check_auth,asyncWrap((req,res)=>{
    return res.render("new.ejs");
}))
app.get("/projects",asyncWrap(async (req,res)=>{
  
    if(req.query.project){
        const project=req.body.project;
        const newProject=new Project(project);
        await newProject.save();
     }
       let filter;
    let projects= await Project.find();
    
    let q="";
       if((req.query.q)&&(req.query.q!="")){
        
         q=req.query.q;
         projects= projects.filter((project) => (
            project.projectName.toLowerCase().includes(q.toLowerCase())
        ))
    
       }
       if(req.query.filter){
        
         filter=req.query.filter;
      
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
app.post("/projects",saveRedirectUrl,isLoggedIn,check_auth,asyncWrap(async(req,res)=>{
   let {project,skills}=req.body;
   project.skills=[];
    skills.split(',').forEach(skills=>{
        project.skills.push(skills);
       })
project.postedBy=req.user.username;

    let result=projectSchema.validate(project);   
    if(result.error){
   
        throw new ExpressError(400,result.error);

    }

    let newproject=new Project(project);
    project.owner=req.user._id;

    await newproject.save();
    req.flash("suc","Listing created successfully!");
   res.redirect("/projects");
}))
app.get("/projects/:id",asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let project=await Project.findById(id);
    return res.render("show.ejs",{project})
}))
app.get("/projects/:id/edit",saveRedirectUrl,isLoggedIn,check_auth,asyncWrap(async(req,res)=>{
    let {id}=req.params;

    let project=await Project.findById(id);
    return res.render("edit.ejs",{project})
}))
app.post("/projects/:id/edit",saveRedirectUrl,isLoggedIn,check_auth,asyncWrap(async (req,res,next)=>{
      
    const {id} =req.params;
    const {project,skills}=req.body;
    
 project.skills=[];
    skills.split(',').forEach(skills=>{
        project.skills.push(skills);
       })

     

    let editlist=await Project.findByIdAndUpdate(id,{...project});
  project.postedBy=editlist.postedBy;
   let result=projectSchema.validate(project); 
   
if(result.error){
    throw new ExpressError(400,result.error);
}
   await editlist.save();
    req.flash("sucdel","Listing updated successfully!");
    res.redirect("/projects");


}
))
app.delete("/projects/:id/delete/",saveRedirectUrl,isLoggedIn,check_auth,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    await Project.findByIdAndDelete(id);
    req.flash("err","Listing deleted successfully!");
    res.redirect("/projects");

}))

app.get("/signup",(req,res)=>{
    return res.render("users/signup.ejs");
 });
 
 app.post("/signup",asyncWrap(async(req,res)=>{
    
     let{username,email,password,auth}=req.body;
     const newUser=new User({email,username,auth});
     await User.register(newUser,password);
     console.log(newUser);
     req.login(newUser,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("suc",`Welcome ${req.user.username}!`);
         return  res.redirect("/home");
     });
   
 }));
app.get("/login",asyncWrap((req,res)=>{
   return res.render("users/login.ejs");
}));

app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),saveRedirectUrl,asyncWrap((req,res)=>{
    req.flash("suc",`Welcome back ${req.user.username}`);
    let redirectUrl=res.locals.redirectUrl || "/projects"
    res.redirect(redirectUrl);
}));

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucdel", "You are logged out!");
      return  res.redirect("/home");
    });
});
app.all("*",(req,res,next)=>{
   return next(new ExpressError(404,"Page Not Found!"));
   })

app.use((err,req,res,next)=>{
    let {status=501,message="some error occured"}= err;
   return res.render("error.ejs",{message})
    } );

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});

