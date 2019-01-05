const express               = require('express'),      
      app                   = express(),      
      wineCtrl              = require('./controllers/Drink.ctrl'),
      port                  = process.env.PORT || 3000;
      
app.use('/api', wineCtrl);

//  refers root to API file
app.use('/', express.static('./public')); 
app.use('/assets', express.static(`${__dirname}/public`));

//  Catch the first req and wait to access route
app.use( (req,res,next) => {    
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "Content-Length, Authorization, Accept,X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// handle unknown page request
app.all('*', (req, res, next) => {
  res.status(404).send({ "Message": `This page was not found` });
});

app.listen(port, () => {   
    console.log(`Listening on port ${port}`);  
});