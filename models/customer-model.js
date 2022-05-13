const mongoose = require("mongoose")

const customersSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    customerName:{
        type:String,
        trim:true
    },
    shippingAddress:{
        type:String
    },
    billingAddress:{
        type:String
    },
     date:{
         type: Date
     },
    
     category:{
         type:String,
         trim:true
     },
     
     syncStatus:{
         type:Number,
         trim:true
     },
     lineItems:{
         type:Array
     }
})

const customer = mongoose.model('customer', customersSchema)

module.exports = customer 