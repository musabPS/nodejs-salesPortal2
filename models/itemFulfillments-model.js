const mongoose = require("mongoose")

const itemFulfillmentSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    ifNumber:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type: Date
    },
    quantity:{
        type:Number,
        default:0,
        min:0
    },
    amount:{
        type:Number,
        default:0,
        min:0,
    },
    status:{
        type:String,
        trim:true
    },
    customerName:{
       type:String,
       trim:true
   },
   customerInternalId:{
       type:String,
       trim:true
   },

    syncStatus:{
        type:String,
        trim:true
    },
    lineItems:{
        type:Array
    }
})

const ItemFulfillment = mongoose.model('ItemFulfillment', itemFulfillmentSchema)

module.exports = ItemFulfillment