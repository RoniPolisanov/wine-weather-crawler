var mongoose = require("mongoose"),
DrinkSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        "WineName": String,
        "Price": String,
        "Alcohol/Vol": String,
        "MadeIn": String,
        "SugarContent": String,
        "AvgTemperature": Number,
        "AvgHumidity": Number
    }
  );
  
exports.DrinkSchema = DrinkSchema;
