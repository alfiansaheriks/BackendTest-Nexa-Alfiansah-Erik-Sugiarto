const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

