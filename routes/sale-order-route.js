const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
var request = require('request')
var session = require('express-session')
const bodyParser = require('body-parser');
const app = express()
const masterdata = require('../masterdata')

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use('/', express.static(path.join(__dirname, './public')))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)
const saleOrder = require('../models/sale-order-model')

app.use(session({
  secret: "key",
}))




router.get('/sales-orders', async (req,res)=>{
  
  app.set('views', path.join(__dirname,'./demo7/views'))
  let route = "pages/transactionTable"
  var data = []
  var tranData = []


   headerData=["S#","SO #","Date","Quantity","Amount","Action"]
   breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
   type="summary"
   listName="Sale Order"

   data = await saleOrder.find({})

   console.log("data",data)
      
   res.render('index', {route,headerData,type,breadcrumbs,tranData,listName}) 
  
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


  //  breadcrumbs=masterdata.Breadcrumbs.SOVIEW
    //res.render('index', {route,breadcrumbs})
 })


module.exports = router