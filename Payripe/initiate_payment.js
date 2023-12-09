var util = require('./util.js');

var sha512 = require('js-sha512');
var crypto = require('crypto');




let initiate_payment = function (data, config, res) {

  function isFloat(amt) {
    var regexp = /^\d+\.\d{1,2}$/;
    return regexp.test(amt)
  }

 
 

  function checkArgumentValidation(data, config) {

    if (!data.username.trim()) {
      res.json({
        "status": 0,
        "data": "Mandatory Parameter name can not empty"
      });
    }
    if (!(data.amount.trim()) ) {
      res.json({
        "status": 0,
        "data": "Mandatory Parameter amount can not empty and must be float "
      });
    }
   
    if (!(data.EmailID.trim()) || !(util.validate_mail(data.EmailID))) {
      res.json({
        "status": 0,
        "data": "Email validation failed. Please enter proper value for email"
      });
    }
    if (!(data.MobileNumber.trim()) || util.validate_phone(data.MobileNumber)) {
      res.json({
        "status": 0,
        "data": "Phone validation failed. Please enter proper value for phone"
      });
    }
    
  }

  function geturl(env) {
    if (env == 'test') {
      url_link = config.test_url;

    } else if (env == 'prod') {
      url_link = config.live_url;
    } else {
      url_link = config.test_url;
    }
    return url_link;
  }

  function form() {
    form = {
      'key': config.key,
      'txnid': data.txnid,
      'amount': data.amount,
      'email': data.email,
      'phone': data.phone,
      'firstname': data.name,
      'udf1': data.udf1,
      'udf2': data.udf2,
      'udf3': data.udf3,
      'udf4': data.udf4,
      'udf5': data.udf5,
      'hash': hash_key,
      'productinfo': data.productinfo,
      'udf6': data.udf6,
      'udf7': data.udf7,
      'udf8': data.udf8,
      'udf9': data.udf9,
      'udf10': data.udf10,
      'furl': data.furl, //'http://localhost:3000/response',
      'surl': data.surl, //'http://localhost:3000/response'
    }
    if (data.unique_id != '') {
      form.unique_id = data.unique_id
    }


    if (data.split_payments != '') {
      form.split_payments = data.split_payments
    }

    if (data.sub_merchant_id != '') {
      form.sub_merchant_id = data.sub_merchant_id
    }

    if (data.customer_authentication_id != '') {
      form.customer_authentication_id = data.customer_authentication_id
    }

    return form;
  }

  function getmyJson(){

     form = {
      'clientId': config.clientKey,
      'clientSecret': config.clientSecret,
      'txnCurr': config.txnCurr,
      'amount': data.amount,
      'emailId': data.EmailID,
      'mobileNumber': data.MobileNumber,
      'username': data.username,
      
     // 'signature': util.get_signature(data, config),
      'signature':util.get_Json_Signature(data, config),
      'udf1': "order1",
      'udf2': "order1",
      'udf3': "order1",
      'udf4': "order1",
      'udf5': "order1",
      
    }
    
    return form;

  }

  // main calling part is below

  checkArgumentValidation(data, config);
  var hash_key = generateHash();


  
  
  
 
  payment_url = geturl(config.env);
  call_url = payment_url;
  myJson=getmyJson();

  encrypt=util.data_encrypt(myJson, config.requestSaltKey,config.requestAESKey);
  // res.json({
  //       "status": 1,
  //       "data": encrypt
  //     });
  //console.log(call_url);
  // console.log(myJson);
  // res.json({
  //       "status": 1,
  //       "data": myJson
  //     });

 

  var user ={
    payment_url:payment_url+ '/payment/gateway/v1/initialrequest',
    clientId:config.clientKey,
    encrypt:encrypt
  }

  res.render("initiate_payment_redirect",
    {
      user: user
    }
  );
  // util.call(call_url, send_data).then(function (response) {
  //   pay(response.data, payment_url)
  // });


  function pay(access_key, url_main) {
    
   
      var url = url_main + '/payment/gateway/v1/initialrequest';
      return res.redirect(url);
   
  }


  function generateHash() {

    var hashstring = config.key + "|" + data.txnid + "|" + data.amount + "|" + data.productinfo + "|" + data.name + "|" + data.email +
      "|" + data.udf1 + "|" + data.udf2 + "|" + data.udf3 + "|" + data.udf4 + "|" + data.udf5 + "|" + data.udf6 + "|" + data.udf7 + "|" + data.udf8 + "|" + data.udf9 + "|" + data.udf10;
    hashstring += "|" + config.salt;
    data.hash = sha512.sha512(hashstring);
    return (data.hash);
  }

   function getJsonsignature() {

  message = config.clientKey+ "" +config.clientSecret+ "" +config.txnCurr+ "" +data.amount+ "" +data.EmailID+ "" +data.MobileNumber;
  
  var hmac = crypto.createHmac('sha256', config.requestHashKey);
    //passing the data to be hashed
    data1 = hmac.update(message);
    //Creating the hmac in the required format
    gen_hmac= data1.digest('hex');
    //Printing the output on the console
    //console.log("hmac : " + gen_hmac);
    return (gen_hmac);
  }

}

exports.initiate_payment = initiate_payment;