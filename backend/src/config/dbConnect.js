const mogoose = require('mongoose');

const dbConnect = async ()  => {
    try {
        const connect = await mogoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected successfully: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); 
    }
}

module.exports = dbConnect;