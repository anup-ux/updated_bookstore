const mongoose=require('mongoose')

// const booksSchema=mongoose.Schema({
   
// })
const storeSchema=mongoose.Schema ({
    _id:mongoose.Types.ObjectId,
    name:{type:String,required:true},
    location:{type:String,required:true},
    books:[{
        _id:{type:String,required:true},
        title:{type:String,required:true},
        stock:{type:Number,required:true},
        Author:{type:String,required:true},
    }]
})
module.exports=mongoose.model('Store',storeSchema)
