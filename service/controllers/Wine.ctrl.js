var express         = require('express'),
    router          = express.Router(),
    bodyParser      = require('body-parser'),
    Wine            = require("../models/Wine"),          //project schema
    // Wine2           = require('../models/Wine2'),        //producer schema
    onlyNotEmpty    = require('../controllers/OnlyNotEmpty');
const mongoose      = require("mongoose");
fs = require('fs');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

Wine('WhiteWine');

router.get('/', (req, res) => {
    var obj = JSON.parse(fs.readFileSync("../data/data2.json", 'utf8'));
    console.log(obj["0"][1]);
});

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