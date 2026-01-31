const express=require('express');
const app=express();
const users=require('./routes/user.js');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const flash=require('connect-flash');
const { name } = require('ejs');
const path=require('path');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));


const sessionOptions={
    secret: 'mysupersecret',
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.get('/register',(req,res)=>{
  let {name='anonymos'}=req.query;
  req.session.name=name;
  req.flash('success','welcome to the site');
  res.redirect('/hello')
})


app.get('/hello', (req, res) => {
  const successMsg = req.flash('success');
  res.render('page.ejs', { 
    name: req.session.name,
    success: successMsg
  });
});

// app.get('/reqcount',(req,res)=>{
//   if( req.session.count){
//      req.session.count++;
//   }
//   else{
//     req.session.count=1;
   
//   }
//    res.send(`you sent a request ${req.session.count} times`);
// })

// app.get('/test',(req,res)=>{
//   res.send('test sucessful')
// })

app.listen(3000, () => {
  console.log("server started at port 3000");
});