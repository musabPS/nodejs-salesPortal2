const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    description: {
        type: String,
        trim:true
    },
    name:{
        type:String,
        trim:true
    }
   
    
})

const Invoice = mongoose.model('Inventory', invoiceSchema)

module.exports = Invoice