const fs = require('fs');

const dir = './public/wa-radio';

const songs = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((file) => !file.isDirectory() && file.name !== '.first')
  .map((file) => file.name);

const first = fs.readFileSync('./public/wa-radio/.first').toString();

const data = JSON.stringify({ first, songs });

fs.writeFileSync('./src/data/wa-radio.json', data);
