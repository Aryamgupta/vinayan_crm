const mongoose = require("mongoose");

const mongoDbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_LINK);

    console.log(`Database Connected to port ${conn.connection.host}`);


  } catch (error) {
    console.log(`error : ${error.message}`);
    process.exit();
  }
};




module.exports = mongoDbConnect;