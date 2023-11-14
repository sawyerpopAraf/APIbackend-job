var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/middleware');
var jsend = require('jsend');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var db=require('../models')
var CategoryService = require("../services/categoryService");
var categoryService = new CategoryService(db);

router.use(jsend.middleware);

//create a new category
router.post('/',isAuth,jsonParser,async(req,res,next)=>{
 const userId=req.userData.id;
 const {name}=req.body;
  if(name==null){
    return res.jsend.fail({name:"Name is required."})
 }
 //to check if the category is already present
 const categories= await categoryService.getAll(userId)
 const categoryNames=categories.map((category)=>category.name)
    if(categoryNames.includes(name)){
        return res.jsend.fail({name:"Category already exists"})
    }
 //to create a new category
  await categoryService.creteCategory(name,userId).then((data)=>{
    res.jsend.success(data)
  }).catch((err)=>{
    res.jsend.error(err)
  })
})

//get all categories
router.get('/',isAuth,jsonParser,async(req,res,next)=>{
    const userId=req.userData.id;

    await categoryService.getAll(userId).then((data)=>{
        res.jsend.success(data)
    }).catch((err)=>{
        res.jsend.error(err)
    })   
})

//delete a category
router.delete('/:id', isAuth, jsonParser, async (req, res, next) => {
    const userId = req.userData.id;
    const categoryId = req.params.id;
    
    try {
        await categoryService.deleteCategory(categoryId, userId);
        res.jsend.success({ message: "Category deleted successfully" });
    } catch (err) {
        res.jsend.error(err.message);
    }
});


 //update a category
 router.put('/:id',isAuth,jsonParser,async(req,res,next)=>{
    const userId=req.userData.id
    const categoryId=req.params.id
    const{newName}=req.body

    if(newName==null){
        return res.jsend.fail({result:"newCategory is required."})
    }
    try{
        await categoryService.updateCategory(categoryId,newName,userId)
        res.jsend.success({message:"Category updated successfully"})
    }
    catch(err){
        res.jsend.error(err.message)
    }
})



module.exports = router;
    