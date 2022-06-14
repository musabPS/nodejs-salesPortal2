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
const netsuiteConfigration = require('../models/netsuiteConfigrations')


let accountSettings={}
let url={}
let userId
netsuiteConfigration().then(function(resp){ 
  accountSettings=resp[0]
  url=resp[1]

})



const authCheck = (req, res, next) => {
  if (! req.session.user_id) {
    return res.redirect('/login')

  }
  else
  {
    userId=req.session.user_id
  }
   next()
}

  const userid=1603

router.get('/sales-orders', authCheck,async (req,res)=>{

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

router.get('/create-sales-order', authCheck,(req,res)=>{
  //  app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/salesOrderForm"


   
   var myRestlet = nsrestlet.createLink(accountSettings, url)

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

router.get('/sales-orders&id=:id', authCheck, async (req,res)=>{
  var {id} = req.params
  app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
  console.log("Req",req.params)

 
 var myRestlet = nsrestlet.createLink(accountSettings, url)

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

router.post('/sales-orders/:id/itemdetail',  async (req,res)=>{
var {id} = req.params
app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
console.log("Reqgg",req.params)


var myRestlet = nsrestlet.createLink(accountSettings, url)

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



var myRestlet = nsrestlet.createLink(accountSettings, url)

myRestlet.get({type:'createSaleOrder',sodata: JSON.stringify(req.body)}, function(error, body)
{
  if (!error)
   {
   
   console.log("createSaleOrder_netsuite",body)
   res.send(JSON.stringify(body))
   //res.sendStatus(status)
  }

});


})
router.post("/editSaleOrder_netsuite", (req,res)=>{

  console.log("Req","")
  console.log("Req",req.body)
 
 
 
 var myRestlet = nsrestlet.createLink(accountSettings, url)
 
 myRestlet.get({type:'editSaleOrder',sodata: JSON.stringify(req.body)}, function(error, body)
 {
   if (!error) {
    
   console.log("saveid",body)
    res.send(body)
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