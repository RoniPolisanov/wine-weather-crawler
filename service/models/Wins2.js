var mongoose = require("mongoose"),
  Wine2Schema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        "WineName": String,
        "Price": String,
        "Alcohol/Vol": String,
        "Made in:": String,
        "AvgTemperature": Number,
        "AvgHumidity": Number
    },
  );

  module.exports = SchemaName => {
    mongoose.model("WineSchema", Wine2Schema, SchemaName);
  }
