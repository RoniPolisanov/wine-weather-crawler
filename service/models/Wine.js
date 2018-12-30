var mongoose = require("mongoose"),
  WineSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        "WineName": String,
        "Price": String,
        "Alcohol/Vol": String,
        "MadeIn:": String,
        "SugarContent": String,
        "AvgTemperature": Number,
        "AvgHumidity": Number
    },
    {collection: "SparklingWine"}
  );

//   module.exports = SchemaName => {
//     mongoose.model("WineSchema", WineSchema, SchemaName);
//   }

module.exports = mongoose.model("WineSchema", WineSchema);