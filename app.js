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
var nsrestlet = require('nsrestlet');

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
   // next()
 }

 app.get('/login', (req,res)=>{
    res.render("pages/login")
   //  res.render('login')
 })

 app.post('/login',async (req,res)=>{
    let credentials = { username:"musab@point-star.com", password:"1" }
    console.log("post route history", req.body )
    const {username, password}=req.body 
   // const user= await User.findOne({username})
   // console.log("post route history", user )
   if(req.body.username==credentials.username && req.body.password == credentials.password){
       console.log("ifff")
       req.user = "musab"
       let route = "partials/_content"
       type="detail"
       breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
        res.render('index',{route,data,type,breadcrumbs})
   // res.redirect("index")
   }
    else{
       let message =  "Username or password is incorrect"
        res.send(message)
   }
 })

  app.get('/signout',async (req,res)=>{

    req.user = "";
   res.redirect("/login")
 })

 app.get('/', (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "partials/_content"
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
    type="detail"
    res.render('index',{route,breadcrumbs,type,data})
 })

 app.get('/create-sales-order', (req,res)=>{
  //  app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/salesOrderForm"
    breadcrumbs=masterdata.Breadcrumbs.SOVIEW
    res.render('index', {route,breadcrumbs})
 })

 app.get('/create-sales-order/:name', (req,res)=>{
    // app.set('views', path.join(__dirname,'./demo7/views'))
    var {name} = req.params
    console.log("param",name)
    app.use('/create-sales-order/' ,express.static(path.join(__dirname, './demo7/public')))
  
     let route = "pages/salesOrderForm"
     console.log("param",req.params)
     breadcrumbs=masterdata.Breadcrumbs.SOCreateBYCustomer
     res.render('index', {route,breadcrumbs})
  })

 app.get('/sales-orders', (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))
   //  let route = "pages/table"
   // // console.log("trandata",data)
   //  headerData=["S#","SO #","Date","Quantity","Amount","Action"]
   //  type="summary"
   //  breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
   //  res.render('index', {route,data,headerData,type,breadcrumbs}) 

   app.set('views', path.join(__dirname,'./demo7/views'))
   let route = "pages/table"
   console.log(data)  
 //  console.log("body parser from app script",req.body)
    let  data2=""
   var accountSettings = {
       accountId: "TSTDRV925863",
       tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
       tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
       consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
       consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6" };
    var urlSettings = {
       url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
    }
    var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)
   // var body = req.body
    console.log("req.body", req.body)
    myRestlet.get({userid: 'getSOTest'}, function(error, body)
     {
       if (!error) {

        //   console.log("message", JSON.parse(body))
             tranData=JSON.parse(body)
            console.log("messaged1")
            console.log("message", tranData[0].values)
            console.log("messaged2")
       //     console.log("message", data2[0])
       headerData=["S#","SO #","Date","Quantity","Amount","Action"]
       breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
       type="summary"

        res.render('index', {route,tranData,headerData,type,breadcrumbs}) 
         //  res.render('index', {route,tranData})
          
           //res.send("OK")
       }
      // console.log("erorr", error);
      // res.send("There was an error")
     });

 })
 app.get('/sales-orders-detail', (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/table"
   // console.log("trandata",data)
    headerData=["S#","SO #","Customer","Location","Date","Quantity","Amount","Action"]
    type="detail"
    res.render('index', {route,data,headerData,type}) 
 })

 app.get('/customerlist', (req,res)=>{
   let route = "pages/customertable"
  let type="customerlist"
    let customerData=masterdata.Customers
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
   res.render('index', {route,customerData,type,breadcrumbs}) 
})
app.get('/customerrequestlist', (req,res)=>{
   let route = "pages/customertable"
    let type="customerrequest"
    let customerData=masterdata.Customers
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
   res.render('index', {route,customerData,type,breadcrumbs}) 
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
     breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
     res.render('index', {route,itmdata,trantype,breadcrumbs}) 
 })
 app.get('/invoices', (req,res)=>{
    let route = "pages/itemfulfillment_table"
     
     let trantype="Invoice"
    let itmdata=invitmdata.invoice
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs

    res.render('index', {route,itmdata,trantype,breadcrumbs}) 
 })

 //////////////////////...data s......////////////////////
 app.get("/data", (req,res)=>{
    // console.log("Req",req)
     res.send(masterdata)
     //return masterdata
 })

 app.post("/getsaleorder", (req,res)=>{   //get data from ajax
     console.log("Req",req.body)
     req.body._id=getNextId(data)
     req.body.tranid="SO"+req.body._id
   //  console.log("fnalreq.body",req.body);
     data.push(req.body)
    // res.redirect('/sales-orders/'+req.body._id)
     res.send(data)
 })
 function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function(o) {
      return o._id;
    })) + 1)
 }
  ///////////////////////////------------------saleorder view Start--------------/////////////////
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
    breadcrumbs=masterdata.Breadcrumbs.SOVIEW
   // console.log("salesorder data", salesOrderData)
    res.render('index', {route,itemdata,salesOrderData,breadcrumbs})
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
   // console.log("salesorder data", salesOrderData)
     itemdata=salesOrderData[0].items
   // console.log("salesorder data", salesOrderData)
 
    res.render('index', {route,itemdata,salesOrderData,breadcrumbss})
 })

  /////////////////////////------------------saleorder view End--------------/////////////////

 app.post('/editsaleorder',async (req,res)=>{
   console.log("post route historyeqqweww", req.body)
   var index=0
   var tranid=req.body.tranid
   tranid=tranid.replace(/ /g, '');
   req.body.tranid=tranid
   console.log("tranid", tranid)
      for(var i=0; i<data.length;i++)
      {
         if(data[i].tranid==tranid)
         {
            index=i
         }
      }
      tranidstr=req.body.tranid
      tranidstr = tranidstr.replace(/\s/g, '');

      req.body._id=parseInt(tranidstr.substring(2))
      data[index]=req.body
     console.log("edit",data[index])
     return true
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
    breadcrumbs=masterdata.Breadcrumbs.SOVIEW
    res.render('index', {route,salesOrderData,itemdata,breadcrumbs})
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

