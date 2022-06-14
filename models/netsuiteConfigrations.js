const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const app = express()




  
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

const configration = require('../models/configration-model')

     async function getNetsuiteConfigrations () {
        try {
            var configArray=[]
            configrationData = await configration.findOne({companyId: 1})

           

            configArray.push({
                accountId: configrationData.accountId,
                tokenKey: configrationData.tokenKey,
                tokenSecret: configrationData.tokenSecret,
                consumerKey: configrationData.consumerKey,
                consumerSecret: configrationData.consumerSecret 
            })

            configArray.push({
                url: configrationData.restletUrl,
            })

          
          return configArray
        } catch (err) {
         console.log("Error",err);
        }
      }

module.exports = getNetsuiteConfigrations