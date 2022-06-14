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


let accountSettings={}
let url={}
netsuiteConfigration().then(function(resp){ 
  accountSettings=resp[0]
  url=resp[1]

})


app.use(session({
   secret: "key",
   cookie: { maxAge: 60000 }
 }))

 app.use(saloeOrderRouter)
 app.use(itemFulfillmentRouter)
 app.use(invoideRouter)
 app.use(customerRouter)
 app.use(itemRouter)
 app.use(dbUpdate)


 app.get('/login', (req,res)=>{
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

 app.get('/', (req,res)=>{
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

 



 const port =  process.env.PORT || 3000
 app.listen(port, () => {
    console.log(`Serving on port ${port}`)
 }) 



