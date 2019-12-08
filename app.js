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
