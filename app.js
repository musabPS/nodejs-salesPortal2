if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const data = require('./data.js')
const masterdata = require('./masterdata.js')
const bodyParser = require('body-parser');
const { json } = require('express/lib/response')
var moment = require('moment');
var session = require('express-session')
var nsrestlet = require('nsrestlet');

require('./models/mongoose')

const app = express()
const saloeOrderRouter = require('./routes/sale-order-route')
const itemFulfillmentRouter = require('./routes/itemfulfillment-route')
const invoideRouter =  require('./routes/invoice-route')
const customerRouter = require('./routes/customer-route')
const itemRouter    = require('./routes/item-route')
const dbUpdate   =    require('./routes/dbUpdate-route')

app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'./demo7/views'))
app.use('/',express.static(path.join(__dirname, './demo7/public')))
app.use('/demo1',express.static(path.join(__dirname, './demo1/public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
const netsuiteConfigration = require('./models/netsuiteConfigrations')

const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {}; /* see below */
// Import dependencies
const fs = require("fs");
const PDFParser = require("pdf2json");
const pdf = require('pdf-parse');
// Get all the filenames from the patients folder
const files = fs.readdirSync("PDF_Files");

// All of the parse patients
let patients = [];

let accountSettings={}
let url={}
netsuiteConfigration().then(function(resp){ 
  accountSettings=resp[0]
  url=resp[1]

})


app.use(session({
   secret: "key",
   cookie: { maxAge: 600000 }
 }))

 app.use(saloeOrderRouter)
 app.use(itemFulfillmentRouter)
 app.use(invoideRouter)
 app.use(customerRouter)
 app.use(itemRouter)
 app.use(dbUpdate)


 const authCheck = (req, res, next) => {
   if (! req.session.user_id) {
     return res.redirect('/login')
 
   }
    next()
 }

 app.get('/login', (req,res)=>{


   pdfExtract.extract('Sample order.pdf', options, (err, data) => {
      if (err) return console.log(err);
      console.log(data.pages[0].content);
    });



    res.render("pages/login")
 })

 app.post('/login',async (req,res)=>{

    let credentials = { username:"musab@point-star.com", password:"1" }
    console.log("post route history", req.body )
    const {username, password}=req.body 

    var body = req.body
    console.log("req.body", body)
    console.log("accountSettings", accountSettings)

    console.log("url", url)


  var myRestlet = nsrestlet.createLink(accountSettings, url)

  myRestlet.get({email: username ,password:password,type:'login'}, function(error, body)
  {
    if (!error) 
    {
       var parseData=JSON.parse(body)

       if(parseData.length>0)
       {
         let returnObj={
             success:true,

          }
          console.log("message", parseData[0])
          req.session.user_id = parseData[0].id
          res.send(JSON.stringify(returnObj))
       }

       else
       {

         let returnObj={
                     success:false,

                  }

        
          res.send( JSON.stringify(returnObj))


       }
        
    }

  });

   //  // const user= await User.findOne({username})
   //  // console.log("post route history", user )
   //  if(req.body.username==credentials.username && req.body.password == credentials.password)
   //  {
   //     console.log("ifff")
   //     req.user = "musab"
   //     let route = "partials/_content"
   //     type="detail"
   //     breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
   //      res.render('index',{route,data,type,breadcrumbs})
   //     // res.redirect("index")
   //   }

   //  else
   //  {
   //     let message =  "Username or password is incorrect"
   //      res.send(message)
   //  }


 })

  app.get('/signout',async (req,res)=>{

    req.user = "";
   res.redirect("/login")
 })

 app.get('/',authCheck , (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "partials/_content"
    breadcrumbs=masterdata.Breadcrumbs.noBreadcrumbs
    type="detail"
    res.render('index',{route,breadcrumbs,type,data})
 })

 app.get('/view',async (req,res)=>{
   // app.set('views', path.join(__dirname,'./demo7/views'))

    let route = "pages/transaction"
    res.render('index', {route})
 })


 app.get('/demo1', (req,res)=>{
    app.set('views', path.join(__dirname,'./demo1/views'))
    res.render('index')
 }) 

 
 app.get('/pdfextract',async (req,res)=>{

  
  let pagesCount=0
  let PageData=[]


  let dataBuffer = fs.readFileSync('PDF_Files/Sample order.pdf');

  pdf(dataBuffer).then(function(data) {
 
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text


    page3=data.text
    page3=page3.split("\n\n")
    page3=page3[3]
    page3=page3.split("\n")

    console.log(page3); 


    date          = page3[5]
    to            =  page3[6]
    attn          = page3[8]
    from          = page3[10]
    jobNumber     = page3[14]
    shipper       = page3[17]
    pol           = page3[20]
    term          = page3[23]
    pod           = page3[26]
    carrierRefNo  = page3[29]
    commodity     = page3[32]
    volume        =  page3[35]







    pdfObject={

      date          : date,
      to            : to,
      attn          : attn,
      from          : from,
      jobNumber     : jobNumber,
      shipper       : shipper,
      pol           : pol,
      term          : term,
      pod           : pod,
      carrierRefNo  : carrierRefNo,
      commodity     : commodity,
      volume        : volume

    }

    console.log("checkc",pdfObject)
    res.send( pdfObject)

});
    // await Promise.all(files.map(async (file) => {

    //   // Set up the pdf parser
    //   let pdfParser = new PDFParser(this, 1);

    //   // Load the pdf document
    //   pdfParser.loadPDF(`PDF_Files/${file}`);
      
    //   // Parsed the patient
    //   let patient = await new Promise(async (resolve, reject) => {

    //       // On data ready
    //       pdfParser.on("pdfParser_dataReady", (pdfData) => {
           

    //           // The raw PDF data in text form
    //           const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
             
    //           pagesCount= raw.split('--Page').length-1
    //         //  let count = raw.split('').filter(x => x == ch).length
    //           //console.log("count",pagesCount)

    //          let pageData = raw.split('Page (2)')[1]
    //           // pageData=pageData.split('Page (3)')[1]
    //           let  pageEndIndex1 =  raw.indexOf('Page (1)');
    //           let  pageEndIndex2 =  raw.indexOf('Page (2)');
    //           let result = raw.substring(pageEndIndex1, pageEndIndex2);
    //          // console.log("pageEndIndex",result)

             
    //           date = result.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");
    //           let to_attn = /TO\s(.*?)TO/i.exec(result)[1].trim()
    //           to_attn = to_attn.split("ATTN")
    //           let attn = to_attn[1].trim().replace(/:/g, "")
    //           let to = to_attn[0].trim().replace(/:/g, "")

    //           let from =result.match("[FROM-]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");


    //          // let to=to_attn
    //           console.log("from",from)
 
    //           console.log("matchdata",result.match(/TO/i))
    //          let fax = result.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}")
    //           let extractData={
    //             date : date[0],
    //             attn : attn,
    //             to   : to
    //           }

              


              // Return the parsed data
              //  resolve({
              //      name: /Date\s(.*?)Address/i.exec(raw)[1].trim()
              // //     address: /Address\s(.*?)Phone/i.exec(raw)[1].trim(),
              // //     phone: /Phone\s(.*?)Birthday/i.exec(raw)[1].trim(),
              // //     birthday: /Birthday\s(.*?)Email\sAddress/i.exec(raw)[1].trim(),
              // //     emailAddress: /Email\sAddress\s(.*?)Blood\stype/i.exec(raw)[1].trim(),
              // //     bloodType: /Blood\stype\s(.*?)Height/i.exec(raw)[1].trim(),
              // //     height: /Height\s(.*?)Weight/i.exec(raw)[1].trim(),
              // //     weight: /Weight\s(.*?)--/i.exec(raw)[1].trim()
              //  });

        //  });

     // });

      // Add the patient to the patients array
     // patients.push(patient);

//  }));

  console.log("check",patients)


}) 


 const port =  process.env.PORT || 3000
 app.listen(port, () => {
    console.log(`Serving on port ${port}`)
 }) 



