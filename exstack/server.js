const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const image = require('./src/endpoints/image');
const post = require('./src/endpoints/post');
const user = require('./src/endpoints/user');

// enable files uploads
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/image', image);
app.use('/post', post);
app.use('/user', user);
app.use('/static/image', express.static('assets/image'));

app.get('/', (req, res) => {
    res.send('Hello from API');
});

//start app
const port = 3000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}.`);
});
