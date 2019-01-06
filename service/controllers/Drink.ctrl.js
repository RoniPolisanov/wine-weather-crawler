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
    Object.values(data2).forEach((category, j) => {
        category.forEach(drink => {
            let prepareCollection = mongoose.model("DrinkSchema", Drink.DrinkSchema, process.env.Drink);
            let readyCollection = new prepareCollection(drink);
            readyCollection.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ "Message": "There was a problem, please try again" });
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

    // Crossing the count of wines with the countries
    function featchData(col) {
        return new Promise(function (resolve, reject) {
            var Drink2 = mongoose.model("DrinkSchema", Drink.DrinkSchema, col);

            // Preparing the aggregate expression
            var agg = [{
                $group: {
                    _id: "$MadeIn",
                    Temperature: { $max: "$AvgTemperature" },
                    Drinks: { $sum: 1 }
                }
            }];

            // Using aggregation to get best query performance
            Drink2.aggregate(agg, function (err, docs) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ "Message": "Internal server error" });
                }
                // docs.forEach((doc) => {
                //     obj[`${doc._id}`] = doc.total; 
                //     obj[`${doc.temperature}`] = doc.temperature; 
                // });            
                resolve(docs);
            });
        })
    }

    featchData(process.env.Drink).then(function (data) {
        // console.log(data);
        res.status(200).send(data);
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
                        newDrink.Price = drink['Price'];
                        newDrink.Alcohol = drink['Alcohol/Vol'];
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
router.get('/SugarTemperatureAlcoholEachCountry', (req, res) => {
    function featchData(col) {
        return new Promise(function (resolve, reject) {
            var Wine2 = mongoose.model("DrinkSchema", Drink.DrinkSchema, col);

            // Preparing the aggregate expression
            var agg = [{
                $group: {
                    _id: "$MadeIn",
                    drinks: { $sum: 1 },
                    temperature: { $max: "$AvgTemperature" },
                    maxSugar: { $max: "$SugarContent" },
                    minSugar: { $min: "$SugarContent" },
                    maxAlcohol: { $max: "$Alcohol/Vol" },
                    minAlcohol: { $min: "$Alcohol/Vol" },
                }
            }];

            // Using aggregation to get best query performance
            Wine2.aggregate(agg, function (err, docs) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ "Message": "Internal server error" });
                }

                //docs.forEach((doc) => obj[`${doc._id}`] = doc.total);  
                console.log(docs);
                resolve(docs);
            });
        })
    }

    featchData(process.env.Drink).then(function (data) {
        // console.log(data);
        res.status(200).send(data);
    })
})  


module.exports = router;