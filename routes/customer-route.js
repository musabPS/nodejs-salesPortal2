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
const netsuiteConfigration = require('../models/netsuiteConfigrations')
const customer = require('../models/customer-model')


const accountSettings = {
  accountId: "TSTDRV925863",
  tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
  tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
  consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
  consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6" 
};

  
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



// const authCheck = (req, res, next) => {
//   if (!req.session.user_id) {
//     return res.redirect('/login')

//   }
//   next()
// }




router.post('/getcustomeraddress', async (req,res)=>{
    // app.set('views', path.join(__dirname,'./demo7/views'))
     var body = req.body
     console.log("req.body", body)

     

     var urlSettings = {
      url: netsuiteConfigration[1]
   }
   var myRestlet = nsrestlet.createLink(netsuiteConfigration[0], netsuiteConfigration[1])

   myRestlet.get({customerid: req.body.customername ,type:'getcustomeraddress'}, function(error, body)
   {
     if (!error) {
         console.log("message", body)
    
     res.send(body)
     }

   });

   //  res.render('index', {route,breadcrumbs})
  })


 router.get('/customerlist', async(req,res)=>{
   let route = "pages/customertable"
    let type="customerlist"

    console.log("netsuiteConfigration", netsuiteConfigration)


    customerList = await customer.find({})
    console.log(customerList)

      let customerData=customerList
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