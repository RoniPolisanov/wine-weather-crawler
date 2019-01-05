var express         = require('express'),
    router          = express.Router(),
    bodyParser      = require('body-parser'),
    Wine            = require("../models/Wine"),          //project schema
    // Wine2           = require('../models/Wine2'),        //producer schema
    onlyNotEmpty    = require('../controllers/OnlyNotEmpty');
const mongoose      = require("mongoose");
fs = require('fs');

var Wine2 = mongoose.model("WineSchema", Wine, "WhiteWine")
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// GET all wines:
// Analyze the Location (Country) for each wine and count of wines per each country.
// Object Structure: Obj[] = { Location: COUNTRY_NAME, 
//                             Drinks(WINES): WINES_NUMBER }

// VIEW1
router.get('/getDrinksPerCountry', (req, res) => {
    let obj = {};
    // Get the distinct list of MadeIn countries
    Wine2.distinct('MadeIn:', (err, docs) => {
        if (err){
          console.log(err);
          return res.status(500).send({"Message": "Internal server error"});
        } 
        // Create object with country name and number of drinks for each country
        docs.forEach( (doc) => {
            obj[`${doc}`] = doc.length;
            console.log(doc);
        })
        res.status(200).send(obj);
    }); 
})  

//VIEW2
router.get('/AlcoholVolsEachCountry', (req, res) => {
    let obj = {};
    // Get the distinct list of MadeIn countires
    Wine2.distinct('MadeIn:', (err, docs) => {
        if (err){
          console.log(err);
          return res.status(500).send({"Message": "Internal server error"});
        } 
        // Get all the drinks with specific attributes
        Wine2.find({}, {'MadeIn:': '', 'Alcohol/Vol': '','Price': ''}, (err, docs2) => {
            if (err){
              console.log(err);
              return res.status(500).send({"Message": "Internal server error"});
            } 
            // Add drinsk to its MadeIn country
            docs.forEach( (country) => {
                let arr = [];
                docs2.forEach( (drink) => {
                    let newDrink = {};
                    if(drink['MadeIn:'] == country){
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

// router.get('/getDrinksPerCountry', (req, res) => {
//     Wine.find({MadeIn:{$exists:true}})
// })

router.get('/', (req, res) => {    
    res.status(200).send(`DONE`);
});

router.get('/NNNNNNNNNN', (req, res) => {    
    var obj = JSON.parse(fs.readFileSync("../data/data2.json", 'utf8'));
    obj[4].forEach( wine => {
        const newWine = new Wine(wine);
        newWine.save(err => {
            if (err){
                console.log(err);
                return res.status(400).send({ "Message": "There was a problem creating the project, please try again" });
            }
        })
    })
    console.log("Done");
    res.status(200).send(`DONE`);
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

//get all projects
// router.get('/', (req, res) => {
//   Project.find({}, (err, docs) => {
//       if (err){
//         console.log(err);
//         return res.status(500).send({"Message":"Internal server error"});
//       } 
//       console.log(docs);
//       res.status(200).send(docs);
//   });
// });

// //create a project - handle ownder id in GUI
// router.post('/createProject/:owner', (req, res) => {
//   const newProject = new Project(req.body);
//   newProject.owner = req.params.owner;
//   newProject.save(err => {
//       if (err){
//         console.log(err);
//         return res.status(400).send({ "Message": "There was a problem creating the project, please try again" });
//       }
//       //after creating the project, we need to attach it into user's profile
//       Producer.findByIdAndUpdate(newProject.owner, { $push: { projects: newProject._id }}, { new: true },
//         (err, docs) => {
//           if (err) {
//             console.log(err);
//             return res.status(400).send({ "Message": "There was a problem updating the project, please try again." });
//           }
//           console.log(`Project ${newProject.title} has been added by ${docs._id}`);
//       });

//       //now, send details to client
//       res.status(200).send(`Project ${newProject.title} has been created successfully`);
//     });
// });


module.exports = router;