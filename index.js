const express = require('express');
const app = express();
const hbs = require('hbs');

const routing = require('./routing');
const bodyParser = require('body-parser');

var PORT_NUMBER = process.env.PORT || 3020;

app.set('view engine','hbs');
app.set('view options', {
    layout:'layouts/layout.hbs'
});

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.enable('trust proxy')

app.use((req, res, next)=>{
     if(req.protocol != 'https'){
         res.redirect("https://" + req.headers.host + req.url);
     }
    next();
})

hbs.registerPartials(__dirname + '/views/partials');

app.use('/', routing);

app.listen(PORT_NUMBER, function(){
    console.log('listening on port : ', PORT_NUMBER);
});

