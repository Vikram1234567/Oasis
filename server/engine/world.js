// rng
const utils = require('./utils');

// world
let tilemap;

// returns the world's tilemap
function getTilemap () {
    return tilemap;
}

// generates a random world of a specified width/height
// (int) width , (int) height
function generateRandom (width, height) {
    tilemap = utils.generateRandomMap(width, height, 0, 3);
}

// generate realistic looking landscape
// (int) width , (int) height , (int) smoothLevel
function generateRealistic (width, height, smoothLevel) {
    console.log('Generating realistic terrain...');

    // generate height map
    tilemap = utils.generateRandomMap(width, height, 0, 1000);

    // smooth it a specified number of rounds
    for (let i=0; i<smoothLevel; i++) {
        utils.smoothMap(tilemap);
    }

    // find min/max heights in heightmap
    let minHeight = 1000;
    let maxHeight = 0;
    for (let y=0; y<tilemap.length; y++) {
        for (let x=0; x<tilemap[y].length; x++) {
            const height = tilemap[y][x];

            // update min/max heights
            if (height < minHeight) minHeight = height;
            if (height > maxHeight) maxHeight = height;
        }
    }
    
    // calculate difference between min/max heights
    const deltaHeight = maxHeight - minHeight;

    // track tile type counts
    let grassCount = 0;
    let sandCount = 0;
    let shoreCount = 0;
    let oceanCount = 0;

    // assign each point in height map an actual tile type
    for (let y=0; y<tilemap.length; y++) {
        for (let x=0; x<tilemap[y].length; x++) {
            const height = tilemap[y][x];

            // calculate desired tile type percentages
            const grassPercentage = maxHeight - (deltaHeight * 0.45);
            const sandPercentage = grassPercentage - (deltaHeight * 0.08);
            const shorePercentage = sandPercentage - (deltaHeight * 0.10);
            const oceanPercentage = minHeight;

            if (height >= grassPercentage) { // grass
                tilemap[y][x] = 0;
                grassCount++;
            } else
            if (height >= sandPercentage) { // sand
                tilemap[y][x] = 1;
                sandCount++;
            } else
            if (height >= shorePercentage) { // shore
                tilemap[y][x] = 2;
                shoreCount++;
            } else
            if (height >= oceanPercentage) { // ocean
                tilemap[y][x] = 3;
                oceanCount++;
            }
        }
    }

    console.log('grass:', grassCount);
    console.log('sand:', sandCount);
    console.log('shore:', shoreCount);
    console.log('ocean:', oceanCount);
    console.log('total:', grassCount + sandCount + shoreCount + oceanCount);
    console.log('Finished generating realistic terrain.');
}

// exports
module.exports = {
    getTilemap,
    generateRandom,
    generateRealistic
}