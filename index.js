const connectToMongo = require('./db');
const express = require('express');

// Database connection requirements.
connectToMongo();
const app = express();
const port = 5000;
app.use(express.json());

// Default Path/Homepage/Landing.
app.get('/', (req, res) => {
  res.send('Hello I am Parth Vaghela!')
})

// Available Routes
// We set router path here like "/auth" and send it to the file, the file will handle 
// everything related to the path after "/auth" so it will just get('/').
app.use('/auth', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
