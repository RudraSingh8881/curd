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

app.listen(port,()=>{
    console.log("server running on port:8080");
});