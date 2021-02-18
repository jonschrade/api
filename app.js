const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
if (app.get('env') === 'development') {
    require('dotenv').config();
}

// Allow X-origin requests
app.use(cors());

mongoose.connect(process.env.DB_CONN, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log("Connected to database");
});

// Set up landing page to explain API
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/README.MD'));
})

app.use('/ql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(process.env.PORT, () => {
    console.log("Listening on port 4000");
});
