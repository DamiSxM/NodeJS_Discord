var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/BostyBot";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    db.close();
  });
});