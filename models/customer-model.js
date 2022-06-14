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
    salePersonId: {
        type: Number,
        trim:true,
    },
    salePerson:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    dateCreated:{
         type: Date
     },
    
     category:{
         type:String,
         trim:true
     },
     
     
     syncStatus:{
         type:Number,
         trim:true
     }
})

const customer = mongoose.model('customer', customersSchema)

module.exports = customer 