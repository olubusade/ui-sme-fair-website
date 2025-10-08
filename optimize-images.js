const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = "public";
const outputDir = "public-optimized";

function processDir(dir, outDir) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.readdirSync(dir).forEach(file => {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(outDir, file);

    if (fs.lstatSync(inputPath).isDirectory()) {
      processDir(inputPath, outputPath);
    } else if (/\.(jpe?g|png)$/i.test(file)) {
      sharp(inputPath)
        .toFormat("jpeg", { quality: 70 }) // 🔹 keep same dimensions, just compress
        .toFile(outputPath)
        .then(() => console.log(`Compressed: ${outputPath}`))
        .catch(err => console.error(err));
    } else {
      fs.copyFileSync(inputPath, outputPath); // keep other files untouched
    }
  });
}

processDir(inputDir, outputDir);
