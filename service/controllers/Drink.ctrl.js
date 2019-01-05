require('dotenv').config();
var express         = require('express'),
    router          = express.Router(),
    bodyParser      = require('body-parser'),
    Drink            = require("../models/Drink"),
    onlyNotEmpty    = require('./OnlyNotEmpty');
const mongoose      = require("mongoose");
fs = require('fs');

// Collections for each wine category
var collections = [];
collections.push(process.env.FirstCollection);
collections.push(process.env.SecondCollection);
collections.push(process.env.ThirdCollection);
collections.push(process.env.FourthCollection);
collections.push(process.env.FifthCollection);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Create collection and insert all its related data
router.post('/initialSystem', (req, res) => {    
        // Read the JSON file and convert to utf-8 correct format
        var data2 = JSON.parse(fs.readFileSync("../data/data2.json", 'utf8'));
        // Prepare Collection for each category and insert all its related data
        Object.values(data2).forEach( (obj, j) =>{
                obj.forEach( drink => {
                    let prepareCollection = mongoose.model("DrinkSchema", Drink.DrinkSchema, process.env.Drink);
                    let readyCollection = new prepareCollection(drink);
                    readyCollection.save(err => {
                        if (err){
                            console.log(err);
                            return res.status(400).send({ "Message": "There was a problem creating the project, please try again" });
                        }
                    })
                })
        })
    res.status(200).send(`DONE`);
});


// VIEW1
router.get('/getDrinksPerCountry', (req, res) => {
    let obj = {};
    let arr = [];
    function username(col){
        console.log('Start');
        return new Promise(function(resolve,reject) {
            // Get the distinct list of MadeIn countries
        var Wine2 = mongoose.model("DrinkSchema", Drink.DrinkSchema, col);
        Wine2.distinct('MadeIn', (err, docs) => {
            if (err){
                console.log(err);
                return res.status(500).send({"Message": "Internal server error"});
            } 
            
            // Create object with country name and number of drinks for each country
            docs.forEach( (doc) => {
                
                console.log(doc.length);
                if (obj[`${doc}`])
                    obj[`${doc}`] += doc.length;
                    else
                    obj[`${doc}`] = doc.length;
                })
                resolve(obj);
            }); 
        })
    }

    username(process.env.Drink).then(function(data){
        arr.push(data);
        // console.log(data);
        res.status(200).send(arr);
    })
})  

// VIEW2
router.get('/AlcoholVolsEachCountry', (req, res) => {
    let obj = {};
    var Drink2 = mongoose.model("DrinkSchema", Drink.DrinkSchema, process.env.Drink);
    // Get the distinct list of MadeIn countires
    Drink2.distinct('MadeIn', (err, docs) => {
        if (err){
          console.log(err);
          return res.status(500).send({"Message": "Internal server error"});
        } 
        // Get all the drinks with specific attributes
        Drink2.find({}, {'MadeIn': '', 'Alcohol/Vol': '','Price': ''}, (err, docs2) => {
            if (err){
              console.log(err);
              return res.status(500).send({"Message": "Internal server error"});
            } 
            // Add drinks to its MadeIn country
            docs.forEach( (country) => {
                let arr = [];
                docs2.forEach( (drink) => {
                    let newDrink = {};
                    if(drink['MadeIn'] == country){
                        newDrink.Price = drink['Price'].split("$").join("");
                        newDrink.Alcohol = drink['Alcohol/Vol'].split("%").join("");
                        arr.push(newDrink);
                    }
                })
                obj[`${country}`] = arr;
            })
            console.log(obj);
            res.status(200).send(obj);
        }); 
    }); 
})

// VIEW3
// router.get('/getDrinksPerCountry', (req, res) => {
//     Wine.find({MadeIn:{$exists:true}})
// })


router.get('/', (req, res) => {    
    res.status(200).send(`ROOT`);
});


// GET all wines:
// Analyze the Location (Country) for each wine and count of wines per each country.
// Object Structure: Obj[] = { Location: COUNTRY_NAME, 
//                             Drinks(WINES): WINES_NUMBER }

// GET all wines:
// Sort the wines by Location (Country) take the Data per each Country: 
// Object Structure: Obj[] = { Location: COUNTRY_NAME, 
//                             AlcoholVol: ALCOHOL_PERCENT, 
//                             Price: PRICE_NUMBER,
//                             AlcoholVol: (Crup duplicated Vol's) }

// GET all wines:
// Object Structure: Obj[] = { Location: CONTRY_NAME, 
//           Drinks(WINES): WINE_NUMBER,
//           Temperature: CELCIUS_TEMPERATURE_NUMBER_AVG (One tempertature per country),
//           MaxSugarContent: MAX_SUGAR_CONTENT + "g/L",
//           MinSugarContent: MIN_SUGAR_CONTENT + "g/L",
//           MaxAlcoholVol: MAX_ALCOHOL_VOL,
//           MinAlcoholVol: MIB_ALCOHOL_VOL }
//
//
// 

// Wine2.Schema('RedWine');


module.exports = router;