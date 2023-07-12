const mongoose = require('mongoose');
require('dotenv').config();

// Connect To Database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas Server');
}).catch((error) => {
    console.error("Error Occured while connecting to DB :", error);
})