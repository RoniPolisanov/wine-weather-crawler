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
  
  
  // 1st param - name <String> model name
  // 2nd param - [schema] <Schema> schema name
  // 3rd param - [collection] <String> collection name (optional, induced from model name)
  // 4th param - [skipInit] <Boolean> whether to skip initialization (defaults to false)
  module.exports = SchemaName => {
    mongoose.model("WineSchema", Wine2Schema, SchemaName);
  }