const express=require("express");
const app=express();

let port=8080;

app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));

app.use((req,res)=>{
    console.log("request received");
});

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
});

