var mongoose = require('mongoose');

var connectionManager = function (db) {
    this.db = db
}

connectionManager.connect = function (dbToConnect) {
    if (mongoose.connection.readyState == undefined || mongoose.connection.readyState == 1) {
        this.disconnect();
    }

    var mongoDb = 'mongodb+srv://usuario1:ZgCRi9bztAWExZ4@cluster0.yjasg.azure.mongodb.net/' + dbToConnect
    mongoose.connect(mongoDb, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.on('open', console.log.bind(console, "Conectado a mongoDB"));
}

connectionManager.disconnect = function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
    });
}

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = connectionManager
