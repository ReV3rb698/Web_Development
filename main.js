const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler.js");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

// main.js : Entry point to your program. This file should NOT have "logic" in it. It will simply

// delegate to the ioHandler.js module you have created to perform the logic required. (For reference, my main.js is around 15-16 lines long).
async function main() {

  await IOhandler.unzip(zipFilePath, pathUnzipped);
  const imgs = await IOhandler.readDir(pathUnzipped);
  
  for (const img of imgs) {
    const inputPath = path.join(pathUnzipped, img);
    const outputPath = path.join(pathProcessed, img);
    await IOhandler.grayScale(inputPath, outputPath);
  }

  console.log("Done");
}

main();

