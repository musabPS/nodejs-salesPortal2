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
const accountSettings = {
  accountId: "TSTDRV925863",
  tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
  tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
  consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
  consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6" };

app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

 const Item = require('../models/items-model')



router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

// const authCheck = (req, res, next) => {
//   if (!req.session.user_id) {
//     return res.redirect('/login')

//   }
//   next()
// }

router.get("/dropdownitems", (req,res)=>{
    // console.log("Req",req)


    var urlSettings = {
      url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
   }
   var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

   myRestlet.get({type:'getitemlist'}, function(error, body)
   {
     if (!error) {
         console.log("message", body)
    
     res.send(body)
     }

   });

 })

 router.post("/inventordetail", (req,res)=>{
   console.log("Req",req.body)


   var urlSettings = {
     url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=432&deploy=1'
  }
  var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)

  myRestlet.get({type:'inventordetail',itemname:req.body.item}, function(error, body)
  {
    if (!error) {
     
   
    res.send(body)
    }

  });


})

router.get('/itemList', async (req,res)=>{

  let route = "pages/itemTable"
  let type="itemList"
  itemData = await Item.find({})

  console.log(itemData)
 let listName  ="Items"

 itemDataLength = itemData.length
 breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs

 res.render('index', {route,type,breadcrumbs,itemData,itemDataLength}) 

}) 

router.post("/search_items", async (req,res)=>{

  console.log("Req","")
  console.log("Req",req.body)
  var filterObject=req.body

   itemData = await Item.find(filterObject).lean()

   console.log(itemData)
  let listName  ="Items"

   itemDataLength = itemData.length
    res.send(itemData)

 })


 router.get('/itemFrom&internalid=:id', (req,res)=>{

  var {id} = req.params
    console.log("Req",req.params)

    let route = "pages/itemForm"
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
    res.render('index', {route,breadcrumbs})

}) 

module.exports = router