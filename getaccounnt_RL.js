/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
 define(
   [
       'N/search','N/record','N/file','N/task'
   ],
   function (search,record,file,task) {
 
 
     function fileUpload(fileId,mapid)
       {
         var weatherFile = file.load({id: "SuiteScripts/Vendor2/Execel/sheet_csv_file.csv"});
         log.debug("checkdatacsv",weatherFile)
          var s0Upload = task.create({taskType: task.TaskType.CSV_IMPORT});
          s0Upload.mappingId = mapid;
          s0Upload.importFile = file.load({ id: fileId});;
          s0Upload.queueId = 1;
          s0Upload.name = "file import by vendor"
          var s0UploadTaskID = s0Upload.submit();
          var taskStatus = task.checkStatus(s0UploadTaskID);
          log.debug({title: "taskStatusCSVUpload",details: taskStatus});
 
          if (taskStatus.status === 'FAILED') 
          {
             log.error({title: "CSV FAILED",details: 'Task Not Submitted'});
            // sendEmail("Task_Status",taskStatus.status)
              return 0;
          }
          else
          {
             log.debug({title: "test",details: 'Task Submitted'});
           //  sendEmail("Task_Status",JSON.stringify(taskStatus.status))
             return 1;
          }
 
       }
 
       function getData()
       {
      
          var mySearch = search.create({
            type: "purchaseorder",
            filters:filters=[["type","anyof","PurchOrd"],"AND",["mainline","is","F"],"AND", ["internalid","anyof",22162]],
            columns:
            [
                search.createColumn({name: "internalid", label: "Tran Internalid"}),
                search.createColumn({name: "tranid", label: "Tran Number"}),
                search.createColumn({name: "item", label: "Item"}),
                search.createColumn({name: "item", label: "Item Name"}),
                search.createColumn({name: "quantity", label: "Quantity"}),
                search.createColumn({name: "custcol_pointstarvendor_originalqty", label: "Vendor Accept Quantity"}),
                search.createColumn({name: "expectedreceiptdate", label: "Expected Receipt Date"}),
              //	search.createColumn({name: "custbody_pointstarvendor_accept", label: "Expected Receipt Date"})
      
            ]
           });
           var mySearch = mySearch.run();
           var isFinalResult = mySearch.getRange(0, 1000);
           var gridDataResult = JSON.parse(JSON.stringify(isFinalResult));
              return gridDataResult
        
          
         var naCountResult = customrecord_einvoice_pt_accountdetailSearchObj.run();
         var returnResult = naCountResult.getRange(0, 1000);
         returnResult = JSON.parse(JSON.stringify(returnResult));
         return returnResult[0].custrecord_einvoice_pt_consumerkey;
       }
 
       function getSalesorderDetailsBySalesRepSummarizedData(userid){
      
   
         var salesorderSearchObj = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND",  
               ["mainline","is","F"], 
               "AND", 
               ["taxline","is","F"],
              "AND",
              ["salesrep","anyof",userid],
            ],
            columns:
            [
               search.createColumn({
                  name: "trandate",
                  summary: "GROUP",
                  sort: search.Sort.ASC,
                  label: "Date"
               }),
               search.createColumn({
                  name: "tranid",
                  summary: "GROUP",
                  label: "Document Number"
               }),
               search.createColumn({
                  name: "entity",
                  summary: "GROUP",
                  label: "Name"
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
                  name: "location",
                  summary: "GROUP",
                  label: "LOCATION"
               }),
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "Internal ID"
               }),
               search.createColumn({
                  name: "status",
                  summary: "GROUP",
                  label: "status"
               })
            ]
         });
         var isData = salesorderSearchObj.run();
         var isFinalResult = isData.getRange(0, 999);
         saleorderList= JSON.stringify(isFinalResult)
         saleorderList = saleorderList.replace(/GROUP/g, '');
         saleorderList = saleorderList.replace(/SUM/g, '');
         saleorderList = saleorderList.replace(/\(/g, "");
         saleorderList = saleorderList.replace(/\)/g, "");
         // var saleorderList2 = JSON.parse(saleorderList);
         // log.debug("checkData",saleorderList2[0])
         return saleorderList
   
       }
       function getCustomerData(salesPersonId)
       {
          var customerSearchObj = search.create({
             type: "customer",
             filters:
             [
               ["salesrep","anyof",salesPersonId]
             ],
             columns:
             [
                search.createColumn({
                   name: "entityid",
                   sort: search.Sort.ASC,
                   label: "Name"
                }),
                search.createColumn({
                   name: "internalid",
                   label: "internalid"
                })
             ]
          });
          var isData = customerSearchObj.run();
          var isFinalResult = isData.getRange(0, 999);
          var customers = JSON.stringify(isFinalResult);
          return customers
    
       }
       function getCustomerAddressData(customerInternalId)
       {
          var customerSearchObj = search.create({
             type: "customer",
             filters:
             [
               ["internalid","anyof",customerInternalId]
             ],
             columns:
             [
                search.createColumn({
                   name: "entityid",
                   sort: search.Sort.ASC,
                   label: "Name"
                }),
               search.createColumn({name: "addresslabel", label: "Address Label"}),
               search.createColumn({name: "address", label: "Address"}),
               search.createColumn({name: "isdefaultbilling", label: "Default Billing Address"}),
               search.createColumn({name: "isdefaultshipping", label: "Default Shipping Address"})
             ]
          });
          var isData = customerSearchObj.run();
          var isFinalResult = isData.getRange(0, 999);
          var customers = JSON.parse(JSON.stringify(isFinalResult));
          
          return customers 
    
       }
 
    function getItemsData()
    {
       var itemSearchObj = search.create({
          type: "item",
          filters:
          [
             ["isinactive","is","F"]
          ],
          columns:
          [
             search.createColumn({
                name: "itemid",
                sort: search.Sort.ASC,
                label: "Name"
             }),
             search.createColumn({name: "displayname", label: "Display Name"}),
             search.createColumn({name: "type", label: "Type"}),
             search.createColumn({name: "baseprice", label: "Base Price"}),
             search.createColumn({name: "internalid", label: "InternalID"}),
             search.createColumn({ name: "isserialitem",label: "Is Serialized Item" })
          ]
       });
 
         var isData = itemSearchObj.run();
         var isFinalResult = isData.getRange(0, 999);
         var Items = JSON.stringify(isFinalResult);
         return Items
    }
 
       function getItemInventory(name)
        {
        var itemSearchObj = search.create({
            type: "item",
            filters:
            [
               ["locationquantityonhand","greaterthan","0"], 
               "AND", 
               ["name","is",name]
            ],
            columns:
            [
               search.createColumn({
                  name: "itemid",
                  summary: "GROUP",
                  sort: search.Sort.ASC,
                  label: "Name"
               }),
               search.createColumn({
                  name: "type",
                  summary: "GROUP",
                  label: "Type"
               }),
               search.createColumn({
                  name: "inventorylocation",
                  summary: "GROUP",
                  label: "Inventory LOCATION"
               }),
               search.createColumn({
                  name: "locationquantityonhand",
                  summary: "MAX",
                  label: "LOCATION On Hand"
               }),
               search.createColumn({
                  name: "locationtotalvalue",
                  summary: "MAX",
                  label: "LOCATION Total Value"
               }),
               search.createColumn({
                name: "salesdescription",
                summary: "GROUP",
                label: "Description"
             })
            ]
         });
 
         var isData = itemSearchObj.run();
         var isFinalResult = isData.getRange(0, 999);
         var inventoryResult =  JSON.stringify(isFinalResult);
            
         return inventoryResult
 
        }
 
        
     function getSalesorderHeader(orderId,ftype,recordType){
      
       var salesorderSearchObj = search.create({
          type: recordType,
          filters:
          [
             ["type","anyof",ftype], 
             "AND", 
             ["mainline","is","mainline"], 
             "AND", 
             ["taxline","is","F"],
             "AND", 
             ["internalid","anyof",orderId]
          ],
          columns:
          [
             search.createColumn({
                name: "trandate",
                sort: search.Sort.ASC,
                label: "Date"
             }),
             search.createColumn({name: "tranid", label: "Document Number"}),
             search.createColumn({name: "entity", label: "Name"}),
             search.createColumn({name: "location", label: "LOCATION"}),
             search.createColumn({name: "billaddress", label: "BillAddress"}),
             search.createColumn({name: "shipaddress", label: "ShipAddress"}),
             search.createColumn({name: "status", label: "status"}),
          ]
       });
       
       
       var Result = salesorderSearchObj.run();
       var ResultRange = Result.getRange(0, 999);
       var jsonResult = JSON.parse(JSON.stringify(ResultRange));
 
       log.debug("salesorderSearchObj : :",jsonResult);
       return jsonResult;
     }
     
     function getSalesorderDetails(orderId,ftype,recordType){
       // var transactionType="salesorder"; 
       // if(ftype=="CustInvc"){
       //    transactionType="invoice"
       // }
       // if(ftype=="ItemShip"){
       //    transactionType="itemfulfillment"
       // }
       // log.debug("ftype ::",ftype)
       // log.debug("transactionType ::",transactionType)
       // log.debug("orderId ::",orderId)
      
       var salesorderSearchObj = search.create({
          type: recordType,
          filters:
          [
             ["type","anyof",ftype], 
             "AND", 
             ["mainline","is","mainline"], 
             "AND", 
             ["taxline","is","F"],
             "AND", 
             ["internalid","anyof",orderId]
          ],
          columns:
          [
             search.createColumn({
                name: "trandate",
                sort: search.Sort.ASC,
                label: "Date"
             }),
             search.createColumn({name: "tranid", label: "Document Number"}),
             search.createColumn({name: "entity", label: "Name"}),
             search.createColumn({name: "item", label: "Item"}),
             search.createColumn({name: "quantity", label: "Quantity"}),
             search.createColumn({name: "rate", label: "Item Rate"}),
             search.createColumn({name: "amount", label: "Amount"}),
             search.createColumn({name: "location", label: "LOCATION"}),
             search.createColumn({name: "billaddress", label: "BillAddress"}),
             search.createColumn({name: "shipaddress", label: "ShipAddress"}),
             search.createColumn({name: "status", label: "status"}),
             search.createColumn({
                name: "type",
                join: "item",
                label: "Type"
             }),
             search.createColumn({
                name: "formulatext",
                formula: "{item.type}",
                label: "itemtype"
             })
          ]
       });
       
       
       var Result = salesorderSearchObj.run();
       var ResultRange = Result.getRange(0, 999);
       var jsonResult = JSON.parse(JSON.stringify(ResultRange));
 
       log.debug("salesorderSearchObj : :",jsonResult);
       return jsonResult;
     }

     function getSaleOrderItemDetail(internalid,type,filterType)
     {
     
      var mainLine=""
        log.debug("dsdsd",type)
       if(type=="itemfulfillment"){  mainLine="T" }
       if(type=="salesorder" || type=="invoice")
       { 
        
         mainLine="F"
       }
       log.debug("saleorderrecordtype",filterType+"-"+mainLine+"-"+type)
      
       var salesorderSearchObj = search.create({
         type: type,
         filters:
         [ 
            ["type","anyof",filterType], 
            "AND", 
            ["mainline","is",mainLine], 
            "AND", 
            ["taxline","is","F"],
            "AND", 
            ["internalid","anyof",internalid]
         ],
         columns:
         [
            search.createColumn({name: "item", label: "Item"}),
            search.createColumn({name: "quantity", label: "Quantity"}),
            search.createColumn({name: "rate", label: "Item Rate"}),
            search.createColumn({name: "amount", label: "Amount"}),
            search.createColumn({name: "formulatext",formula: "{item.type}",label: "Formula (Text)"})
         ]
      });
      var Result = salesorderSearchObj.run();
      var ResultRange = Result.getRange(0, 999);
      var jsonResult = JSON.stringify(ResultRange);
      return jsonResult

     }

     function getItemFulfillmentHeaderData(internalId)
     {
      var salesorderSearchObj = search.create({
         type: "itemfulfillment",
         filters:
         [
            ["type","anyof","ItemShip"], 
            "AND", 
            ["mainline","is","mainline"], 
            "AND", 
            ["taxline","is","F"],
            "AND", 
            ["internalid","anyof",internalId]
         ],
         columns:
         [
            search.createColumn({name: "trandate",sort: search.Sort.ASC,label: "Date"}),
            search.createColumn({name: "tranid", label: "Document Number"}),
            search.createColumn({name: "entity", label: "Name"}),
            search.createColumn({name: "location", label: "LOCATION"}),
            search.createColumn({name: "billaddress", label: "BillAddress"}),
            search.createColumn({name: "shipaddress", label: "ShipAddress"}),
            search.createColumn({name: "status", label: "status"}),
            search.createColumn({ name: "type",join: "item",label: "Type" }),
            search.createColumn({ name: "formulatext", formula: "{item.type}", label: "itemtype"})
         ]
      });
      
      
      var Result = salesorderSearchObj.run();
      var ResultRange = Result.getRange(0, 999);
      var jsonResult = JSON.stringify(ResultRange);
     
      return jsonResult
     }


     function getItemFulfillmentItemDetail(internalId)
     {
      var salesorderSearchObj = search.create({
         type: "itemfulfillment",
         filters:
         [
            ["type","anyof","ItemShip"], 
            "AND", 
            ["mainline","is","mainline"], 
            "AND", 
            ["taxline","is","F"],
            "AND", 
            ["internalid","anyof",internalId]
         ],
         columns:
         [
           search.createColumn({name: "item", label: "Item"}),
           search.createColumn({name: "quantity", label: "Quantity"}),
           search.createColumn({name: "rate", label: "Item Rate"}),
           search.createColumn({name: "amount", label: "Amount"})
         ]
      });
      
      
      var Result = salesorderSearchObj.run();
      var ResultRange = Result.getRange(0, 999);
      var jsonResult = JSON.stringify(ResultRange);
      return jsonResult

    
     }


 
       function get (datain) {
 
           log.debug("checkhit",datain)
               //getData()
 
              if(datain.type == "getsaleorderlist")
              { 
                 var getSo=  getSalesorderDetailsBySalesRepSummarizedData(datain.userid)
                  return getSo
              }
 
              if(datain.type == "getcustomerdropdown")
              { 
                // var customerlist =  getCustomerData(datain.userid)
                // var itemList     =  getItemsData()
 
                 var item_customerlist={
                    customerlist :  getCustomerData(datain.userid)
                 }
 
                
                  return JSON.stringify(item_customerlist)
              }
              if(datain.type == "getcustomeraddress")
              { 
                 var customerlist =  getCustomerAddressData(datain.customerid)
                 log.debug("checkData",customerlist)
                  return customerlist
              }
              if(datain.type == "getitemlist")
              { 
                 var customerlist =  getItemsData()
                 log.debug("checkData",customerlist)
                  return customerlist
              }
              if(datain.type == "inventordetail")
              { 
                 var customerlist =  getItemInventory(datain.itemname)
                 log.debug("checkData",customerlist)
                  return customerlist
              }
 
              if(datain.type == "getSOHeaderData")
              {   
 
                 var saleOrder_customerList={
                   customerlist :  getCustomerData(datain.userid),
                   soHeaderInfo :  getSalesorderHeader(datain.orderId,'SalesOrd','salesorder')
                 }
 
                 return JSON.stringify(saleOrder_customerList)

              }
              if(datain.type == "getItemfulfillmentHeaderData")
              {   
 
                 var itemfulFillment_customerList={
                   customerlist :  getCustomerData(datain.userid),
                   soHeaderInfo :  getItemFulfillmentHeaderData(datain.orderId)
                 }
                 log.debug("itemfulFillment_customerList",itemfulFillment_customerList)
 
                 return JSON.stringify(itemfulFillment_customerList)
 
              }
              if(datain.type == "getItemfulfillmentItemDetail")
              {   
                                
                 return getItemFulfillmentItemDetail(datain.orderId)
              }

              if(datain.type == "itemDetail")
              {
                 
               return  getSaleOrderItemDetail(datain.orderId,'salesorder','SalesOrd')
              }
 
              if(datain.type == "createSaleOrder")
              { 
                
         log.debug("checkData",datain)
                saleOrderParse = JSON.parse(datain.sodata)
 
                log.debug("checkData",saleOrderParse)
 
                 var salesOrder = record.create({
                   type: record.Type.SALES_ORDER, 
                   isDynamic: true,
                 });
 
 
                 salesOrder.setValue({fieldId:'entity', value:saleOrderParse.customer})
                 salesOrder.setValue({fieldId:'shipaddress', value:saleOrderParse.billingaddress})
                 salesOrder.setValue({fieldId:'billaddress', value:saleOrderParse.shipingaddress})
                
                 var itemCount = salesOrder.getLineCount({"sublistId" : "item"});
                 log.debug("totalline",itemCount)
 
                 for(var i=0;i<saleOrderParse.items.length; i++)
                 {
                     if(!saleOrderParse.items[i].name)
                     {
                       continue;
                     }
         
                     log.debug("checklineoption",saleOrderParse.items[i])
                   
                   salesOrder.selectNewLine({ 
                       sublistId: 'item',
                       line : i          
                   });
         
                   salesOrder.setCurrentSublistValue({   
                       sublistId: 'item',
                       fieldId: 'item',
                       value:  saleOrderParse.items[i].name
                   });
         
                   salesOrder.setCurrentSublistValue({   
                       sublistId: 'item',
                       fieldId: 'quantity',
                       value: saleOrderParse.items[i].qty
                   });
                   salesOrder.setCurrentSublistValue({   
                     sublistId: 'item',
                     fieldId: 'rate',
                     value: saleOrderParse.items[i].rate
                 });
               
                   salesOrder.commitLine({  
                       sublistId: 'item'
                   });
         
                 }
         
                   saveid =  salesOrder.save({                  
                   ignoreMandatoryFields: true    
                       });
 
                       log.debug("checkSaveid",saveid)
 
                  return saveid
      
              }
              
              if(datain.type == "editSaleOrder")
              {
                log.debug("checkData",datain)
                postJson = JSON.parse(datain.sodata)
                 
                var salesOrder = record.load({
                  type: record.Type.SALES_ORDER, 
                  id: postJson.internalid,
                  isDynamic: true
               });
      
               salesOrder.setValue({fieldId:'entity', value:postJson.customer})
               salesOrder.setValue({fieldId:'shipaddress', value:postJson.billingaddress})
               salesOrder.setValue({fieldId:'billaddress', value:postJson.shipingaddress})
               log.debug("loadsaleorder",salesOrder)
               var itemCount = salesOrder.getLineCount({"sublistId" : "item"});
               log.debug("totalline",itemCount)
      
              for(var i=0;i<postJson.items.length; i++)
              {
                  if(!postJson.items[i].name)
                  {
                    continue;
                  }
      
                  log.debug("checklineoption",postJson.items[i])
                
                salesOrder.selectNewLine({ 
                    sublistId: 'item',
                    line : i          
                });
      
                salesOrder.setCurrentSublistValue({   
                    sublistId: 'item',
                    fieldId: 'item',
                    value:  postJson.items[i].name
                });
      
                salesOrder.setCurrentSublistValue({   
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: postJson.items[i].qty
                });
                salesOrder.setCurrentSublistValue({   
                  sublistId: 'item',
                  fieldId: 'rate',
                  value: postJson.items[i].rate
              });
            
                salesOrder.commitLine({  
                    sublistId: 'item'
                });
      
              }
      
                saveid=  salesOrder.save({                  
                ignoreMandatoryFields: true    
                    });
      
              var salesOrderde = record.load({
                type: record.Type.SALES_ORDER,
                id: postJson.internalid,
                isDynamic: true
              });
      
              for(var j=0; j<itemCount; j++)
              {
                salesOrderde.removeLine({ sublistId: 'item', line: 0 });
              }
              saveid =  salesOrderde.save({                  
                ignoreMandatoryFields: true    
                    });
      
              log.debug("saleorderid",saveid)

              return JSON.stringify(saveid)

            }

            if(datain.type == "edititemfulfillment")
            {
              log.debug("checkData",datain)
              postJson = JSON.parse(datain.sodata)
               
              var salesOrder = record.load({
                type: 'itemfulfillment', 
                id: postJson.internalid,
                isDynamic: true
             });
    
            //  salesOrder.setValue({fieldId:'entity', value:postJson.customer})
            //  salesOrder.setValue({fieldId:'shipaddress', value:postJson.billingaddress})
            //  salesOrder.setValue({fieldId:'billaddress', value:postJson.shipingaddress})

             log.debug("loadsaleorder",salesOrder)
             var itemCount = salesOrder.getLineCount({"sublistId" : "item"});
             log.debug("totalline",itemCount)
    
             for(var i=0;i<postJson.items.length; i++)
            {
                if(!postJson.items[i].name)
                {
                  continue;
                }
    
                log.debug("checklineoption",postJson.items[i])
              
              salesOrder.selectNewLine({ 
                  sublistId: 'item',
                  line : i          
              });
    
          
    
              salesOrder.setCurrentSublistValue({   
                  sublistId: 'item',
                  fieldId: 'quantity',
                  value: postJson.items[i].quantity
              });
           
          
              salesOrder.commitLine({  
                  sublistId: 'item'
              });
    
            }
    
                saveid =  salesOrder.save({                  
                ignoreMandatoryFields: true    
                  });

                  log.debug("savebeforeremove",saveid)
    
              var salesOrderde = record.load({
              type: record.Type.SALES_ORDER,
              id: postJson.internalid,
              isDynamic: true
             });
    
             for(var j=0; j<itemCount; j++)
             {
              salesOrderde.removeLine({ sublistId: 'item', line: 0 });
             }
             saveid =  salesOrderde.save({                  
              ignoreMandatoryFields: true    
                  });
    
            log.debug("saleorderid",saveid)

            return JSON.stringify(saveid)

          }

          //var data= getData()
        //     var Record = record.load({
        //     type: 'purchaseorder',
        //     id: 22055,
        //  isDynamic: true
        //  });
         
        //  log.debug("checkhit2",Record)
        //  Record.setValue({fieldId : 'custbody_pointstarvendor_accept', value: true})
        //  log.debug("checkhit3")
        
        //      // return  JSON.stringify(Record)
        //  // Record.save();
        //     Record.save({
        //    enableSourcing: false,
        //  ignoreMandatoryFields: false
        //  });
       
        
          
       }
     
     function restlet_called(datain)
     {
 
       log.debug("parseSheetData",parseSheetData)
 
       var sheetData=datain.body.resultbody
       var parseSheetData=JSON.parse(sheetData)
       log.debug("parseSheetData",parseSheetData)
     //   log.debug("sds",parseSheetData["valueRanges"][0].values)
       var sheetArrayData=parseSheetData["valueRanges"][0].values
       var lineconteent="Tran Internalid,Tran Number,Item,Item Name,Quantity,Rate,Vendor Accept Quantity,Expected Receipt Date\n"
      //  var lineconteent="";
         for(var i=1; i<sheetArrayData.length; i++)
         {
          // log.debug("sds",sheetArrayData[i].length)
           for(var j=0; j<sheetArrayData[i].length; j++)
           {
            
               lineconteent+=sheetArrayData[i][j]+','
           }
           lineconteent+='\n'
         }
 
       var csvFile = file.create({
             name: 'sheet_csv_file.csv',
             fileType: file.Type.CSV,
             contents: lineconteent,
             folder: '2260' // Folder ID where the file should be saved in the File Cabinet
          });
 
          var saveId = csvFile.save();
        log.debug("saveId",saveId)
       //  var scriptTask = task.create({taskType: task.TaskType.SCHEDULED_SCRIPT});
       //         scriptTask.scriptId = 'customscript_ps_vendor_import_ss';
       //         scriptTask.deploymentId = 'customdeploy_ps_vendor_importitems_ss';
       //         scriptTask.params={'custscript_csvfileid': saveId };
 
       //         var scriptTaskId = scriptTask.submit();
       
       log.debug("Sheet Data",JSON.stringify(lineconteent))
       log.debug("saveId",saveId)
       fileUpload(saveId,21)
 
       //  getData()
     }
 
       return {
           get: get,
         post: restlet_called,
        
       };
   }
 );