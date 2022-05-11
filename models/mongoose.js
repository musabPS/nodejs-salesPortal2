const mongoose = require('mongoose')
//const validator= require('validator')
const mongodbLocal = 'mongodb://localhost:27017/sale-portal-app'
const mongodbAtlas = 'mongodb+srv://pointstar:poinstar123@cluster0.nenzn.mongodb.net/sale-portal-app?retryWrites=true&w=majority'


mongoose.connect( mongodbAtlas ,{
    useNewUrlParser:true,

}).then(()=>{
    console.log("Mongo connection open")

})
.catch(err=>{
    console.log(err)
})
var db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB connection error:'))

