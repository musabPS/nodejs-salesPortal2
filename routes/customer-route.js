const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');
let request = require('request')
const app = express()
const FormData = require('form-data');
const fs = require('fs');
var stream = require('stream');

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
const invitmdata = require('../invoice_itemfulldata.js')
const masterdata = require('../masterdata.js')
const customer = require('../models/customer-model')
const netsuiteConfigration = require('../models/netsuiteConfigrations')


let accountSettings={}
let url={}
netsuiteConfigration().then(function(resp){ 
  accountSettings=resp[0]
  url=resp[1]

})

 



app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

// const Invoice = require('../models/invoices-model')
// const ItemFulfillments = require('../models/itemFulfillments-model')

//const PurchaseRequests = require('../models/purchaseRequests')
// const ItemFulfillments = require('../models/itemFulfillments')
// const Invoices = require('./models/invoices')


router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)



const authCheck = (req, res, next) => {
  if (! req.session.user_id) {
    return res.redirect('/login')

  }
   next()
}




router.post('/getcustomeraddress', async (req,res)=>{
    // app.set('views', path.join(__dirname,'./demo7/views'))
     var body = req.body
     console.log("req.body", body)

   var myRestlet = nsrestlet.createLink(accountSettings, url)

   myRestlet.get({customerid: req.body.customername ,type:'getcustomeraddress'}, function(error, body)
   {
     if (!error) {
         console.log("message", body)
    
     res.send(body)
     }

   });

   //  res.render('index', {route,breadcrumbs})
  })


 router.get('/customerlist', authCheck,async (req,res)=>{
   let route = "pages/customertable"
    let type="customerlist"

    console.log("req.session.user_id",req.session.user_id)

    customerData = await customer.find({salePersonId:req.session.user_id})
    console.log("data",customerData)


      breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
    res.render('index', {route,customerData,type,breadcrumbs}) 
})
router.get('/customerrequestlist', (req,res)=>{
   let route = "pages/customertable"
    let type="customerrequest"
    let customerData=masterdata.Customers
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
   res.render('index', {route,customerData,type,breadcrumbs}) 
})



module.exports = router