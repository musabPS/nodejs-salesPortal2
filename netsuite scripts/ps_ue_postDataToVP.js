/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
 
 const modules = [
   'N/record',
   'N/log',
   'N/search',
   'N/runtime', 
   'N/url',
   'N/https'
];

define(modules, function (record, log, search, runtime, url, https) {


   function afterSubmit(context) {


      var customerRecord = context.newRecord;
      log.debug("context type", context.type);
      log.debug("context type", customerRecord.type);

      if (context.type == 'create') {


         if (customerRecord.type == "salesorder") {
            try {
               var filterType = "SalesOrd"
               var mainLine = "F"
               var data = getSavedSearchData(customerRecord.type, filterType, customerRecord.id, mainLine)
               log.debug("checkpo", data)
               var newObjForMongo = generateMongoosObject(customerRecord.type,data)
               log.debug("checkpo", newObjForMongo)
               var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/createSaleOrderMongo')
   
   
               if (mongooseResponse.success) {
                  mongoSyncSuccessUpdate('salesorder', customerRecord.id, mongooseResponse)
               }
   
               // else {
               //    mongoSyncFailUpdate(type, id, mongooseResponse)
               // }
   
               log.debug("newObjForMongo", mongooseResponse)
            }
            catch(ex){
               log.error("POST DATA TO VP >>>> SALES ORDER", ex)
            }
           
         }

         if (customerRecord.type == "itemfulfillment") {
            var filterType = "ItemShip"
            var mainLine = "T"
            var getIFData = getSavedSearchData(customerRecord.type, filterType, customerRecord.id, mainLine)
            log.debug("check IF data", getIFData)
            var newObjForMongo = generateMongoosObject(customerRecord.type,getIFData)
            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/createItemFulfillmentsMongo')

            log.debug("check mongoreturn on sucess", mongooseResponse)
            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
               mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            log.debug("newObjForMongo", newObjForMongo)
         }

         if (customerRecord.type == "invoice") {
            var filterType = "CustInvc"
            var mainLine = "T"
            var invoiceData = getSavedSearchData(customerRecord.type, filterType, customerRecord.id, mainLine)
            log.debug("check Invoice data", invoiceData)

           var newObjForMongo = generateMongoosObject(customerRecord.type,invoiceData)
            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/createInvoiceMongo')

            log.debug("check mongoreturn on sucess", mongooseResponse)
            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
               mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            log.debug("newObjForMongo", newObjForMongo)
         }


         if (customerRecord.type == "customer") {
   
            var customerData = getCustomerData(customerRecord.type, customerRecord.id)
            log.debug("check customer data", customerData)

           var newObjForMongo = generateMongoosObject(customerRecord.type,customerData)

           
           log.debug("newObjForMongo", newObjForMongo)


            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/createCustomerMongo')

            log.debug("check mongoreturn on sucess", mongooseResponse)
            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
               mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

         }

      }

      if (context.type == 'edit') {

         log.debug("checktype",customerRecord.type)

         if (customerRecord.type == "salesorder") {
            var filterType = "SalesOrd"
            var mainLine = "F"
            var data = getSavedSearchData(customerRecord.type, filterType, customerRecord.id, mainLine)
            log.debug("checkpo", data)
            var newObjForMongo = generateMongoosObject(customerRecord.type,data)

            log.debug("newObjForMongo", newObjForMongo)


            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/updateSaleOrderMongo')


            var Record = record.load({
               type: 'salesorder',
               id: customerRecord.id,
            });

            if (mongooseResponse.success) { 
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: true })
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_upd', value: '1' })
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_syncdatet', value: mongooseResponse.currentDateTime})
               Record.save();
            }

            else {
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: false })
               Record.setValue({ fieldId: 'custbody_nodejsvendorportal_syncerror', value: mongooseResponse.error })
               Record.save();

            }

            log.debug("newObjForMongo", mongooseResponse.success)
            return

         }

         if (customerRecord.type == "itemfulfillment") {
            var filterType = "ItemShip"
            var mainLine = "T"
            var data = getSavedSearchData(customerRecord.type, filterType, customerRecord.id, mainLine)
            log.debug("checkpo", data)
            var newObjForMongo = generateMongoosObject(customerRecord.type,data)

            log.debug("newObjForMongo", newObjForMongo)

            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/updateItemFulfillmentsMongo')

            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
              mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }
         }

         if (customerRecord.type == "invoice") {
            var filterType = "CustInvc"
            var mainLine = "T"
            var data = getSavedSearchData(customerRecord.type, filterType, customerRecord.id, mainLine)
            log.debug("checkpo", data)
            var newObjForMongo = generateMongoosObject(customerRecord.type,data)

            log.debug("newObjForMongo", newObjForMongo)

            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/updateInvoiceMongo')

            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
              mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }
         }

         if (customerRecord.type == "customer") {
           
            var data = getCustomerData(customerRecord.type, customerRecord.id)
            log.debug("checkpo", data)
            var newObjForMongo = generateMongoosObject(customerRecord.type,data)

            log.debug("newObjForMongo", newObjForMongo)

            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://81ea-2400-adc1-18f-5d00-1476-205e-ddba-1efc.ngrok.io/updateCustomerMongo')

            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
              mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }
         }


      }











      var customerRecord = context.newRecord;
      if (customerRecord.getValue('salesrep')) {
          var call = record.create({
              type: record.Type.PHONE_CALL,
              isDynamic: true
          });
          call.setValue('title', 'Make follow-up call to new customer');
          call.setValue('assigned', customerRecord.getValue('salesrep'));
          call.setValue('phone', customerRecord.getValue('phone'));
          try {
              var callId = call.save();
              log.debug('Call record created successfully', 'Id: ' + callId);
          } catch (e) {
              log.error(e.name);
          }
      }


   }

   
   function getSavedSearchData(type, filtertype, internalid, mainline) {

      log.debug("filtertype",filtertype);
      log.debug("internalid",internalid);
      log.debug("mainline",mainline);

      var salesorderSearchObj = search.create({
         type: type,
         filters:
         [
            ["type", "anyof", filtertype],
            "AND",
            ["mainline", "is", mainline],
            "AND",
            ["internalid", "anyof", internalid],
         ],
         columns:
         [
            search.createColumn({
               name: "internalid",
               summary: "GROUP",
               label: "internalId"
            }),
            search.createColumn({
               name: "tranid",
               summary: "GROUP",
               label: "soNumber"
            }),
            search.createColumn({
               name: "trandate",
               summary: "GROUP",
               label: "date"
            }),
            search.createColumn({
               name: "quantity",
               summary: "SUM",
               label: "Quantity"
            }),
            search.createColumn({
               name: "amount",
               summary: "SUM",
               label: "Amount"
            }),
            search.createColumn({
               name: "billaddress",
               summary: "GROUP",
               label: "billingAddress"
            }),
            search.createColumn({
               name: "shipaddress",
               summary: "GROUP",
               label: "shippingAddress"
            }),
            search.createColumn({
               name: "statusref",
               summary: "GROUP",
               label: "status"
            }),
            search.createColumn({
               name: "entityid",
               join: "customerMain",
               summary: "GROUP",
               label: "customerName"
            }),
            search.createColumn({
               name: "internalid",
               join: "customerMain",
               summary: "GROUP",
               label: "customerInternalId"
            }),
            search.createColumn({
               name: "internalid",
               join: "salesRep",
               summary: "GROUP",
               label: "salePersonId"
            }),
            search.createColumn({
               name: "entityid",
               join: "salesRep",
               summary: "GROUP",
               label: "salePersonName"
            })
         ]
      });
   
      var isData = salesorderSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var DataResult = JSON.parse(JSON.stringify(isFinalResult))

      log.debug("saved search",DataResult);
      return DataResult

   }


   function getCustomerData(type, internalid){

      var customerSearchObj = search.create({
         type: type,
         filters:
         [
            ["internalid","anyof",internalid]
         ],
         columns:
         [
            search.createColumn({name: "internalid", label: "internalId"}),
            search.createColumn({ name: "entityid", sort: search.Sort.ASC, label: "customerName"}),
            search.createColumn({name: "shipaddress", label: "shippingAddress"}),
            search.createColumn({name: "billaddress", label: "billingAddress"}),
            search.createColumn({name: "datecreated", label: "date"}),
            search.createColumn({name: "category", label: "category"})
         ]
      });

      var isData = customerSearchObj.run();
      var isFinalResult = isData.getRange(0, 999);
      var DataResult = JSON.parse(JSON.stringify(isFinalResult))

      log.debug("saved search",DataResult);
      return DataResult
   }


   function generateMongoosObject(type,data) {
      var newObj = []

      if(type=="salesorder"){
         newObj.push({
            amount: parseInt(data[0].values["SUM(amount)"]),
            billingAddress: data[0].values["GROUP(billaddress)"],
            customerInternalId: data[0].values["GROUP(customerMain.internalid)"][0].value,
            customerName: data[0].values["GROUP(customerMain.entityid)"],
            date:  new Date(data[0].values["GROUP(trandate)"]),
            internalId: parseInt(data[0].values["GROUP(internalid)"][0].value),
            quantity: data[0].values["SUM(quantity)"],
            salePersonId: data[0].values["GROUP(salesRep.internalid)"][0].value,
            salePersonName: data[0].values["GROUP(salesRep.entityid)"],
            shippingAddress : data[0].values["GROUP(shipaddress)"],
            soNumber : data[0].values["GROUP(tranid)"],
            status : data[0].values["GROUP(statusref)"][0].text,
         })
      }
      if(type=="itemfulfillment"){
         newObj.push({
            amount: parseInt(data[0].values["SUM(amount)"]),
            billingAddress: data[0].values["GROUP(billaddress)"],
            customerInternalId: data[0].values["GROUP(customerMain.internalid)"][0].value,
            customerName: data[0].values["GROUP(customerMain.entityid)"],
            date:  new Date(data[0].values["GROUP(trandate)"]),
            ifNumber : data[0].values["GROUP(tranid)"],
            internalId: parseInt(data[0].values["GROUP(internalid)"][0].value),
            quantity: data[0].values["SUM(quantity)"],
            salePersonName: data[0].values["GROUP(salesRep.entityid)"],
            shippingAddress : data[0].values["GROUP(shipaddress)"],
            status : data[0].values["GROUP(statusref)"][0].text,
         })
      }

      if(type=="invoice"){
         newObj.push({
            amount: parseInt(data[0].values["SUM(amount)"]),
            billingAddress: data[0].values["GROUP(billaddress)"],
            customerInternalId: data[0].values["GROUP(customerMain.internalid)"][0].value,
            customerName: data[0].values["GROUP(customerMain.entityid)"],
            date:  new Date(data[0].values["GROUP(trandate)"]),
            internalId: parseInt(data[0].values["GROUP(internalid)"][0].value),
            invoiceNumber : data[0].values["GROUP(tranid)"],
            quantity: data[0].values["SUM(quantity)"],
            salePersonId: data[0].values["GROUP(salesRep.internalid)"][0].value,
            salePersonName: data[0].values["GROUP(salesRep.entityid)"],
            shippingAddress : data[0].values["GROUP(shipaddress)"],
            status : data[0].values["GROUP(statusref)"][0].text,
         })
      }

      if(type=="customer"){
         newObj.push({
            internalId: parseInt(data[0].values["internalid"][0].value),
            customerName: data[0].values["entityid"],
            shippingAddress : data[0].values["shipaddress"],
            billingAddress: data[0].values["billaddress"],
            date:  new Date(data[0].values["datecreated"]),
            category: data[0].values["category"][0].text, 
         })
      }

    

      return newObj
   }

   function getvendorBillSavedSearch(internalId) {
      var purchaseorderSearchObj = search.create({
         type: "purchaseorder",
         filters:
            [
               ["type", "anyof", "PurchOrd"],
               "AND",
               ["mainline", "is", "F"],
               "AND",
               ["applyingtransaction.internalid", "anyof", internalId],
               "AND",
               ["applyingtransaction.type", "anyof", "VendBill"]
            ],
         columns:
            [
               search.createColumn({
                  name: "internalid",
                  join: "applyingTransaction",
                  summary: "GROUP",
                  label: "internalId"
               }),
               search.createColumn({
                  name: "tranid",
                  join: "applyingTransaction",
                  summary: "GROUP",
                  label: "billNo"
               }),
               search.createColumn({
                  name: "tranid",
                  summary: "GROUP",
                  label: "poNumber"
               }),
               search.createColumn({
                  name: "trandate",
                  join: "applyingTransaction",
                  summary: "GROUP",
                  label: "date"
               }),
               search.createColumn({
                  name: "quantity",
                  summary: "SUM",
                  label: "Quantity"
               }),
               search.createColumn({
                  name: "amount",
                  summary: "SUM",
                  label: "Amount"
               }),
               search.createColumn({
                  name: "quantitybilled",
                  summary: "SUM",
                  label: "Quantity Billed"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "SUM({quantitybilled}*{rate})",
                  label: "Formula (Numeric)"
               }),
               search.createColumn({
                  name: "location",
                  summary: "GROUP",
                  label: "location"
               }),
               search.createColumn({
                  name: "statusref",
                  summary: "GROUP",
                  label: "approvalStatus"
               }),
               search.createColumn({
                  name: "entityid",
                  join: "vendor",
                  summary: "GROUP",
                  label: "vendorName"
               }),
               search.createColumn({
                  name: "internalid",
                  join: "vendor",
                  summary: "GROUP",
                  label: "vendorIntenalId"
               })
            ]
      });
        var isData = purchaseorderSearchObj.run();
        var isFinalResult = isData.getRange(0, 1000);
        isFinalResult = JSON.parse(JSON.stringify(isFinalResult));

        return isFinalResult
   }

   function generateMongoosObject_forgetvendorBillSavedSearch(data) {
      var newObj = []
      newObj.push({
         internalId   : data[0].values["GROUP(applyingTransaction.internalid)"][0].value,
         billNo       : data[0].values["GROUP(applyingTransaction.tranid)"],
         poNumber     : data[0].values["GROUP(tranid)"],
         date        : data[0].values["GROUP(applyingTransaction.trandate)"],
         poQuantity    : data[0].values["SUM(quantity)"],
         poAmount: data[0].values["SUM(amount)"],
         billQuantity: data[0].values["SUM(quantitybilled)"],
         billAmount: data[0].values["SUM(formulanumeric)"],
         approvalStatus: data[0].values["GROUP(statusref)"][0].text,
         location: data[0].values["GROUP(location)"][0].text,
         vendorName : data[0].values["GROUP(vendor.entityid)"][0].text,
         vendorInternalId : data[0].values["GROUP(vendor.internalid)"][0].text,

      })

      return newObj
   }

   function getPaymentSavedSearch(internalId) {
      var vendorpaymentSearchObj = search.create({
         type: "vendorpayment",
         filters:
         [
            ["type","anyof","VendPymt"],  
            "AND", 
            ["mainline","is","F"], 
            "AND", 
            ["internalid","anyof",internalId]
         ],
         columns:
         [
            search.createColumn({
               name: "internalid",
               summary: "GROUP",
               label: "Internal ID"
            }),
            search.createColumn({
               name: "tranid",
               summary: "GROUP",
               label: "Document Number"
            }),
            search.createColumn({
               name: "trandate",
               summary: "GROUP",
               label: "Date"
            }),
            search.createColumn({
               name: "appliedtotransaction",
               summary: "GROUP",
               label: "Applied To Transaction"
            }),
            search.createColumn({
               name: "debitamount",
               summary: "SUM",
               label: "Amount (Debit)"
            }),
            search.createColumn({
               name: "entity",
               summary: "GROUP",
               label: "Name"
            }),
            search.createColumn({
               name: "internalid",
               join: "vendor",
               summary: "GROUP",
               label: "Internal ID"
            }),
            search.createColumn({
               name: "amount",
               join: "appliedToTransaction",
               summary: "SUM",
               label: "Amount"
            }),
            search.createColumn({
               name: "trandate",
               join: "appliedToTransaction",
               summary: "GROUP",
               label: "Date"
            })
         ]
      });

      var isData = vendorpaymentSearchObj.run();
      var isFinalResult = isData.getRange(0, 1000);
      var gridDataResult = JSON.parse(JSON.stringify(isFinalResult));
      return gridDataResult
   }

   function generateMongoDBObject(data) {
      var newObj = []

      newObj.push({
         internalId         : data[0].values["GROUP(internalid)"][0].value,
         billPaymentNumber  : data[0].values["GROUP(tranid)"],
         date               : data[0].values["GROUP(trandate)"],
         billNumber         : data[0].values["GROUP(appliedtotransaction)"][0].text,
         amount             : data[0].values["SUM(debitamount)"],
         vendorName         : data[0].values["GROUP(entity)"][0].text,
         vendorInternalId   : data[0].values["GROUP(entity)"][0].value,
         billAmount         : data[0].values["SUM(appliedToTransaction.amount)"],
         billDate           : data[0].values["GROUP(appliedToTransaction.trandate)"],

      })

      return newObj
   }

   function sendDataToMongoose(allData, link) {

      log.debug('allData', allData);

      var neObj = { "netsuiteData": allData }
      var headers1 = [];
      headers1['Content-Type'] = 'application/json';
      log.debug("check data", JSON.stringify(allData))
      var postRequest = https.post({
         url: link,
         body: JSON.stringify(neObj),
         headers: headers1
      })

      log.debug('title', postRequest.body);
      return JSON.parse(postRequest.body)
   }

   function mongoSyncSuccessUpdate(type, id, mongooseResponse) {
      var Record = record.load({
         type: type,
         id: id,
      });


      Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: true })
      if (mongooseResponse.type == "Update") {
         Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_upd', value: '1' })
      }
      else {
         Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_upd', value: '0' })
      }

      Record.setText({ fieldId: 'custbody_nodejs_vendorportal_syncdatet', text: mongooseResponse.currentDateTime })
      Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_obj', value: mongooseResponse.mongoObjId })

      Record.save();

   }

   function mongoSyncFailUpdate(type, id, mongooseResponse) {
      var Record = record.load({
         type: type,
         id: id,
      });

      var values = {}

      values["custbody_nodejsvendorportal_syncerror"] = mongooseResponse.error.message
      values["custbody_nodejs_vendorportal_issync"] = false
      values["custbody_nodejs_vendorportal_syncdatet"] = mongooseResponse.currentDateTime
      log.debug("values", values)
      var sf = record.submitFields({
         type: "itemreceipt",
         id: id,
         values: values,
         options: {
            ignoreMandatoryFields: true
         }
      });
       log.debug("sf", sf)
      // Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: false })
      // Record.setValue({ fieldId: 'custbody_nodejsvendorportal_syncerror', value: JSON.stringify(mongooseResponse.error) })
      // Record.setText({ fieldId: 'custbody_nodejs_vendorportal_syncdatet', text: mongooseResponse.date })

      // Record.save();

   }

   return {
      afterSubmit: afterSubmit
   };

});