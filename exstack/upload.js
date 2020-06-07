const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Upload API');
});

router.post('/image', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            const file = req.files.upload;
            
            if (file.mimetype.split('/')[0] === 'image') {
                file.mv('./uploads/image/' + file.name);
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size,
                        url: `/static/image/${file.name}`
                    }
                });
            } else {
                res.send({
                    status: false,
                    message: 'Only image file is permitted'
                });
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;