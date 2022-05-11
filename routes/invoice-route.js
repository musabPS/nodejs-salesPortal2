const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');
const app = express()
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
const invitmdata = require('../invoice_itemfulldata.js')
const masterdata = require('../masterdata.js')
const invoice=require('../models/invoice-model')

app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)



router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

// const authCheck = (req, res, next) => {
//   if (!req.session.user_id) {
//     return res.redirect('/login')

//   }
//   next()
// }




router.get('/invoices', async (req,res)=>{
  let route = "pages/invoice_table"
   
  headerData=["Invoice#","Customer","Date","Quantity","Amount","Status"]

  let tranData = await invoice.find({})
   let listName ="Invoice"
  let itmdata=invitmdata.invoice
  breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs

  res.render('index', {route,tranData,listName ,breadcrumbs,headerData,moment:moment}) 
})







module.exports = router