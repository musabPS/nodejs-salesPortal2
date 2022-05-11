const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
var session = require('express-session')
const bodyParser = require('body-parser');
const app = express()
const masterdata = require('../masterdata')
var nsrestlet = require('nsrestlet');
var moment = require('moment');


app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use('/', express.static(path.join(__dirname, './public')))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)
const SaleOrder = require('../models/sale-order-model')
const accountSettings = {
  accountId: "TSTDRV925863",
  tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
  tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
  consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
  consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6" };


app.use(session({
  secret: "key",
}))


  const userid=1603

router.get('/sales-orders', async (req,res)=>{

  try
  {

    app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/transactionTable"
    var data = []
    var tranData = []
  
  
     headerData=["SO#","Customer","Date","Quantity","Amount","Status","Action"]
     breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
     type="summary"
     listName="Sale Order"
  
     tranData = await SaleOrder.find({})

        console.log(tranData)
        console.log(tranData[0].customerName)
        
     res.render('index', {route,headerData,type,breadcrumbs,tranData,listName,moment: moment}) 
  
  
  }

  catch(e)
  {
    console.log(e)
  }
  

  
 //   var urlSettings = {
 //      url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
 //   }
 //   var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)
 //  // var body = req.body
 //   console.log("req.body", req.body)
 //   myRestlet.get({userid: userid, type:'getsaleorderlist'}, function(error, body)
 //    {
 //      if (!error) {

 //       //   console.log("message", JSON.parse(body))
 //            tranData=JSON.parse(body)
 //            console.log("messaged1")
 //            console.log("message", tranData[0].values)
   
 //      headerData=["S#","SO #","Date","Quantity","Amount","Action"]
 //      breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
 //      type="summary"
 //      listName="Sale Order"

 //       res.render('index', {route,headerData,type,breadcrumbs,tranData,listName}) 

 //      }

 //    });

      

})

router.get('/create-sales-order', (req,res)=>{
  //  app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/salesOrderForm"


    var urlSettings = {
      url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
   }
   var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

   myRestlet.get({userid: userid ,type:'getcustomerdropdown'}, function(error, body)
   {
     if (!error) {
      //   console.log("message", JSON.parse(body))
           createDataLoad=JSON.parse(body)
         //   console.log("messaged1")
         //   console.log("message", createDataLoad)
         //   console.log("messaged2")
     //     console.log("message", data2[0])
     customerData     = JSON.parse(createDataLoad.customerlist)

     breadcrumbs=masterdata.Breadcrumbs.SOVIEW
      res.render('index', {route,customerData,breadcrumbs}) 
     }

   });

 })

 router.post("/getsaleorder", (req,res)=>{   //get data from ajax
  console.log("Req",req.body)
  req.body._id=getNextId(data)
  req.body.tranid="SO"+req.body._id
//  console.log("fnalreq.body",req.body);
  data.push(req.body)
 // res.redirect('/sales-orders/'+req.body._id)
  res.send(data)
})

router.get('/sales-orders/:id', async (req,res)=>{
  app.use('/sales-orders',express.static(path.join(__dirname, './demo7/public')))
  var {id} = req.params
  let route = "pages/transaction"

  salesOrderData = await SaleOrder.findOne({internalId: parseInt(id)})
  console.log(salesOrderData)

  breadcrumbs=masterdata.Breadcrumbs.SOVIEW
 // console.log("salesorder data", salesOrderData)
  res.render('index', {route,salesOrderData,breadcrumbs})
})

router.get('/sales-orders&id=:id', async (req,res)=>{
  var {id} = req.params
  app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
  console.log("Req",req.params)

  var urlSettings = {
    url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
 }
 var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

 myRestlet.get({type:'getSOHeaderData',orderId: id ,userid: userid}, function(error, body)
 {
   if (!error) {

     body = JSON.parse(body)
     body.soHeaderInfo[0].values.trandate1=moment(new Date(body.soHeaderInfo[0].values.trandate)).format("YYYY-MM-DD");
     console.log("saveid", body.soHeaderInfo)
     let route = "pages/transaction"
     let soHeader     = body.soHeaderInfo
     let customerList = JSON.parse(body.customerlist)
     breadcrumbs=masterdata.Breadcrumbs.SOVIEW
     res.render('index', {route,soHeader,breadcrumbs,customerList})
   
   }

 });


})

router.post('/sales-orders/:id/itemdetail', async (req,res)=>{
var {id} = req.params
app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
console.log("Reqgg",req.params)

var urlSettings = {
  url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
}
var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

myRestlet.get({type:'itemDetail',orderId: id}, function(error, body)
{
 if (!error) {
   console.log("itemDetail",body)
   res.send(body)
 }

});


})

router.post("/createSaleOrder_netsuite", (req,res)=>{
 console.log("Req",req.body)


 var urlSettings = {
   url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
 }
var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

myRestlet.get({type:'createSaleOrder',sodata: JSON.stringify(req.body)}, function(error, body)
{
  if (!error) {
   
  console.log("saveid",body)
   //res.send(body)
  }

});


})

router.get('/sales-orders-detail', (req,res)=>{
  // app.set('views', path.join(__dirname,'./demo7/views'))
   let route = "pages/table"
  // console.log("trandata",data)
   headerData=["S#","SO #","Customer","Location","Date","Quantity","Amount","Action"]
   type="detail"
   res.render('index', {route,data,headerData,type}) 
})

function getNextId(obj) {
 return (Math.max.apply(Math, obj.map(function(o) {
   return o._id;
 })) + 1)
}


module.exports = router