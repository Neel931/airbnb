const express=require('express');
const router=express.Router();

//indddex  user route
router.get('/users',(req,res)=>{
    res.send("hi i am users");
});

// show route
router.get('/users/:id',(req,res)=>{
    res.send("hi i am  show users");
});

// post route
router.post('/users',(req,res)=>{
    res.send("post user created");
});

router.delete('/users/:id',(req,res)=>{
    res.send("user deleted");
});

module.exports=router;
