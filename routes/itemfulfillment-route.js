const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
let nsrestlet = require('nsrestlet');
let moment = require('moment');
let request = require('request')
const FormData = require('form-data');
const fs = require('fs');
const invitmdata = require('../invoice_itemfulldata.js')
const masterdata = require('../masterdata.js')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))


app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

// const PurchaseRequests = require('../models/purchaseRequests')
 const ItemFulfillments = require('../models/itemFulfillments-model')

 const accountSettings = {
  accountId: "TSTDRV925863",
  tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
  tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
  consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
  consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6" };

  userid=1603

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)




router.get('/itemFrom&internalid=:id', (req,res)=>{

    var {id} = req.params
      console.log("Req",req.params)
  
      let route = "pages/itemForm"
      breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
      res.render('index', {route,breadcrumbs})

  }) 

  router.get('/itemfulfillments', async (req,res)=>{
    let route = "pages/itemfulfillment_table"
     console.log("invitmdata.itemfulfillments")

     tranData = await ItemFulfillments.find({})

     console.log(tranData[0])
     headerData=["IF#","Customer","Date","Quantity","Amount","Status","Action"]


    let listName  ="Item Fulfillment"
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
    res.render('index', {route,tranData,listName ,breadcrumbs,headerData,moment:moment}) 
})

router.get('/itemfulfillment&id=:id', async (req,res)=>{

    var {id} = req.params
    //app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
    console.log("Req",req.params)

    var urlSettings = {
      url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
 }
 var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

 myRestlet.get({type:'getItemfulfillmentHeaderData',orderId: id ,userid: userid}, function(error, body)
 {
   if (!error) {

    console.log("body", body.customerlist)
     body = JSON.parse(body)
     var header = JSON.parse(body.soHeaderInfo)
     console.log("body.soHeaderInfo",  header)

    header[0].values.trandate1=moment(new Date(header[0].values.trandate)).format("YYYY-MM-DD");
     let route = "pages/itemfulfillmentForm"
     let soHeader     = header
     let customerList = JSON.parse(body.customerlist)
     breadcrumbs=masterdata.Breadcrumbs.SOVIEW
     res.render('index', {route,soHeader,breadcrumbs,customerList})
   
   }

 });


})

router.post('/itemfulfillmentDetail&id=:id', async (req,res)=>{

  var {id} = req.params
  //app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
  console.log("itemfulfillmentDetail",req.params)

  var urlSettings = {
    url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
}
var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

myRestlet.get({type:'getItemfulfillmentItemDetail',orderId: id ,userid: userid}, function(error, body)
{
 if (!error) {

  console.log("itemDetail",body)
   res.send(body)
 
 }

});


})
router.post("/editItemfulfillmet_netsuite", (req,res)=>{

  console.log("Req","")
  console.log("Req",req.body)
 
 
  var urlSettings = {
    url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
  }
 var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)
 
 myRestlet.get({type:'edititemfulfillment',sodata: JSON.stringify(req.body)}, function(error, body)
 {
   if (!error) {
    
   console.log("saveid",body)
    res.send(body)
   }
 
 });
 
 
 })

module.exports = router