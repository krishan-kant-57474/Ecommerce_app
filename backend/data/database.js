const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`mongodb connected with sever:${data.connection.host}`);
    })
    // .catch((err) => {
    //   console.log(err.message);
    // });
};

module.exports = connectDatabase;
