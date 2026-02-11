const express=require('express');
const app=express();
const port=8080;
const path=require('path');
const{v4:uuidv4}=require('uuid');//uuid genrate karta hai new id ko.
const methodOverride=require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));//api request ke url encoded data samjh payega.

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user");       //user page ko require kiye hai.
const session = require("express-session");

const flash =require("connect-flash");
const mongoose = require("mongoose");//mongoose require.

//variable type ka database banana hai jisese ki user essily delete ker sake yaha per post noun hai.

let posts=[
    {
         id:uuidv4(),
        username:"Rudra",
        content:"i love coding!"
    },
     {
         id:uuidv4(),
        username:"Ritesh",
        content:"i love coding!"
    }
];
//simple way smajhne ke liye comment-
//app.get('/',(req,res)=>{
 //   res.send("Hello world");
//});

app.use(session({              //session hamesa ek individual user ka hai.
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: false
}));     
         
//flash 
app.use(flash());


// global variables for ejs
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});


//ye sare passport se related hai.
app.use(passport.initialize());
app.use(passport.session());

// Custom serialize/deserialize (without passport-local-mongoose)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await require('./models/user').findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});


// ===== ROUTES (SABSE LAST) =====
const userRouter=require("./routes/user");
app.use("/",userRouter);


//demoUser
//app.get('/demoUser',async(req,res)=>{
  //  let fakeUser=new user({
       // email:"student@gmail.com",
      //  username:"rudra"
    //});
    //let registeredUser=await user.register(fakeUser,"hello123");//register check automatical ki unique hai ya nahi.
  // res.send(registeredUser);
//});



//home path
app.get('/posts',(req,res)=>{
    res.render("index.ejs",{posts});//curli bracket ke inside jo likhte hai use object kahte hao
});

//form path
app.get('/posts/new',(req,res)=>{
    res.render("new.ejs");
});

//submit path
app.post('/posts',(req,res)=>{
    let {username,content}=req.body;//form create ker liya
    let id=uuidv4();//uuidv4 function call karte hai.
    posts.push({id,username,content});
    // redirect to posts list so user can see the newly added post
    res.redirect('/posts');//patch request redirct hoker yahi submit karega.
});

//posts/:id path
app.get('/posts/:id',(req,res)=>{
    let {id}=req.params;
       console.log(id);
    let post=posts.find((p)=>p.id===id);
   // console.log(post);
    res.render("show.ejs",{post});
});

//patch req ya fir update route. ye hamara pura apdate hopskotch online platform se change hoga content.
app.patch('/posts/:id',(req,res)=>{
     let {id}=req.params;//id se sirf hum apna content change ker sakte hai.
       let newContent=req.body.content;//content hamare body se req karke layega.
       let post=posts.find((p)=>p.id===id);//then id match hoga .
       post.content=newContent;
        console.log(id);// then id print hoga.
        res.redirect("/posts");
});

//lekin hame apne browser se edit karna ho to ye.
app.get('/posts/:id/edit',(req,res)=>{
      let {id}=req.params;
       let post=posts.find((p)=>p.id===id);
      res.render("edit.ejs",{post});
});


//delete route
app.delete('/posts/:id',(req,res)=>{
    let {id}=req.params;    //id extract karte hai.
    posts=posts.filter((p)=>p.id!==id);   //id choose karte hai hai kis id ko delete karna hai.
    res.redirect("/posts");
});

app.listen(port,()=>{
    console.log("server running on port:8080");
});


//simple way under standing for mongodb conection.
const MONGO_URL = "mongodb+srv://prataprudrapratap07_db_user:CpA9amcrVI2bZZxD@cluster0.2up1kr4.mongodb.net/curd?retryWrites=true&w=majority";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));
