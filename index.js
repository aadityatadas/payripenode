// Require http header 
const http = require('http'); 
const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// // Create server 
// http.createServer(function (req, res) { 

// 	// HTTP Status: 200 : OK 
// 	// Content Type: text/html 
// 	res.writeHead(200, {'Content-Type': 'text/html'}); 
	
// 	// Send the response body as "Hello World!" 
// 	res.end('Hello World!'); 

// }).listen(8081); 





app.get('/pay', async(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/',urlencodedParser, (request, response, next)=>{
	 console.log("Server successfully running on port 8081");
	 console.log('Got body:', request.body);
	response.send(request.body);
	
    //response.sendStatus(200);

});



app.listen(8081, () => {
    console.log("Server successfully running on port 8081");
  });

