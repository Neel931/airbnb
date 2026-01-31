const express=require('express');
const app=express();




// post:
// index route
app.get('/posts',(req,res)=>{
    res.send("hi i am posts");
});

// show route
app.get('/posts/:id',(req,res)=>{
    res.send("hi i am  show posts");
});

// post route
app.post('/posts',(req,res)=>{
    res.send("post user posts");
});

app.delete('/posts/:id',(req,res)=>{
    res.send("user delete posts");
});

app.listen(3000,()=>{
    console.log("server started at port 3000")
});
