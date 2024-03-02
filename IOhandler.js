// /*
//  * Project: Milestone 1
//  * File Name: IOhandler.js
//  * Description: Collection of functions for files input/output related operations
//  *
//  * Created Date:
//  * Author:
//  *
//  */

const yauzl = require("yauzl"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

// /**
//  * Description: decompress file from given pathIn, write to given pathOut
//  *
//  * @param {string} pathIn
//  * @param {string} pathOut
//  * @return {promise}
//  */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    yauzl.open(pathIn, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
      }
      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
        } else {
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err);
            }
            readStream.on("end", () => {
              zipfile.readEntry();
            });
            const filePath = path.join(pathOut, entry.fileName);
            fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Create the directory if it doesn't exist
            readStream.pipe(fs.createWriteStream(filePath));
          });
        }
      });
      zipfile.on("end", () => {
        resolve();
      });
    });
  });
};
// Use Yauzl to unzip the file

// /**
//  * Description: read all the png files from given directory and return Promise containing array of each png file path
//  *
//  * @param {string} path
//  * @return {promise}
//  */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      }
      const pngFiles = files.filter((file) => path.extname(file) === ".png");
      resolve(pngFiles);
    });
  });
};

// /**
//  * Description: Read in png file by given pathIn,
//  * convert to grayscale and write to given pathOut
//  *
//  * @param {string} filePath
//  * @param {string} pathProcessed
//  * @return {promise}
//  */
const grayScale = (pathIn, pathOut) => { // convert to grayscale
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(pathIn);
    readStream.on('error', reject); // Add error event handler to read stream

    const writeStream = fs.createWriteStream(pathOut);
    writeStream.on('error', reject); // Add error event handler to write stream

    readStream
      .pipe(new PNG())
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = avg;
            this.data[idx + 1] = avg;
            this.data[idx + 2] = avg;
          }
        }
        this.pack().pipe(writeStream).on('finish', resolve); // Resolve promise when writing is finished
      });
  });
};





module.exports = {
  unzip,
  readDir,
  grayScale,
};
