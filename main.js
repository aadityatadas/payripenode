/* 
 ------------------------------------------
  Payripe Payment Gateway Integration Kit
  Install required packages -> npm install
  Run integration kit -> node main.js
 -----------------------------------------
  Author:  Aditya Tadas

*/
require('dotenv').config()
var sha512 = require('js-sha512');
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser());
app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use('/view', express.static(path.join(__dirname, 'views')))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs')
const fs = require("fs").promises;
var urlencodedParser = bodyParser.urlencoded({ extended: false })
/* 
  Change key,salt and other configuration mentioned in .env file
*/

var config = {
  key: process.env.PAYRIPE_KEY,
  salt: process.env.PAYRIPE_SALT,
  env: process.env.PAYRIPE_ENV,
  enable_iframe: process.env.PAYRIPE_IFRAME,
	clientKey: process.env.PAYRIPE_ClientKey,
  clientSecret: process.env.PAYRIPE_ClientSecret,
  requestHashKey: process.env.PAYRIPE_RequestHashKey,
  requestSaltKey: process.env.PAYRIPE_requestSaltKey,
  requestAESKey: process.env.PAYRIPE_requestAESKey,
  responseSaltKey: process.env.PAYRIPE_responseSaltKey,
  responseAESKey: process.env.PAYRIPE_responseAESKey,
  test_url: process.env.PAYRIPE_URL_TEST,
  live_url: process.env.PAYRIPE_URL_LIVE,

 txnCurr:"INR"
};


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/adibaba", function(req, res){
	
	// Sample data to be filled in form
	var user = {
		email: 'test@gmail.com',
		name: 'Gourav',
		mobile: 9999999999,
		address: 'ABC Colony, House 23, India'
	}

	res.render("SampleForm",
		{
			user: user
		}
	);
})


const appendFile = async (path, data) => {
  try {
    await fs.appendFile(path, data);
  } catch (error) {
    console.error(error);
  }
};


//response 
app.post('/response', function (req, res) {
  
  responseData=req.body.secureData;
  var util = require('./Payripe/util.js');
  var d = new Date();
  newDate=d.toJSON().slice(0,19).replace('T',':');
  appendFile("responsedata.txt", "\r\n"+newDate+"  =>  "+responseData);

  decryptJsonObj=util.data_decrypt(responseData,config.responseSaltKey,config.responseAESKey);
  // if (checkReverseHash(req.body)) {
  //   res.send(req.body);
  // }
  res.send(decryptJsonObj);
  res.send('false, check the hash value ');
});


//initiate_payment API
app.post('/initiate_payment', function (req, res) {
  data = req.body;

  console.log('Got body:', req.body);
  var initiate_payment = require('./Payripe/initiate_payment.js');
  initiate_payment.initiate_payment(data, config, res);
});



app.listen(3001);
console.log("Payripe Payment Kit Demo server started at 3001");