if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const data = require('./data.js')

// console.log(data)
let publicDirectoryPath = path.join(__dirname, './demo7/public')

const app = express()
app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'./demo7/views'))
app.use('/',express.static(path.join(__dirname, './demo7/public')))
app.use('/demo1',express.static(path.join(__dirname, './demo1/public')))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// app.use(express.static(publicDirectoryPath)) 



app.get('/', (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "partials/_content"
    res.render('index',{route})
})

app.get('/create-sales-order', (req,res)=>{
  //  app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/salesOrderForm"
    res.render('index', {route})
})
app.get('/sales-orders', (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/table"
    res.render('index', {route,data}) 
})
app.get('/view',async (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))

    let route = "pages/transaction"
    res.render('index', {route})
})
 
app.get('/sales-orders/:id', async (req,res)=>{
    app.use('/sales-orders',express.static(path.join(__dirname, './demo7/public')))
    var {id} = req.params
    let route = "pages/transaction"
    var salesOrderData = data.filter((el)=>{
        if(el._id == id){
            return el
        }
    })
    console.log("salesorder data", salesOrderData)
    res.render('index', {route,salesOrderData})
})

app.get('/sales-orders/:id/edit', async (req,res)=>{
    var {id} = req.params
    app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))

    let route = "pages/transaction"
    res.render('index', {route})
})
// app.put('/sales-orders/:id', async (req,res)=>{
//     var {id} = req.params
//     let route = "pages/salesOrderForm"
//     res.redirect(`/sales-orders/${campground._id}`)
// })

// app.delete('/sales-orders/:id',async(req,res)=>{
//     var {id} = req.params
//     res.redirect('/view')
// })





app.get('/demo1', (req,res)=>{
    app.set('views', path.join(__dirname,'./demo1/views'))
    res.render('index')
}) 
const port =  process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
}) 

