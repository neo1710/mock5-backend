const express=require('express');
const connection = require('./db');
const UserModel = require('./models/UserModel');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');
const empRoute = require('./routes/employeesRoutes');
const cors=require('cors');

const app=express();
app.use(cors);
app.use(express.json());
app.use(empRoute);

app.get('/',(req,res)=>{
   res.status(200).send('homepage'); 
})

app.post('/signup',async(req,res)=>{
let {email,password,confirm}=req.body;
 try {
if(password!==confirm){
  res.status(400).send({msg:"confirm password again"});  
}else{
let check = await UserModel.findOne({email});
console.log(check);
if(check){
    res.status(400).send({msg:"user already exist"}); 
}else{
bcrypt.hash(password,5,async(err,hashed)=>{
   if(hashed){
     let user= new UserModel({email,password:hashed});
    await user.save();
    res.status(200).send({msg:"user has been added"});   
   }else{
    res.status(400).send({msg:"something went wrong"}); 
   }
})      
}
}    
} catch (error) {
 res.status(500).send('outer error');   
}
})

app.post('/login',async(req,res)=>{
    let {email,password}=req.body;
     try {
    let check = await UserModel.findOne({email});
    if(check){
    bcrypt.compare(password,check.password,async(err,same)=>{
       if(same){
        let token= jwt.sign({email,_id:check._id},'neo');
        res.status(200).send({msg:"user has been logged in",token});   
       }else{
        res.status(400).send({msg:"wrong password"}); 
       }
    })  
}else{
    res.status(400).send({msg:"user does not exist"});   
}       
    } catch (error) {
     res.status(500).send('outer error');   
    }
    })


app.listen(7000,async()=>{
    try {
        await connection;
        console.log('connected');
        console.log('running')
    } catch (error) {
        console.log(error);
    } 
})