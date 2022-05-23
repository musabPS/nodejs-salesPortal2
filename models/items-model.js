const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    name: {
        type: String,
        trim:true
    },
    basePrice:{
        type:Number,
        trim:true
    },
    type:{
        type:String,
        trim:true
    }
   
    
})

const Invoice = mongoose.model('items', itemSchema)

module.exports = Invoice