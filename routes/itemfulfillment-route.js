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



module.exports = router