//import { getMinMaxByKey, getNormalizedData } from '../../voxels/src/utils/getMinMax';
const fs = require("fs");
const { NetCDFReader } = require("netcdfjs");

const outputFolder = "../output";
const outputFilename = "output.vv";
const filePath =
  "../data/FRE16/netcdf/2025-02-08-FRE16-sensitive_clay_probability-subset.nc";

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

const x = reader.getDataVariable("x");
const y = reader.getDataVariable("y");
const z = reader.getDataVariable("z");

//console.log(x)
//console.log(y)
//console.log(z)
let resistivity = reader.getDataVariable("resistivity");
const probabilitySensitiveClay = reader.getDataVariable(
  "probability_sensitive_clay"
);

//resistivity = resistivity.filter((v) => v >= 0)
const indicesToKeep = resistivity
  .map((item, index) => (item >= 0 ? index : -1))
  .filter((index) => index !== -1);

const points = [];

for (let i_x = 0; i_x < x.length; i_x++) {
  for (let i_y = 0; i_y < y.length; i_y++) {
    for (let i_z = 0; i_z < z.length; i_z++) {
      points.push({
        x: x[i_x],
        y: y[i_y],
        z: z[i_z],
      });
    }
  }
}

const filteredPoints = indicesToKeep.map((index) => points[index]);
const filteredResistivity = indicesToKeep.map((index) => resistivity[index]);
const filteredProbability = indicesToKeep.map(
  (index) => probabilitySensitiveClay[index]
);

// console.log(points)
// console.log(resistivity)
//console.log(filteredPoints)

// --------------------

const utm = require("utm");

// Convert from UTM to WGS84
function convertUtmToWgs84(easting, northing) {
  // The utm.to_latlon function expects:
  // easting, northing, zone number, zone letter (calculated automatically)
  const coords = utm.toLatLon(
    easting,
    northing,
    (zoneNum = 32),
    (zoneLetter = "X")
  );

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}

// // Convert from WGS84 to UTM
// function convertWgs84ToUtm(latitude, longitude) {
//     // The utm.from_latlon function returns:
//     // { easting, northing, zoneNum, zoneLetter }
//     return utm.from_latlon(latitude, longitude);
// }
const translatedPoints = [];
for (let i = 0; i < filteredPoints.length; i++) {
  const xy = convertUtmToWgs84(filteredPoints[i].x, filteredPoints[i].y);
  translatedPoints.push({
    x: xy["longitude"],
    y: xy["latitude"],
    z: filteredPoints[i].z,
    resistivity: filteredResistivity[i],
    probability: filteredProbability[i],
  });
}

console.log(translatedPoints);

// ---------------------
function findMinMax(points, attribute) {
  // Check if points exists and is an array
  if (!Array.isArray(points)) {
      throw new Error('Input must be an array');
  }

  // Check if the array is empty
  if (points.length === 0) {
      return {
          min: null,
          max: null
      };
  }

  // Check if the first element has the requested attribute
  if (!(attribute in points[0])) {
      throw new Error(`Attribute "${attribute}" not found in points`);
  }

  return points.reduce((acc, point) => {
      return {
          min: Math.min(acc.min, point[attribute]),
          max: Math.max(acc.max, point[attribute])
      };
  }, {
      min: points[0][attribute],
      max: points[0][attribute]
  });
}

const resistivityMin = findMinMax(translatedPoints, "resistivity")["min"]
const resistivityMax = findMinMax(translatedPoints, "resistivity")["max"]
const probabilityMin = findMinMax(translatedPoints, "probability")["min"]
const probabilityMax = findMinMax(translatedPoints, "probability")["max"]

const dataDict = {
  data: translatedPoints,
  meta: {
    variables: {
      resistivity: {
        min: resistivityMin,
        max: resistivityMax,
      },
      probability: {
        min: probabilityMin,
        max: probabilityMax,
      },
    }
  }
}
// ---------------------

function convertListToJson(list) {
  return JSON.stringify(list);
}

const jsonString = convertListToJson(dataDict);
// console.log(jsonString); // Output the JSON string

// To demonstrate parsing it back:
const parsedList = JSON.parse(jsonString);
// console.log(parsedList); // Output the JavaScript object

//  If you want formatted/pretty printed JSON:
const prettyJsonString = JSON.stringify(dataDict, null, 2); // The '2' indents with 2 spaces
//console.log(prettyJsonString);

// Specify the file path where you want to save the JSON
const filePathJson = "./pts.json";

// Write the JSON string to the file
fs.writeFile(filePathJson, prettyJsonString, (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("JSON data saved to", filePathJson);
  }
});
