const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://coolrohan18786_db_user:6i6UKoz6u9CrQZGA@cluster0.wiy6lif.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;