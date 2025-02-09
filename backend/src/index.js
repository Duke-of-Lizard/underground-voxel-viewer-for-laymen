const fs = require("fs");
const { NetCDFReader } = require("netcdfjs");

const outputFolder = "../output";
const outputFilename = "output.vv";
const filePath =
  "../../data/FRE16/netcdf/2025-02-08-FRE16-sensitive_clay_probability-subset.nc";

const tilesetTemplate = {
  asset: {
    version: "1.1",
  },
  root: {
    boundingVolume: {
      box: [0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0, 50], // Adjust based on your dataset
    },
    geometricError: 500,
    refine: "ADD",
    content: {
      uri: outputFilename,
    },
  },
};

// Read the file as a Buffer
const data = fs.readFileSync(filePath);
const reader = new NetCDFReader(data);

// List available variables
// console.log(
//   "Variables in NetCDF:",
//   reader.variables.map((v) => v.name)
// );

// Extract grid dimensions
const x_dim = reader.dimensions.find((d) => d.name === "x").size;
const y_dim = reader.dimensions.find((d) => d.name === "y").size;
const z_dim = reader.dimensions.find((d) => d.name === "z").size;

const resistivity = reader.getDataVariable("resistivity");
const probability_sensitive_clay = reader.getDataVariable(
  "probability_sensitive_clay"
);

function writeVVFile(
  resistivityData,
  clayProbabilityData,
  dimensions,
  outputPath
) {
  const totalVoxels = x_dim * y_dim * z_dim;
  const bytesPerVoxel = 8; // 2 properties * 4 bytes each
  const bufferSize = 8 + totalVoxels * bytesPerVoxel * 2; // 8 bytes header + voxel data
  const buffer = Buffer.alloc(bufferSize);

  // Write magic bytes
  buffer.write("VV", 0, "ascii");

  // Write dimensions (32-bit integers)
  buffer.writeUInt32LE(dimensions[0], 2);
  buffer.writeUInt32LE(dimensions[1], 6);
  buffer.writeUInt32LE(dimensions[2], 10);

  // Write voxel properties (each voxel has 2 properties, 4 bytes each)
  for (let i = 0; i < resistivityData.length; i++) {
    buffer.writeFloatLE(resistivityData[i], 14 + i * 8); // Resistivity
    buffer.writeFloatLE(clayProbabilityData[i], 18 + i * 8); // Clay probability
  }

  // Save file
  fs.writeFileSync(outputPath, buffer);
  console.log(`Voxel file saved: ${outputPath}`);
}

// Generate `.vv` file
writeVVFile(
  resistivity,
  probability_sensitive_clay,
  [x_dim, y_dim, z_dim],
  `${outputFolder}/${outputFilename}`
);

// Save `tileset.json`
fs.writeFileSync(
  `${outputFolder}/tileset.json`,
  JSON.stringify(tilesetTemplate, null, 2)
);
console.log("tileset.json created!");
