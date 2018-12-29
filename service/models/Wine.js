var mongoose = require("mongoose"),
  WineSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        "WineName": String,
        "Price": String,
        "Alcohol/Vol": String,
        "Made in:": String,
        "Sugar Content": String,
        "AvgTemperature": Number,
        "AvgHumidity": Number
    },
  );

  module.exports = SchemaName => {
    mongoose.model("WineSchema", WineSchema, SchemaName);
  }
