const sharp = require('sharp');
const [,, file, top, height, outFile] = process.argv;
sharp(file).metadata().then((m) => sharp(file).extract({ left: 0, top: +top, width: m.width, height: Math.min(+height, m.height - +top) }).toFile(outFile)).then(() => console.log('ok'));
