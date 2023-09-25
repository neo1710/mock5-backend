const {Router}=require('express');
const EmployeeModel = require('../models/employeesModel');

const empRoute=Router();

empRoute.post('/employees',async(req,res)=>{
    let employee=req.body;
    try {
      let newData=new EmployeeModel(employee);
      await newData.save()  
      res.status(200).send({msg:"employee has been added"}); 
    } catch (error) {
        res.status(500).send('outer error');      
    }
})

empRoute.delete('/employees/:id',async(req,res)=>{
    let {id}=req.params;
    try {
      await EmployeeModel.findByIdAndDelete(id);
      res.status(200).send({msg:"employee has been deleted"}); 
    } catch (error) {
        res.status(500).send('outer error');      
    }
})

empRoute.patch('/employees/:id',async(req,res)=>{
    let {id}=req.params;
    try {
      await EmployeeModel.findByIdAndUpdate(id,req.body);
      res.status(200).send({msg:"employee has been updated"}); 
    } catch (error) {
        res.status(500).send('outer error');      
    }
})

empRoute.get('/employees',async(req,res)=>{
    // let {limit,department}=req.query;
    try {
      let Data=await EmployeeModel.find();
      res.status(200).send({data:Data}); 
    } catch (error) {
        res.status(500).send('outer error');      
    }
})


module.exports=empRoute;