// const mongoose = require("mongoose");

// function connectToDb() {
//     mongoose.connect(process.env.DB_CONNECT)
//         .then(() => {
//             console.log("Database connected successfully");
//         })
//         .catch((err) => console.log(err));
// }

// module.exports = connectToDb;



const mongoose = require("mongoose");

async function connectToDb() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed:");
        console.error(err.message);
    }
}

module.exports = connectToDb;
