const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const Register=require('../model/db')
const Store=require('../model/store')
const bcrypt=require('bcrypt');
const db = require('../model/db');
const store = require('../model/store');
router.get("/test",(req,res)=>{
    res.send("handling requetst")
})
router.post('/register',(req,res)=>{
    Register.find({email:req.body.email})
      .exec()
      .then((user)=>{
          if(user.length>=1){
              console.log("user",user)
              return res.status(409).json({
                  messege:"user exists"
              })
          }else{
              bcrypt.hash(req.body.password,10,(err,hash)=>{
                  if (err){
                  res.status(500).json({
                  messege:"error while hasing",
                  error:err
                  })
                  console.log(err);
                  }else{
                      const registerUser=new Register({
                          _id:mongoose.Types.ObjectId(),
                          name:req.body.name,
                          email:req.body.email,
                          password:hash,
                       })
                       registerUser.save().then((result)=>{
                           console.log("resul",result)
                           res.status(200).json({
                              messege:"Registered",
                              data:registerUser
                          })
                       }).catch((err)=>{
                           res.status(500).json({
                               error:err
                           })
                       })
                  }
              })
          }
      })
     
  })
  router.post("/login",(req,res)=>{
    Register.findOne({email:req.body.email})
    .exec()
    .then(async user=>{
        console.log("user is",user)
        if(user.length<1){
         return res.status(401).json({
                messege:" user not found"
            })
        }
      const compare=await bcrypt.compare(req.body.password,user.password)
      try{
        if(compare){
            return res.status(200).redirect('/stores/view')
        }
      }catch(err){
           console.log("error in password",err)
      }
    })
    .catch(err=>{
        res.status(401).json({
            messege:"authentication failed",
            error:err
        })
    })
})
router.post("/newstore",(req,res)=>{
    Store.find({name:req.body.name})
    .exec()
    .then((store)=>{
        if(store.length>=1){
            return res.status(409).json({
                messege:"store exists",
            })
        }
        else{
            const bookies=req.body.books
            const registerStore=new Store({
                _id:mongoose.Types.ObjectId(),
                name:req.body.name,
                location:req.body.location,
                books:bookies
             })
             registerStore.save().then((result)=>{
                 console.log("resul",result)
                 res.status(200).json({
                    messege:"Registered",
                    data:registerStore
                })
             }).catch((err)=>{
                 res.status(500).json({
                     error:err,
                     messege:"error while store register"
                 })
             })
             }
        })
     })
     router.get('/stores/view',(req,res)=>{
        Store.find().then((mess)=>{
        console.log("mess",mess)
        res.status(200).json({
            messege:"sucess",
            data:mess
        })
        
    }).catch(err=>res.status(500).json({error:err}))    
})
router.patch('/store/update/:id',async(req,res)=>{
    console.log(req.params.id);
    try{
        const result=await Store.findById(req.params.id)
        console.log("result",result);
        console.log("body",req.body)
       if(req.body.name){
        result.name=req.body.name
        const value=await result.save()
        res.status(200).json({
            messege:"sucess",
            data:value
        })
       }else if(req.body.location){
        result.location=req.body.location
        const value=await result.save()
        res.status(200).json({
            messege:"sucess",
            data:value
        }) 
       }else{
        res.send("updated")
       }
      
    }catch(err){
        res.send("err")
        console.log(err)
    }
})
router.get('/store/:id/:bookid',async(req,res)=>{
    const store= await Store.findById(req.params.id)
    const books=store.books
    var newArray = books.filter(el=>
      { 
        return el._id===req.params.bookid
      })
      console.log("book found",newArray);
  })
router.patch("/books/update/:storeid/:bookid",async(req,res)=>{
    console.log("object",req.body);
try{
    const result=await Store.findById(req.params.storeid)
    const books=result.books
    var newArray = books.filter(el=>
      { 
        return el._id===req.params.bookid
      })
if(!req.body.stock){
    newArray[0].title=req.body.title
    const value=await result.save()
    res.status(200).json({
        messege:"sucess",
        data:value
    })
   }else if(!req.body.body){
    newArray[0].stock=req.body.stock
    const value=await result.save()
    res.status(200).json({
        messege:"sucess saved stocks",
        data:value
    })
   }
   else{
    newArray[0].title=req.body.title
    newArray[0].stock=req.body.stock
    const value=await result.save()
    res.status(200).json({
        messege:"sucess saved ",
        data:value
    }) 
   }
}catch(error){
    console.log("Errpr",error)
}
})
router.get("/getbooks/:storeid/:bookid/:stock",async(req,res)=>{
    const store= await Store.findById(req.params.storeid)
    const books=store.books
    var newArray = books.filter(el=>
      { 
        return el._id===req.params.bookid
      })
      if(newArray[0].stock===0){
         res.send("out of stock")
      }else if(newArray[0].stock<req.params.stock){
          res.send(`book only has ${newArray[0].stock}`)
      }
      else{
          res.send("success rented book")
          newArray[0].stock=newArray[0].stock-req.params.stock
          const value=await store.save()
          res.status(200).json({
              messege:"sucess saved ",
              data:value
          }) 
      }
})
// http://localhost:7005/getbooks/60d3256b1be0033d80a4c85f/bagId/2
module.exports=router