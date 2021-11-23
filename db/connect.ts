import mongoose = require("mongoose");
const connectDB = (url: string) => {
    return mongoose.connect(url);
};
export default connectDB;