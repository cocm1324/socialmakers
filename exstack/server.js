const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();
const upload = require('./upload');

// enable files uploads
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use('/upload', upload);
app.use('/static', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello from server');
});

//start app 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}.`);
});
