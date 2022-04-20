console.log("grid_fan_1.js")

// Configuration
const cellSize = 25;
const numCols = 12;
const numRows = 24;
const outerPadding = 30;
const innerPadding = 0;
const rotDur = 3000;

// Initial position values
let xPos = outerPadding;
let xCtrPos = xPos + cellSize / 2;
let yPos = outerPadding;
let yCtrPos = yPos + cellSize / 2;
let rotDeg = 0;

// Formulating Data-based positioning

// initial cell data
function newCell(xPos, xCtrPos, yPos, yCtrPos) {
  return {
    "xPos": xPos,
    "xCtrPos": xCtrPos,
    "yPos": yPos,
    "yCtrPos": yCtrPos,
    "rotDeg": rotDeg
  }
}

const cellData = [];

// Create data for all cells in grid
for (let row = 0; row < numRows; row++) {
  for (let col = 0; col < numCols; col++) {
    cellData.push(newCell(xPos, xCtrPos, yPos, yCtrPos, rotDeg));
    xPos = xPos + cellSize + innerPadding; // advance one col to right
    xCtrPos = xPos + cellSize / 2; // advance one col to right
    // INSERT ROTATION VALUE HERE (ADVANCE IT ALSO)
    rotDeg = rotDeg + 0.3125;
  } // end col loop
  xPos = outerPadding; // reset to left-most column
  xCtrPos = xPos + cellSize / 2; // reset to left-most column
  yPos = yPos + cellSize + innerPadding; // advance down one row
  yCtrPos = yPos + cellSize / 2; // advance down one row
} // end row loop

// D3js construction of elements

const svg = d3.select("#squares")
  .append("svg")
    .attr("width", (outerPadding * 2) + (cellSize * numCols) + (innerPadding * (numCols - 1)))
    .attr("height", (outerPadding * 2) + (cellSize * numRows) + (innerPadding * (numRows - 1)));

let cells = svg.selectAll("rect")
  .data(cellData)
  .join(
    function(enter) {
      return enter.append("rect")
        .attr("x", function(d) { return d.xPos })
        .attr("y", function(d) { return d.yPos})
        .attr("width", cellSize)
        .attr("height", cellSize);
    } // end enter
  ); // end join

// rotation function (closure)
function rotTween(d) { // d is cellData
  const interp = d3.interpolate(0, d.rotDeg);
  return function(t) {
    return `rotate(${interp(t)}, ${d.xCtrPos}, ${d.yCtrPos})`;
  };
}

function activateCascade() {
  cells
  .each(function(d) {
    d3.select(this)
      .transition()
      .duration(rotDur)
      .attrTween("transform", rotTween);
  })
}