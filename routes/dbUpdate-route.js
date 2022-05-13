const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');
var request = require('request')
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

//const itemFulfillments = require('../models/itemFulfillments-model')
const saleorders= require('../models/sale-order-model')
const itemFulfillments = require('../models/itemFulfillments-model')
const invoices =  require('../models/invoice-model')
const customers =  require('../models/customer-model')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)


router.post('/createSaleOrderMongo', async (req, res) => {
    try {
        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]
        const saleorder = new saleorders(obj)
        await saleorder.save();

        console.log("objId", saleorder.id)

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Create",
            mongoObjId: saleorder.id
        }

        console.log("mongoo data hit");

        res.send(JSON.stringify(response)) 
    }
    catch (e) {
        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: false,
            currentDateTime: currentDateTime,
            type: "Create",
            error: e

        }


        res.send(JSON.stringify(response))


        console.log(e)
    }

})

router.post('/updateSaleOrderMongo', async (req, res) => {
    var data = []
    try {

        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]

        const filter = { internalId: obj.internalId };
        console.log("checkresponce ", filter)
        delete obj.internalId;


        data = saleorders.updateOne(filter, obj, function (err, res) {
            if (err) throw err;
            console.log("1 document update", res);
            responceData = res

            console.log("checkresponce ", data)
        });

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Update"

        }


        res.send(JSON.stringify(response))
    }
    catch (e) {

        let response = {
            success: false,
            type: "Update",
            error: e
        }

        res.send(JSON.stringify(response))
    }
})


// router.post('/DeletePurchaseRequest', async (req, res) => {
//     var data = []
//     try {

//         console.log("reg", req.body)
//         var obj = req.body.netsuiteData[0]

//         const filter = { internalId: obj.internalId };
//         console.log("checkresponce ", filter)
//         // delete obj.internalId;


//         // data = PurchaseRequests.updateOne(filter, obj, function (err, res) {
//         //     if (err) throw err;
//         //     console.log("1 document update", res);
//         //     responceData = res

//         //     console.log("checkresponce ", data)
//         // });

//          // Delete the document by its _id
//         await PurchaseRequests.deleteOne({ internalId : internalId });

//         res.send()
//     }
//     catch (e) {

//         // let response = {
//         //     success: false,
//         //     type: "Delete",
//         //     error: e
//         // }

//         res.send(JSON.stringify("Error Delete!"))
//     }
// })


router.post('/createItemFulfillmentsMongo', async (req, res) => {
    try {
        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]
        const itemFulfillment = new itemFulfillments(obj)
        await itemFulfillment.save();

        console.log("objId", itemFulfillment.id)

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Create",
            mongoObjId: itemFulfillment.id
        }

        console.log("mongoo data hit");

        res.send(JSON.stringify(response)) 
    }
    catch (e) {
        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: false,
            currentDateTime: currentDateTime,
            type: "Create",
            error: e

        }


        res.send(JSON.stringify(response))


        console.log(e)
        
    }

})



router.post('/updateItemFulfillmentsMongo', async (req, res) => {
    var data = []
    try {

        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]

        const filter = { internalId: obj.internalId };
        console.log("checkresponce ", filter)
        delete obj.internalId;


        data = itemFulfillments.updateOne(filter, obj, function (err, res) {
            if (err) throw err;
            console.log("1 document update", res);
            responceData = res

            console.log("checkresponce ", data)
        });

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Update"

        }


        res.send(JSON.stringify(response))
    }
    catch (e) {

        let response = {
            success: false,
            type: "Update",
            error: e
        }

        res.send(JSON.stringify(response))
    }
})




router.post('/createInvoiceMongo', async (req, res) => {
    try {
        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]
        const invoice = new invoices(obj)
        await invoice.save();

        console.log("objId", invoice.id)

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Create",
            mongoObjId: invoice.id
        }

        console.log("mongoo data hit");

        res.send(JSON.stringify(response)) 
    }
    catch (e) {
        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: false,
            currentDateTime: currentDateTime,
            type: "Create",
            error: e

        }


        res.send(JSON.stringify(response))


        console.log(e)
        
    }

})


router.post('/updateInvoiceMongo', async (req, res) => {
    var data = []
    try {

        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]

        const filter = { internalId: obj.internalId };
        console.log("checkresponce ", filter)
        delete obj.internalId;


        data = invoices.updateOne(filter, obj, function (err, res) {
            if (err) throw err;
            console.log("1 document update", res);
            responceData = res

            console.log("checkresponce ", data)
        });

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Update"

        }


        res.send(JSON.stringify(response))
    }
    catch (e) {

        let response = {
            success: false,
            type: "Update",
            error: e
        }

        res.send(JSON.stringify(response))
    }
})



router.post('/createCustomerMongo', async (req, res) => {
    try {
        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]
        const customer = new customers(obj)
        await customer.save();

        console.log("objId", customer.id)

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Create",
            mongoObjId: customer.id
        }

        console.log("mongoo data hit");

        res.send(JSON.stringify(response)) 
    }
    catch (e) {
        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: false,
            currentDateTime: currentDateTime,
            type: "Create",
            error: e

        }


        res.send(JSON.stringify(response))


        console.log(e)
        
    }

})


router.post('/updateCustomerMongo', async (req, res) => {
    var data = []
    try {

        console.log("reg", req.body)
        var obj = req.body.netsuiteData[0]

        const filter = { internalId: obj.internalId };
        console.log("checkresponce ", filter)
        delete obj.internalId;


        data = customers.updateOne(filter, obj, function (err, res) {
            if (err) throw err;
            console.log("1 document update", res);
            responceData = res

            console.log("checkresponce ", data)
        });

        let currentDate = new Date()
        let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
        let response = {
            success: true,
            currentDateTime: currentDateTime,
            type: "Update"

        }


        res.send(JSON.stringify(response))
    }
    catch (e) {

        let response = {
            success: false,
            type: "Update",
            error: e
        }

        res.send(JSON.stringify(response))
    }
})


// router.post('/createpayment',async(req,res)=>{

//     try {

//         console.log("reg", req.body)
//         var obj = req.body.netsuiteData[0]

//         const bill = new payments(obj)
//         await bill.save();

//         console.log("objId", bill._id)

//          let currentDate = new Date()
//          let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
//          let response = {
//             success: true,
//             currentDateTime: currentDateTime,
//             type: "Create",
//             mongoObjId: bill._id

//         }


//         res.send(JSON.stringify(response))
//     }
//     catch (e) {
//         let currentDate = new Date()
//         let currentDateTime = moment(currentDate).format('MM/DD/YYYY hh:mm:ss A');
//         let response = {
//             success: false,
//             currentDateTime: currentDateTime,
//             type: "Create",
//             error: e

//         }


//         res.send(JSON.stringify(response))


//         console.log(e)
//     }
 

// })


module.exports = router