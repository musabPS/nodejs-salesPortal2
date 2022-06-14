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
  userId=1603

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)





  router.get('/itemfulfillments', authCheck,async (req,res)=>{
    let route = "pages/itemfulfillment_table"
     console.log("invitmdata.itemfulfillments")

     tranData = await ItemFulfillments.find({})

     console.log(tranData[0])
     headerData=["IF#","Customer","Date","Quantity","Amount","Status","Action"]


    let listName  ="Item Fulfillment"
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
    res.render('index', {route,tranData,listName ,breadcrumbs,headerData,moment:moment}) 
})

router.get('/itemfulfillment&id=:id', authCheck, async (req,res)=>{

    var {id} = req.params
    //app.use('/sales-orders/'+id ,express.static(path.join(__dirname, './demo7/public')))
    console.log("Req",req.params)

  
 var myRestlet = nsrestlet.createLink(accountSettings, url)

 myRestlet.get({type:'getItemfulfillmentHeaderData',orderId: id ,userId: userId}, function(error, body)
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


var myRestlet = nsrestlet.createLink(accountSettings, url)

myRestlet.get({type:'getItemfulfillmentItemDetail',orderId: id ,userId: userId}, function(error, body)
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
 
 
 
 var myRestlet = nsrestlet.createLink(accountSettings, url)
 
 myRestlet.get({type:'edititemfulfillment',sodata: JSON.stringify(req.body)}, function(error, body)
 {
   if (!error) {
    
   console.log("saveid",body)
    res.send(body)
   }
 
 });
 
 
 })

module.exports = router