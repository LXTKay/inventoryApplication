const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

function establishDBConnection(databaseURL){
  main().catch((err) => console.log(err));
  async function main() {
    await mongoose.connect(databaseURL);
  };
}

module.exports = establishDBConnection;