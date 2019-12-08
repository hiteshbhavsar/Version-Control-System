const express = require('express');
const path=require('path')
const app = express();
const parser = require('body-parser');

const pullRoute = require('./routes/pullRoute');
const pushRoute = require('./routes/pushRoute');

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use('/vcs/push', pushRoute);
app.use('/vcs/pull', pullRoute);
app.use('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname, '/', 'n.html'))
})
app.listen(8080, () => {
    console.log("Application listening on port 8080!")
});

/*
var http=require("http");
var fs=require("fs");

http.createServer(onRequest).listen(8888);

function onRequest(request,response)
{
    if(request.method=='GET'&& request.url=='/')
    {
      response.writehead(200,{"Content-Type":"text/html"})
      fs.createReadStream("./index.html").pipe(response);
      else {
        send404Response(request);
      }
    }
}

function send404Response(onRequest)
{
  response.writeRead(404,{"Content-Type":"text/plain"});
  response.write("Error 404: Page not found");
  response.end();
}
*/
