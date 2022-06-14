const mongoose = require("mongoose")

const configrationsSchema = new mongoose.Schema({
    companyId: {
        type: Number,
    },
    comapnyName:{
        type:String,
    },
    restletUrl:{
        type:String
    },
    netsuiteAccount:{
        type:String
    },
    accountId:{
         type: String
     },
    
     tokenKey:{
         type:String,
         trim:true
     },
     tokenSecret:{
         type:String,
         trim:true
     },
     consumerKey:{
         type:String
     },
     consumerSecret:{
        type:String,
    }
})

const configration = mongoose.model('configration', configrationsSchema)

module.exports = configration 