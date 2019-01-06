var mongoose = require("mongoose"),
DrinkSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        "WineName": String,
        "Price": String,
        "Alcohol/Vol": Number,
        "MadeIn": String,
        "SugarContent": Number,
        "AvgTemperature": Number,
        "AvgHumidity": Number
    }
  );
  
exports.DrinkSchema = DrinkSchema;
