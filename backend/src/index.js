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
console.log(
  "Variables in NetCDF:",
  reader.variables.map((v) => v.name)
);

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
  const [x_dim, y_dim, z_dim] = dimensions;
  const totalVoxels = x_dim * y_dim * z_dim;
  const bytesPerVoxel = 8; // 2 float32 properties per voxel
  const bufferSize = 8 + totalVoxels * bytesPerVoxel * 2;

  const buffer = Buffer.alloc(bufferSize); // Correctly allocated buffer

  // Define a safe value range (adjust as needed)
  const MIN_VALUE = -1e6; // Lower bound for float32
  const MAX_VALUE = 1e6; // Upper bound for float32

  // Function to sanitize float values
  function safeFloat(value) {
    if (isNaN(value) || !isFinite(value)) return 0; // Replace NaN/Infinity with 0
    return Math.max(MIN_VALUE, Math.min(MAX_VALUE, value)); // Clamp values
  }

  // Write magic bytes
  buffer.write("VV", 0, "ascii");

  // Write dimensions as 32-bit integers
  buffer.writeUInt32LE(x_dim, 2);
  buffer.writeUInt32LE(y_dim, 6);
  buffer.writeUInt32LE(z_dim, 10);

  // Write voxel data correctly
  let offset = 14; // Start writing voxel data after header
  for (let i = 0; i < totalVoxels; i++) {
    buffer.writeFloatLE(safeFloat(resistivityData[i] || 0), offset);
    offset += 4; // Move 4 bytes forward

    buffer.writeFloatLE(safeFloat(clayProbabilityData[i] || 0), offset);
    offset += 4; // Move 4 bytes forward
  }

  // Save file
  fs.writeFileSync(outputPath, buffer);
  console.log(`Voxel file saved: ${outputPath} (Size: ${buffer.length} bytes)`);
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
