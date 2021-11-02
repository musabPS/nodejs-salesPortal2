if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const data = require('./data.js')
const masterdata = require('./masterdata.js')
const invitmdata = require('./invoice_itemfulldata.js')
const bodyParser = require('body-parser');
// console.log(data)
let publicDirectoryPath = path.join(__dirname, './demo7/public')

const app = express()
app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'./demo7/views'))
app.use('/',express.static(path.join(__dirname, './demo7/public')))
app.use('/demo1',express.static(path.join(__dirname, './demo1/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// app.use(express.static(publicDirectoryPath)) 

const authCheck = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    next()
}

app.get('/login', (req,res)=>{
    res.render("pages/login")
   //  res.render('login')
 })

app.post('/login', (req,res)=>{
    let credentials = { username:"jasim@point-star.com", password:"jasim" }
    console.log("post route history", req.body )
   if(req.body.username==credentials.username && req.body.password == credentials.password){
       console.log("ifff")
       req.user = "Jasim"
       let route = "partials/_content"
       res.render('index',{route})
   }
   else{
       let message =  "Username or password is incorrect"
       res.render('login',{message})
   }
   
})

app.get('/',authCheck, (req,res)=>{
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
   // console.log("trandata",data)
    res.render('index', {route,data}) 
})
app.get('/view',async (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))

    let route = "pages/transaction"
    res.render('index', {route})
})

app.get('/itemfulfillments', (req,res)=>{
     let route = "pages/itemfulfillment_table"
      console.log("invitmdata.itemfulfillments")
     let itmdata=invitmdata.itemfulfillments
     let trantype="Item Fulfillment"
     res.render('index', {route,itmdata,trantype}) 
 })
 app.get('/invoices', (req,res)=>{
    let route = "pages/itemfulfillment_table"
     
     let trantype="Invoice"
    let itmdata=invitmdata.invoice
    res.render('index', {route,itmdata,trantype}) 
})

//////////////////////...data s......////////////////////
app.get("/data", (req,res)=>{
    // console.log("Req",req)
     res.send(masterdata)
 })

 app.post("/getsaleorder", (req,res)=>{   //get data from ajax
     //console.log("Req",req.body)
     req.body._id=getNextId(data)
     
     req.body.tranid="SO_"+req.body._id
   //  console.log("fnalreq.body",req.body);
     data.push(req.body)
     res.send(data)
 })
 function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function(o) {
      return o._id;
    })) + 1)
 }
 
app.get('/sales-orders/:id', async (req,res)=>{
    app.use('/sales-orders',express.static(path.join(__dirname, './demo7/public')))
    var {id} = req.params
    let route = "pages/transaction"
    var salesOrderData = data.filter((el)=>{
        if(el._id == id){
            return el
        }
    })
   // console.log("salesorder data", salesOrderData)
     itemdata=salesOrderData[0].items
   // console.log("salesorder data", salesOrderData)
    res.render('index', {route,itemdata,salesOrderData})
})

app.get('/sales-orders/:id/edit', async (req,res)=>{
    var {id} = req.params
    app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))

    var salesOrderData = data.filter((el)=>{
        if(el._id == id){
            return el
        }
    })

    itemdata=salesOrderData[0].items
    let route = "pages/transaction"
    res.render('index', {route,salesOrderData,itemdata})
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

const port =  process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
}) 

