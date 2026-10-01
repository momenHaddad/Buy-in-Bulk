const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({  
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Notification', NotificationSchema);