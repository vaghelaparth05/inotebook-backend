const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/inotebookk';

// I don't know what this does.
mongoose.set('strictQuery', true);
const connectToMongo = () =>{
    mongoose.connect(mongoURI, () => {
        console.log('Connected to Mongo Successfully!!!');
    });
}

module.exports = connectToMongo;