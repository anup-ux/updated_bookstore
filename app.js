const express=require('express')
const routes=require('./routes/routes')
const mongoose=require('mongoose')
const app=express()
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
mongoose.connect('mongodb+srv://Anup:123456Anup@cluster0.44kgf.mongodb.net/bookstore?retryWrites=true&w=majority',
 { useNewUrlParser: true,useUnifiedTopology: true,useUnifiedTopology: true,useCreateIndex: true,useNewUrlParser: true })
app.use('/',routes)
app.listen(7005, () => {
    console.log("listening at 7005")
})