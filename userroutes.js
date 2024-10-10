const express=require('express');
const mongoose=require('mongoose');
const user=require("../models/usermodel");
const router=express.router();
router.get("/",(req,res)=>{
    res.render('index', { data });

});