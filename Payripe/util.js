let curl_call = function (url, data, method = 'POST') {

  var request = require('request');
  var options = {
    'method': method,
    'url': url,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    form: data,
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      if (response) {
        var data = JSON.parse(response.body)
        return resolve(data);
      } else
        return reject(error);
    })
  })
}


let validate_email = function (mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return true;
}

let validate_phone = function (number) {
  if ((number.length === 10)) {
    return false;
  }

  return true;
}
let generateHash = function (data, config) {

  var hashstring = config.key + "|" + data.txnid + "|" + data.amount + "|" + data.productinfo + "|" + data.name + "|" + data.email +
    "|" + data.udf1 + "|" + data.udf2 + "|" + data.udf3 + "|" + data.udf4 + "|" + data.udf5 + "|" + data.udf6 + "|" + data.udf7 + "|" + data.udf8 + "|" + data.udf9 + "|" + data.udf10;
  hashstring += "|" + config.salt;
  data.hash = sha512.sha512(hashstring);
  return (data.hash);
}

let getSignature = function (data, config) {

  var hashstring = config.key + "|" + data.txnid + "|" + data.amount + "|" + data.productinfo + "|" + data.name + "|" + data.email +
    "|" + data.udf1 + "|" + data.udf2 + "|" + data.udf3 + "|" + data.udf4 + "|" + data.udf5 + "|" + data.udf6 + "|" + data.udf7 + "|" + data.udf8 + "|" + data.udf9 + "|" + data.udf10;
  hashstring += "|" + config.salt;
  data.hash = sha512.sha512(hashstring);
  return (data.hash);
}

 let getJsonSignature = function (data, config) {
  var crypto = require('crypto');


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

let validate_float = function (number) {
  return parseFloat(number) === number
}

function get_query_url(env) {
  let url_link = '';
  if (env == 'prod') {
    url_link = "https://dashboard.easebuzz.in/";
  }

  return url_link;
}

let get_data_encrypt1 = function (data, salt, key) {
  var crypto = require('crypto');

   data = 'Hello, World!';
 key = 'randomsalt';
 salt = 'secretkey';

  if (key !== null && data !== "" && salt !== "") {
        var method = "AES-256-CBC";
        /* Converting Array to bytes */
        var iv = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        var chars = Array.from(iv, function(byte) {
            return String.fromCharCode(byte);
        });
        var IVbytes = chars.join("");
        IVbytes = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        /* Encoding to UTF-8 */
        var salt1 = new TextEncoder().encode(salt);
        var key1 = new TextEncoder().encode(key);
        /* SecretKeyFactory Instance of PBKDF2WithHmacSHA1 Java Equivalent */
        var hash = crypto.pbkdf2Sync(key1, salt1, 256, 65536, 'sha1');
        var encrypted = crypto.createCipheriv(method, hash, IVbytes);
        var encryptedData = encrypted.update(data, 'utf8', 'hex') + encrypted.final('hex');
        return encryptedData;
    } else {
        return "String to encrypt, Salt and Key is required.";
    }
  }

let get_data_encrypt = function (data, salt, key) {
  var crypto = require('crypto');
  data=JSON.stringify(data);
 if (key !== null && data !== '' && salt !== '') {
        const method = 'aes-256-cbc';

        // Converting Array to bytes
        const iv = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        const saltBuffer = Buffer.from(salt, 'utf-8');
        const keyBuffer = Buffer.from(key, 'utf-8');

        // SecretKeyFactory Instance of PBKDF2WithHmacSHA1 Node.js Equivalent
        const hash = crypto.pbkdf2Sync(keyBuffer, saltBuffer, 65536, 32, 'sha1');

        const cipher = crypto.createCipheriv(method, hash, iv);
        let encrypted = cipher.update(data, 'utf-8', 'hex');
        encrypted += cipher.final('hex');

        return encrypted;
    } else {
        return 'String to encrypt, Salt and Key are required.';
    }
  }


  let get_data_decrypt = function (data, salt, key) {
          var crypto = require('crypto');
          
          if (key !== null && data !== '' && salt !== '') {
        const method = 'aes-256-cbc';

        // Converting Array to bytes
        const iv = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

        const dataEncrypted = Buffer.from(data, 'hex');
        const saltBuffer = Buffer.from(salt, 'utf-8');
        const keyBuffer = Buffer.from(key, 'utf-8');

        // SecretKeyFactory Instance of PBKDF2WithHmacSHA1 Node.js Equivalent
        const hash = crypto.pbkdf2Sync(keyBuffer, saltBuffer, 65536, 32, 'sha1');

        const decipher = crypto.createDecipheriv(method, hash, iv);
        let decrypted = decipher.update(dataEncrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    } else {
        return 'Encrypted String to decrypt, Salt and Key are required.';
    }
  };

exports.validate_mail = validate_email;
exports.validate_phone = validate_phone;
exports.generateHash = generateHash;
exports.validate_float = validate_float;
exports.call = curl_call;
exports.get_base_url = get_query_url;
exports.get_Json_Signature = getJsonSignature;
exports.data_encrypt = get_data_encrypt;
exports.data_decrypt = get_data_decrypt;
