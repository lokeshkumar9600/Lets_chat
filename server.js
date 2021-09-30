const express = require("express");
const app = express();
const PORT = 3000||process.env.PORT;
const path = require("path");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/lets_chat" , {useNewUrlParser : true , useUnifiedTopology:true});
const bodyParser = require("body-parser");

// database schema import
var users = require("./db/user")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")))

app.get("/",(req, res) => {
 res.sendFile(__dirname + "/public/main.html")
});

app.get("/signin",(req, res) => {
  res.sendFile(__dirname + "/public/sign-in.html");
});

app.get("/signup",(req, res) => {
  res.sendFile(__dirname + "/public/sign-up.html");
});

app.post("/signup",(req, res) => {
  if(req.body.signupPassword == req.body.signupConfirmPassword){
    console.log("check confirm")
   users.create({
     email: req.body.signupEmail,
     password: req.body.signupPassword
   },(err,save)=>{
     if(err){
       console.log(err);
     }else{
       console.log(save);
     }
   });
  }else{
    
  }
});

app.post("/signin",(req, res) => {
users.findOne({email: req.body.signinEmail},(err,userfound)=>{
  if(err){
    console.log(err);
    console.log(userfound);
  }else{
    console.log(userfound);
    if(userfound){
      if(userfound.password === req.body.signinPassword){
        console.log("users has registered and allowed to enter the site")
      }
    }
  }
})
});




app.listen(PORT,(req,res)=>{
  console.log( `the server is running on ${PORT}`);
});