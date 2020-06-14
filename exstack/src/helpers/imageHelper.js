const getPixels = require('get-pixels')
const fs = require('fs');

const imageHelper = {
    loadImage: (image) => {
        return new Promise((resolve, reject) => {
            getPixels(image, (err, pixels) => {
                if (err) {
                    reject(err);
                }
                fs.writeFileSync('testing.txt', JSON.stringify(pixels));

                resolve('done');
            });
        });
    },
    convertPixelToRGB: (pixels) => {
        const width = pixels.shape[0];
        const height = pixels.shape[1];
        const rgbValues = [];
        for (let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                
            }
        }
    }

}

module.exports = imageHelper;