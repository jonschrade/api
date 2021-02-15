const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/ql', graphqlHTTP({
    schema
}));

app.listen(4000, () => {
    console.log("Listening on port 4000");
});
