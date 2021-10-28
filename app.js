if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
let publicDirectoryPath = path.join(__dirname, './demo7/public')

const app = express()
app.set('view engine', 'ejs')
//app.set('views', path.join(__dirname,'./demo7/views'))
app.use('/demo7',express.static(path.join(__dirname, './demo7/public')))
app.use('/demo1',express.static(path.join(__dirname, './demo1/public')))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// app.use(express.static(publicDirectoryPath)) 



app.get('/demo7', (req,res)=>{
    app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "partials/_content"
    res.render('index',{route})
})

app.get('/demo7/create-sales-order', (req,res)=>{
    app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/salesOrderForm"
    res.render('index', {route})
})
app.get('/demo7/sales-orders', (req,res)=>{
    app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/table"
    res.render('index', {route})
})
app.get('/demo1', (req,res)=>{
    app.set('views', path.join(__dirname,'./demo1/views'))
    res.render('index')
}) 
const port =  process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
}) 

