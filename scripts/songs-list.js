const fs = require('fs');

const songDir = './public/wa-radio';

const gifDir = './public/assets/gifs';

const songs = fs
  .readdirSync(songDir, { withFileTypes: true })
  .filter((file) => !file.isDirectory() && file.name !== '.first')
  .map((file) => file.name);

const first = fs.readFileSync('./public/wa-radio/.first').toString().trim();

const gifs = fs.readdirSync(gifDir, { withFileTypes: true }).map((file) => file.name);

const data = JSON.stringify({ first, songs, gifs });

fs.writeFileSync('./src/data/wa-radio.json', data);
