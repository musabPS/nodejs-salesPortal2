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
 const netsuiteConfigration = require('../models/netsuiteConfigrations')

 let accountSettings={}
 let url={}
 netsuiteConfigration().then(function(resp){ 
   accountSettings=resp[0]
   url=resp[1]
 
 })


router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

const authCheck = (req, res, next) => {
  if (! req.session.user_id) {
    return res.redirect('/login')

  }
   next()
}

router.get("/dropdownitems", (req,res)=>{
    // console.log("Req",req)


  
   var myRestlet = nsrestlet.createLink(accountSettings, url)

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


 
  var myRestlet = nsrestlet.createLink(accountSettings, url)

  myRestlet.get({type:'inventordetail',itemname:req.body.item}, function(error, body)
  {
    if (!error) {
     
   
    res.send(body)
    }

  });


})

router.get('/itemList', authCheck, async (req,res)=>{

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