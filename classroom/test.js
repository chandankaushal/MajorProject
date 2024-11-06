const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const port = 8080;
const session = require("express-session");
const flash = require("connect-flash");

let sessionOptions = {secret:"secret",resave:false,saveUninitialized:true,cookie: { secure: false, httpOnly: true, maxAge: 60000 }};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.SuccessMsg = req.flash("success");
  res.locals.ErrorMsg = req.flash("error");
  next();
})



app.get("/test",(req,res)=>{
  let {name="anonymous"} = req.query;
  req.session.name = name;
  if(name=="anonymous"){
    req.flash("error","Name is anonymous");
  }
  else{
    req.flash("success","Name has been set");
  }
  res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
  let {name="Hello"} = req.session;
  res.render("hello.ejs",{name});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});